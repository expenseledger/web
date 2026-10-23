import {
    buildTransactionPatch,
    compareTransactionsDesc,
    mapTransactionFromServer,
    monthYearsBetween,
    toOffsetDateTime,
} from "../../../service/helper/transactoinHelper";
import Transaction from "../../../service/model/Transaction";

const cash = { id: "1", name: "Cash", balance: 100, currency: "THB" as const };
const euro = { id: "2", name: "Euro", balance: 5, currency: "EUR" as const };

const expense: Transaction = {
    id: "42",
    type: "EXPENSE",
    fromAccount: cash,
    toAccount: null,
    amount: 50,
    convertedAmount: null,
    category: { id: "7", name: "Food", type: "EXPENSE" },
    description: "Lunch",
    date: new Date(2026, 0, 2, 12, 30),
};

describe("transactoinHelper", () => {
    describe("mapTransactionFromServer", () => {
        it("maps a transfer from the server", () => {
            const result = mapTransactionFromServer({
                __typename: "Transfer",
                id: "42",
                amount: { amount: 40, currency: "THB" },
                convertedAmount: { amount: 1, currency: "EUR" },
                from: { id: "1", name: "Cash", balance: { amount: 100, currency: "THB" } },
                to: { id: "2", name: "Euro", balance: { amount: 5, currency: "EUR" } },
                category: { id: "7", name: "Food", type: "EXPENSE" },
                description: null,
                occurredAt: "2026-01-02T03:04:05Z",
            });

            expect(result).toEqual({
                id: "42",
                type: "TRANSFER",
                fromAccount: cash,
                toAccount: euro,
                amount: 40,
                convertedAmount: 1,
                category: { id: "7", name: "Food", type: "EXPENSE" },
                description: null,
                date: new Date("2026-01-02T03:04:05Z"),
            });
        });

        it("maps an expense without a to account or converted amount", () => {
            const result = mapTransactionFromServer({
                __typename: "Expense",
                id: "1",
                amount: { amount: 10, currency: "THB" },
                from: { id: "1", name: "Cash", balance: { amount: 100, currency: "THB" } },
                category: null,
                description: "",
                occurredAt: "2026-01-02T03:04:05Z",
            });

            expect(result.type).toBe("EXPENSE");
            expect(result.toAccount).toBeNull();
            expect(result.convertedAmount).toBeNull();
            expect(result.category).toBeNull();
        });
    });

    describe("compareTransactionsDesc", () => {
        it("orders by date, then by numeric id, newest first", () => {
            const older = { ...expense, id: "9", date: new Date(2026, 0, 1) };
            const low = { ...expense, id: "9" };
            const high = { ...expense, id: "10" };

            expect([older, low, high].sort(compareTransactionsDesc)).toEqual([high, low, older]);
        });
    });

    describe("monthYearsBetween", () => {
        it("lists every month from the oldest to the newest, newest first", () => {
            const oldest = new Date(2025, 10, 30, 23, 59);
            const newest = new Date(2026, 1, 1);

            expect(monthYearsBetween(oldest, newest)).toEqual([
                "2026-02",
                "2026-01",
                "2025-12",
                "2025-11",
            ]);
        });

        it("lists one month when both are in it", () => {
            expect(monthYearsBetween(new Date(2026, 1, 1), new Date(2026, 1, 28))).toEqual([
                "2026-02",
            ]);
        });
    });

    describe("toOffsetDateTime", () => {
        it("keeps the local time and adds the local offset", () => {
            const value = toOffsetDateTime(new Date(2026, 8, 1));

            expect(value).toMatch(/^2026-09-01T00:00:00[+-]\d{2}:\d{2}$/);
            expect(new Date(value)).toEqual(new Date(2026, 8, 1));
        });
    });

    describe("buildTransactionPatch", () => {
        const unchanged = {
            amount: 50,
            categoryId: "7",
            description: "Lunch",
            occurredAt: new Date(2026, 0, 2),
        };

        it("omits unchanged fields, including a date on the same day", () => {
            expect(buildTransactionPatch(expense, cash.id, unchanged)).toEqual({
                id: "42",
                type: "EXPENSE",
            });
        });

        it("sends the changed fields", () => {
            expect(
                buildTransactionPatch(expense, cash.id, {
                    amount: 60,
                    categoryId: "8",
                    description: "",
                    occurredAt: new Date(2026, 0, 3),
                })
            ).toEqual({
                id: "42",
                type: "EXPENSE",
                amount: { amount: 60, currency: "THB" },
                categoryId: "8",
                description: null,
                occurredAt: new Date(2026, 0, 3),
            });
        });

        it("edits the converted amount on the receiving side of a cross-currency transfer", () => {
            const transfer: Transaction = {
                ...expense,
                type: "TRANSFER",
                toAccount: euro,
                amount: 40,
                convertedAmount: 1,
            };

            expect(buildTransactionPatch(transfer, euro.id, { ...unchanged, amount: 2 })).toEqual({
                id: "42",
                type: "TRANSFER",
                convertedAmount: { amount: 2, currency: "EUR" },
            });
        });
    });
});
