/* eslint-disable */
/** Internal type. DO NOT USE DIRECTLY. */
type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
/** Internal type. DO NOT USE DIRECTLY. */
export type Incremental<T> =
    T | { [P in keyof T]?: P extends " $fragmentName" | "__typename" ? T[P] : never };
import { TypedDocumentNode as DocumentNode } from "@graphql-typed-document-node/core";
export type TransactionType = "EXPENSE" | "INCOME" | "TRANSFER";

export type GetAllAccountsQueryVariables = Exact<{ [key: string]: never }>;

export type GetAllAccountsQuery = {
    accounts: { nodes: Array<{ id: number; balance: number; name: string } | null> } | null;
};

export type GetAccountByIdQueryVariables = Exact<{
    id: number;
}>;

export type GetAccountByIdQuery = { account: { id: number; name: string; balance: number } | null };

export type CreateAccountMutationVariables = Exact<{
    name: string;
}>;

export type CreateAccountMutation = {
    createAccount: { account: { balance: number; id: number; name: string } | null } | null;
};

export type DeleteAccountMutationVariables = Exact<{
    id: number;
}>;

export type DeleteAccountMutation = {
    closeAccount: { account: { balance: number; id: number; name: string } | null } | null;
};

export type PlainAccountFragment = { id: number; name: string; balance: number };

export type CreateCategoryMutationVariables = Exact<{
    name: string;
}>;

export type CreateCategoryMutation = {
    createCategoryV2: { category: { id: number; name: string } | null } | null;
};

export type DeleteCategoryMutationVariables = Exact<{
    id: number;
}>;

export type DeleteCategoryMutation = {
    deleteCategory: {
        owner: { categories: { nodes: Array<{ id: number; name: string } | null> } } | null;
    } | null;
};

export type GetAllCategoriesQueryVariables = Exact<{ [key: string]: never }>;

export type GetAllCategoriesQuery = {
    categories: { nodes: Array<{ id: number; name: string } | null> } | null;
};

export type PlainCategoryFragment = { id: number; name: string };

export type PlainTransactionFragment = {
    id: number;
    amount: number;
    description: string;
    type: TransactionType;
    date: any;
    categoryId: number | null;
    fromAccountId: number | null;
    toAccountId: number | null;
};

export type AddExpenseMutationVariables = Exact<{
    amount: number;
    description: string;
    categoryId: number;
    fromAccountId: number;
    occurredAt: any;
}>;

export type AddExpenseMutation = {
    spend: {
        transaction: {
            id: number;
            amount: number;
            description: string;
            type: TransactionType;
            date: any;
            categoryId: number | null;
            fromAccountId: number | null;
            toAccountId: number | null;
            fromAccount: { id: number; name: string; balance: number } | null;
            category: { id: number; name: string } | null;
        } | null;
    } | null;
};

export type AddIncomeMutationVariables = Exact<{
    amount: number;
    description: string;
    categoryId: number;
    toAccountId: number;
    occurredAt: any;
}>;

export type AddIncomeMutation = {
    receive: {
        transaction: {
            id: number;
            amount: number;
            description: string;
            type: TransactionType;
            date: any;
            categoryId: number | null;
            fromAccountId: number | null;
            toAccountId: number | null;
            toAccount: { id: number; name: string; balance: number } | null;
            category: { id: number; name: string } | null;
        } | null;
    } | null;
};

export type AddTransferMutationVariables = Exact<{
    amount: number;
    description: string;
    categoryId: number;
    fromAccountId: number;
    toAccountId: number;
    occurredAt: any;
}>;

export type AddTransferMutation = {
    transferV2: {
        transaction: {
            id: number;
            amount: number;
            description: string;
            type: TransactionType;
            date: any;
            categoryId: number | null;
            fromAccountId: number | null;
            toAccountId: number | null;
            fromAccount: { id: number; name: string; balance: number } | null;
            toAccount: { id: number; name: string; balance: number } | null;
            category: { id: number; name: string } | null;
        } | null;
    } | null;
};

export type DeleteTransactionMutationVariables = Exact<{
    transactionId: number;
}>;

export type DeleteTransactionMutation = {
    deleteTransaction: {
        transaction: {
            id: number;
            amount: number;
            description: string;
            type: TransactionType;
            date: any;
            categoryId: number | null;
            fromAccountId: number | null;
            toAccountId: number | null;
            fromAccount: { id: number; name: string; balance: number } | null;
            toAccount: { id: number; name: string; balance: number } | null;
            category: { id: number; name: string } | null;
        } | null;
    } | null;
};

export type GetTransactionsQueryVariables = Exact<{
    accountId: number;
    from: any;
    until: any;
}>;

export type GetTransactionsQuery = {
    transactions: {
        totalCount: number;
        nodes: Array<{
            id: number;
            amount: number;
            description: string;
            type: TransactionType;
            date: any;
            categoryId: number | null;
            fromAccountId: number | null;
            toAccountId: number | null;
            toAccount: { id: number; name: string; balance: number } | null;
            fromAccount: { id: number; name: string; balance: number } | null;
            category: { id: number; name: string } | null;
        } | null>;
    } | null;
};

export type GetTransactionsByFromAccountQueryVariables = Exact<{
    accountId: number;
    from: any;
    until: any;
}>;

export type GetTransactionsByFromAccountQuery = {
    transactions: {
        totalCount: number;
        nodes: Array<{
            id: number;
            amount: number;
            description: string;
            type: TransactionType;
            date: any;
            categoryId: number | null;
            fromAccountId: number | null;
            toAccountId: number | null;
            toAccount: { id: number; name: string; balance: number } | null;
            fromAccount: { id: number; name: string; balance: number } | null;
            category: { id: number; name: string } | null;
        } | null>;
    } | null;
};

export type GetTransactionsPageByAccountIdQueryVariables = Exact<{
    accountId: number;
    first: number;
    after?: any;
}>;

export type GetTransactionsPageByAccountIdQuery = {
    transactions: {
        nodes: Array<{
            id: number;
            amount: number;
            description: string;
            type: TransactionType;
            date: any;
            categoryId: number | null;
            fromAccountId: number | null;
            toAccountId: number | null;
            toAccount: { id: number; name: string; balance: number } | null;
            fromAccount: { id: number; name: string; balance: number } | null;
            category: { id: number; name: string } | null;
        } | null>;
        pageInfo: { endCursor: any; hasNextPage: boolean };
    } | null;
};

export type UpdateTransactionMutationVariables = Exact<{
    id: number;
    amount: number;
    description: string;
    categoryId: number;
    occurredAt: any;
}>;

export type UpdateTransactionMutation = {
    updateTransaction: {
        transaction: {
            id: number;
            amount: number;
            description: string;
            type: TransactionType;
            date: any;
            categoryId: number | null;
            fromAccountId: number | null;
            toAccountId: number | null;
            fromAccount: { id: number; name: string; balance: number } | null;
            toAccount: { id: number; name: string; balance: number } | null;
            category: { id: number; name: string } | null;
        } | null;
    } | null;
};

export type CurrentUserMutationVariables = Exact<{ [key: string]: never }>;

export type CurrentUserMutation = {
    currentUser: {
        owner: {
            accounts: { nodes: Array<{ id: number; name: string; balance: number } | null> };
            categories: { nodes: Array<{ id: number; name: string } | null> };
        } | null;
    } | null;
};

