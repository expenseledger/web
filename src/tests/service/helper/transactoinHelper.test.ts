import { mapTransactionFromServer } from "../../../service/helper/transactoinHelper";

describe("transactoinHelper", () => {
    describe("mapTransactionFromServer", () => {
        it("maps full transaction data from server", () => {
            const date = "2024-06-15T10:00:00.000Z";
            const serverData = {
                id: 42,
                fromAccount: { id: 1, name: "Cash", type: "CASH", balance: 100 },
                toAccount: null as any,
                amount: 50,
                type: "EXPENSE",
                category: { id: 2, name: "Food", type: "EXPENSE" },
                description: "Lunch",
                date,
            };

            const result = mapTransactionFromServer(serverData);

            expect(result.id).toBe(42);
            expect(result.fromAccount).toEqual(serverData.fromAccount);
            expect(result.toAccount).toBeNull();
            expect(result.amount).toBe(50);
            expect(result.type).toBe("EXPENSE");
            expect(result.category).toEqual(serverData.category);
            expect(result.description).toBe("Lunch");
            expect(result.date).toEqual(new Date(date));
        });

        it("maps null optional fields", () => {
            const result = mapTransactionFromServer({
                id: 1,
                fromAccount: null,
                toAccount: null,
                amount: 10,
                type: "INCOME",
                category: null,
                description: "",
                date: "2024-01-01T00:00:00.000Z",
            });

            expect(result.fromAccount).toBeNull();
            expect(result.toAccount).toBeNull();
            expect(result.category).toBeNull();
        });
    });
});
