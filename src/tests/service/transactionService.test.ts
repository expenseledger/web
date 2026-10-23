import { createAccount, patchAccount } from "../../service/accountService";
import { getAllCategories } from "../../service/categoryService";
import Account from "../../service/model/Account";
import { Money } from "../../service/model/Money";
import {
    addExpense,
    addIncome,
    addTransfer,
    deleteTransaction,
    getTransactionMonthYearList,
    listTransactions,
    listTransactionsPage,
    updateTransaction,
} from "../../service/transactionService";
import { getUserData } from "../../service/userService";
import { mockClient, resetMockV3 } from "../mock/mockClient";

jest.mock("../../lib/apollo", () => ({
    __esModule: true,
    default: jest.requireActual("../mock/mockClient").mockClient,
}));

jest.mock("../../common/utils", () => ({
    log: jest.fn(),
}));

const thb = (amount: number): Money => ({ amount, currency: "THB" });

async function account(name: string, balance: number, currency: Money["currency"] = "THB") {
    const { account } = await createAccount({ name, currency });

    return (await patchAccount({ id: account.id, balance: { amount: balance, currency } }))
        .account as Account;
}

describe("transactionService", () => {
    let cash: Account;
    let bank: Account;

    beforeEach(async () => {
        jest.restoreAllMocks();
        await resetMockV3();
        await getUserData();
        cash = await account("Cash", 100);
        bank = await account("Bank", 0);
    });

    describe("addExpense", () => {
        it("returns the expense with the new balance", async () => {
            const food = (await getAllCategories()).find((c) => c.name === "Food");
            const date = new Date(2026, 0, 2);

            const result = await addExpense({
                amount: thb(30),
                categoryId: food.id,
                description: "Lunch",
                fromAccountId: cash.id,
                date,
            });

            expect(result.transaction).toEqual({
                id: expect.any(String),
                type: "EXPENSE",
                fromAccount: { ...cash, balance: 70 },
                toAccount: null,
                amount: 30,
                convertedAmount: null,
                category: food,
                description: "Lunch",
                date,
            });
        });

        it("defaults to the None category and no description", async () => {
            const result = await addExpense({
                amount: thb(30),
                description: "",
                fromAccountId: cash.id,
                date: new Date(),
            });

            expect(result.transaction.category.name).toBe("None");
            expect(result.transaction.description).toBeNull();
        });

        it("returns the error code of a rejected expense", async () => {
            const result = await addExpense({
                amount: thb(0),
                fromAccountId: cash.id,
                date: new Date(),
            });

            expect(result).toEqual({ transaction: null, errorCode: "NON_POSITIVE_AMOUNT" });
        });

        it("returns null on an unexpected error", async () => {
            jest.spyOn(mockClient, "mutate").mockRejectedValueOnce(new Error("network"));

            const result = await addExpense({
                amount: thb(1),
                fromAccountId: cash.id,
                date: new Date(),
            });

            expect(result.transaction).toBeNull();
        });
    });

    describe("addIncome", () => {
        it("returns the income with the new balance", async () => {
            const result = await addIncome({
                amount: thb(5),
                toAccountId: bank.id,
                date: new Date(),
            });

            expect(result.transaction.type).toBe("INCOME");
            expect(result.transaction.toAccount.balance).toBe(5);
        });
    });

    describe("addTransfer", () => {
        it("moves money between the accounts", async () => {
            const result = await addTransfer({
                amount: thb(40),
                fromAccountId: cash.id,
                toAccountId: bank.id,
                date: new Date(),
            });

            expect(result.transaction.fromAccount.balance).toBe(60);
            expect(result.transaction.toAccount.balance).toBe(40);
        });

        it("sends the converted amount between currencies", async () => {
            const euro = await account("Euro", 0, "EUR");

            const result = await addTransfer({
                amount: thb(40),
                convertedAmount: { amount: 1, currency: "EUR" },
                fromAccountId: cash.id,
                toAccountId: euro.id,
                date: new Date(),
            });

            expect(result.transaction.convertedAmount).toBe(1);
            expect(result.transaction.toAccount.balance).toBe(1);
        });

        it("returns the error code of a transfer to the same account", async () => {
            const result = await addTransfer({
                amount: thb(1),
                fromAccountId: cash.id,
                toAccountId: cash.id,
                date: new Date(),
            });

            expect(result.errorCode).toBe("INVALID_TRANSACTION");
        });
    });

    describe("listTransactions", () => {
        it("returns every transaction of the account within whole local days", async () => {
            const dates = [
                new Date(2026, 7, 31, 23, 30),
                new Date(2026, 8, 1, 0, 30),
                new Date(2026, 8, 30, 23, 30),
                new Date(2026, 9, 1, 0, 30),
            ];
            for (const date of dates) {
                await addExpense({ amount: thb(1), fromAccountId: cash.id, date });
            }
            await addIncome({ amount: thb(1), toAccountId: bank.id, date: dates[1] });

            const result = await listTransactions({
                accountId: cash.id,
                fromDate: new Date(2026, 8, 1),
                toDate: new Date(2026, 8, 30),
            });

            expect(result.items.map((t) => t.date)).toEqual([dates[2], dates[1]]);
        });

        it("pages through more than 50 transactions", async () => {
            for (let i = 0; i < 52; i++) {
                await addExpense({
                    amount: thb(1),
                    fromAccountId: cash.id,
                    date: new Date(2026, 8, 2),
                });
            }

            const result = await listTransactions({
                accountId: cash.id,
                fromDate: new Date(2026, 8, 1),
                toDate: new Date(2026, 8, 30),
            });

            expect(result.items).toHaveLength(52);
        });
    });

    describe("listTransactionsPage", () => {
        it("returns transactions on either side of the account, newest first", async () => {
            await addExpense({
                amount: thb(1),
                fromAccountId: cash.id,
                date: new Date(2026, 0, 1),
            });
            await addTransfer({
                amount: thb(1),
                fromAccountId: bank.id,
                toAccountId: cash.id,
                date: new Date(2026, 0, 3),
            });
            await addIncome({ amount: thb(1), toAccountId: cash.id, date: new Date(2026, 0, 2) });

            const first = await listTransactionsPage({ accountId: cash.id, first: 2 });
            const second = await listTransactionsPage({
                accountId: cash.id,
                first: 2,
                after: first.endCursor,
            });

            expect(first.items.map((t) => t.type)).toEqual(["TRANSFER", "INCOME"]);
            expect(first.hasNextPage).toBe(true);
            expect(second.items.map((t) => t.type)).toEqual(["EXPENSE"]);
            expect(second.hasNextPage).toBe(false);
        });
    });

    describe("getTransactionMonthYearList", () => {
        it("lists the months from the oldest to the newest transaction, newest first", async () => {
            await addIncome({ amount: thb(1), toAccountId: cash.id, date: new Date(2026, 0, 31) });
            await addTransfer({
                amount: thb(1),
                fromAccountId: bank.id,
                toAccountId: cash.id,
                date: new Date(2025, 10, 1),
            });
            await addExpense({
                amount: thb(1),
                fromAccountId: bank.id,
                date: new Date(2024, 0, 1),
            });

            const result = await getTransactionMonthYearList({ accountId: cash.id });

            expect(result.monthYears).toEqual(["2026-01", "2025-12", "2025-11"]);
        });

        it("lists no months for an account without transactions", async () => {
            expect(await getTransactionMonthYearList({ accountId: cash.id })).toEqual({
                monthYears: [],
            });
        });
    });

    describe("deleteTransaction", () => {
        it("deletes the transaction", async () => {
            const { transaction } = await addExpense({
                amount: thb(1),
                fromAccountId: cash.id,
                date: new Date(),
            });

            expect(await deleteTransaction({ id: transaction.id })).toEqual({ isSuccess: true });
        });

        it("returns the error code of an unknown transaction", async () => {
            expect(await deleteTransaction({ id: "999" })).toEqual({
                isSuccess: false,
                errorCode: "RESOURCE_NOT_FOUND",
            });
        });
    });

    describe("updateTransaction", () => {
        it("patches only the given fields and returns the new balance", async () => {
            const { transaction } = await addExpense({
                amount: thb(30),
                description: "Lunch",
                fromAccountId: cash.id,
                date: new Date(2026, 0, 2),
            });

            const result = await updateTransaction({
                id: transaction.id,
                type: "EXPENSE",
                amount: thb(50),
            });

            expect(result.updatedTransaction).toEqual({
                ...transaction,
                amount: 50,
                fromAccount: { ...cash, balance: 50 },
            });
        });

        it("patches a transfer", async () => {
            const { transaction } = await addTransfer({
                amount: thb(10),
                fromAccountId: cash.id,
                toAccountId: bank.id,
                date: new Date(),
            });

            const result = await updateTransaction({
                id: transaction.id,
                type: "TRANSFER",
                description: null,
                occurredAt: new Date(2026, 0, 5),
            });

            expect(result.updatedTransaction.date).toEqual(new Date(2026, 0, 5));
        });

        it("returns the error code of a rejected patch", async () => {
            const { transaction } = await addIncome({
                amount: thb(10),
                toAccountId: bank.id,
                date: new Date(),
            });

            const result = await updateTransaction({
                id: transaction.id,
                type: "INCOME",
                amount: { amount: 1, currency: "EUR" },
            });

            expect(result).toEqual({ updatedTransaction: null, errorCode: "CURRENCY_MISMATCH" });
        });
    });
});
