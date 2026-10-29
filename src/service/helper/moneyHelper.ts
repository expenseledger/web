import { currencyDecimals } from "../constants";
import { Money } from "../model/Money";

/**
 * Rounds half away from zero to the currency's minor unit. API v3 stores
 * 4 decimals and doesn't round, so the client must (backend, 2026-10-24).
 */
export function roundMoney(money: Money): Money;
export function roundMoney(money: Money | undefined | null): Money | undefined | null;
export function roundMoney(money: Money | undefined | null): Money | undefined | null {
    if (!money) {
        return money;
    }

    const decimals = currencyDecimals[money.currency];
    // Shifting by exponent string avoids float error, e.g. 1.005 * 100 = 100.49999;
    // toFixed keeps tiny amounts out of exponent notation (1e-7).
    const shifted = Math.round(Number(`${Math.abs(money.amount).toFixed(10)}e${decimals}`));
    const amount = Math.sign(money.amount) * Number(`${shifted}e-${decimals}`);

    return { ...money, amount: amount || 0 };
}
