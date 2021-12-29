import { WalletType } from "../../constants";

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

// Wallet
export interface CreateWalletRequest {
    name: string;
    type: WalletType;
}

export interface GetWalletRequest {
    id: number;
}

export interface DeleteWalletRequest {
    id: number;
}

export interface GetTransactionMonthYearListRequest {
    accountId: number;
}
