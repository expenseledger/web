import { buildSchema, GraphQLError, GraphQLSchema } from "graphql";

/**
 * An in-memory API v3 for tests and local development. It follows the
 * backend's rules (balances, validation order, error codes, paging, date
 * filters) for one user, and ignores auth.
 */

type Currency = "USD" | "THB" | "EUR" | "JPY";
type TxType = "Expense" | "Income" | "Transfer";
type CategoryType = "ANY" | "EXPENSE" | "INCOME" | "TRANSFER";

interface Money {
    amount: number;
    currency: Currency;
}

interface AccountRow {
    id: string;
    name: string;
    balance: Money;
}

interface CategoryRow {
    id: string;
    name: string;
    type: CategoryType;
}

interface TxRow {
    id: string;
    type: TxType;
    fromId?: string;
    toId?: string;
    amount: Money;
    convertedAmount?: Money;
    categoryId: string;
    description: string | null;
    occurredAt: string;
}

interface Order {
    property: string;
    direction: "ASC" | "DESC";
}

interface PageArgs {
    first: number;
    after?: string;
    sort?: Order[];
}

type Args = Record<string, any>;

export interface MockV3 {
    schema: GraphQLSchema;
    rootValue: Record<string, (args: Args) => unknown>;
}

const MAX_PAGE_SIZE = 50;
const NONE = "None";
const DEFAULT_CATEGORIES: [string, CategoryType][] = [
    ["Food", "EXPENSE"],
    ["Transport", "EXPENSE"],
    ["Groceries", "EXPENSE"],
    ["Bills", "EXPENSE"],
    ["Entertainment", "EXPENSE"],
    ["Salary", "INCOME"],
    [NONE, "ANY"],
];
const DATE_TIME_WITH_OFFSET = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}(:\d{2}(\.\d+)?)?(Z|[+-]\d{2}:\d{2})$/;
const DAY_MS = 24 * 60 * 60 * 1000;

function fail(classification: string, code: string, message: string): never {
    throw new GraphQLError(message, { extensions: { classification, code } });
}

const notFound = (what: string, id: string) =>
    fail("NOT_FOUND", "RESOURCE_NOT_FOUND", `${what} ${id} not found`);
const badRequest = (code: string, message: string) => fail("BAD_REQUEST", code, message);

const round = (value: number) => Math.round(value * 10000) / 10000;

function toInstant(value: string): string {
    if (!DATE_TIME_WITH_OFFSET.test(value) || Number.isNaN(Date.parse(value))) {
        badRequest("INVALID_DATE_TIME", `Invalid date-time '${value}'`);
    }

    return new Date(value).toISOString();
}

/** Start of the calendar day of `value`, in `value`'s own offset. */
function startOfDay(value: string): number {
    toInstant(value);
    const offset = value.endsWith("Z") ? "+00:00" : value.slice(-6);
    const sign = offset.startsWith("-") ? -1 : 1;
    const offsetMs = sign * (+offset.slice(1, 3) * 60 + +offset.slice(4, 6)) * 60 * 1000;
    const local = Date.parse(value) + offsetMs;

    return local - (((local % DAY_MS) + DAY_MS) % DAY_MS) - offsetMs;
}

function requirePositive(money: Money): void {
    if (money.amount <= 0) {
        badRequest("NON_POSITIVE_AMOUNT", `Amount must be positive: ${money.amount}`);
    }
}

function requireCurrency(expected: Currency, money: Money): void {
    if (money.currency !== expected) {
        badRequest("CURRENCY_MISMATCH", `Expected ${expected}, got ${money.currency}`);
    }
}

function compareBy(sort: Order[] = [{ property: "id", direction: "ASC" }]) {
    return (a: Args, b: Args) => {
        for (const { property, direction } of sort) {
            const [x, y] = [a[property], b[property]];
            const result = property === "id" ? +x - +y : String(x).localeCompare(String(y), "en");

            if (result !== 0) {
                return direction === "DESC" ? -result : result;
            }
        }

        return 0;
    };
}

function connection<T>(rows: Args[], { first, after, sort }: PageArgs, toNode: (row: any) => T) {
    if (first > MAX_PAGE_SIZE) {
        badRequest("TOO_MANY_ROWS", `first must be at most ${MAX_PAGE_SIZE}`);
    }

    const start = after ? +atob(after) + 1 : 0;
    const page = [...rows].sort(compareBy(sort)).slice(start, start + first);
    const edges = page.map((row, idx) => ({ node: toNode(row), cursor: btoa(`${start + idx}`) }));

    return {
        edges,
        pageInfo: {
            hasPreviousPage: start > 0,
            hasNextPage: start + first < rows.length,
            startCursor: edges[0]?.cursor ?? null,
            endCursor: edges[edges.length - 1]?.cursor ?? null,
        },
    };
}

