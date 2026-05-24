import client from "../../lib/apollo";
import {
    addExpense,
    addIncome,
    addTransfer,
    deleteTransaction,
    getTransactionMonthYearList,
    listTransactions,
    updateTransaction,
} from "../../service/transactionService";

jest.mock("../../lib/apollo", () => ({
    __esModule: true,
    default: {
        query: jest.fn(),
        mutate: jest.fn(),
    },
}));

jest.mock("../../common/utils", () => ({
    log: jest.fn(),
}));

const mockClient = client as jest.Mocked<typeof client>;

const serverTransaction = {
    id: 1,
    fromAccount: { id: 1, name: "Cash", type: "CASH", balance: 100 },
    toAccount: null,
    amount: 50,
    type: "EXPENSE",
    category: { id: 2, name: "Food", type: "EXPENSE" },
    description: "Lunch",
    date: "2024-06-15T10:00:00.000Z",
};

describe("transactionService", () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe("addExpense", () => {
        it("returns mapped transaction on success", async () => {
            mockClient.mutate.mockResolvedValue({
                data: { spend: { transaction: serverTransaction } },
            } as never);

            const result = await addExpense({
                amount: 50,
                categoryId: 2,
                description: "Lunch",
                fromAccountId: 1,
                date: new Date("2024-06-15"),
            });

            expect(result?.transaction.id).toBe(1);
            expect(result?.transaction.amount).toBe(50);
        });

        it("returns null when mutation has error", async () => {
            mockClient.mutate.mockResolvedValue({
                data: null,
                error: { message: "failed" },
            } as never);

            const result = await addExpense({
                amount: 50,
                categoryId: 2,
                description: "Lunch",
                fromAccountId: 1,
                date: new Date(),
            });

            expect(result).toBeNull();
        });

        it("returns null on unexpected error", async () => {
            mockClient.mutate.mockRejectedValue(new Error("network"));

            const result = await addExpense({
                amount: 50,
                categoryId: 2,
                description: "Lunch",
                fromAccountId: 1,
                date: new Date(),
            });

            expect(result).toBeNull();
        });
    });

    describe("addIncome", () => {
        it("returns mapped transaction on success", async () => {
            const incomeTransaction = {
                ...serverTransaction,
                type: "INCOME",
                fromAccount: null,
                toAccount: { id: 1, name: "Cash", type: "CASH", balance: 100 },
            };

            mockClient.mutate.mockResolvedValue({
                data: { receive: { transaction: incomeTransaction } },
            } as never);

            const result = await addIncome({
                amount: 100,
                categoryId: 2,
                description: "Salary",
                toAccountId: 1,
                date: new Date("2024-06-15"),
            });

            expect(result?.transaction.type).toBe("INCOME");
        });

        it("returns null when mutation has error", async () => {
            mockClient.mutate.mockResolvedValue({
                data: null,
                error: { message: "failed" },
            } as never);

            const result = await addIncome({
                amount: 100,
                categoryId: 2,
                description: "Salary",
                toAccountId: 1,
                date: new Date(),
            });

            expect(result).toBeNull();
        });
    });

    describe("addTransfer", () => {
        it("returns mapped transaction on success", async () => {
            const transferTransaction = {
                ...serverTransaction,
                type: "TRANSFER",
                toAccount: { id: 2, name: "Bank", type: "BANK", balance: 200 },
            };

            mockClient.mutate.mockResolvedValue({
                data: { transferV2: { transaction: transferTransaction } },
            } as never);

            const result = await addTransfer({
                amount: 50,
                categoryId: 2,
                description: "Transfer",
                fromAccountId: 1,
                toAccountId: 2,
                date: new Date("2024-06-15"),
            });

            expect(result?.transaction.type).toBe("TRANSFER");
        });

        it("returns null when mutation has error", async () => {
            mockClient.mutate.mockResolvedValue({
                data: null,
                error: { message: "failed" },
            } as never);

            const result = await addTransfer({
                amount: 50,
                categoryId: 2,
                description: "Transfer",
                fromAccountId: 1,
                toAccountId: 2,
                date: new Date(),
            });

            expect(result).toBeNull();
        });
    });

    describe("listTransactions", () => {
        const request = {
            accountId: 1,
            from: new Date("2024-01-01"),
            until: new Date("2024-12-31"),
        };

        it("returns merged and sorted transactions on success", async () => {
            const older = {
                ...serverTransaction,
                id: 1,
                date: "2024-01-01T00:00:00.000Z",
            };
            const newer = {
                ...serverTransaction,
                id: 2,
                date: "2024-06-01T00:00:00.000Z",
            };

            mockClient.query
                .mockResolvedValueOnce({
                    data: { transactions: { nodes: [older], totalCount: 1 } },
                } as never)
                .mockResolvedValueOnce({
                    data: { transactions: { nodes: [newer], totalCount: 1 } },
                } as never);

            const result = await listTransactions(request);

            expect(result.length).toBe(2);
            expect(result.items[0].id).toBe(2);
            expect(result.items[1].id).toBe(1);
        });

        it("uses network-only fetch policy when useCache is false", async () => {
            mockClient.query.mockResolvedValue({
                data: { transactions: { nodes: [], totalCount: 0 } },
            } as never);

            await listTransactions({ ...request, useCache: false });

            expect(mockClient.query).toHaveBeenCalledWith(
                expect.objectContaining({ fetchPolicy: "network-only" })
            );
        });

        it("returns empty result when a query has error", async () => {
            mockClient.query
                .mockResolvedValueOnce({
                    data: { transactions: { nodes: [], totalCount: 0 } },
                    error: { message: "failed" },
                } as never)
                .mockResolvedValueOnce({
                    data: { transactions: { nodes: [], totalCount: 0 } },
                } as never);

            const result = await listTransactions(request);

            expect(result).toEqual({ length: 0, items: [] });
        });

        it("returns empty result on unexpected error", async () => {
            mockClient.query.mockRejectedValue(new Error("network"));

            const result = await listTransactions(request);

            expect(result).toEqual({ length: 0, items: [] });
        });
    });

    describe("deleteTransaction", () => {
        it("returns success on successful deletion", async () => {
            mockClient.mutate.mockResolvedValue({ data: {} } as never);

            const result = await deleteTransaction({ id: 1 });

            expect(result.isSuccess).toBe(true);
        });

        it("returns failure when mutation has error", async () => {
            mockClient.mutate.mockResolvedValue({
                data: null,
                error: { message: "failed" },
            } as never);

            const result = await deleteTransaction({ id: 1 });

            expect(result.isSuccess).toBe(false);
        });
    });

    describe("getTransactionMonthYearList", () => {
        it("returns month year list on success", async () => {
            mockClient.query.mockResolvedValue({
                data: {
                    transactionMonthYearListByAccountId: {
                        nodes: ["2024-06", "2024-05"],
                    },
                },
            } as never);

            const result = await getTransactionMonthYearList({ accountId: 1 });

            expect(result.monthYears).toEqual(["2024-06", "2024-05"]);
        });

        it("returns empty list when response has error", async () => {
            mockClient.query.mockResolvedValue({
                data: null,
                error: { message: "failed" },
            } as never);

            const result = await getTransactionMonthYearList({ accountId: 1 });

            expect(result.monthYears).toEqual([]);
        });

        it("returns empty list on unexpected error", async () => {
            mockClient.query.mockRejectedValue(new Error("network"));

            const result = await getTransactionMonthYearList({ accountId: 1 });

            expect(result.monthYears).toEqual([]);
        });
    });

    describe("updateTransaction", () => {
        it("returns updated transaction on success", async () => {
            mockClient.mutate.mockResolvedValue({
                data: { updateTransaction: { transaction: serverTransaction } },
            } as never);

            const result = await updateTransaction({
                id: 1,
                amount: 50,
                categoryId: 2,
                description: "Updated",
                occurredAt: new Date("2024-06-15"),
            });

            expect(result.updatedTransaction?.id).toBe(1);
        });

        it("returns null updated transaction when mutation has error", async () => {
            mockClient.mutate.mockResolvedValue({
                data: null,
                error: { message: "failed" },
            } as never);

            const result = await updateTransaction({
                id: 1,
                amount: 50,
                categoryId: 2,
                description: "Updated",
                occurredAt: new Date(),
            });

            expect(result.updatedTransaction).toBeNull();
        });
    });
});
