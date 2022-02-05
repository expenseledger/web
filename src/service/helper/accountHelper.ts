import { AccountType } from "../constants";
import Account from "../model/Account";

export function mapAccountTypeToString(accountType: AccountType, isGQL = false): string {
    switch (accountType) {
        case "BANK_ACCOUNT":
            return isGQL ? "BANK" : "Bank Account";
        case "CASH":
            return isGQL ? "CASH" : "Cash";
        case "CREDIT":
            return isGQL ? "CREDIT" : "Credit";
    }
}

export function mapStringToAccountType(accountType: string): AccountType {
    switch (accountType) {
        case "Bank Account":
        case "BANK":
            return "BANK_ACCOUNT";
        case "Cash":
        case "CASH":
            return "CASH";
        case "Credit":
        case "CREDIT":
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
        type: mapStringToAccountType(account.type),
    };
}
