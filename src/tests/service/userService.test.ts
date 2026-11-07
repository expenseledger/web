import { createAccount } from "../../service/accountService";
import { createCategory } from "../../service/categoryService";
import { getUserData } from "../../service/userService";
import { mockClient, resetMockV3 } from "../mock/mockClient";

jest.mock("../../lib/apollo", () => ({
    __esModule: true,
    default: jest.requireActual("../mock/mockClient").mockClient,
}));

jest.mock("../../common/utils", () => ({
    log: jest.fn(),
}));

describe("userService", () => {
    beforeEach(async () => {
        jest.restoreAllMocks();
        await resetMockV3();
    });

    describe("getUserData", () => {
        it("initializes the user and returns accounts and categories by name", async () => {
            await createAccount({ name: "Wallet", currency: "THB" });
            await createAccount({ name: "Savings", currency: "EUR" });

            const result = await getUserData();

            expect(result.accounts).toEqual([
                { id: expect.any(String), name: "Bank", balance: 0, currency: "THB" },
                { id: expect.any(String), name: "Cash", balance: 0, currency: "THB" },
                { id: expect.any(String), name: "Savings", balance: 0, currency: "EUR" },
                { id: expect.any(String), name: "Wallet", balance: 0, currency: "THB" },
            ]);
            expect(result.categories.map((c) => c.name)).toEqual([
                "Bills",
                "Entertainment",
                "Food",
                "Groceries",
                "Other",
                "Salary",
                "Transport",
            ]);
        });

        it("pages through more than 50 categories", async () => {
            await getUserData();
            for (let i = 0; i < 45; i++) {
                await createCategory({ name: `Category ${i}` });
            }

            const result = await getUserData();

            expect(result.categories).toHaveLength(52);
        });

        it("throws when a request fails", async () => {
            jest.spyOn(mockClient, "mutate").mockRejectedValueOnce(new Error("network"));

            await expect(getUserData()).rejects.toThrow("network");
        });
    });
});
