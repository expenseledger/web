import type Account from "../Account";
import type Category from "../Category";
import type Transaction from "../Transaction";

/** The API v3 `extensions.code` of a rejected request, when it has one. */
interface WithErrorCode {
    errorCode?: string;
}

// Transaction
export interface AddExpenseResponse extends WithErrorCode {
    transaction: Transaction;
}

export interface AddIncomeResponse extends WithErrorCode {
    transaction: Transaction;
}

export interface AddTransferResponse extends WithErrorCode {
    transaction: Transaction;
}

export interface ListTransactionsResponse {
    items: Transaction[];
}

export interface DeleteTransactionResponse extends WithErrorCode {
    isSuccess: boolean;
}

// Category
export interface CreateCategoryResponse extends WithErrorCode {
    addedCategory: Category;
}

export interface PatchCategoryResponse extends WithErrorCode {
    category: Category;
}

export interface DeleteCategoryResponse extends WithErrorCode {
    isSuccess: boolean;
}

// Account

export interface DeleteAccountResponse extends WithErrorCode {
    isSuccess: boolean;
}

export interface CreateAccountResponse extends WithErrorCode {
    account: Account;
}

export interface PatchAccountResponse extends WithErrorCode {
    account: Account;
}

export interface GetAllAccountResponse {
    accounts: Account[];
}

export interface GetAccountResponse {
    account: Account;
}

// Transaction

export interface GetTransactionMonthYearListResponse {
    monthYears: string[];
}

export interface ListTransactionsPageResponse {
    items: Transaction[];
    endCursor: string;
    hasNextPage: boolean;
}

export interface UpdateTransactionResponse extends WithErrorCode {
    updatedTransaction: Transaction;
}
