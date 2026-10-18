import type Account from "../Account";
import type Category from "../Category";
import type Transaction from "../Transaction";

// Transaction
export interface AddExpenseResponse {
    transaction: Transaction;
}

export interface AddIncomeResponse {
    transaction: Transaction;
}

export interface AddTransferResponse {
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

// Account

export interface DeleteAccountResponse {
    isSuccess: boolean;
}

export interface CreateAccountResponse {
    account: Account;
}

export interface GetAllAccountResponse {
    accounts: Account[];
}

export interface GetAccountResponse {
    account: Account;
}

// Transaction

export interface ListTransactionsPageResponse {
    items: Transaction[];
    endCursor: string;
    hasNextPage: boolean;
}

export interface UpdateTransactionResponse {
    updatedTransaction: Transaction;
}
