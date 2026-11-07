import {
    mapAccountFromServer,
    replaceAccounts,
    sumBalancesByCurrency,
} from "../../../service/helper/accountHelper";

const cash = { id: "1", name: "Cash", balance: 100, currency: "THB" as const };
const bank = { id: "2", name: "Bank", balance: 5, currency: "EUR" as const };
const wallet = { id: "3", name: "Wallet", balance: 20, currency: "THB" as const };

describe("accountHelper", () => {
    describe("mapAccountFromServer", () => {
        it("flattens the balance money", () => {
            expect(
                mapAccountFromServer({
                    id: "1",
                    name: "Cash",
                    balance: { amount: 100, currency: "THB" },
                })
            ).toEqual(cash);
        });
    });

    describe("replaceAccounts", () => {
        it("replaces accounts by id and ignores missing ones", () => {
            const updated = { ...bank, balance: 1 };

            expect(replaceAccounts([cash, bank], [updated, null])).toEqual([cash, updated]);
        });
    });

    describe("sumBalancesByCurrency", () => {
        it("sums balances per currency in order of first appearance", () => {
            expect(sumBalancesByCurrency([cash, bank, wallet])).toEqual([
                { currency: "THB", balance: 120 },
                { currency: "EUR", balance: 5 },
            ]);
        });
    });
});