export function createMockV3(sdl: string): MockV3 {
    const accounts = new Map<string, AccountRow>();
    const categories = new Map<string, CategoryRow>();
    const transactions = new Map<string, TxRow>();
    let lastId = 0;
    const nextId = () => `${++lastId}`;

    const getAccount = (id: string) => accounts.get(id) ?? notFound("Account", id);
    const getCategory = (id: string) => categories.get(id) ?? notFound("Category", id);
    const getTx = (id: string) => transactions.get(id) ?? notFound("Transaction", id);
    const noneCategory = () => [...categories.values()].find((c) => c.name === NONE);

    function categoryIdOrNone(categoryId: string | null | undefined): string {
        if (categoryId) {
            return getCategory(categoryId).id;
        }

        return (
            noneCategory()?.id ??
            fail("INTERNAL_ERROR", "CATEGORY_DEFAULTS_NOT_FOUND", "Call initializeUser first")
        );
    }

    function requireUniqueName(
        rows: Map<string, { id: string; name: string }>,
        name: string,
        id?: string
    ) {
        if ([...rows.values()].some((row) => row.name === name && row.id !== id)) {
            badRequest("NAME_TAKEN", `Name '${name}' is taken`);
        }
    }

    const accountNode = (row: AccountRow) => ({
        id: row.id,
        name: row.name,
        balance: () => ({ ...row.balance }),
    });

    const txNode = (row: TxRow) => ({
        __typename: row.type,
        id: row.id,
        amount: { ...row.amount },
        convertedAmount: row.convertedAmount ? { ...row.convertedAmount } : null,
        category: () => categories.get(row.categoryId),
        description: row.description,
        occurredAt: row.occurredAt,
        from: () => (row.fromId ? accountNode(getAccount(row.fromId)) : null),
        to: () => (row.toId ? accountNode(getAccount(row.toId)) : null),
    });

    /** Checks a transaction in the backend's order, before any balance changes. */
    function validate(tx: TxRow): void {
        const from = tx.fromId ? getAccount(tx.fromId) : undefined;
        const to = tx.toId ? getAccount(tx.toId) : undefined;

        if (tx.type === "Transfer" && tx.fromId === tx.toId) {
            badRequest("INVALID_TRANSACTION", "from and to are the same account");
        }

        requirePositive(tx.amount);
        requireCurrency((from ?? to).balance.currency, tx.amount);

        if (tx.type !== "Transfer") {
            return;
        }

        if (from.balance.currency === to.balance.currency) {
            if (tx.convertedAmount) {
                badRequest("INVALID_TRANSACTION", "convertedAmount given for the same currency");
            }
        } else {
            if (!tx.convertedAmount) {
                badRequest("INVALID_TRANSACTION", "convertedAmount missing for another currency");
            }

            requirePositive(tx.convertedAmount);
            requireCurrency(to.balance.currency, tx.convertedAmount);
        }
    }

    function move(tx: TxRow, sign: 1 | -1): void {
        const change = (id: string, amount: number) => {
            const account = getAccount(id);
            account.balance = {
                ...account.balance,
                amount: round(account.balance.amount + sign * amount),
            };
        };

        if (tx.fromId) {
            change(tx.fromId, -tx.amount.amount);
        }

        if (tx.toId) {
            change(tx.toId, (tx.convertedAmount ?? tx.amount).amount);
        }
    }

    function create(type: TxType, args: Args) {
        const tx: TxRow = {
            id: undefined,
            type,
            fromId: args.fromAccountId,
            toId: args.toAccountId,
            amount: args.amount,
            convertedAmount: args.convertedAmount ?? undefined,
            categoryId: categoryIdOrNone(args.categoryId),
            description: args.description ?? null,
            occurredAt: args.occurredAt ? toInstant(args.occurredAt) : new Date().toISOString(),
        };
        validate(tx);
        tx.id = nextId();
        move(tx, 1);
        transactions.set(tx.id, tx);

        return txNode(tx);
    }

    function patch(type: TxType, args: Args) {
        const old = getTx(args.id);

        if (old.type !== type) {
            notFound(type, args.id);
        }

        const tx: TxRow = {
            ...old,
            fromId: args.fromAccountId ?? old.fromId,
            toId: args.toAccountId ?? old.toId,
            amount: args.amount ?? old.amount,
            convertedAmount: args.convertedAmount ?? old.convertedAmount,
            categoryId: "categoryId" in args ? categoryIdOrNone(args.categoryId) : old.categoryId,
            description: "description" in args ? args.description : old.description,
            occurredAt: args.occurredAt ? toInstant(args.occurredAt) : old.occurredAt,
        };
        validate(tx);
        move(old, -1);
        move(tx, 1);
        transactions.set(tx.id, tx);

        return txNode(tx);
    }

    function filterTransactions(filter: Args = {}): TxRow[] {
        const from = filter.fromDate ? startOfDay(filter.fromDate) : -Infinity;
        const until = filter.toDate ? startOfDay(filter.toDate) + DAY_MS : Infinity;

        if (from >= until) {
            badRequest("TRANSACTION_FILTER_INVALID_DATE_RANGE", "fromDate is after toDate");
        }

        const types: Record<string, TxType> = {
            EXPENSE: "Expense",
            INCOME: "Income",
            TRANSFER: "Transfer",
        };

        return [...transactions.values()].filter((tx) => {
            const at = Date.parse(tx.occurredAt);

            return (
                at >= from &&
                at < until &&
                (!filter.categoryId || tx.categoryId === filter.categoryId) &&
                (!filter.accountId ||
                    tx.fromId === filter.accountId ||
                    tx.toId === filter.accountId) &&
                (!filter.type || tx.type === types[filter.type])
            );
        });
    }

    const rootValue: MockV3["rootValue"] = {
        // Queries
        accounts: (args) => connection([...accounts.values()], args as PageArgs, accountNode),
        account: ({ id }) => accountNode(getAccount(id)),
        categories: (args) => connection([...categories.values()], args as PageArgs, (c) => c),
        category: ({ id }) => getCategory(id),
        transactions: (args) =>
            connection(filterTransactions(args.filter), args as PageArgs, txNode),
        transaction: ({ id }) => txNode(getTx(id)),

        // Users
        initializeUser: () => {
            DEFAULT_CATEGORIES.filter(
                ([name]) => ![...categories.values()].some((c) => c.name === name)
            ).forEach(([name, type]) => {
                const id = nextId();
                categories.set(id, { id, name, type });
            });

            return true;
        },

        // Accounts
        createAccount: ({ name, balance }) => {
            requireUniqueName(accounts, name);
            const row = { id: nextId(), name, balance: { ...balance } };
            accounts.set(row.id, row);

            return accountNode(row);
        },
        patchAccount: ({ id, name, balance }) => {
            const row = getAccount(id);

            if (name != null) {
                requireUniqueName(accounts, name, id);
            }

            if (balance != null) {
                requireCurrency(row.balance.currency, balance);
            }

            row.name = name ?? row.name;
            row.balance = balance ? { ...balance } : row.balance;

            return accountNode(row);
        },
        deleteAccount: ({ id }) => {
            getAccount(id);
            transactions.forEach((tx) => {
                if (tx.type !== "Transfer") {
                    if (tx.fromId === id || tx.toId === id) {
                        transactions.delete(tx.id);
                    }
                } else if (tx.toId === id) {
                    transactions.set(tx.id, { ...tx, type: "Expense", toId: undefined });
                } else if (tx.fromId === id) {
                    transactions.set(tx.id, {
                        ...tx,
                        type: "Income",
                        fromId: undefined,
                        amount: tx.convertedAmount ?? tx.amount,
                        convertedAmount: undefined,
                    });
                }
            });
            accounts.delete(id);

            return id;
        },

        // Categories
        createCategory: ({ name, type }) => {
            requireUniqueName(categories, name);
            const row = { id: nextId(), name, type: type ?? "ANY" };
            categories.set(row.id, row);

            return row;
        },
        patchCategory: ({ id, name, type }) => {
            const row = getCategory(id);

            if (row.name === NONE) {
                badRequest("CATEGORY_PROTECTED", "The None category can't be changed");
            }

            if (name != null) {
                requireUniqueName(categories, name, id);
                row.name = name;
            }

            row.type = type ?? row.type;

            return row;
        },
        deleteCategory: ({ id }) => {
            const row = getCategory(id);

            if (row.name === NONE) {
                badRequest("CATEGORY_PROTECTED", "The None category can't be deleted");
            }

            const noneId = categoryIdOrNone(null);
            transactions.forEach((tx) => {
                if (tx.categoryId === id) {
                    tx.categoryId = noneId;
                }
            });
            categories.delete(id);

            return id;
        },

        // Transactions
        withdraw: (args) => create("Expense", args),
        deposit: (args) => create("Income", args),
        transfer: (args) => create("Transfer", args),
        patchExpense: (args) => patch("Expense", args),
        patchIncome: (args) => patch("Income", args),
        patchTransfer: (args) => patch("Transfer", args),
        deleteTransaction: ({ id }) => {
            move(getTx(id), -1);
            transactions.delete(id);

            return id;
        },
    };

    return { schema: buildSchema(sdl), rootValue };
}
