import type { Currency } from "../constants";

interface Account {
    id: string;
    name: string;
    balance: number;
    currency: Currency;
}

export default Account;
