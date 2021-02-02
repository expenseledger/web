import { WalletType } from "./constants";

export function mapWalletTypeToString(walletType: WalletType): string {
    switch (walletType) {
        case "BANK_ACCOUNT":
            return "Bank Account";
        case "CASH":
            return "Cash";
        case "CREDIT":
            return "Credit";
    }
}

export function mapStringToWalletType(walletType: string): WalletType {
    switch (walletType) {
        case "Bank Account":
            return "BANK_ACCOUNT";
        case "Cash":
            return "CASH";
        case "Credit":
            return "CREDIT";
        default:
            throw new Error(`${walletType} is not defined`);
    }
}
