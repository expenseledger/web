import { WalletType } from "../constants";
import Wallet from "../model/Wallet";

export function mapWalletTypeToString(
    walletType: WalletType,
    isGQL = false
): string {
    switch (walletType) {
        case "BANK_ACCOUNT":
            return isGQL ? "BANK" : "Bank Account";
        case "CASH":
            return isGQL ? "CASH" : "Cash";
        case "CREDIT":
            return isGQL ? "CREDIT" : "Credit";
    }
}

export function mapStringToWalletType(walletType: string): WalletType {
    switch (walletType) {
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
            throw new Error(`${walletType} is not defined`);
    }
}

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export function mapWalletFromServer(wallet: any): Wallet {
    return {
        id: wallet.id,
        name: wallet.name,
        balance: wallet.balance,
        type: mapStringToWalletType(wallet.type),
    };
}
