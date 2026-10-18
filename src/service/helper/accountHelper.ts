import Account from "../model/Account";

export const allCurrencies = ["฿", "€", "$", "¥", "₩"];

export function mapAccountFromServer(account: any): Account {
    return {
        id: account.id,
        name: account.name,
        balance: account.balance,
    };
}
