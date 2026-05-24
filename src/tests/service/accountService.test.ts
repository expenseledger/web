import client from "../../lib/apollo";
import {
    createAccount,
    deleteAccount,
    getAccount,
    getAllAccount,
    updateAccount,
} from "../../service/accountService";

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

describe("accountService", () => {
    const serverAccount = { id: 1, name: "Cash", balance: 100, type: "CASH" };

    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe("getAllAccount", () => {
        it("returns mapped accounts on success", async () => {
            mockClient.query.mockResolvedValue({
                data: { accounts: { nodes: [serverAccount] } },
            } as never);

            const result = await getAllAccount();

            expect(result.accounts).toEqual([serverAccount]);
        });

        it("returns empty accounts when response has error", async () => {
            mockClient.query.mockResolvedValue({
                data: null,
                error: { message: "failed" },
            } as never);

            const result = await getAllAccount();

            expect(result.accounts).toEqual([]);
        });

        it("returns empty accounts on unexpected error", async () => {
            mockClient.query.mockRejectedValue(new Error("network"));

            const result = await getAllAccount();

            expect(result.accounts).toEqual([]);
        });
    });

    describe("getAccount", () => {
        it("returns mapped account on success", async () => {
            mockClient.query.mockResolvedValue({
                data: { account: serverAccount },
            } as never);

            const result = await getAccount({ id: 1 });

            expect(result.account).toEqual(serverAccount);
        });

        it("returns null account when response has error", async () => {
            mockClient.query.mockResolvedValue({
                data: null,
                error: { message: "not found" },
            } as never);

            const result = await getAccount({ id: 99 });

            expect(result.account).toBeNull();
        });

        it("returns null account on unexpected error", async () => {
            mockClient.query.mockRejectedValue(new Error("network"));

            const result = await getAccount({ id: 1 });

            expect(result.account).toBeNull();
        });
    });

    describe("createAccount", () => {
        it("returns created account on success", async () => {
            mockClient.mutate.mockResolvedValue({
                data: { createAccount: { account: serverAccount } },
            } as never);

            const result = await createAccount({ name: "Cash", type: "CASH" });

            expect(result.account).toEqual(serverAccount);
        });

        it("returns null account when mutation has error", async () => {
            mockClient.mutate.mockResolvedValue({
                data: null,
                error: { message: "failed" },
            } as never);

            const result = await createAccount({ name: "Cash", type: "CASH" });

            expect(result.account).toBeNull();
        });

        it("returns null account on unexpected error", async () => {
            mockClient.mutate.mockRejectedValue(new Error("network"));

            const result = await createAccount({ name: "Cash", type: "CASH" });

            expect(result.account).toBeNull();
        });
    });

    describe("deleteAccount", () => {
        it("returns success on successful deletion", async () => {
            mockClient.mutate.mockResolvedValue({ data: {} } as never);

            const result = await deleteAccount({ id: 1 });

            expect(result.isSuccess).toBe(true);
        });

        it("returns failure when mutation has error", async () => {
            mockClient.mutate.mockResolvedValue({
                data: null,
                error: { message: "failed" },
            } as never);

            const result = await deleteAccount({ id: 1 });

            expect(result.isSuccess).toBe(false);
        });

        it("returns failure on unexpected error", async () => {
            mockClient.mutate.mockRejectedValue(new Error("network"));

            const result = await deleteAccount({ id: 1 });

            expect(result.isSuccess).toBe(false);
        });
    });

    describe("updateAccount", () => {
        it("returns updated account on success", async () => {
            mockClient.mutate.mockResolvedValue({
                data: { updateAccount: { account: serverAccount } },
            } as never);

            const result = await updateAccount({
                id: 1,
                name: "Cash",
                type: "CASH",
            });

            expect(result.account).toEqual(serverAccount);
        });

        it("returns null account when mutation has error", async () => {
            mockClient.mutate.mockResolvedValue({
                data: null,
                error: { message: "failed" },
            } as never);

            const result = await updateAccount({
                id: 1,
                name: "Cash",
                type: "CASH",
            });

            expect(result.account).toBeNull();
        });

        it("returns null account on unexpected error", async () => {
            mockClient.mutate.mockRejectedValue(new Error("network"));

            const result = await updateAccount({
                id: 1,
                name: "Cash",
                type: "CASH",
            });

            expect(result.account).toBeNull();
        });
    });
});
