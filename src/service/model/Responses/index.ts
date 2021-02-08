import Category from "../Category";
import Transaction from "../Transaction";
import Wallet from "../Wallet";

// Transaction
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

// Category
export interface CreateCategoryResponse {
    addedCategory: Category;
}

export interface DeleteCategoryResponse {
    isSuccess: boolean;
}

export interface DeleteWalletResponse {
    isSuccess: boolean;
}

export interface CreateWalletResponse {
    wallet: Wallet;
}

export interface GetAllWalletResponse {
    wallets: Wallet[];
}

export interface GetWalletResponse {
    wallet: Wallet;
}
