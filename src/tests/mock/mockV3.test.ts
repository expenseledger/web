import { graphql } from "graphql";
import { createMockV3, MockV3 } from "../../mock/mockV3";
import { v3Sdl } from "./v3Schema";

let mock: MockV3;

async function run(source: string, variableValues?: Record<string, unknown>) {
    return graphql({ schema: mock.schema, rootValue: mock.rootValue, source, variableValues });
}

async function ok(source: string, variableValues?: Record<string, unknown>) {
    const result = await run(source, variableValues);
    expect(result.errors).toBeUndefined();

    return result.data as any;
}

async function errorCode(source: string, variableValues?: Record<string, unknown>) {
    const result = await run(source, variableValues);

    return result.errors?.[0]?.extensions?.code;
}

const thb = (amount: number) => ({ amount, currency: "THB" });

async function createAccount(name: string, balance = thb(100)): Promise<string> {
    const data = await ok(
        `mutation ($name: String!, $balance: MoneyInput!) {
            createAccount(name: $name, balance: $balance) { id }
        }`,
        { name, balance }
    );

    return data.createAccount.id;
}

async function balanceOf(id: string): Promise<number> {
    const data = await ok(`query ($id: ID!) { account(id: $id) { balance { amount } } }`, { id });

    return data.account.balance.amount;
}

async function categoryNames(): Promise<string[]> {
    const data = await ok(`{ categories(first: 50) { edges { node { name } } } }`);

    return data.categories.edges.map((e: any) => e.node.name);
}

const WITHDRAW = `mutation ($from: ID!, $amount: MoneyInput!, $occurredAt: String, $categoryId: ID) {
    withdraw(fromAccountId: $from, amount: $amount, occurredAt: $occurredAt, categoryId: $categoryId) {
        id
        occurredAt
        category { name }
        from { balance { amount } }
    }
}`;

const TRANSFER = `mutation ($from: ID!, $to: ID!, $amount: MoneyInput!, $converted: MoneyInput) {
    transfer(fromAccountId: $from, toAccountId: $to, amount: $amount, convertedAmount: $converted) {
        id
    }
}`;

async function accounts() {
    const data = await ok(
        `{ accounts(first: 50) { edges { node { id name balance { amount currency } } } } }`
    );

    return data.accounts.edges.map((e: any) => e.node);
}

beforeEach(async () => {
    mock = createMockV3(v3Sdl);
    await ok(`mutation { initializeUser }`);
    // Start without the seeded accounts; the tests below create their own.
    for (const { id } of await accounts()) {
        await ok(`mutation ($id: ID!) { deleteAccount(id: $id) }`, { id });
    }
});

