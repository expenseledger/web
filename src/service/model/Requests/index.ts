// Transaction
interface AddTransactionRequest {
    amount: number;
    categoryId?: number;
    description?: string;
    date: Date;
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
}

export interface DeleteCategoryRequest {
    id: number;
}

// Account
export interface CreateAccountRequest {
    name: string;
}

export interface GetAccountRequest {
    id: number;
}

export interface DeleteAccountRequest {
    id: number;
}

// Transaction

export interface ListTransactionsPageRequest {
    accountId: number;
    first: number;
    after?: string;
}

export interface UpdateTransactionRequest {
    id: number;
    amount: number;
    categoryId: number;
    description: string;
    occurredAt: Date;
}
