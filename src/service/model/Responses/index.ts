import Transaction from "../Transaction";
import Wallet from "../Wallet";

export interface AddExpenseResponse {
    srcWallet: Wallet;
    transaction: Transaction;
}

export interface AddIncomeResponse {
    dstWallet: Wallet;
    transaction: Transaction;
}

export interface AddTransferResponse {
    dstWallet: Wallet;
    srcWallet: Wallet;
    transaction: Transaction;
}

export interface ListTransactionsResponse {
    length: number;
    items: Transaction[];
}

export interface DeleteTransactionResponse {
    isSuccess: boolean;
}
