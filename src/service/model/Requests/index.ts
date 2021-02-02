// Transaction
interface AddTransactionRequest {
    amount: number;
    category: string;
    description?: string;
    date?: string;
}
export interface AddExpenseRequest extends AddTransactionRequest {
    from: string;
}

export interface AddIncomeRequest extends AddTransactionRequest {
    to: string;
}

export interface AddTransferRequest extends AddTransactionRequest {
    from: string;
    to: string;
}

export interface ListTransactionsRequest {
    wallet: string;
}

export interface DeleteTranactionRequest {
    id: string;
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
}
