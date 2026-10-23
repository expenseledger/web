import { roundMoney } from "../../../service/helper/moneyHelper";

describe("moneyHelper", () => {
    describe("roundMoney", () => {
        it("rounds to the currency's minor unit", () => {
            expect(roundMoney({ amount: 0.005, currency: "THB" })).toEqual({
                amount: 0.01,
                currency: "THB",
            });
            expect(roundMoney({ amount: 12.344, currency: "EUR" })).toEqual({
                amount: 12.34,
                currency: "EUR",
            });
            expect(roundMoney({ amount: 99.5, currency: "JPY" })).toEqual({
                amount: 100,
                currency: "JPY",
            });
        });

        it("rounds halves away from zero despite float error", () => {
            expect(roundMoney({ amount: 1.005, currency: "USD" }).amount).toBe(1.01);
            expect(roundMoney({ amount: -1.005, currency: "USD" }).amount).toBe(-1.01);
        });

        it("handles tiny amounts", () => {
            expect(roundMoney({ amount: 1e-7, currency: "THB" }).amount).toBe(0);
            expect(roundMoney({ amount: -0.001, currency: "THB" }).amount).toBe(0);
        });

        it("passes a missing amount through", () => {
            expect(roundMoney(undefined)).toBeUndefined();
            expect(roundMoney(null)).toBeNull();
        });
    });
});
