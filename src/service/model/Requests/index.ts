import type { TransactionType } from "../../constants";
import type { CategoryType, Currency } from "../../constants";
import type { Money } from "../Money";

// Transaction
interface AddTransactionRequest {
    amount: Money;
    categoryId?: string;
    description?: string;
    date: Date;
}
export interface AddExpenseRequest extends AddTransactionRequest {
    fromAccountId: string;
}

export interface AddIncomeRequest extends AddTransactionRequest {
    toAccountId: string;
}

export interface AddTransferRequest extends AddTransactionRequest {
    fromAccountId: string;
    toAccountId: string;
    convertedAmount?: Money;
}

export interface ListTransactionsRequest {
    accountId: string;
    /** First day, inclusive. */
    fromDate: Date;
    /** Last day, inclusive. */
    toDate: Date;
}

export interface DeleteTranactionRequest {
    id: string;
}

// Category
export interface CreateCategoryRequest {
    name: string;
    /** ANY when omitted. */
    type?: CategoryType;
}

/** Omitted fields stay unchanged. */
export interface PatchCategoryRequest {
    id: string;
    name?: string;
    type?: CategoryType;
}

export interface DeleteCategoryRequest {
    id: string;
}

// Account
export interface CreateAccountRequest {
    name: string;
    currency: Currency;
}

export interface PatchAccountRequest {
    id: string;
    name?: string;
    balance?: Money;
}

export interface GetAccountRequest {
    id: string;
}

export interface DeleteAccountRequest {
    id: string;
}

// Transaction

export interface GetTransactionMonthYearListRequest {
    accountId: string;
}

export interface ListTransactionsPageRequest {
    accountId: string;
    first: number;
    after?: string;
}

/** Omitted fields stay unchanged; a null description clears it. */
export interface UpdateTransactionRequest {
    id: string;
    type: TransactionType;
    amount?: Money;
    convertedAmount?: Money;
    categoryId?: string;
    description?: string | null;
    occurredAt?: Date;
}
