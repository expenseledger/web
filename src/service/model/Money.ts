import type { Currency } from "../constants";

export interface Money {
    amount: number;
    currency: Currency;
}