export const PlainAccountFragmentDoc = {
    kind: "Document",
    definitions: [
        {
            kind: "FragmentDefinition",
            name: { kind: "Name", value: "PlainAccount" },
            typeCondition: { kind: "NamedType", name: { kind: "Name", value: "Account" } },
            selectionSet: {
                kind: "SelectionSet",
                selections: [
                    { kind: "Field", name: { kind: "Name", value: "id" } },
                    { kind: "Field", name: { kind: "Name", value: "name" } },
                    { kind: "Field", name: { kind: "Name", value: "balance" } },
                ],
            },
        },
    ],
} as unknown as DocumentNode<PlainAccountFragment, unknown>;
export const PlainCategoryFragmentDoc = {
    kind: "Document",
    definitions: [
        {
            kind: "FragmentDefinition",
            name: { kind: "Name", value: "PlainCategory" },
            typeCondition: { kind: "NamedType", name: { kind: "Name", value: "Category" } },
            selectionSet: {
                kind: "SelectionSet",
                selections: [
                    { kind: "Field", name: { kind: "Name", value: "id" } },
                    { kind: "Field", name: { kind: "Name", value: "name" } },
                ],
            },
        },
    ],
} as unknown as DocumentNode<PlainCategoryFragment, unknown>;
export const PlainTransactionFragmentDoc = {
    kind: "Document",
    definitions: [
        {
            kind: "FragmentDefinition",
            name: { kind: "Name", value: "PlainTransaction" },
            typeCondition: { kind: "NamedType", name: { kind: "Name", value: "Transaction" } },
            selectionSet: {
                kind: "SelectionSet",
                selections: [
                    { kind: "Field", name: { kind: "Name", value: "id" } },
                    { kind: "Field", name: { kind: "Name", value: "amount" } },
                    { kind: "Field", name: { kind: "Name", value: "description" } },
                    { kind: "Field", name: { kind: "Name", value: "type" } },
                    { kind: "Field", name: { kind: "Name", value: "date" } },
                    { kind: "Field", name: { kind: "Name", value: "categoryId" } },
                    { kind: "Field", name: { kind: "Name", value: "fromAccountId" } },
                    { kind: "Field", name: { kind: "Name", value: "toAccountId" } },
                ],
            },
        },
    ],
} as unknown as DocumentNode<PlainTransactionFragment, unknown>;
export const GetAllAccountsDocument = {
    kind: "Document",
    definitions: [
        {
            kind: "OperationDefinition",
            operation: "query",
            name: { kind: "Name", value: "GetAllAccounts" },
            selectionSet: {
                kind: "SelectionSet",
                selections: [
                    {
                        kind: "Field",
                        name: { kind: "Name", value: "accounts" },
                        selectionSet: {
                            kind: "SelectionSet",
                            selections: [
                                {
                                    kind: "Field",
                                    name: { kind: "Name", value: "nodes" },
                                    selectionSet: {
                                        kind: "SelectionSet",
                                        selections: [
                                            { kind: "Field", name: { kind: "Name", value: "id" } },
                                            {
                                                kind: "Field",
                                                name: { kind: "Name", value: "balance" },
                                            },
                                            {
                                                kind: "Field",
                                                name: { kind: "Name", value: "name" },
                                            },
                                        ],
                                    },
                                },
                            ],
                        },
                    },
                ],
            },
        },
    ],
} as unknown as DocumentNode<GetAllAccountsQuery, GetAllAccountsQueryVariables>;
export const GetAccountByIdDocument = {
    kind: "Document",
    definitions: [
        {
            kind: "OperationDefinition",
            operation: "query",
            name: { kind: "Name", value: "GetAccountById" },
            variableDefinitions: [
                {
                    kind: "VariableDefinition",
                    variable: { kind: "Variable", name: { kind: "Name", value: "id" } },
                    type: {
                        kind: "NonNullType",
                        type: { kind: "NamedType", name: { kind: "Name", value: "Int" } },
                    },
                },
            ],
            selectionSet: {
                kind: "SelectionSet",
                selections: [
                    {
                        kind: "Field",
                        name: { kind: "Name", value: "account" },
                        arguments: [
                            {
                                kind: "Argument",
                                name: { kind: "Name", value: "id" },
                                value: { kind: "Variable", name: { kind: "Name", value: "id" } },
                            },
                        ],
                        selectionSet: {
                            kind: "SelectionSet",
                            selections: [
                                { kind: "Field", name: { kind: "Name", value: "id" } },
                                { kind: "Field", name: { kind: "Name", value: "name" } },
                                { kind: "Field", name: { kind: "Name", value: "balance" } },
                            ],
                        },
                    },
                ],
            },
        },
    ],
} as unknown as DocumentNode<GetAccountByIdQuery, GetAccountByIdQueryVariables>;
export const CreateAccountDocument = {
    kind: "Document",
    definitions: [
        {
            kind: "OperationDefinition",
            operation: "mutation",
            name: { kind: "Name", value: "CreateAccount" },
            variableDefinitions: [
                {
                    kind: "VariableDefinition",
                    variable: { kind: "Variable", name: { kind: "Name", value: "name" } },
                    type: {
                        kind: "NonNullType",
                        type: { kind: "NamedType", name: { kind: "Name", value: "String" } },
                    },
                },
            ],
            selectionSet: {
                kind: "SelectionSet",
                selections: [
                    {
                        kind: "Field",
                        name: { kind: "Name", value: "createAccount" },
                        arguments: [
                            {
                                kind: "Argument",
                                name: { kind: "Name", value: "input" },
                                value: {
                                    kind: "ObjectValue",
                                    fields: [
                                        {
                                            kind: "ObjectField",
                                            name: { kind: "Name", value: "name" },
                                            value: {
                                                kind: "Variable",
                                                name: { kind: "Name", value: "name" },
                                            },
                                        },
                                        {
                                            kind: "ObjectField",
                                            name: { kind: "Name", value: "type" },
                                            value: { kind: "EnumValue", value: "CASH" },
                                        },
                                        {
                                            kind: "ObjectField",
                                            name: { kind: "Name", value: "balance" },
                                            value: { kind: "FloatValue", value: "0.0" },
                                        },
                                    ],
                                },
                            },
                        ],
                        selectionSet: {
                            kind: "SelectionSet",
                            selections: [
                                {
                                    kind: "Field",
                                    name: { kind: "Name", value: "account" },
                                    selectionSet: {
                                        kind: "SelectionSet",
                                        selections: [
                                            {
                                                kind: "Field",
                                                name: { kind: "Name", value: "balance" },
                                            },
                                            { kind: "Field", name: { kind: "Name", value: "id" } },
                                            {
                                                kind: "Field",
                                                name: { kind: "Name", value: "name" },
                                            },
                                        ],
                                    },
                                },
                            ],
                        },
                    },
                ],
            },
        },
    ],
} as unknown as DocumentNode<CreateAccountMutation, CreateAccountMutationVariables>;
export const DeleteAccountDocument = {
    kind: "Document",
    definitions: [
        {
            kind: "OperationDefinition",
            operation: "mutation",
            name: { kind: "Name", value: "DeleteAccount" },
            variableDefinitions: [
                {
                    kind: "VariableDefinition",
                    variable: { kind: "Variable", name: { kind: "Name", value: "id" } },
                    type: {
                        kind: "NonNullType",
                        type: { kind: "NamedType", name: { kind: "Name", value: "Int" } },
                    },
                },
            ],
            selectionSet: {
                kind: "SelectionSet",
                selections: [
                    {
                        kind: "Field",
                        name: { kind: "Name", value: "closeAccount" },
                        arguments: [
                            {
                                kind: "Argument",
                                name: { kind: "Name", value: "input" },
                                value: {
                                    kind: "ObjectValue",
                                    fields: [
                                        {
                                            kind: "ObjectField",
                                            name: { kind: "Name", value: "id" },
                                            value: {
                                                kind: "Variable",
                                                name: { kind: "Name", value: "id" },
                                            },
                                        },
                                    ],
                                },
                            },
                        ],
                        selectionSet: {
                            kind: "SelectionSet",
                            selections: [
                                {
                                    kind: "Field",
                                    name: { kind: "Name", value: "account" },
                                    selectionSet: {
                                        kind: "SelectionSet",
                                        selections: [
                                            {
                                                kind: "Field",
                                                name: { kind: "Name", value: "balance" },
                                            },
                                            { kind: "Field", name: { kind: "Name", value: "id" } },
                                            {
                                                kind: "Field",
                                                name: { kind: "Name", value: "name" },
                                            },
                                        ],
                                    },
                                },
                            ],
                        },
                    },
                ],
            },
        },
    ],
} as unknown as DocumentNode<DeleteAccountMutation, DeleteAccountMutationVariables>;
export const CreateCategoryDocument = {
    kind: "Document",
    definitions: [
        {
            kind: "OperationDefinition",
            operation: "mutation",
            name: { kind: "Name", value: "CreateCategory" },
            variableDefinitions: [
                {
                    kind: "VariableDefinition",
                    variable: { kind: "Variable", name: { kind: "Name", value: "name" } },
                    type: {
                        kind: "NonNullType",
                        type: { kind: "NamedType", name: { kind: "Name", value: "String" } },
                    },
                },
            ],
            selectionSet: {
                kind: "SelectionSet",
                selections: [
                    {
                        kind: "Field",
                        name: { kind: "Name", value: "createCategoryV2" },
                        arguments: [
                            {
                                kind: "Argument",
                                name: { kind: "Name", value: "input" },
                                value: {
                                    kind: "ObjectValue",
                                    fields: [
                                        {
                                            kind: "ObjectField",
                                            name: { kind: "Name", value: "name" },
                                            value: {
                                                kind: "Variable",
                                                name: { kind: "Name", value: "name" },
                                            },
                                        },
                                        {
                                            kind: "ObjectField",
                                            name: { kind: "Name", value: "type" },
                                            value: { kind: "EnumValue", value: "ANY" },
                                        },
                                    ],
                                },
                            },
                        ],
                        selectionSet: {
                            kind: "SelectionSet",
                            selections: [
                                {
                                    kind: "Field",
                                    name: { kind: "Name", value: "category" },
                                    selectionSet: {
                                        kind: "SelectionSet",
                                        selections: [
                                            { kind: "Field", name: { kind: "Name", value: "id" } },
                                            {
                                                kind: "Field",
                                                name: { kind: "Name", value: "name" },
                                            },
                                        ],
                                    },
                                },
                            ],
                        },
                    },
                ],
            },
        },
    ],
} as unknown as DocumentNode<CreateCategoryMutation, CreateCategoryMutationVariables>;
export const DeleteCategoryDocument = {
    kind: "Document",
    definitions: [
        {
            kind: "OperationDefinition",
            operation: "mutation",
            name: { kind: "Name", value: "DeleteCategory" },
            variableDefinitions: [
                {
                    kind: "VariableDefinition",
                    variable: { kind: "Variable", name: { kind: "Name", value: "id" } },
                    type: {
                        kind: "NonNullType",
                        type: { kind: "NamedType", name: { kind: "Name", value: "Int" } },
                    },
                },
            ],
            selectionSet: {
                kind: "SelectionSet",
                selections: [
                    {
                        kind: "Field",
                        name: { kind: "Name", value: "deleteCategory" },
                        arguments: [
                            {
                                kind: "Argument",
                                name: { kind: "Name", value: "input" },
                                value: {
                                    kind: "ObjectValue",
                                    fields: [
                                        {
                                            kind: "ObjectField",
                                            name: { kind: "Name", value: "id" },
                                            value: {
                                                kind: "Variable",
                                                name: { kind: "Name", value: "id" },
                                            },
                                        },
                                    ],
                                },
                            },
                        ],
                        selectionSet: {
                            kind: "SelectionSet",
                            selections: [
                                {
                                    kind: "Field",
                                    name: { kind: "Name", value: "owner" },
                                    selectionSet: {
                                        kind: "SelectionSet",
                                        selections: [
                                            {
                                                kind: "Field",
                                                name: { kind: "Name", value: "categories" },
                                                selectionSet: {
                                                    kind: "SelectionSet",
                                                    selections: [
                                                        {
                                                            kind: "Field",
                                                            name: { kind: "Name", value: "nodes" },
                                                            selectionSet: {
                                                                kind: "SelectionSet",
                                                                selections: [
                                                                    {
                                                                        kind: "Field",
                                                                        name: {
                                                                            kind: "Name",
                                                                            value: "id",
                                                                        },
                                                                    },
                                                                    {
                                                                        kind: "Field",
                                                                        name: {
                                                                            kind: "Name",
                                                                            value: "name",
                                                                        },
                                                                    },
                                                                ],
                                                            },
                                                        },
                                                    ],
                                                },
                                            },
                                        ],
                                    },
                                },
                            ],
                        },
                    },
                ],
            },
        },
    ],
} as unknown as DocumentNode<DeleteCategoryMutation, DeleteCategoryMutationVariables>;
export const GetAllCategoriesDocument = {
    kind: "Document",
    definitions: [
        {
            kind: "OperationDefinition",
            operation: "query",
            name: { kind: "Name", value: "GetAllCategories" },
            selectionSet: {
                kind: "SelectionSet",
                selections: [
                    {
                        kind: "Field",
                        name: { kind: "Name", value: "categories" },
                        selectionSet: {
                            kind: "SelectionSet",
                            selections: [
                                {
                                    kind: "Field",
                                    name: { kind: "Name", value: "nodes" },
                                    selectionSet: {
                                        kind: "SelectionSet",
                                        selections: [
                                            { kind: "Field", name: { kind: "Name", value: "id" } },
                                            {
                                                kind: "Field",
                                                name: { kind: "Name", value: "name" },
                                            },
                                        ],
                                    },
                                },
                            ],
                        },
                    },
                ],
            },
        },
    ],
} as unknown as DocumentNode<GetAllCategoriesQuery, GetAllCategoriesQueryVariables>;
export const AddExpenseDocument = {
    kind: "Document",
    definitions: [
        {
            kind: "OperationDefinition",
            operation: "mutation",
            name: { kind: "Name", value: "AddExpense" },
            variableDefinitions: [
                {
                    kind: "VariableDefinition",
                    variable: { kind: "Variable", name: { kind: "Name", value: "amount" } },
                    type: {
                        kind: "NonNullType",
                        type: { kind: "NamedType", name: { kind: "Name", value: "Float" } },
                    },
                },
                {
                    kind: "VariableDefinition",
                    variable: { kind: "Variable", name: { kind: "Name", value: "description" } },
                    type: {
                        kind: "NonNullType",
                        type: { kind: "NamedType", name: { kind: "Name", value: "String" } },
                    },
                },
                {
                    kind: "VariableDefinition",
                    variable: { kind: "Variable", name: { kind: "Name", value: "categoryId" } },
                    type: {
                        kind: "NonNullType",
                        type: { kind: "NamedType", name: { kind: "Name", value: "Int" } },
                    },
                },
                {
                    kind: "VariableDefinition",
                    variable: { kind: "Variable", name: { kind: "Name", value: "fromAccountId" } },
                    type: {
                        kind: "NonNullType",
                        type: { kind: "NamedType", name: { kind: "Name", value: "Int" } },
                    },
                },
                {
                    kind: "VariableDefinition",
                    variable: { kind: "Variable", name: { kind: "Name", value: "occurredAt" } },
                    type: {
                        kind: "NonNullType",
                        type: { kind: "NamedType", name: { kind: "Name", value: "Datetime" } },
                    },
                },
            ],
            selectionSet: {
                kind: "SelectionSet",
                selections: [
                    {
                        kind: "Field",
                        name: { kind: "Name", value: "spend" },
                        arguments: [
                            {
                                kind: "Argument",
                                name: { kind: "Name", value: "input" },
                                value: {
                                    kind: "ObjectValue",
                                    fields: [
                                        {
                                            kind: "ObjectField",
                                            name: { kind: "Name", value: "amount" },
                                            value: {
                                                kind: "Variable",
                                                name: { kind: "Name", value: "amount" },
                                            },
                                        },
                                        {
                                            kind: "ObjectField",
                                            name: { kind: "Name", value: "description" },
                                            value: {
                                                kind: "Variable",
                                                name: { kind: "Name", value: "description" },
                                            },
                                        },
                                        {
                                            kind: "ObjectField",
                                            name: { kind: "Name", value: "categoryId" },
                                            value: {
                                                kind: "Variable",
                                                name: { kind: "Name", value: "categoryId" },
                                            },
                                        },
                                        {
                                            kind: "ObjectField",
                                            name: { kind: "Name", value: "fromAccountId" },
                                            value: {
                                                kind: "Variable",
                                                name: { kind: "Name", value: "fromAccountId" },
                                            },
                                        },
                                        {
                                            kind: "ObjectField",
                                            name: { kind: "Name", value: "occurredAt" },
                                            value: {
                                                kind: "Variable",
                                                name: { kind: "Name", value: "occurredAt" },
                                            },
                                        },
                                    ],
                                },
                            },
                        ],
                        selectionSet: {
                            kind: "SelectionSet",
                            selections: [
                                {
                                    kind: "Field",
                                    name: { kind: "Name", value: "transaction" },
                                    selectionSet: {
                                        kind: "SelectionSet",
                                        selections: [
                                            {
                                                kind: "FragmentSpread",
                                                name: { kind: "Name", value: "PlainTransaction" },
                                            },
                                            {
                                                kind: "Field",
                                                name: { kind: "Name", value: "fromAccount" },
                                                selectionSet: {
                                                    kind: "SelectionSet",
                                                    selections: [
                                                        {
                                                            kind: "FragmentSpread",
                                                            name: {
                                                                kind: "Name",
                                                                value: "PlainAccount",
                                                            },
                                                        },
                                                    ],
                                                },
                                            },
                                            {
                                                kind: "Field",
                                                name: { kind: "Name", value: "category" },
                                                selectionSet: {
                                                    kind: "SelectionSet",
                                                    selections: [
                                                        {
                                                            kind: "FragmentSpread",
                                                            name: {
                                                                kind: "Name",
                                                                value: "PlainCategory",
                                                            },
                                                        },
                                                    ],
                                                },
                                            },
                                        ],
                                    },
                                },
                            ],
                        },
                    },
                ],
            },
        },
        {
            kind: "FragmentDefinition",
            name: { kind: "Name", value: "PlainTransaction" },
            typeCondition: { kind: "NamedType", name: { kind: "Name", value: "Transaction" } },
            selectionSet: {
                kind: "SelectionSet",
                selections: [
                    { kind: "Field", name: { kind: "Name", value: "id" } },
                    { kind: "Field", name: { kind: "Name", value: "amount" } },
                    { kind: "Field", name: { kind: "Name", value: "description" } },
                    { kind: "Field", name: { kind: "Name", value: "type" } },
                    { kind: "Field", name: { kind: "Name", value: "date" } },
                    { kind: "Field", name: { kind: "Name", value: "categoryId" } },
                    { kind: "Field", name: { kind: "Name", value: "fromAccountId" } },
                    { kind: "Field", name: { kind: "Name", value: "toAccountId" } },
                ],
            },
        },
        {
            kind: "FragmentDefinition",
            name: { kind: "Name", value: "PlainAccount" },
            typeCondition: { kind: "NamedType", name: { kind: "Name", value: "Account" } },
            selectionSet: {
                kind: "SelectionSet",
                selections: [
                    { kind: "Field", name: { kind: "Name", value: "id" } },
                    { kind: "Field", name: { kind: "Name", value: "name" } },
                    { kind: "Field", name: { kind: "Name", value: "balance" } },
                ],
            },
        },
        {
            kind: "FragmentDefinition",
            name: { kind: "Name", value: "PlainCategory" },
            typeCondition: { kind: "NamedType", name: { kind: "Name", value: "Category" } },
            selectionSet: {
                kind: "SelectionSet",
                selections: [
                    { kind: "Field", name: { kind: "Name", value: "id" } },
                    { kind: "Field", name: { kind: "Name", value: "name" } },
                ],
            },
        },
    ],
} as unknown as DocumentNode<AddExpenseMutation, AddExpenseMutationVariables>;
export const AddIncomeDocument = {
    kind: "Document",
    definitions: [
        {
            kind: "OperationDefinition",
            operation: "mutation",
            name: { kind: "Name", value: "AddIncome" },
            variableDefinitions: [
                {
                    kind: "VariableDefinition",
                    variable: { kind: "Variable", name: { kind: "Name", value: "amount" } },
                    type: {
                        kind: "NonNullType",
                        type: { kind: "NamedType", name: { kind: "Name", value: "Float" } },
                    },
                },
                {
                    kind: "VariableDefinition",
                    variable: { kind: "Variable", name: { kind: "Name", value: "description" } },
                    type: {
                        kind: "NonNullType",
                        type: { kind: "NamedType", name: { kind: "Name", value: "String" } },
                    },
                },
                {
                    kind: "VariableDefinition",
                    variable: { kind: "Variable", name: { kind: "Name", value: "categoryId" } },
                    type: {
                        kind: "NonNullType",
                        type: { kind: "NamedType", name: { kind: "Name", value: "Int" } },
                    },
                },
                {
                    kind: "VariableDefinition",
                    variable: { kind: "Variable", name: { kind: "Name", value: "toAccountId" } },
                    type: {
                        kind: "NonNullType",
                        type: { kind: "NamedType", name: { kind: "Name", value: "Int" } },
                    },
                },
                {
                    kind: "VariableDefinition",
                    variable: { kind: "Variable", name: { kind: "Name", value: "occurredAt" } },
                    type: {
                        kind: "NonNullType",
                        type: { kind: "NamedType", name: { kind: "Name", value: "Datetime" } },
                    },
                },
            ],
            selectionSet: {
                kind: "SelectionSet",
                selections: [
                    {
                        kind: "Field",
                        name: { kind: "Name", value: "receive" },
                        arguments: [
                            {
                                kind: "Argument",
                                name: { kind: "Name", value: "input" },
                                value: {
                                    kind: "ObjectValue",
                                    fields: [
                                        {
                                            kind: "ObjectField",
                                            name: { kind: "Name", value: "amount" },
                                            value: {
                                                kind: "Variable",
                                                name: { kind: "Name", value: "amount" },
                                            },
                                        },
                                        {
                                            kind: "ObjectField",
                                            name: { kind: "Name", value: "description" },
                                            value: {
                                                kind: "Variable",
                                                name: { kind: "Name", value: "description" },
                                            },
                                        },
                                        {
                                            kind: "ObjectField",
                                            name: { kind: "Name", value: "categoryId" },
                                            value: {
                                                kind: "Variable",
                                                name: { kind: "Name", value: "categoryId" },
                                            },
                                        },
                                        {
                                            kind: "ObjectField",
                                            name: { kind: "Name", value: "toAccountId" },
                                            value: {
                                                kind: "Variable",
                                                name: { kind: "Name", value: "toAccountId" },
                                            },
                                        },
                                        {
                                            kind: "ObjectField",
                                            name: { kind: "Name", value: "occurredAt" },
                                            value: {
                                                kind: "Variable",
                                                name: { kind: "Name", value: "occurredAt" },
                                            },
                                        },
                                    ],
                                },
                            },
                        ],
                        selectionSet: {
                            kind: "SelectionSet",
                            selections: [
                                {
                                    kind: "Field",
                                    name: { kind: "Name", value: "transaction" },
                                    selectionSet: {
                                        kind: "SelectionSet",
                                        selections: [
                                            {
                                                kind: "FragmentSpread",
                                                name: { kind: "Name", value: "PlainTransaction" },
                                            },
                                            {
                                                kind: "Field",
                                                name: { kind: "Name", value: "toAccount" },
                                                selectionSet: {
                                                    kind: "SelectionSet",
                                                    selections: [
                                                        {
                                                            kind: "FragmentSpread",
                                                            name: {
                                                                kind: "Name",
                                                                value: "PlainAccount",
                                                            },
                                                        },
                                                    ],
                                                },
                                            },
                                            {
                                                kind: "Field",
                                                name: { kind: "Name", value: "category" },
                                                selectionSet: {
                                                    kind: "SelectionSet",
                                                    selections: [
                                                        {
                                                            kind: "FragmentSpread",
                                                            name: {
                                                                kind: "Name",
                                                                value: "PlainCategory",
                                                            },
                                                        },
                                                    ],
                                                },
                                            },
                                        ],
                                    },
                                },
                            ],
                        },
                    },
                ],
            },
        },
        {
            kind: "FragmentDefinition",
            name: { kind: "Name", value: "PlainTransaction" },
            typeCondition: { kind: "NamedType", name: { kind: "Name", value: "Transaction" } },
            selectionSet: {
                kind: "SelectionSet",
                selections: [
                    { kind: "Field", name: { kind: "Name", value: "id" } },
                    { kind: "Field", name: { kind: "Name", value: "amount" } },
                    { kind: "Field", name: { kind: "Name", value: "description" } },
                    { kind: "Field", name: { kind: "Name", value: "type" } },
                    { kind: "Field", name: { kind: "Name", value: "date" } },
                    { kind: "Field", name: { kind: "Name", value: "categoryId" } },
                    { kind: "Field", name: { kind: "Name", value: "fromAccountId" } },
                    { kind: "Field", name: { kind: "Name", value: "toAccountId" } },
                ],
            },
        },
        {
            kind: "FragmentDefinition",
            name: { kind: "Name", value: "PlainAccount" },
            typeCondition: { kind: "NamedType", name: { kind: "Name", value: "Account" } },
            selectionSet: {
                kind: "SelectionSet",
                selections: [
                    { kind: "Field", name: { kind: "Name", value: "id" } },
                    { kind: "Field", name: { kind: "Name", value: "name" } },
                    { kind: "Field", name: { kind: "Name", value: "balance" } },
                ],
            },
        },
        {
            kind: "FragmentDefinition",
            name: { kind: "Name", value: "PlainCategory" },
            typeCondition: { kind: "NamedType", name: { kind: "Name", value: "Category" } },
            selectionSet: {
                kind: "SelectionSet",
                selections: [
                    { kind: "Field", name: { kind: "Name", value: "id" } },
                    { kind: "Field", name: { kind: "Name", value: "name" } },
                ],
            },
        },
    ],
} as unknown as DocumentNode<AddIncomeMutation, AddIncomeMutationVariables>;
export const AddTransferDocument = {
    kind: "Document",
    definitions: [
        {
            kind: "OperationDefinition",
            operation: "mutation",
            name: { kind: "Name", value: "AddTransfer" },
            variableDefinitions: [
                {
                    kind: "VariableDefinition",
                    variable: { kind: "Variable", name: { kind: "Name", value: "amount" } },
                    type: {
                        kind: "NonNullType",
                        type: { kind: "NamedType", name: { kind: "Name", value: "Float" } },
                    },
                },
                {
                    kind: "VariableDefinition",
                    variable: { kind: "Variable", name: { kind: "Name", value: "description" } },
                    type: {
                        kind: "NonNullType",
                        type: { kind: "NamedType", name: { kind: "Name", value: "String" } },
                    },
                },
                {
                    kind: "VariableDefinition",
                    variable: { kind: "Variable", name: { kind: "Name", value: "categoryId" } },
                    type: {
                        kind: "NonNullType",
                        type: { kind: "NamedType", name: { kind: "Name", value: "Int" } },
                    },
                },
                {
                    kind: "VariableDefinition",
                    variable: { kind: "Variable", name: { kind: "Name", value: "fromAccountId" } },
                    type: {
                        kind: "NonNullType",
                        type: { kind: "NamedType", name: { kind: "Name", value: "Int" } },
                    },
                },
                {
                    kind: "VariableDefinition",
                    variable: { kind: "Variable", name: { kind: "Name", value: "toAccountId" } },
                    type: {
                        kind: "NonNullType",
                        type: { kind: "NamedType", name: { kind: "Name", value: "Int" } },
                    },
                },
                {
                    kind: "VariableDefinition",
                    variable: { kind: "Variable", name: { kind: "Name", value: "occurredAt" } },
                    type: {
                        kind: "NonNullType",
                        type: { kind: "NamedType", name: { kind: "Name", value: "Datetime" } },
                    },
                },
            ],
            selectionSet: {
                kind: "SelectionSet",
                selections: [
                    {
                        kind: "Field",
                        name: { kind: "Name", value: "transferV2" },
                        arguments: [
                            {
                                kind: "Argument",
                                name: { kind: "Name", value: "input" },
                                value: {
                                    kind: "ObjectValue",
                                    fields: [
                                        {
                                            kind: "ObjectField",
                                            name: { kind: "Name", value: "amount" },
                                            value: {
                                                kind: "Variable",
                                                name: { kind: "Name", value: "amount" },
                                            },
                                        },
                                        {
                                            kind: "ObjectField",
                                            name: { kind: "Name", value: "description" },
                                            value: {
                                                kind: "Variable",
                                                name: { kind: "Name", value: "description" },
                                            },
                                        },
                                        {
                                            kind: "ObjectField",
                                            name: { kind: "Name", value: "categoryId" },
                                            value: {
                                                kind: "Variable",
                                                name: { kind: "Name", value: "categoryId" },
                                            },
                                        },
                                        {
                                            kind: "ObjectField",
                                            name: { kind: "Name", value: "fromAccountId" },
                                            value: {
                                                kind: "Variable",
                                                name: { kind: "Name", value: "fromAccountId" },
                                            },
                                        },
                                        {
                                            kind: "ObjectField",
                                            name: { kind: "Name", value: "toAccountId" },
                                            value: {
                                                kind: "Variable",
                                                name: { kind: "Name", value: "toAccountId" },
                                            },
                                        },
                                        {
                                            kind: "ObjectField",
                                            name: { kind: "Name", value: "occurredAt" },
                                            value: {
                                                kind: "Variable",
                                                name: { kind: "Name", value: "occurredAt" },
                                            },
                                        },
                                    ],
                                },
                            },
                        ],
                        selectionSet: {
                            kind: "SelectionSet",
                            selections: [
                                {
                                    kind: "Field",
                                    name: { kind: "Name", value: "transaction" },
                                    selectionSet: {
                                        kind: "SelectionSet",
                                        selections: [
                                            {
                                                kind: "FragmentSpread",
                                                name: { kind: "Name", value: "PlainTransaction" },
                                            },
                                            {
                                                kind: "Field",
                                                name: { kind: "Name", value: "fromAccount" },
                                                selectionSet: {
                                                    kind: "SelectionSet",
                                                    selections: [
                                                        {
                                                            kind: "FragmentSpread",
                                                            name: {
                                                                kind: "Name",
                                                                value: "PlainAccount",
                                                            },
                                                        },
                                                    ],
                                                },
                                            },
                                            {
                                                kind: "Field",
                                                name: { kind: "Name", value: "toAccount" },
                                                selectionSet: {
                                                    kind: "SelectionSet",
                                                    selections: [
                                                        {
                                                            kind: "FragmentSpread",
                                                            name: {
                                                                kind: "Name",
                                                                value: "PlainAccount",
                                                            },
                                                        },
                                                    ],
                                                },
                                            },
                                            {
                                                kind: "Field",
                                                name: { kind: "Name", value: "category" },
                                                selectionSet: {
                                                    kind: "SelectionSet",
                                                    selections: [
                                                        {
                                                            kind: "FragmentSpread",
                                                            name: {
                                                                kind: "Name",
                                                                value: "PlainCategory",
                                                            },
                                                        },
                                                    ],
                                                },
                                            },
                                        ],
                                    },
                                },
                            ],
                        },
                    },
                ],
            },
        },
        {
            kind: "FragmentDefinition",
            name: { kind: "Name", value: "PlainTransaction" },
            typeCondition: { kind: "NamedType", name: { kind: "Name", value: "Transaction" } },
            selectionSet: {
                kind: "SelectionSet",
                selections: [
                    { kind: "Field", name: { kind: "Name", value: "id" } },
                    { kind: "Field", name: { kind: "Name", value: "amount" } },
                    { kind: "Field", name: { kind: "Name", value: "description" } },
                    { kind: "Field", name: { kind: "Name", value: "type" } },
                    { kind: "Field", name: { kind: "Name", value: "date" } },
                    { kind: "Field", name: { kind: "Name", value: "categoryId" } },
                    { kind: "Field", name: { kind: "Name", value: "fromAccountId" } },
                    { kind: "Field", name: { kind: "Name", value: "toAccountId" } },
                ],
            },
        },
        {
            kind: "FragmentDefinition",
            name: { kind: "Name", value: "PlainAccount" },
            typeCondition: { kind: "NamedType", name: { kind: "Name", value: "Account" } },
            selectionSet: {
                kind: "SelectionSet",
                selections: [
                    { kind: "Field", name: { kind: "Name", value: "id" } },
                    { kind: "Field", name: { kind: "Name", value: "name" } },
                    { kind: "Field", name: { kind: "Name", value: "balance" } },
                ],
            },
        },
        {
            kind: "FragmentDefinition",
            name: { kind: "Name", value: "PlainCategory" },
            typeCondition: { kind: "NamedType", name: { kind: "Name", value: "Category" } },
            selectionSet: {
                kind: "SelectionSet",
                selections: [
                    { kind: "Field", name: { kind: "Name", value: "id" } },
                    { kind: "Field", name: { kind: "Name", value: "name" } },
                ],
            },
        },
    ],
} as unknown as DocumentNode<AddTransferMutation, AddTransferMutationVariables>;
export const DeleteTransactionDocument = {
    kind: "Document",
    definitions: [
        {
            kind: "OperationDefinition",
            operation: "mutation",
            name: { kind: "Name", value: "DeleteTransaction" },
            variableDefinitions: [
                {
                    kind: "VariableDefinition",
                    variable: { kind: "Variable", name: { kind: "Name", value: "transactionId" } },
                    type: {
                        kind: "NonNullType",
                        type: { kind: "NamedType", name: { kind: "Name", value: "Int" } },
                    },
                },
            ],
            selectionSet: {
                kind: "SelectionSet",
                selections: [
                    {
                        kind: "Field",
                        name: { kind: "Name", value: "deleteTransaction" },
                        arguments: [
                            {
                                kind: "Argument",
                                name: { kind: "Name", value: "input" },
                                value: {
                                    kind: "ObjectValue",
                                    fields: [
                                        {
                                            kind: "ObjectField",
                                            name: { kind: "Name", value: "id" },
                                            value: {
                                                kind: "Variable",
                                                name: { kind: "Name", value: "transactionId" },
                                            },
                                        },
                                    ],
                                },
                            },
                        ],
                        selectionSet: {
                            kind: "SelectionSet",
                            selections: [
                                {
                                    kind: "Field",
                                    name: { kind: "Name", value: "transaction" },
                                    selectionSet: {
                                        kind: "SelectionSet",
                                        selections: [
                                            {
                                                kind: "FragmentSpread",
                                                name: { kind: "Name", value: "PlainTransaction" },
                                            },
                                            {
                                                kind: "Field",
                                                name: { kind: "Name", value: "fromAccount" },
                                                selectionSet: {
                                                    kind: "SelectionSet",
                                                    selections: [
                                                        {
                                                            kind: "FragmentSpread",
                                                            name: {
                                                                kind: "Name",
                                                                value: "PlainAccount",
                                                            },
                                                        },
                                                    ],
                                                },
                                            },
                                            {
                                                kind: "Field",
                                                name: { kind: "Name", value: "toAccount" },
                                                selectionSet: {
                                                    kind: "SelectionSet",
                                                    selections: [
                                                        {
                                                            kind: "FragmentSpread",
                                                            name: {
                                                                kind: "Name",
                                                                value: "PlainAccount",
                                                            },
                                                        },
                                                    ],
                                                },
                                            },
                                            {
                                                kind: "Field",
                                                name: { kind: "Name", value: "category" },
                                                selectionSet: {
                                                    kind: "SelectionSet",
                                                    selections: [
                                                        {
                                                            kind: "FragmentSpread",
                                                            name: {
                                                                kind: "Name",
                                                                value: "PlainCategory",
                                                            },
                                                        },
                                                    ],
                                                },
                                            },
                                        ],
                                    },
                                },
                            ],
                        },
                    },
                ],
            },
        },
        {
            kind: "FragmentDefinition",
            name: { kind: "Name", value: "PlainTransaction" },
            typeCondition: { kind: "NamedType", name: { kind: "Name", value: "Transaction" } },
            selectionSet: {
                kind: "SelectionSet",
                selections: [
                    { kind: "Field", name: { kind: "Name", value: "id" } },
                    { kind: "Field", name: { kind: "Name", value: "amount" } },
                    { kind: "Field", name: { kind: "Name", value: "description" } },
                    { kind: "Field", name: { kind: "Name", value: "type" } },
                    { kind: "Field", name: { kind: "Name", value: "date" } },
                    { kind: "Field", name: { kind: "Name", value: "categoryId" } },
                    { kind: "Field", name: { kind: "Name", value: "fromAccountId" } },
                    { kind: "Field", name: { kind: "Name", value: "toAccountId" } },
                ],
            },
        },
        {
            kind: "FragmentDefinition",
            name: { kind: "Name", value: "PlainAccount" },
            typeCondition: { kind: "NamedType", name: { kind: "Name", value: "Account" } },
            selectionSet: {
                kind: "SelectionSet",
                selections: [
                    { kind: "Field", name: { kind: "Name", value: "id" } },
                    { kind: "Field", name: { kind: "Name", value: "name" } },
                    { kind: "Field", name: { kind: "Name", value: "balance" } },
                ],
            },
        },
        {
            kind: "FragmentDefinition",
            name: { kind: "Name", value: "PlainCategory" },
            typeCondition: { kind: "NamedType", name: { kind: "Name", value: "Category" } },
            selectionSet: {
                kind: "SelectionSet",
                selections: [
                    { kind: "Field", name: { kind: "Name", value: "id" } },
                    { kind: "Field", name: { kind: "Name", value: "name" } },
                ],
            },
        },
    ],
} as unknown as DocumentNode<DeleteTransactionMutation, DeleteTransactionMutationVariables>;
export const GetTransactionsDocument = {
    kind: "Document",
    definitions: [
        {
            kind: "OperationDefinition",
            operation: "query",
            name: { kind: "Name", value: "GetTransactions" },
            variableDefinitions: [
                {
                    kind: "VariableDefinition",
                    variable: { kind: "Variable", name: { kind: "Name", value: "accountId" } },
                    type: {
                        kind: "NonNullType",
                        type: { kind: "NamedType", name: { kind: "Name", value: "Int" } },
                    },
                },
                {
                    kind: "VariableDefinition",
                    variable: { kind: "Variable", name: { kind: "Name", value: "from" } },
                    type: {
                        kind: "NonNullType",
                        type: { kind: "NamedType", name: { kind: "Name", value: "Datetime" } },
                    },
                },
                {
                    kind: "VariableDefinition",
                    variable: { kind: "Variable", name: { kind: "Name", value: "until" } },
                    type: {
                        kind: "NonNullType",
                        type: { kind: "NamedType", name: { kind: "Name", value: "Datetime" } },
                    },
                },
            ],
            selectionSet: {
                kind: "SelectionSet",
                selections: [
                    {
                        kind: "Field",
                        name: { kind: "Name", value: "transactions" },
                        arguments: [
                            {
                                kind: "Argument",
                                name: { kind: "Name", value: "condition" },
                                value: {
                                    kind: "ObjectValue",
                                    fields: [
                                        {
                                            kind: "ObjectField",
                                            name: { kind: "Name", value: "toAccountId" },
                                            value: {
                                                kind: "Variable",
                                                name: { kind: "Name", value: "accountId" },
                                            },
                                        },
                                    ],
                                },
                            },
                            {
                                kind: "Argument",
                                name: { kind: "Name", value: "filter" },
                                value: {
                                    kind: "ObjectValue",
                                    fields: [
                                        {
                                            kind: "ObjectField",
                                            name: { kind: "Name", value: "date" },
                                            value: {
                                                kind: "ObjectValue",
                                                fields: [
                                                    {
                                                        kind: "ObjectField",
                                                        name: {
                                                            kind: "Name",
                                                            value: "greaterThanOrEqualTo",
                                                        },
                                                        value: {
                                                            kind: "Variable",
                                                            name: { kind: "Name", value: "from" },
                                                        },
                                                    },
                                                    {
                                                        kind: "ObjectField",
                                                        name: { kind: "Name", value: "lessThan" },
                                                        value: {
                                                            kind: "Variable",
                                                            name: { kind: "Name", value: "until" },
                                                        },
                                                    },
                                                ],
                                            },
                                        },
                                    ],
                                },
                            },
                        ],
                        selectionSet: {
                            kind: "SelectionSet",
                            selections: [
                                {
                                    kind: "Field",
                                    name: { kind: "Name", value: "nodes" },
                                    selectionSet: {
                                        kind: "SelectionSet",
                                        selections: [
                                            {
                                                kind: "FragmentSpread",
                                                name: { kind: "Name", value: "PlainTransaction" },
                                            },
                                            {
                                                kind: "Field",
                                                name: { kind: "Name", value: "toAccount" },
                                                selectionSet: {
                                                    kind: "SelectionSet",
                                                    selections: [
                                                        {
                                                            kind: "FragmentSpread",
                                                            name: {
                                                                kind: "Name",
                                                                value: "PlainAccount",
                                                            },
                                                        },
                                                    ],
                                                },
                                            },
                                            {
                                                kind: "Field",
                                                name: { kind: "Name", value: "fromAccount" },
                                                selectionSet: {
                                                    kind: "SelectionSet",
                                                    selections: [
                                                        {
                                                            kind: "FragmentSpread",
                                                            name: {
                                                                kind: "Name",
                                                                value: "PlainAccount",
                                                            },
                                                        },
                                                    ],
                                                },
                                            },
                                            {
                                                kind: "Field",
                                                name: { kind: "Name", value: "category" },
                                                selectionSet: {
                                                    kind: "SelectionSet",
                                                    selections: [
                                                        {
                                                            kind: "FragmentSpread",
                                                            name: {
                                                                kind: "Name",
                                                                value: "PlainCategory",
                                                            },
                                                        },
                                                    ],
                                                },
                                            },
                                        ],
                                    },
                                },
                                { kind: "Field", name: { kind: "Name", value: "totalCount" } },
                            ],
                        },
                    },
                ],
            },
        },
        {
            kind: "FragmentDefinition",
            name: { kind: "Name", value: "PlainTransaction" },
            typeCondition: { kind: "NamedType", name: { kind: "Name", value: "Transaction" } },
            selectionSet: {
                kind: "SelectionSet",
                selections: [
                    { kind: "Field", name: { kind: "Name", value: "id" } },
                    { kind: "Field", name: { kind: "Name", value: "amount" } },
                    { kind: "Field", name: { kind: "Name", value: "description" } },
                    { kind: "Field", name: { kind: "Name", value: "type" } },
                    { kind: "Field", name: { kind: "Name", value: "date" } },
                    { kind: "Field", name: { kind: "Name", value: "categoryId" } },
                    { kind: "Field", name: { kind: "Name", value: "fromAccountId" } },
                    { kind: "Field", name: { kind: "Name", value: "toAccountId" } },
                ],
            },
        },
        {
            kind: "FragmentDefinition",
            name: { kind: "Name", value: "PlainAccount" },
            typeCondition: { kind: "NamedType", name: { kind: "Name", value: "Account" } },
            selectionSet: {
                kind: "SelectionSet",
                selections: [
                    { kind: "Field", name: { kind: "Name", value: "id" } },
                    { kind: "Field", name: { kind: "Name", value: "name" } },
                    { kind: "Field", name: { kind: "Name", value: "balance" } },
                ],
            },
        },
        {
            kind: "FragmentDefinition",
            name: { kind: "Name", value: "PlainCategory" },
            typeCondition: { kind: "NamedType", name: { kind: "Name", value: "Category" } },
            selectionSet: {
                kind: "SelectionSet",
                selections: [
                    { kind: "Field", name: { kind: "Name", value: "id" } },
                    { kind: "Field", name: { kind: "Name", value: "name" } },
                ],
            },
        },
    ],
} as unknown as DocumentNode<GetTransactionsQuery, GetTransactionsQueryVariables>;
export const GetTransactionsByFromAccountDocument = {
    kind: "Document",
    definitions: [
        {
            kind: "OperationDefinition",
            operation: "query",
            name: { kind: "Name", value: "GetTransactionsByFromAccount" },
            variableDefinitions: [
                {
                    kind: "VariableDefinition",
                    variable: { kind: "Variable", name: { kind: "Name", value: "accountId" } },
                    type: {
                        kind: "NonNullType",
                        type: { kind: "NamedType", name: { kind: "Name", value: "Int" } },
                    },
                },
                {
                    kind: "VariableDefinition",
                    variable: { kind: "Variable", name: { kind: "Name", value: "from" } },
                    type: {
                        kind: "NonNullType",
                        type: { kind: "NamedType", name: { kind: "Name", value: "Datetime" } },
                    },
                },
                {
                    kind: "VariableDefinition",
                    variable: { kind: "Variable", name: { kind: "Name", value: "until" } },
                    type: {
                        kind: "NonNullType",
                        type: { kind: "NamedType", name: { kind: "Name", value: "Datetime" } },
                    },
                },
            ],
            selectionSet: {
                kind: "SelectionSet",
                selections: [
                    {
                        kind: "Field",
                        name: { kind: "Name", value: "transactions" },
                        arguments: [
                            {
                                kind: "Argument",
                                name: { kind: "Name", value: "condition" },
                                value: {
                                    kind: "ObjectValue",
                                    fields: [
                                        {
                                            kind: "ObjectField",
                                            name: { kind: "Name", value: "fromAccountId" },
                                            value: {
                                                kind: "Variable",
                                                name: { kind: "Name", value: "accountId" },
                                            },
                                        },
                                    ],
                                },
                            },
                            {
                                kind: "Argument",
                                name: { kind: "Name", value: "filter" },
                                value: {
                                    kind: "ObjectValue",
                                    fields: [
                                        {
                                            kind: "ObjectField",
                                            name: { kind: "Name", value: "date" },
                                            value: {
                                                kind: "ObjectValue",
                                                fields: [
                                                    {
                                                        kind: "ObjectField",
                                                        name: {
                                                            kind: "Name",
                                                            value: "greaterThanOrEqualTo",
                                                        },
                                                        value: {
                                                            kind: "Variable",
                                                            name: { kind: "Name", value: "from" },
                                                        },
                                                    },
                                                    {
                                                        kind: "ObjectField",
                                                        name: { kind: "Name", value: "lessThan" },
                                                        value: {
                                                            kind: "Variable",
                                                            name: { kind: "Name", value: "until" },
                                                        },
                                                    },
                                                ],
                                            },
                                        },
                                    ],
                                },
                            },
                        ],
                        selectionSet: {
                            kind: "SelectionSet",
                            selections: [
                                {
                                    kind: "Field",
                                    name: { kind: "Name", value: "nodes" },
                                    selectionSet: {
                                        kind: "SelectionSet",
                                        selections: [
                                            {
                                                kind: "FragmentSpread",
                                                name: { kind: "Name", value: "PlainTransaction" },
                                            },
                                            {
                                                kind: "Field",
                                                name: { kind: "Name", value: "toAccount" },
                                                selectionSet: {
                                                    kind: "SelectionSet",
                                                    selections: [
                                                        {
                                                            kind: "FragmentSpread",
                                                            name: {
                                                                kind: "Name",
                                                                value: "PlainAccount",
                                                            },
                                                        },
                                                    ],
                                                },
                                            },
                                            {
                                                kind: "Field",
                                                name: { kind: "Name", value: "fromAccount" },
                                                selectionSet: {
                                                    kind: "SelectionSet",
                                                    selections: [
                                                        {
                                                            kind: "FragmentSpread",
                                                            name: {
                                                                kind: "Name",
                                                                value: "PlainAccount",
                                                            },
                                                        },
                                                    ],
                                                },
                                            },
                                            {
                                                kind: "Field",
                                                name: { kind: "Name", value: "category" },
                                                selectionSet: {
                                                    kind: "SelectionSet",
                                                    selections: [
                                                        {
                                                            kind: "FragmentSpread",
                                                            name: {
                                                                kind: "Name",
                                                                value: "PlainCategory",
                                                            },
                                                        },
                                                    ],
                                                },
                                            },
                                        ],
                                    },
                                },
                                { kind: "Field", name: { kind: "Name", value: "totalCount" } },
                            ],
                        },
                    },
                ],
            },
        },
        {
            kind: "FragmentDefinition",
            name: { kind: "Name", value: "PlainTransaction" },
            typeCondition: { kind: "NamedType", name: { kind: "Name", value: "Transaction" } },
            selectionSet: {
                kind: "SelectionSet",
                selections: [
                    { kind: "Field", name: { kind: "Name", value: "id" } },
                    { kind: "Field", name: { kind: "Name", value: "amount" } },
                    { kind: "Field", name: { kind: "Name", value: "description" } },
                    { kind: "Field", name: { kind: "Name", value: "type" } },
                    { kind: "Field", name: { kind: "Name", value: "date" } },
                    { kind: "Field", name: { kind: "Name", value: "categoryId" } },
                    { kind: "Field", name: { kind: "Name", value: "fromAccountId" } },
                    { kind: "Field", name: { kind: "Name", value: "toAccountId" } },
                ],
            },
        },
        {
            kind: "FragmentDefinition",
            name: { kind: "Name", value: "PlainAccount" },
            typeCondition: { kind: "NamedType", name: { kind: "Name", value: "Account" } },
            selectionSet: {
                kind: "SelectionSet",
                selections: [
                    { kind: "Field", name: { kind: "Name", value: "id" } },
                    { kind: "Field", name: { kind: "Name", value: "name" } },
                    { kind: "Field", name: { kind: "Name", value: "balance" } },
                ],
            },
        },
        {
            kind: "FragmentDefinition",
            name: { kind: "Name", value: "PlainCategory" },
            typeCondition: { kind: "NamedType", name: { kind: "Name", value: "Category" } },
            selectionSet: {
                kind: "SelectionSet",
                selections: [
                    { kind: "Field", name: { kind: "Name", value: "id" } },
                    { kind: "Field", name: { kind: "Name", value: "name" } },
                ],
            },
        },
    ],
} as unknown as DocumentNode<
    GetTransactionsByFromAccountQuery,
    GetTransactionsByFromAccountQueryVariables
