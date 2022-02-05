import Account from "../Account";
import Category from "../Category";
import Transaction from "../Transaction";

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

export interface GetTransactionMonthYearListResponse {
    monthYears: string[];
}
