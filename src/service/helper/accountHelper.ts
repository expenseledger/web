import { AccountType } from "../constants";
import Account from "../model/Account";
import { allAccountTypes } from "./../constants";

export const allAccountTypesString = allAccountTypes.map(mapAccountTypeToString);

export const allCurrencies = ["฿", "€"];

export function mapAccountTypeToString(accountType: AccountType): string {
    switch (accountType) {
        case "BANK":
            return "Bank Account";
        case "CASH":
            return "Cash";
        case "CREDIT":
            return "Credit";
    }
}

export function mapStringToAccountType(accountType: string): AccountType {
    switch (accountType) {
        case "Bank Account":
            return "BANK";
        case "Cash":
            return "CASH";
        case "Credit":
            return "CREDIT";
        default:
            throw new Error(`${accountType} is not defined`);
    }
}

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export function mapAccountFromServer(account: any): Account {
    return {
        id: account.id,
        name: account.name,
        balance: account.balance,
        type: account.type,
    };
}
