import {
    createAccount,
    deleteAccount,
    getAccount,
    getAllAccount,
    patchAccount,
} from "../../service/accountService";
import { mockClient, resetMockV3 } from "../mock/mockClient";

jest.mock("../../lib/apollo", () => ({
    __esModule: true,
    default: jest.requireActual("../mock/mockClient").mockClient,
}));

jest.mock("../../common/utils", () => ({
    log: jest.fn(),
}));

describe("accountService", () => {
    beforeEach(async () => {
        jest.restoreAllMocks();
        await resetMockV3();
    });

    describe("createAccount", () => {
        it("creates an account with a zero balance in the given currency", async () => {
            const result = await createAccount({ name: "Cash", currency: "JPY" });

            expect(result.account).toEqual({
                id: expect.any(String),
                name: "Cash",
                balance: 0,
                currency: "JPY",
            });
        });

        it("returns the error code of a taken name", async () => {
            await createAccount({ name: "Cash", currency: "THB" });

            const result = await createAccount({ name: "Cash", currency: "THB" });

            expect(result).toEqual({ account: null, errorCode: "NAME_TAKEN" });
        });

        it("returns null on an unexpected error", async () => {
            jest.spyOn(mockClient, "mutate").mockRejectedValueOnce(new Error("network"));

            const result = await createAccount({ name: "Cash", currency: "THB" });

            expect(result.account).toBeNull();
        });
    });

    describe("patchAccount", () => {
        it("renames the account and sets its balance", async () => {
            const { account } = await createAccount({ name: "Cash", currency: "THB" });

            const result = await patchAccount({
                id: account.id,
                name: "Wallet",
                balance: { amount: 12.5, currency: "THB" },
            });

            expect(result.account).toEqual({ ...account, name: "Wallet", balance: 12.5 });
        });

        it("rounds the balance to the currency's minor unit", async () => {
            const { account } = await createAccount({ name: "Cash", currency: "JPY" });

            const result = await patchAccount({
                id: account.id,
                balance: { amount: 1000.4, currency: "JPY" },
            });

            expect(result.account.balance).toBe(1000);
        });

        it("returns the error code of a balance in another currency", async () => {
            const { account } = await createAccount({ name: "Cash", currency: "THB" });

            const result = await patchAccount({
                id: account.id,
                balance: { amount: 1, currency: "USD" },
            });

            expect(result).toEqual({ account: null, errorCode: "CURRENCY_MISMATCH" });
        });
    });

    describe("deleteAccount", () => {
        it("deletes the account", async () => {
            const { account } = await createAccount({ name: "Cash", currency: "THB" });

            const result = await deleteAccount({ id: account.id });

            expect(result.isSuccess).toBe(true);
            expect((await getAllAccount()).accounts).toEqual([]);
        });

        it("returns the error code of an unknown account", async () => {
            const result = await deleteAccount({ id: "999" });

            expect(result).toEqual({ isSuccess: false, errorCode: "RESOURCE_NOT_FOUND" });
        });
    });

    describe("getAllAccount", () => {
        it("pages through more than 50 accounts", async () => {
            for (let i = 0; i < 52; i++) {
                await createAccount({ name: `Account ${i}`, currency: "THB" });
            }

            const result = await getAllAccount();

            expect(result.accounts).toHaveLength(52);
        });

        it("returns no accounts on an unexpected error", async () => {
            jest.spyOn(mockClient, "query").mockRejectedValueOnce(new Error("network"));

            const result = await getAllAccount();

            expect(result.accounts).toEqual([]);
        });
    });

    describe("getAccount", () => {
        it("returns the account", async () => {
            const { account } = await createAccount({ name: "Cash", currency: "THB" });

            expect((await getAccount({ id: account.id })).account).toEqual(account);
        });

        it("returns null for an unknown account", async () => {
            expect((await getAccount({ id: "999" })).account).toBeNull();
        });
    });
});
