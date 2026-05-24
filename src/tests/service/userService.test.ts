import client from "../../lib/apollo";
import { getUserData } from "../../service/userService";

jest.mock("../../lib/apollo", () => ({
    __esModule: true,
    default: {
        query: jest.fn(),
        mutate: jest.fn(),
    },
}));

const mockClient = client as jest.Mocked<typeof client>;

describe("userService", () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe("getUserData", () => {
        it("returns user categories and accounts on success", async () => {
            const accounts = [{ id: 1, name: "Cash", type: "CASH", balance: 100 }];
            const categories = [{ id: 2, name: "Food", type: "EXPENSE" }];

            mockClient.mutate.mockResolvedValue({
                data: {
                    currentUser: {
                        owner: {
                            accounts: { nodes: accounts },
                            categories: { nodes: categories },
                        },
                    },
                },
            } as never);

            const result = await getUserData();

            expect(result).toEqual({ accounts, categories });
        });

        it("throws when mutation has error", async () => {
            mockClient.mutate.mockResolvedValue({
                data: null,
                error: { message: "unauthorized" },
            } as never);

            await expect(getUserData()).rejects.toThrow("unauthorized");
        });
    });
});