describe("mock API v3", () => {
    it("seeds the default categories once", async () => {
        await ok(`mutation { initializeUser }`);

        expect(await categoryNames()).toEqual([
            "Food",
            "Transport",
            "Groceries",
            "Bills",
            "Entertainment",
            "Salary",
            "Other",
        ]);
    });

    it("seeds Cash and Bank with no balance in THB by default", async () => {
        mock = createMockV3(v3Sdl);
        await ok(`mutation { initializeUser }`);

        expect((await accounts()).map((a: any) => [a.name, a.balance])).toEqual([
            ["Cash", thb(0)],
            ["Bank", thb(0)],
        ]);
    });

    it("seeds the default accounts in the given currency once", async () => {
        mock = createMockV3(v3Sdl);
        await ok(`mutation { initializeUser(currency: EUR) }`);
        const [cash] = await accounts();
        await ok(`mutation ($id: ID!) { deleteAccount(id: $id) }`, { id: cash.id });
        await ok(`mutation { initializeUser(currency: USD) }`);

        expect((await accounts()).map((a: any) => [a.name, a.balance])).toEqual([
            ["Bank", { amount: 0, currency: "EUR" }],
        ]);
    });

    it("seeds the default category types", async () => {
        const data = await ok(`{ categories(first: 50) { edges { node { name type } } } }`);
        const types = Object.fromEntries(
            data.categories.edges.map((e: any) => [e.node.name, e.node.type])
        );

        expect(types).toEqual({
            Food: "EXPENSE",
            Transport: "EXPENSE",
            Groceries: "EXPENSE",
            Bills: "EXPENSE",
            Entertainment: "EXPENSE",
            Salary: "INCOME",
            Other: "ANY",
        });
    });

    it("creates a category as ANY unless given a type, and retypes it", async () => {
        const { gift } = await ok(`mutation { gift: createCategory(name: "Gift") { type } }`);
        const { tip } = await ok(
            `mutation { tip: createCategory(name: "Tip", type: null) { type } }`
        );
        const { bonus } = await ok(
            `mutation { bonus: createCategory(name: "Bonus", type: INCOME) { id type } }`
        );
        const { renamed } = await ok(
            `mutation ($id: ID!) { renamed: patchCategory(id: $id, name: "Bonuses") { type } }`,
            { id: bonus.id }
        );
        const { retyped } = await ok(
            `mutation ($id: ID!) { retyped: patchCategory(id: $id, type: TRANSFER) { name type } }`,
            { id: bonus.id }
        );

        expect(gift.type).toBe("ANY");
        expect(tip.type).toBe("ANY");
        expect(bonus.type).toBe("INCOME");
        expect(renamed.type).toBe("INCOME");
        expect(retyped).toEqual({ name: "Bonuses", type: "TRANSFER" });
    });

    it("rejects a taken account name", async () => {
        await createAccount("Cash");

        expect(
            await errorCode(
                `mutation { createAccount(name: "Cash", balance: { amount: 0, currency: THB }) { id } }`
            )
        ).toBe("NAME_TAKEN");
    });

    it("withdraws from the account and defaults the category to Other", async () => {
        const cash = await createAccount("Cash");

        const data = await ok(WITHDRAW, {
            from: cash,
            amount: thb(30),
            occurredAt: "2026-01-02T10:04:05+07:00",
        });

        expect(data.withdraw.from.balance.amount).toBe(70);
        expect(data.withdraw.category.name).toBe("Other");
        expect(data.withdraw.occurredAt).toBe("2026-01-02T03:04:05.000Z");
    });

    it("rejects a non-positive amount, a wrong currency and a bare date", async () => {
        const cash = await createAccount("Cash");

        expect(await errorCode(WITHDRAW, { from: cash, amount: thb(0) })).toBe(
            "NON_POSITIVE_AMOUNT"
        );
        expect(
            await errorCode(WITHDRAW, { from: cash, amount: { amount: 1, currency: "EUR" } })
        ).toBe("CURRENCY_MISMATCH");
        expect(
            await errorCode(WITHDRAW, { from: cash, amount: thb(1), occurredAt: "2026-01-02" })
        ).toBe("INVALID_DATE_TIME");
        expect(await balanceOf(cash)).toBe(100);
    });

    it("validates transfers like the backend", async () => {
        const cash = await createAccount("Cash");
        const bank = await createAccount("Bank");
        const euro = await createAccount("Euro", { amount: 10, currency: "EUR" });

        expect(await errorCode(TRANSFER, { from: cash, to: cash, amount: thb(1) })).toBe(
            "INVALID_TRANSACTION"
        );
        expect(
            await errorCode(TRANSFER, { from: cash, to: bank, amount: thb(1), converted: thb(1) })
        ).toBe("INVALID_TRANSACTION");
        expect(await errorCode(TRANSFER, { from: cash, to: euro, amount: thb(1) })).toBe(
            "INVALID_TRANSACTION"
        );
        expect(
            await errorCode(TRANSFER, { from: cash, to: euro, amount: thb(1), converted: thb(1) })
        ).toBe("CURRENCY_MISMATCH");

        await ok(TRANSFER, {
            from: cash,
            to: euro,
            amount: thb(40),
            converted: { amount: 1, currency: "EUR" },
        });

        expect(await balanceOf(cash)).toBe(60);
        expect(await balanceOf(euro)).toBe(11);
    });

    it("patches only the given fields and re-applies the balance", async () => {
        const cash = await createAccount("Cash");
        const { withdraw } = await ok(WITHDRAW, { from: cash, amount: thb(30) });
        await ok(`mutation ($id: ID!) { patchExpense(id: $id, description: "Lunch") { id } }`, {
            id: withdraw.id,
        });

        const data = await ok(
            `mutation ($id: ID!) {
                patchExpense(id: $id, amount: { amount: 50, currency: THB }, categoryId: null) {
                    description
                    category { name }
                    from { balance { amount } }
                }
            }`,
            { id: withdraw.id }
        );

        expect(data.patchExpense.description).toBe("Lunch");
        expect(data.patchExpense.category.name).toBe("Other");
        expect(data.patchExpense.from.balance.amount).toBe(50);
    });

    it("reverses the balance when deleting a transaction", async () => {
        const cash = await createAccount("Cash");
        const { withdraw } = await ok(WITHDRAW, { from: cash, amount: thb(30) });

        await ok(`mutation ($id: ID!) { deleteTransaction(id: $id) }`, { id: withdraw.id });

        expect(await balanceOf(cash)).toBe(100);
    });

    it("sets an account's name and balance directly", async () => {
        const cash = await createAccount("Cash");
        await createAccount("Bank");

        const data = await ok(
            `mutation ($id: ID!) {
                patchAccount(id: $id, name: "Wallet", balance: { amount: 5, currency: THB }) {
                    name
                    balance { amount }
                }
            }`,
            { id: cash }
        );

        expect(data.patchAccount).toEqual({ name: "Wallet", balance: { amount: 5 } });
        expect(
            await errorCode(`mutation ($id: ID!) { patchAccount(id: $id, name: "Bank") { id } }`, {
                id: cash,
            })
        ).toBe("NAME_TAKEN");
        expect(
            await errorCode(
                `mutation ($id: ID!) {
                    patchAccount(id: $id, balance: { amount: 5, currency: EUR }) { id }
                }`,
                { id: cash }
            )
        ).toBe("CURRENCY_MISMATCH");
    });

    it("rewrites transfers with the remaining account when deleting an account", async () => {
        const cash = await createAccount("Cash");
        const bank = await createAccount("Bank");
        await ok(TRANSFER, { from: cash, to: bank, amount: thb(20) });
        await ok(WITHDRAW, { from: bank, amount: thb(5) });

        await ok(`mutation ($id: ID!) { deleteAccount(id: $id) }`, { id: bank });

        const data = await ok(
            `query ($id: ID) {
                transactions(first: 50, filter: { accountId: $id }) {
                    edges { node { __typename amount { amount } } }
                }
            }`,
            { id: cash }
        );
        expect(data.transactions.edges).toEqual([
            { node: { __typename: "Expense", amount: { amount: 20 } } },
        ]);
        expect(await balanceOf(cash)).toBe(80);
    });

    it("moves transactions to Other when deleting a category and protects Other", async () => {
        const cash = await createAccount("Cash");
        const categories = await ok(`{ categories(first: 50) { edges { node { id name } } } }`);
        const byName = Object.fromEntries(
            categories.categories.edges.map((e: any) => [e.node.name, e.node.id])
        );
        const { withdraw } = await ok(WITHDRAW, {
            from: cash,
            amount: thb(1),
            categoryId: byName.Food,
        });

        await ok(`mutation ($id: ID!) { deleteCategory(id: $id) }`, { id: byName.Food });

        const data = await ok(`query ($id: ID!) { transaction(id: $id) { category { name } } }`, {
            id: withdraw.id,
        });
        expect(data.transaction.category.name).toBe("Other");
        expect(
            await errorCode(`mutation ($id: ID!) { deleteCategory(id: $id) }`, { id: byName.Other })
        ).toBe("CATEGORY_PROTECTED");
        expect(
            await errorCode(`mutation ($id: ID!) { patchCategory(id: $id, name: "Misc") { id } }`, {
                id: byName.Other,
            })
        ).toBe("CATEGORY_PROTECTED");
        expect(
            await errorCode(`mutation ($id: ID!) { patchCategory(id: $id, type: INCOME) { id } }`, {
                id: byName.Other,
            })
        ).toBe("CATEGORY_PROTECTED");
    });

    it("filters by whole days in the given offset and pages newest first", async () => {
        const cash = await createAccount("Cash");
        for (const occurredAt of [
            "2026-08-31T23:30:00+07:00",
            "2026-09-01T00:30:00+07:00",
            "2026-09-30T23:30:00+07:00",
            "2026-10-01T00:30:00+07:00",
        ]) {
            await ok(WITHDRAW, { from: cash, amount: thb(1), occurredAt });
        }
        const query = `query ($after: String) {
            transactions(
                first: 1
                after: $after
                sort: [{ property: "occurredAt", direction: DESC }]
                filter: { fromDate: "2026-09-01T00:00:00+07:00", toDate: "2026-09-30T00:00:00+07:00" }
            ) {
                edges { node { occurredAt } }
                pageInfo { hasNextPage endCursor }
            }
        }`;

        const first = await ok(query);
        const second = await ok(query, { after: first.transactions.pageInfo.endCursor });

        expect(first.transactions.edges[0].node.occurredAt).toBe("2026-09-30T16:30:00.000Z");
        expect(first.transactions.pageInfo.hasNextPage).toBe(true);
        expect(second.transactions.edges[0].node.occurredAt).toBe("2026-08-31T17:30:00.000Z");
        expect(second.transactions.pageInfo.hasNextPage).toBe(false);
    });

    it("rejects pages larger than 50", async () => {
        expect(await errorCode(`{ accounts(first: 51) { edges { cursor } } }`)).toBe(
            "TOO_MANY_ROWS"
        );
    });
});
