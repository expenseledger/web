import { Currency } from "../constants";
import Account from "../model/Account";

export function mapAccountFromServer(account: any): Account {
    return {
        id: account.id,
        name: account.name,
        balance: account.balance.amount,
        currency: account.balance.currency,
    };
}

/** Swaps in the updated copies of accounts, matched by id. */
export function replaceAccounts(accounts: Account[], updated: Account[]): Account[] {
    const byId = new Map(updated.filter((a) => a).map((a) => [a.id, a]));

    return accounts.map((a) => byId.get(a.id) ?? a);
}

export function sumBalancesByCurrency(
    accounts: Account[]
): { currency: Currency; balance: number }[] {
    const totals = new Map<Currency, number>();
    accounts.forEach((a) => totals.set(a.currency, (totals.get(a.currency) ?? 0) + a.balance));

    return [...totals.entries()].map(([currency, balance]) => ({ currency, balance }));
}
