// Interfaces for GraphQL mutate and query functions used in transactionService.ts

// AddExpense Mutation
export interface AddExpenseMutationVariables {
    amount: number;
    description: string;
    categoryId: number;
    fromAccountId: number;
    occurredAt: string;
}
export interface AddExpenseMutationResponse {
    spend: {
        transaction: any; // Replace 'any' with Transaction type if available
    };
}

// AddIncome Mutation
export interface AddIncomeMutationVariables {
    amount: number;
    description: string;
    categoryId: number;
    toAccountId: number;
    occurredAt: string;
}
export interface AddIncomeMutationResponse {
    receive: {
        transaction: any;
    };
}

// AddTransfer Mutation
export interface AddTransferMutationVariables {
    amount: number;
    description: string;
    categoryId: number;
    fromAccountId: number;
    toAccountId: number;
    occurredAt: string;
}
export interface AddTransferMutationResponse {
    transferV2: {
        transaction: any;
    };
}

// DeleteTransaction Mutation
export interface DeleteTransactionMutationVariables {
    transactionId: number;
}
export interface DeleteTransactionMutationResponse {
    deleteTransaction: {
        transaction: any;
    };
}

// ListTransactions Query
export interface ListTransactionsQueryVariables {
    accountId: number;
    from: string;
    until: string;
}
export interface ListTransactionsQueryResponse {
    transactions: {
        nodes: any[];
        totalCount: number;
    };
}

// GetTransactionMonthYearList Query
export interface GetTransactionMonthYearListQueryVariables {
    accountId: number;
}
export interface GetTransactionMonthYearListQueryResponse {
    transactionMonthYearListByAccountId: {
        nodes: string[];
    };
}

// UpdateTransaction Mutation
export interface UpdateTransactionMutationVariables {
    id: number;
    amount: number;
    description: string;
    categoryId: number;
    occurredAt: string;
}
export interface UpdateTransactionMutationResponse {
    updateTransaction: {
        transaction: any;
    };
}