>;
export const GetTransactionsPageByAccountIdDocument = {
    kind: "Document",
    definitions: [
        {
            kind: "OperationDefinition",
            operation: "query",
            name: { kind: "Name", value: "GetTransactionsPageByAccountId" },
            variableDefinitions: [
                {
                    kind: "VariableDefinition",
                    variable: { kind: "Variable", name: { kind: "Name", value: "accountId" } },
                    type: {
                        kind: "NonNullType",
                        type: { kind: "NamedType", name: { kind: "Name", value: "Int" } },
                    },
                },
                {
                    kind: "VariableDefinition",
                    variable: { kind: "Variable", name: { kind: "Name", value: "first" } },
                    type: {
                        kind: "NonNullType",
                        type: { kind: "NamedType", name: { kind: "Name", value: "Int" } },
                    },
                },
                {
                    kind: "VariableDefinition",
                    variable: { kind: "Variable", name: { kind: "Name", value: "after" } },
                    type: { kind: "NamedType", name: { kind: "Name", value: "Cursor" } },
                },
            ],
            selectionSet: {
                kind: "SelectionSet",
                selections: [
                    {
                        kind: "Field",
                        name: { kind: "Name", value: "transactions" },
                        arguments: [
                            {
                                kind: "Argument",
                                name: { kind: "Name", value: "filter" },
                                value: {
                                    kind: "ObjectValue",
                                    fields: [
                                        {
                                            kind: "ObjectField",
                                            name: { kind: "Name", value: "or" },
                                            value: {
                                                kind: "ListValue",
                                                values: [
                                                    {
                                                        kind: "ObjectValue",
                                                        fields: [
                                                            {
                                                                kind: "ObjectField",
                                                                name: {
                                                                    kind: "Name",
                                                                    value: "toAccountId",
                                                                },
                                                                value: {
                                                                    kind: "ObjectValue",
                                                                    fields: [
                                                                        {
                                                                            kind: "ObjectField",
                                                                            name: {
                                                                                kind: "Name",
                                                                                value: "equalTo",
                                                                            },
                                                                            value: {
                                                                                kind: "Variable",
                                                                                name: {
                                                                                    kind: "Name",
                                                                                    value: "accountId",
                                                                                },
                                                                            },
                                                                        },
                                                                    ],
                                                                },
                                                            },
                                                        ],
                                                    },
                                                    {
                                                        kind: "ObjectValue",
                                                        fields: [
                                                            {
                                                                kind: "ObjectField",
                                                                name: {
                                                                    kind: "Name",
                                                                    value: "fromAccountId",
                                                                },
                                                                value: {
                                                                    kind: "ObjectValue",
                                                                    fields: [
                                                                        {
                                                                            kind: "ObjectField",
                                                                            name: {
                                                                                kind: "Name",
                                                                                value: "equalTo",
                                                                            },
                                                                            value: {
                                                                                kind: "Variable",
                                                                                name: {
                                                                                    kind: "Name",
                                                                                    value: "accountId",
                                                                                },
                                                                            },
                                                                        },
                                                                    ],
                                                                },
                                                            },
                                                        ],
                                                    },
                                                ],
                                            },
                                        },
                                    ],
                                },
                            },
                            {
                                kind: "Argument",
                                name: { kind: "Name", value: "orderBy" },
                                value: {
                                    kind: "ListValue",
                                    values: [
                                        { kind: "EnumValue", value: "DATE_DESC" },
                                        { kind: "EnumValue", value: "ID_DESC" },
                                    ],
                                },
                            },
                            {
                                kind: "Argument",
                                name: { kind: "Name", value: "first" },
                                value: { kind: "Variable", name: { kind: "Name", value: "first" } },
                            },
                            {
                                kind: "Argument",
                                name: { kind: "Name", value: "after" },
                                value: { kind: "Variable", name: { kind: "Name", value: "after" } },
                            },
                        ],
                        selectionSet: {
                            kind: "SelectionSet",
                            selections: [
                                {
                                    kind: "Field",
                                    name: { kind: "Name", value: "nodes" },
                                    selectionSet: {
                                        kind: "SelectionSet",
                                        selections: [
                                            {
                                                kind: "FragmentSpread",
                                                name: { kind: "Name", value: "PlainTransaction" },
                                            },
                                            {
                                                kind: "Field",
                                                name: { kind: "Name", value: "toAccount" },
                                                selectionSet: {
                                                    kind: "SelectionSet",
                                                    selections: [
                                                        {
                                                            kind: "FragmentSpread",
                                                            name: {
                                                                kind: "Name",
                                                                value: "PlainAccount",
                                                            },
                                                        },
                                                    ],
                                                },
                                            },
                                            {
                                                kind: "Field",
                                                name: { kind: "Name", value: "fromAccount" },
                                                selectionSet: {
                                                    kind: "SelectionSet",
                                                    selections: [
                                                        {
                                                            kind: "FragmentSpread",
                                                            name: {
                                                                kind: "Name",
                                                                value: "PlainAccount",
                                                            },
                                                        },
                                                    ],
                                                },
                                            },
                                            {
                                                kind: "Field",
                                                name: { kind: "Name", value: "category" },
                                                selectionSet: {
                                                    kind: "SelectionSet",
                                                    selections: [
                                                        {
                                                            kind: "FragmentSpread",
                                                            name: {
                                                                kind: "Name",
                                                                value: "PlainCategory",
                                                            },
                                                        },
                                                    ],
                                                },
                                            },
                                        ],
                                    },
                                },
                                {
                                    kind: "Field",
                                    name: { kind: "Name", value: "pageInfo" },
                                    selectionSet: {
                                        kind: "SelectionSet",
                                        selections: [
                                            {
                                                kind: "Field",
                                                name: { kind: "Name", value: "endCursor" },
                                            },
                                            {
                                                kind: "Field",
                                                name: { kind: "Name", value: "hasNextPage" },
                                            },
                                        ],
                                    },
                                },
                            ],
                        },
                    },
                ],
            },
        },
        {
            kind: "FragmentDefinition",
            name: { kind: "Name", value: "PlainTransaction" },
            typeCondition: { kind: "NamedType", name: { kind: "Name", value: "Transaction" } },
            selectionSet: {
                kind: "SelectionSet",
                selections: [
                    { kind: "Field", name: { kind: "Name", value: "id" } },
                    { kind: "Field", name: { kind: "Name", value: "amount" } },
                    { kind: "Field", name: { kind: "Name", value: "description" } },
                    { kind: "Field", name: { kind: "Name", value: "type" } },
                    { kind: "Field", name: { kind: "Name", value: "date" } },
                    { kind: "Field", name: { kind: "Name", value: "categoryId" } },
                    { kind: "Field", name: { kind: "Name", value: "fromAccountId" } },
                    { kind: "Field", name: { kind: "Name", value: "toAccountId" } },
                ],
            },
        },
        {
            kind: "FragmentDefinition",
            name: { kind: "Name", value: "PlainAccount" },
            typeCondition: { kind: "NamedType", name: { kind: "Name", value: "Account" } },
            selectionSet: {
                kind: "SelectionSet",
                selections: [
                    { kind: "Field", name: { kind: "Name", value: "id" } },
                    { kind: "Field", name: { kind: "Name", value: "name" } },
                    { kind: "Field", name: { kind: "Name", value: "balance" } },
                ],
            },
        },
        {
            kind: "FragmentDefinition",
            name: { kind: "Name", value: "PlainCategory" },
            typeCondition: { kind: "NamedType", name: { kind: "Name", value: "Category" } },
            selectionSet: {
                kind: "SelectionSet",
                selections: [
                    { kind: "Field", name: { kind: "Name", value: "id" } },
                    { kind: "Field", name: { kind: "Name", value: "name" } },
                ],
            },
        },
    ],
} as unknown as DocumentNode<
    GetTransactionsPageByAccountIdQuery,
    GetTransactionsPageByAccountIdQueryVariables
