import { AccountType } from "../../constants";
import { CategoryType } from "./../../constants";

// Transaction
interface AddTransactionRequest {
    amount: number;
    categoryId?: number;
    description?: string;
    date: string;
}
export interface AddExpenseRequest extends AddTransactionRequest {
    fromAccountId: number;
}

export interface AddIncomeRequest extends AddTransactionRequest {
    toAccountId: number;
}

export interface AddTransferRequest extends AddTransactionRequest {
    fromAccountId: number;
    toAccountId: number;
}

export interface ListTransactionsRequest {
    accountId: number;
    from: Date;
    until: Date;
}

export interface DeleteTranactionRequest {
    id: number;
}

// Category
export interface CreateCategoryRequest {
    name: string;
}

export interface DeleteCategoryRequest {
    id: number;
}
export interface UpdateCategoryRequest {
    id: number;
    name: string;
    type: CategoryType;
}

// Account
export interface CreateAccountRequest {
    name: string;
    type: AccountType;
}

export interface GetAccountRequest {
    id: number;
}

export interface DeleteAccountRequest {
    id: number;
}

export interface GetTransactionMonthYearListRequest {
    accountId: number;
}
