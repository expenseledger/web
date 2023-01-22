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
    useCache?: boolean;
}

export interface DeleteTranactionRequest {
    id: number;
}

// Category
export interface CreateCategoryRequest {
    name: string;
    type: CategoryType;
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

export interface UpdateAccountRequest {
    id: number;
    name: string;
    type: AccountType;
}

// Transaction

export interface GetTransactionMonthYearListRequest {
    accountId: number;
}