>;
export const UpdateTransactionDocument = {
    kind: "Document",
    definitions: [
        {
            kind: "OperationDefinition",
            operation: "mutation",
            name: { kind: "Name", value: "UpdateTransaction" },
            variableDefinitions: [
                {
                    kind: "VariableDefinition",
                    variable: { kind: "Variable", name: { kind: "Name", value: "id" } },
                    type: {
                        kind: "NonNullType",
                        type: { kind: "NamedType", name: { kind: "Name", value: "Int" } },
                    },
                },
                {
                    kind: "VariableDefinition",
                    variable: { kind: "Variable", name: { kind: "Name", value: "amount" } },
                    type: {
                        kind: "NonNullType",
                        type: { kind: "NamedType", name: { kind: "Name", value: "Float" } },
                    },
                },
                {
                    kind: "VariableDefinition",
                    variable: { kind: "Variable", name: { kind: "Name", value: "description" } },
                    type: {
                        kind: "NonNullType",
                        type: { kind: "NamedType", name: { kind: "Name", value: "String" } },
                    },
                },
                {
                    kind: "VariableDefinition",
                    variable: { kind: "Variable", name: { kind: "Name", value: "categoryId" } },
                    type: {
                        kind: "NonNullType",
                        type: { kind: "NamedType", name: { kind: "Name", value: "Int" } },
                    },
                },
                {
                    kind: "VariableDefinition",
                    variable: { kind: "Variable", name: { kind: "Name", value: "occurredAt" } },
                    type: {
                        kind: "NonNullType",
                        type: { kind: "NamedType", name: { kind: "Name", value: "Datetime" } },
                    },
                },
            ],
            selectionSet: {
                kind: "SelectionSet",
                selections: [
                    {
                        kind: "Field",
                        name: { kind: "Name", value: "updateTransaction" },
                        arguments: [
                            {
                                kind: "Argument",
                                name: { kind: "Name", value: "input" },
                                value: {
                                    kind: "ObjectValue",
                                    fields: [
                                        {
                                            kind: "ObjectField",
                                            name: { kind: "Name", value: "id" },
                                            value: {
                                                kind: "Variable",
                                                name: { kind: "Name", value: "id" },
                                            },
                                        },
                                        {
                                            kind: "ObjectField",
                                            name: { kind: "Name", value: "amount" },
                                            value: {
                                                kind: "Variable",
                                                name: { kind: "Name", value: "amount" },
                                            },
                                        },
                                        {
                                            kind: "ObjectField",
                                            name: { kind: "Name", value: "description" },
                                            value: {
                                                kind: "Variable",
                                                name: { kind: "Name", value: "description" },
                                            },
                                        },
                                        {
                                            kind: "ObjectField",
                                            name: { kind: "Name", value: "categoryId" },
                                            value: {
                                                kind: "Variable",
                                                name: { kind: "Name", value: "categoryId" },
                                            },
                                        },
                                        {
                                            kind: "ObjectField",
                                            name: { kind: "Name", value: "occurredAt" },
                                            value: {
                                                kind: "Variable",
                                                name: { kind: "Name", value: "occurredAt" },
                                            },
                                        },
                                    ],
                                },
                            },
                        ],
                        selectionSet: {
                            kind: "SelectionSet",
                            selections: [
                                {
                                    kind: "Field",
                                    name: { kind: "Name", value: "transaction" },
                                    selectionSet: {
                                        kind: "SelectionSet",
                                        selections: [
                                            {
                                                kind: "FragmentSpread",
                                                name: { kind: "Name", value: "PlainTransaction" },
                                            },
                                            {
                                                kind: "Field",
                                                name: { kind: "Name", value: "fromAccount" },
                                                selectionSet: {
                                                    kind: "SelectionSet",
                                                    selections: [
                                                        {
                                                            kind: "FragmentSpread",
                                                            name: {
                                                                kind: "Name",
                                                                value: "PlainAccount",
                                                            },
                                                        },
                                                    ],
                                                },
                                            },
                                            {
                                                kind: "Field",
                                                name: { kind: "Name", value: "toAccount" },
                                                selectionSet: {
                                                    kind: "SelectionSet",
                                                    selections: [
                                                        {
                                                            kind: "FragmentSpread",
                                                            name: {
                                                                kind: "Name",
                                                                value: "PlainAccount",
                                                            },
                                                        },
                                                    ],
                                                },
                                            },
                                            {
                                                kind: "Field",
                                                name: { kind: "Name", value: "category" },
                                                selectionSet: {
                                                    kind: "SelectionSet",
                                                    selections: [
                                                        {
                                                            kind: "FragmentSpread",
                                                            name: {
                                                                kind: "Name",
                                                                value: "PlainCategory",
                                                            },
                                                        },
                                                    ],
                                                },
                                            },
                                        ],
                                    },
                                },
                            ],
                        },
                    },
                ],
            },
        },
        {
            kind: "FragmentDefinition",
            name: { kind: "Name", value: "PlainTransaction" },
            typeCondition: { kind: "NamedType", name: { kind: "Name", value: "Transaction" } },
            selectionSet: {
                kind: "SelectionSet",
                selections: [
                    { kind: "Field", name: { kind: "Name", value: "id" } },
                    { kind: "Field", name: { kind: "Name", value: "amount" } },
                    { kind: "Field", name: { kind: "Name", value: "description" } },
                    { kind: "Field", name: { kind: "Name", value: "type" } },
                    { kind: "Field", name: { kind: "Name", value: "date" } },
                    { kind: "Field", name: { kind: "Name", value: "categoryId" } },
                    { kind: "Field", name: { kind: "Name", value: "fromAccountId" } },
                    { kind: "Field", name: { kind: "Name", value: "toAccountId" } },
                ],
            },
        },
        {
            kind: "FragmentDefinition",
            name: { kind: "Name", value: "PlainAccount" },
            typeCondition: { kind: "NamedType", name: { kind: "Name", value: "Account" } },
            selectionSet: {
                kind: "SelectionSet",
                selections: [
                    { kind: "Field", name: { kind: "Name", value: "id" } },
                    { kind: "Field", name: { kind: "Name", value: "name" } },
                    { kind: "Field", name: { kind: "Name", value: "balance" } },
                ],
            },
        },
        {
            kind: "FragmentDefinition",
            name: { kind: "Name", value: "PlainCategory" },
            typeCondition: { kind: "NamedType", name: { kind: "Name", value: "Category" } },
            selectionSet: {
                kind: "SelectionSet",
                selections: [
                    { kind: "Field", name: { kind: "Name", value: "id" } },
                    { kind: "Field", name: { kind: "Name", value: "name" } },
                ],
            },
        },
    ],
} as unknown as DocumentNode<UpdateTransactionMutation, UpdateTransactionMutationVariables>;
export const CurrentUserDocument = {
    kind: "Document",
    definitions: [
        {
            kind: "OperationDefinition",
            operation: "mutation",
            name: { kind: "Name", value: "CurrentUser" },
            selectionSet: {
                kind: "SelectionSet",
                selections: [
                    {
                        kind: "Field",
                        name: { kind: "Name", value: "currentUser" },
                        arguments: [
                            {
                                kind: "Argument",
                                name: { kind: "Name", value: "input" },
                                value: { kind: "ObjectValue", fields: [] },
                            },
                        ],
                        selectionSet: {
                            kind: "SelectionSet",
                            selections: [
                                {
                                    kind: "Field",
                                    name: { kind: "Name", value: "owner" },
                                    selectionSet: {
                                        kind: "SelectionSet",
                                        selections: [
                                            {
                                                kind: "Field",
                                                name: { kind: "Name", value: "accounts" },
                                                arguments: [
                                                    {
                                                        kind: "Argument",
                                                        name: { kind: "Name", value: "orderBy" },
                                                        value: {
                                                            kind: "ListValue",
                                                            values: [
                                                                {
                                                                    kind: "EnumValue",
                                                                    value: "NAME_ASC",
                                                                },
                                                            ],
                                                        },
                                                    },
                                                ],
                                                selectionSet: {
                                                    kind: "SelectionSet",
                                                    selections: [
                                                        {
                                                            kind: "Field",
                                                            name: { kind: "Name", value: "nodes" },
                                                            selectionSet: {
                                                                kind: "SelectionSet",
                                                                selections: [
                                                                    {
                                                                        kind: "Field",
                                                                        name: {
                                                                            kind: "Name",
                                                                            value: "id",
                                                                        },
                                                                    },
                                                                    {
                                                                        kind: "Field",
                                                                        name: {
                                                                            kind: "Name",
                                                                            value: "name",
                                                                        },
                                                                    },
                                                                    {
                                                                        kind: "Field",
                                                                        name: {
                                                                            kind: "Name",
                                                                            value: "balance",
                                                                        },
                                                                    },
                                                                ],
                                                            },
                                                        },
                                                    ],
                                                },
                                            },
                                            {
                                                kind: "Field",
                                                name: { kind: "Name", value: "categories" },
                                                arguments: [
                                                    {
                                                        kind: "Argument",
                                                        name: { kind: "Name", value: "orderBy" },
                                                        value: {
                                                            kind: "ListValue",
                                                            values: [
                                                                {
                                                                    kind: "EnumValue",
                                                                    value: "NAME_ASC",
                                                                },
                                                            ],
                                                        },
                                                    },
                                                ],
                                                selectionSet: {
                                                    kind: "SelectionSet",
                                                    selections: [
                                                        {
                                                            kind: "Field",
                                                            name: { kind: "Name", value: "nodes" },
                                                            selectionSet: {
                                                                kind: "SelectionSet",
                                                                selections: [
                                                                    {
                                                                        kind: "Field",
                                                                        name: {
                                                                            kind: "Name",
                                                                            value: "id",
                                                                        },
                                                                    },
                                                                    {
                                                                        kind: "Field",
                                                                        name: {
                                                                            kind: "Name",
                                                                            value: "name",
                                                                        },
                                                                    },
                                                                ],
                                                            },
                                                        },
                                                    ],
                                                },
                                            },
                                        ],
                                    },
                                },
                            ],
                        },
                    },
                ],
            },
        },
    ],
} as unknown as DocumentNode<CurrentUserMutation, CurrentUserMutationVariables>;
