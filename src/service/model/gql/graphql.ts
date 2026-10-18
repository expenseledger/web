/* eslint-disable */
/** Internal type. DO NOT USE DIRECTLY. */
type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
/** Internal type. DO NOT USE DIRECTLY. */
export type Incremental<T> =
    T | { [P in keyof T]?: P extends " $fragmentName" | "__typename" ? T[P] : never };
import { TypedDocumentNode as DocumentNode } from "@graphql-typed-document-node/core";
export type Currency = "EUR" | "JPY" | "THB" | "USD";

export type MoneyInput = {
    amount: number;
    currency: Currency;
};

export type PlainAccountFragment = {
    id: string;
    name: string;
    balance: { amount: number; currency: Currency };
};

export type GetAccountsPageQueryVariables = Exact<{
    first: number;
    after?: string | null | undefined;
}>;

export type GetAccountsPageQuery = {
    accounts: {
        edges: Array<{
            node: { id: string; name: string; balance: { amount: number; currency: Currency } };
        } | null>;
        pageInfo: { hasNextPage: boolean; endCursor: string | null };
    };
};

export type GetAccountByIdQueryVariables = Exact<{
    id: string | number;
}>;

export type GetAccountByIdQuery = {
    account: { id: string; name: string; balance: { amount: number; currency: Currency } };
};

export type CreateAccountMutationVariables = Exact<{
    name: string;
    balance: MoneyInput;
}>;

export type CreateAccountMutation = {
    createAccount: { id: string; name: string; balance: { amount: number; currency: Currency } };
};

export type PatchAccountMutationVariables = Exact<{
    id: string | number;
    name?: string | null | undefined;
    balance?: MoneyInput | null | undefined;
}>;

export type PatchAccountMutation = {
    patchAccount: { id: string; name: string; balance: { amount: number; currency: Currency } };
};

export type DeleteAccountMutationVariables = Exact<{
    id: string | number;
}>;

export type DeleteAccountMutation = { deleteAccount: string };

export type PlainCategoryFragment = { id: string; name: string };

export type CreateCategoryMutationVariables = Exact<{
    name: string;
}>;

export type CreateCategoryMutation = { createCategory: { id: string; name: string } };

export type PatchCategoryMutationVariables = Exact<{
    id: string | number;
    name?: string | null | undefined;
}>;

export type PatchCategoryMutation = { patchCategory: { id: string; name: string } };

export type DeleteCategoryMutationVariables = Exact<{
    id: string | number;
}>;

export type DeleteCategoryMutation = { deleteCategory: string };

export type GetCategoriesPageQueryVariables = Exact<{
    first: number;
    after?: string | null | undefined;
}>;

export type GetCategoriesPageQuery = {
    categories: {
        edges: Array<{ node: { id: string; name: string } } | null>;
        pageInfo: { hasNextPage: boolean; endCursor: string | null };
    };
};

type PlainTransaction_Expense_Fragment = {
    __typename: "Expense";
    id: string;
    description: string | null;
    occurredAt: string;
    from: { id: string; name: string; balance: { amount: number; currency: Currency } };
    amount: { amount: number; currency: Currency };
    category: { id: string; name: string } | null;
};

type PlainTransaction_Income_Fragment = {
    __typename: "Income";
    id: string;
    description: string | null;
    occurredAt: string;
    to: { id: string; name: string; balance: { amount: number; currency: Currency } };
    amount: { amount: number; currency: Currency };
    category: { id: string; name: string } | null;
};

type PlainTransaction_Transfer_Fragment = {
    __typename: "Transfer";
    id: string;
    description: string | null;
    occurredAt: string;
    from: { id: string; name: string; balance: { amount: number; currency: Currency } };
    to: { id: string; name: string; balance: { amount: number; currency: Currency } };
    convertedAmount: { amount: number; currency: Currency } | null;
    amount: { amount: number; currency: Currency };
    category: { id: string; name: string } | null;
};

export type PlainTransactionFragment =
    | PlainTransaction_Expense_Fragment
    | PlainTransaction_Income_Fragment
    | PlainTransaction_Transfer_Fragment;

export type AddExpenseMutationVariables = Exact<{
    amount: MoneyInput;
    description?: string | null | undefined;
    categoryId?: string | number | null | undefined;
    fromAccountId: string | number;
    occurredAt?: string | null | undefined;
}>;

export type AddExpenseMutation = {
    withdraw: {
        __typename: "Expense";
        id: string;
        description: string | null;
        occurredAt: string;
        from: { id: string; name: string; balance: { amount: number; currency: Currency } };
        amount: { amount: number; currency: Currency };
        category: { id: string; name: string } | null;
    };
};

export type AddIncomeMutationVariables = Exact<{
    amount: MoneyInput;
    description?: string | null | undefined;
    categoryId?: string | number | null | undefined;
    toAccountId: string | number;
    occurredAt?: string | null | undefined;
}>;

export type AddIncomeMutation = {
    deposit: {
        __typename: "Income";
        id: string;
        description: string | null;
        occurredAt: string;
        to: { id: string; name: string; balance: { amount: number; currency: Currency } };
        amount: { amount: number; currency: Currency };
        category: { id: string; name: string } | null;
    };
};

export type AddTransferMutationVariables = Exact<{
    amount: MoneyInput;
    convertedAmount?: MoneyInput | null | undefined;
    description?: string | null | undefined;
    categoryId?: string | number | null | undefined;
    fromAccountId: string | number;
    toAccountId: string | number;
    occurredAt?: string | null | undefined;
}>;

export type AddTransferMutation = {
    transfer: {
        __typename: "Transfer";
        id: string;
        description: string | null;
        occurredAt: string;
        from: { id: string; name: string; balance: { amount: number; currency: Currency } };
        to: { id: string; name: string; balance: { amount: number; currency: Currency } };
        convertedAmount: { amount: number; currency: Currency } | null;
        amount: { amount: number; currency: Currency };
        category: { id: string; name: string } | null;
    } | null;
};

export type DeleteTransactionMutationVariables = Exact<{
    transactionId: string | number;
}>;

export type DeleteTransactionMutation = { deleteTransaction: string };

export type GetTransactionsPageQueryVariables = Exact<{
    first: number;
    after?: string | null | undefined;
    accountId?: string | number | null | undefined;
    fromDate?: string | null | undefined;
    toDate?: string | null | undefined;
}>;

export type GetTransactionsPageQuery = {
    transactions: {
        edges: Array<{
            node:
                | {
                      __typename: "Expense";
                      id: string;
                      description: string | null;
                      occurredAt: string;
                      from: {
                          id: string;
                          name: string;
                          balance: { amount: number; currency: Currency };
                      };
                      amount: { amount: number; currency: Currency };
                      category: { id: string; name: string } | null;
                  }
                | {
                      __typename: "Income";
                      id: string;
                      description: string | null;
                      occurredAt: string;
                      to: {
                          id: string;
                          name: string;
                          balance: { amount: number; currency: Currency };
                      };
                      amount: { amount: number; currency: Currency };
                      category: { id: string; name: string } | null;
                  }
                | {
                      __typename: "Transfer";
                      id: string;
                      description: string | null;
                      occurredAt: string;
                      from: {
                          id: string;
                          name: string;
                          balance: { amount: number; currency: Currency };
                      };
                      to: {
                          id: string;
                          name: string;
                          balance: { amount: number; currency: Currency };
                      };
                      convertedAmount: { amount: number; currency: Currency } | null;
                      amount: { amount: number; currency: Currency };
                      category: { id: string; name: string } | null;
                  };
        } | null>;
        pageInfo: { hasNextPage: boolean; endCursor: string | null };
    };
};

export type PatchExpenseMutationVariables = Exact<{
    id: string | number;
    amount?: MoneyInput | null | undefined;
    categoryId?: string | number | null | undefined;
    description?: string | null | undefined;
    occurredAt?: string | null | undefined;
}>;

export type PatchExpenseMutation = {
    patchExpense: {
        __typename: "Expense";
        id: string;
        description: string | null;
        occurredAt: string;
        from: { id: string; name: string; balance: { amount: number; currency: Currency } };
        amount: { amount: number; currency: Currency };
        category: { id: string; name: string } | null;
    };
};

export type PatchIncomeMutationVariables = Exact<{
    id: string | number;
    amount?: MoneyInput | null | undefined;
    categoryId?: string | number | null | undefined;
    description?: string | null | undefined;
    occurredAt?: string | null | undefined;
}>;

export type PatchIncomeMutation = {
    patchIncome: {
        __typename: "Income";
        id: string;
        description: string | null;
        occurredAt: string;
        to: { id: string; name: string; balance: { amount: number; currency: Currency } };
        amount: { amount: number; currency: Currency };
        category: { id: string; name: string } | null;
    };
};

export type PatchTransferMutationVariables = Exact<{
    id: string | number;
    amount?: MoneyInput | null | undefined;
    convertedAmount?: MoneyInput | null | undefined;
    categoryId?: string | number | null | undefined;
    description?: string | null | undefined;
    occurredAt?: string | null | undefined;
}>;

export type PatchTransferMutation = {
    patchTransfer: {
        __typename: "Transfer";
        id: string;
        description: string | null;
        occurredAt: string;
        from: { id: string; name: string; balance: { amount: number; currency: Currency } };
        to: { id: string; name: string; balance: { amount: number; currency: Currency } };
        convertedAmount: { amount: number; currency: Currency } | null;
        amount: { amount: number; currency: Currency };
        category: { id: string; name: string } | null;
    };
};

export type InitializeUserMutationVariables = Exact<{ [key: string]: never }>;

export type InitializeUserMutation = { initializeUser: boolean | null };

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
                    {
                        kind: "Field",
                        name: { kind: "Name", value: "balance" },
                        selectionSet: {
                            kind: "SelectionSet",
                            selections: [
                                { kind: "Field", name: { kind: "Name", value: "amount" } },
                                { kind: "Field", name: { kind: "Name", value: "currency" } },
                            ],
                        },
                    },
                ],
            },
        },
    ],
} as unknown as DocumentNode<PlainAccountFragment, unknown>;
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
                    { kind: "Field", name: { kind: "Name", value: "__typename" } },
                    { kind: "Field", name: { kind: "Name", value: "id" } },
                    {
                        kind: "Field",
                        name: { kind: "Name", value: "amount" },
                        selectionSet: {
                            kind: "SelectionSet",
                            selections: [
                                { kind: "Field", name: { kind: "Name", value: "amount" } },
                                { kind: "Field", name: { kind: "Name", value: "currency" } },
                            ],
                        },
                    },
                    { kind: "Field", name: { kind: "Name", value: "description" } },
                    { kind: "Field", name: { kind: "Name", value: "occurredAt" } },
                    {
                        kind: "Field",
                        name: { kind: "Name", value: "category" },
                        selectionSet: {
                            kind: "SelectionSet",
                            selections: [
                                {
                                    kind: "FragmentSpread",
                                    name: { kind: "Name", value: "PlainCategory" },
                                },
                            ],
                        },
                    },
                    {
                        kind: "InlineFragment",
                        typeCondition: {
                            kind: "NamedType",
                            name: { kind: "Name", value: "Expense" },
                        },
                        selectionSet: {
                            kind: "SelectionSet",
                            selections: [
                                {
                                    kind: "Field",
                                    name: { kind: "Name", value: "from" },
                                    selectionSet: {
                                        kind: "SelectionSet",
                                        selections: [
                                            {
                                                kind: "FragmentSpread",
                                                name: { kind: "Name", value: "PlainAccount" },
                                            },
                                        ],
                                    },
                                },
                            ],
                        },
                    },
                    {
                        kind: "InlineFragment",
                        typeCondition: {
                            kind: "NamedType",
                            name: { kind: "Name", value: "Income" },
                        },
                        selectionSet: {
                            kind: "SelectionSet",
                            selections: [
                                {
                                    kind: "Field",
                                    name: { kind: "Name", value: "to" },
                                    selectionSet: {
                                        kind: "SelectionSet",
                                        selections: [
                                            {
                                                kind: "FragmentSpread",
                                                name: { kind: "Name", value: "PlainAccount" },
                                            },
                                        ],
                                    },
                                },
                            ],
                        },
                    },
                    {
                        kind: "InlineFragment",
                        typeCondition: {
                            kind: "NamedType",
                            name: { kind: "Name", value: "Transfer" },
                        },
                        selectionSet: {
                            kind: "SelectionSet",
                            selections: [
                                {
                                    kind: "Field",
                                    name: { kind: "Name", value: "from" },
                                    selectionSet: {
                                        kind: "SelectionSet",
                                        selections: [
                                            {
                                                kind: "FragmentSpread",
                                                name: { kind: "Name", value: "PlainAccount" },
                                            },
                                        ],
                                    },
                                },
                                {
                                    kind: "Field",
                                    name: { kind: "Name", value: "to" },
                                    selectionSet: {
                                        kind: "SelectionSet",
                                        selections: [
                                            {
                                                kind: "FragmentSpread",
                                                name: { kind: "Name", value: "PlainAccount" },
                                            },
                                        ],
                                    },
                                },
                                {
                                    kind: "Field",
                                    name: { kind: "Name", value: "convertedAmount" },
                                    selectionSet: {
                                        kind: "SelectionSet",
                                        selections: [
                                            {
                                                kind: "Field",
                                                name: { kind: "Name", value: "amount" },
                                            },
                                            {
                                                kind: "Field",
                                                name: { kind: "Name", value: "currency" },
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
        {
            kind: "FragmentDefinition",
            name: { kind: "Name", value: "PlainAccount" },
            typeCondition: { kind: "NamedType", name: { kind: "Name", value: "Account" } },
            selectionSet: {
                kind: "SelectionSet",
                selections: [
                    { kind: "Field", name: { kind: "Name", value: "id" } },
                    { kind: "Field", name: { kind: "Name", value: "name" } },
                    {
                        kind: "Field",
                        name: { kind: "Name", value: "balance" },
                        selectionSet: {
                            kind: "SelectionSet",
                            selections: [
                                { kind: "Field", name: { kind: "Name", value: "amount" } },
                                { kind: "Field", name: { kind: "Name", value: "currency" } },
                            ],
                        },
                    },
                ],
            },
        },
    ],
} as unknown as DocumentNode<PlainTransactionFragment, unknown>;
export const GetAccountsPageDocument = {
    kind: "Document",
    definitions: [
        {
            kind: "OperationDefinition",
            operation: "query",
            name: { kind: "Name", value: "GetAccountsPage" },
            variableDefinitions: [
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
                    type: { kind: "NamedType", name: { kind: "Name", value: "String" } },
                },
            ],
            selectionSet: {
                kind: "SelectionSet",
                selections: [
                    {
                        kind: "Field",
                        name: { kind: "Name", value: "accounts" },
                        arguments: [
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
                            {
                                kind: "Argument",
                                name: { kind: "Name", value: "sort" },
                                value: {
                                    kind: "ListValue",
                                    values: [
                                        {
                                            kind: "ObjectValue",
                                            fields: [
                                                {
                                                    kind: "ObjectField",
                                                    name: { kind: "Name", value: "property" },
                                                    value: {
                                                        kind: "StringValue",
                                                        value: "name",
                                                        block: false,
                                                    },
                                                },
                                                {
                                                    kind: "ObjectField",
                                                    name: { kind: "Name", value: "direction" },
                                                    value: { kind: "EnumValue", value: "ASC" },
                                                },
                                            ],
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
                                    name: { kind: "Name", value: "edges" },
                                    selectionSet: {
                                        kind: "SelectionSet",
                                        selections: [
                                            {
                                                kind: "Field",
                                                name: { kind: "Name", value: "node" },
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
                                                name: { kind: "Name", value: "hasNextPage" },
                                            },
                                            {
                                                kind: "Field",
                                                name: { kind: "Name", value: "endCursor" },
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
            name: { kind: "Name", value: "PlainAccount" },
            typeCondition: { kind: "NamedType", name: { kind: "Name", value: "Account" } },
            selectionSet: {
                kind: "SelectionSet",
                selections: [
                    { kind: "Field", name: { kind: "Name", value: "id" } },
                    { kind: "Field", name: { kind: "Name", value: "name" } },
                    {
                        kind: "Field",
                        name: { kind: "Name", value: "balance" },
                        selectionSet: {
                            kind: "SelectionSet",
                            selections: [
                                { kind: "Field", name: { kind: "Name", value: "amount" } },
                                { kind: "Field", name: { kind: "Name", value: "currency" } },
                            ],
                        },
                    },
                ],
            },
        },
    ],
} as unknown as DocumentNode<GetAccountsPageQuery, GetAccountsPageQueryVariables>;
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
                        type: { kind: "NamedType", name: { kind: "Name", value: "ID" } },
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
                                {
                                    kind: "FragmentSpread",
                                    name: { kind: "Name", value: "PlainAccount" },
                                },
                            ],
                        },
                    },
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
                    {
                        kind: "Field",
                        name: { kind: "Name", value: "balance" },
                        selectionSet: {
                            kind: "SelectionSet",
                            selections: [
                                { kind: "Field", name: { kind: "Name", value: "amount" } },
                                { kind: "Field", name: { kind: "Name", value: "currency" } },
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
                {
                    kind: "VariableDefinition",
                    variable: { kind: "Variable", name: { kind: "Name", value: "balance" } },
                    type: {
                        kind: "NonNullType",
                        type: { kind: "NamedType", name: { kind: "Name", value: "MoneyInput" } },
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
                                name: { kind: "Name", value: "name" },
                                value: { kind: "Variable", name: { kind: "Name", value: "name" } },
                            },
                            {
                                kind: "Argument",
                                name: { kind: "Name", value: "balance" },
                                value: {
                                    kind: "Variable",
                                    name: { kind: "Name", value: "balance" },
                                },
                            },
                        ],
                        selectionSet: {
                            kind: "SelectionSet",
                            selections: [
                                {
                                    kind: "FragmentSpread",
                                    name: { kind: "Name", value: "PlainAccount" },
                                },
                            ],
                        },
                    },
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
                    {
                        kind: "Field",
                        name: { kind: "Name", value: "balance" },
                        selectionSet: {
                            kind: "SelectionSet",
                            selections: [
                                { kind: "Field", name: { kind: "Name", value: "amount" } },
                                { kind: "Field", name: { kind: "Name", value: "currency" } },
                            ],
                        },
                    },
                ],
            },
        },
    ],
} as unknown as DocumentNode<CreateAccountMutation, CreateAccountMutationVariables>;
export const PatchAccountDocument = {
    kind: "Document",
    definitions: [
        {
            kind: "OperationDefinition",
            operation: "mutation",
            name: { kind: "Name", value: "PatchAccount" },
            variableDefinitions: [
                {
                    kind: "VariableDefinition",
                    variable: { kind: "Variable", name: { kind: "Name", value: "id" } },
                    type: {
                        kind: "NonNullType",
                        type: { kind: "NamedType", name: { kind: "Name", value: "ID" } },
                    },
                },
                {
                    kind: "VariableDefinition",
                    variable: { kind: "Variable", name: { kind: "Name", value: "name" } },
                    type: { kind: "NamedType", name: { kind: "Name", value: "String" } },
                },
                {
                    kind: "VariableDefinition",
                    variable: { kind: "Variable", name: { kind: "Name", value: "balance" } },
                    type: { kind: "NamedType", name: { kind: "Name", value: "MoneyInput" } },
                },
            ],
            selectionSet: {
                kind: "SelectionSet",
                selections: [
                    {
                        kind: "Field",
                        name: { kind: "Name", value: "patchAccount" },
                        arguments: [
                            {
                                kind: "Argument",
                                name: { kind: "Name", value: "id" },
                                value: { kind: "Variable", name: { kind: "Name", value: "id" } },
                            },
                            {
                                kind: "Argument",
                                name: { kind: "Name", value: "name" },
                                value: { kind: "Variable", name: { kind: "Name", value: "name" } },
                            },
                            {
                                kind: "Argument",
                                name: { kind: "Name", value: "balance" },
                                value: {
                                    kind: "Variable",
                                    name: { kind: "Name", value: "balance" },
                                },
                            },
                        ],
                        selectionSet: {
                            kind: "SelectionSet",
                            selections: [
                                {
                                    kind: "FragmentSpread",
                                    name: { kind: "Name", value: "PlainAccount" },
                                },
                            ],
                        },
                    },
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
                    {
                        kind: "Field",
                        name: { kind: "Name", value: "balance" },
                        selectionSet: {
                            kind: "SelectionSet",
                            selections: [
                                { kind: "Field", name: { kind: "Name", value: "amount" } },
                                { kind: "Field", name: { kind: "Name", value: "currency" } },
                            ],
                        },
                    },
                ],
            },
        },
    ],
} as unknown as DocumentNode<PatchAccountMutation, PatchAccountMutationVariables>;
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
                        type: { kind: "NamedType", name: { kind: "Name", value: "ID" } },
                    },
                },
            ],
            selectionSet: {
                kind: "SelectionSet",
                selections: [
                    {
                        kind: "Field",
                        name: { kind: "Name", value: "deleteAccount" },
                        arguments: [
                            {
                                kind: "Argument",
                                name: { kind: "Name", value: "id" },
                                value: { kind: "Variable", name: { kind: "Name", value: "id" } },
                            },
                        ],
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
                        name: { kind: "Name", value: "createCategory" },
                        arguments: [
                            {
                                kind: "Argument",
                                name: { kind: "Name", value: "name" },
                                value: { kind: "Variable", name: { kind: "Name", value: "name" } },
                            },
                        ],
                        selectionSet: {
                            kind: "SelectionSet",
                            selections: [
                                {
                                    kind: "FragmentSpread",
                                    name: { kind: "Name", value: "PlainCategory" },
                                },
                            ],
                        },
                    },
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
} as unknown as DocumentNode<CreateCategoryMutation, CreateCategoryMutationVariables>;
export const PatchCategoryDocument = {
    kind: "Document",
    definitions: [
        {
            kind: "OperationDefinition",
            operation: "mutation",
            name: { kind: "Name", value: "PatchCategory" },
            variableDefinitions: [
                {
                    kind: "VariableDefinition",
                    variable: { kind: "Variable", name: { kind: "Name", value: "id" } },
                    type: {
                        kind: "NonNullType",
                        type: { kind: "NamedType", name: { kind: "Name", value: "ID" } },
                    },
                },
                {
                    kind: "VariableDefinition",
                    variable: { kind: "Variable", name: { kind: "Name", value: "name" } },
                    type: { kind: "NamedType", name: { kind: "Name", value: "String" } },
                },
            ],
            selectionSet: {
                kind: "SelectionSet",
                selections: [
                    {
                        kind: "Field",
                        name: { kind: "Name", value: "patchCategory" },
                        arguments: [
                            {
                                kind: "Argument",
                                name: { kind: "Name", value: "id" },
                                value: { kind: "Variable", name: { kind: "Name", value: "id" } },
                            },
                            {
                                kind: "Argument",
                                name: { kind: "Name", value: "name" },
                                value: { kind: "Variable", name: { kind: "Name", value: "name" } },
                            },
                        ],
                        selectionSet: {
                            kind: "SelectionSet",
                            selections: [
                                {
                                    kind: "FragmentSpread",
                                    name: { kind: "Name", value: "PlainCategory" },
                                },
                            ],
                        },
                    },
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
} as unknown as DocumentNode<PatchCategoryMutation, PatchCategoryMutationVariables>;
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
                        type: { kind: "NamedType", name: { kind: "Name", value: "ID" } },
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
                                name: { kind: "Name", value: "id" },
                                value: { kind: "Variable", name: { kind: "Name", value: "id" } },
                            },
                        ],
                    },
                ],
            },
        },
    ],
} as unknown as DocumentNode<DeleteCategoryMutation, DeleteCategoryMutationVariables>;
export const GetCategoriesPageDocument = {
    kind: "Document",
    definitions: [
        {
            kind: "OperationDefinition",
            operation: "query",
            name: { kind: "Name", value: "GetCategoriesPage" },
            variableDefinitions: [
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
                    type: { kind: "NamedType", name: { kind: "Name", value: "String" } },
                },
            ],
            selectionSet: {
                kind: "SelectionSet",
                selections: [
                    {
                        kind: "Field",
                        name: { kind: "Name", value: "categories" },
                        arguments: [
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
                            {
                                kind: "Argument",
                                name: { kind: "Name", value: "sort" },
                                value: {
                                    kind: "ListValue",
                                    values: [
                                        {
                                            kind: "ObjectValue",
                                            fields: [
                                                {
                                                    kind: "ObjectField",
                                                    name: { kind: "Name", value: "property" },
                                                    value: {
                                                        kind: "StringValue",
                                                        value: "name",
                                                        block: false,
                                                    },
                                                },
                                                {
                                                    kind: "ObjectField",
                                                    name: { kind: "Name", value: "direction" },
                                                    value: { kind: "EnumValue", value: "ASC" },
                                                },
                                            ],
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
                                    name: { kind: "Name", value: "edges" },
                                    selectionSet: {
                                        kind: "SelectionSet",
                                        selections: [
                                            {
                                                kind: "Field",
                                                name: { kind: "Name", value: "node" },
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
                                                name: { kind: "Name", value: "hasNextPage" },
                                            },
                                            {
                                                kind: "Field",
                                                name: { kind: "Name", value: "endCursor" },
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
} as unknown as DocumentNode<GetCategoriesPageQuery, GetCategoriesPageQueryVariables>;
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
                        type: { kind: "NamedType", name: { kind: "Name", value: "MoneyInput" } },
                    },
                },
                {
                    kind: "VariableDefinition",
                    variable: { kind: "Variable", name: { kind: "Name", value: "description" } },
                    type: { kind: "NamedType", name: { kind: "Name", value: "String" } },
                },
                {
                    kind: "VariableDefinition",
                    variable: { kind: "Variable", name: { kind: "Name", value: "categoryId" } },
                    type: { kind: "NamedType", name: { kind: "Name", value: "ID" } },
                },
                {
                    kind: "VariableDefinition",
                    variable: { kind: "Variable", name: { kind: "Name", value: "fromAccountId" } },
                    type: {
                        kind: "NonNullType",
                        type: { kind: "NamedType", name: { kind: "Name", value: "ID" } },
                    },
                },
                {
                    kind: "VariableDefinition",
                    variable: { kind: "Variable", name: { kind: "Name", value: "occurredAt" } },
                    type: { kind: "NamedType", name: { kind: "Name", value: "String" } },
                },
            ],
            selectionSet: {
                kind: "SelectionSet",
                selections: [
                    {
                        kind: "Field",
                        name: { kind: "Name", value: "withdraw" },
                        arguments: [
                            {
                                kind: "Argument",
                                name: { kind: "Name", value: "amount" },
                                value: {
                                    kind: "Variable",
                                    name: { kind: "Name", value: "amount" },
                                },
                            },
                            {
                                kind: "Argument",
                                name: { kind: "Name", value: "description" },
                                value: {
                                    kind: "Variable",
                                    name: { kind: "Name", value: "description" },
                                },
                            },
                            {
                                kind: "Argument",
                                name: { kind: "Name", value: "categoryId" },
                                value: {
                                    kind: "Variable",
                                    name: { kind: "Name", value: "categoryId" },
                                },
                            },
                            {
                                kind: "Argument",
                                name: { kind: "Name", value: "fromAccountId" },
                                value: {
                                    kind: "Variable",
                                    name: { kind: "Name", value: "fromAccountId" },
                                },
                            },
                            {
                                kind: "Argument",
                                name: { kind: "Name", value: "occurredAt" },
                                value: {
                                    kind: "Variable",
                                    name: { kind: "Name", value: "occurredAt" },
                                },
                            },
                        ],
                        selectionSet: {
                            kind: "SelectionSet",
                            selections: [
                                {
                                    kind: "FragmentSpread",
                                    name: { kind: "Name", value: "PlainTransaction" },
                                },
                            ],
                        },
                    },
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
        {
            kind: "FragmentDefinition",
            name: { kind: "Name", value: "PlainAccount" },
            typeCondition: { kind: "NamedType", name: { kind: "Name", value: "Account" } },
            selectionSet: {
                kind: "SelectionSet",
                selections: [
                    { kind: "Field", name: { kind: "Name", value: "id" } },
                    { kind: "Field", name: { kind: "Name", value: "name" } },
                    {
                        kind: "Field",
                        name: { kind: "Name", value: "balance" },
                        selectionSet: {
                            kind: "SelectionSet",
                            selections: [
                                { kind: "Field", name: { kind: "Name", value: "amount" } },
                                { kind: "Field", name: { kind: "Name", value: "currency" } },
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
                    { kind: "Field", name: { kind: "Name", value: "__typename" } },
                    { kind: "Field", name: { kind: "Name", value: "id" } },
                    {
                        kind: "Field",
                        name: { kind: "Name", value: "amount" },
                        selectionSet: {
                            kind: "SelectionSet",
                            selections: [
                                { kind: "Field", name: { kind: "Name", value: "amount" } },
                                { kind: "Field", name: { kind: "Name", value: "currency" } },
                            ],
                        },
                    },
                    { kind: "Field", name: { kind: "Name", value: "description" } },
                    { kind: "Field", name: { kind: "Name", value: "occurredAt" } },
                    {
                        kind: "Field",
                        name: { kind: "Name", value: "category" },
                        selectionSet: {
                            kind: "SelectionSet",
                            selections: [
                                {
                                    kind: "FragmentSpread",
                                    name: { kind: "Name", value: "PlainCategory" },
                                },
                            ],
                        },
                    },
                    {
                        kind: "InlineFragment",
                        typeCondition: {
                            kind: "NamedType",
                            name: { kind: "Name", value: "Expense" },
                        },
                        selectionSet: {
                            kind: "SelectionSet",
                            selections: [
                                {
                                    kind: "Field",
                                    name: { kind: "Name", value: "from" },
                                    selectionSet: {
                                        kind: "SelectionSet",
                                        selections: [
                                            {
                                                kind: "FragmentSpread",
                                                name: { kind: "Name", value: "PlainAccount" },
                                            },
                                        ],
                                    },
                                },
                            ],
                        },
                    },
                    {
                        kind: "InlineFragment",
                        typeCondition: {
                            kind: "NamedType",
                            name: { kind: "Name", value: "Income" },
                        },
                        selectionSet: {
                            kind: "SelectionSet",
                            selections: [
                                {
                                    kind: "Field",
                                    name: { kind: "Name", value: "to" },
                                    selectionSet: {
                                        kind: "SelectionSet",
                                        selections: [
                                            {
                                                kind: "FragmentSpread",
                                                name: { kind: "Name", value: "PlainAccount" },
                                            },
                                        ],
                                    },
                                },
                            ],
                        },
                    },
                    {
                        kind: "InlineFragment",
                        typeCondition: {
                            kind: "NamedType",
                            name: { kind: "Name", value: "Transfer" },
                        },
                        selectionSet: {
                            kind: "SelectionSet",
                            selections: [
                                {
                                    kind: "Field",
                                    name: { kind: "Name", value: "from" },
                                    selectionSet: {
                                        kind: "SelectionSet",
                                        selections: [
                                            {
                                                kind: "FragmentSpread",
                                                name: { kind: "Name", value: "PlainAccount" },
                                            },
                                        ],
                                    },
                                },
                                {
                                    kind: "Field",
                                    name: { kind: "Name", value: "to" },
                                    selectionSet: {
                                        kind: "SelectionSet",
                                        selections: [
                                            {
                                                kind: "FragmentSpread",
                                                name: { kind: "Name", value: "PlainAccount" },
                                            },
                                        ],
                                    },
                                },
                                {
                                    kind: "Field",
                                    name: { kind: "Name", value: "convertedAmount" },
                                    selectionSet: {
                                        kind: "SelectionSet",
                                        selections: [
                                            {
                                                kind: "Field",
                                                name: { kind: "Name", value: "amount" },
                                            },
                                            {
                                                kind: "Field",
                                                name: { kind: "Name", value: "currency" },
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
                        type: { kind: "NamedType", name: { kind: "Name", value: "MoneyInput" } },
                    },
                },
                {
                    kind: "VariableDefinition",
                    variable: { kind: "Variable", name: { kind: "Name", value: "description" } },
                    type: { kind: "NamedType", name: { kind: "Name", value: "String" } },
                },
                {
                    kind: "VariableDefinition",
                    variable: { kind: "Variable", name: { kind: "Name", value: "categoryId" } },
                    type: { kind: "NamedType", name: { kind: "Name", value: "ID" } },
                },
                {
                    kind: "VariableDefinition",
                    variable: { kind: "Variable", name: { kind: "Name", value: "toAccountId" } },
                    type: {
                        kind: "NonNullType",
                        type: { kind: "NamedType", name: { kind: "Name", value: "ID" } },
                    },
                },
                {
                    kind: "VariableDefinition",
                    variable: { kind: "Variable", name: { kind: "Name", value: "occurredAt" } },
                    type: { kind: "NamedType", name: { kind: "Name", value: "String" } },
                },
            ],
            selectionSet: {
                kind: "SelectionSet",
                selections: [
                    {
                        kind: "Field",
                        name: { kind: "Name", value: "deposit" },
                        arguments: [
                            {
                                kind: "Argument",
                                name: { kind: "Name", value: "amount" },
                                value: {
                                    kind: "Variable",
                                    name: { kind: "Name", value: "amount" },
                                },
                            },
                            {
                                kind: "Argument",
                                name: { kind: "Name", value: "description" },
                                value: {
                                    kind: "Variable",
                                    name: { kind: "Name", value: "description" },
                                },
                            },
                            {
                                kind: "Argument",
                                name: { kind: "Name", value: "categoryId" },
                                value: {
                                    kind: "Variable",
                                    name: { kind: "Name", value: "categoryId" },
                                },
                            },
                            {
                                kind: "Argument",
                                name: { kind: "Name", value: "toAccountId" },
                                value: {
                                    kind: "Variable",
                                    name: { kind: "Name", value: "toAccountId" },
                                },
                            },
                            {
                                kind: "Argument",
                                name: { kind: "Name", value: "occurredAt" },
                                value: {
                                    kind: "Variable",
                                    name: { kind: "Name", value: "occurredAt" },
                                },
                            },
                        ],
                        selectionSet: {
                            kind: "SelectionSet",
                            selections: [
                                {
                                    kind: "FragmentSpread",
                                    name: { kind: "Name", value: "PlainTransaction" },
                                },
                            ],
                        },
                    },
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
        {
            kind: "FragmentDefinition",
            name: { kind: "Name", value: "PlainAccount" },
            typeCondition: { kind: "NamedType", name: { kind: "Name", value: "Account" } },
            selectionSet: {
                kind: "SelectionSet",
                selections: [
                    { kind: "Field", name: { kind: "Name", value: "id" } },
                    { kind: "Field", name: { kind: "Name", value: "name" } },
                    {
                        kind: "Field",
                        name: { kind: "Name", value: "balance" },
                        selectionSet: {
                            kind: "SelectionSet",
                            selections: [
                                { kind: "Field", name: { kind: "Name", value: "amount" } },
                                { kind: "Field", name: { kind: "Name", value: "currency" } },
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
                    { kind: "Field", name: { kind: "Name", value: "__typename" } },
                    { kind: "Field", name: { kind: "Name", value: "id" } },
                    {
                        kind: "Field",
                        name: { kind: "Name", value: "amount" },
                        selectionSet: {
                            kind: "SelectionSet",
                            selections: [
                                { kind: "Field", name: { kind: "Name", value: "amount" } },
                                { kind: "Field", name: { kind: "Name", value: "currency" } },
                            ],
                        },
                    },
                    { kind: "Field", name: { kind: "Name", value: "description" } },
                    { kind: "Field", name: { kind: "Name", value: "occurredAt" } },
                    {
                        kind: "Field",
                        name: { kind: "Name", value: "category" },
                        selectionSet: {
                            kind: "SelectionSet",
                            selections: [
                                {
                                    kind: "FragmentSpread",
                                    name: { kind: "Name", value: "PlainCategory" },
                                },
                            ],
                        },
                    },
                    {
                        kind: "InlineFragment",
                        typeCondition: {
                            kind: "NamedType",
                            name: { kind: "Name", value: "Expense" },
                        },
                        selectionSet: {
                            kind: "SelectionSet",
                            selections: [
                                {
                                    kind: "Field",
                                    name: { kind: "Name", value: "from" },
                                    selectionSet: {
                                        kind: "SelectionSet",
                                        selections: [
                                            {
                                                kind: "FragmentSpread",
                                                name: { kind: "Name", value: "PlainAccount" },
                                            },
                                        ],
                                    },
                                },
                            ],
                        },
                    },
                    {
                        kind: "InlineFragment",
                        typeCondition: {
                            kind: "NamedType",
                            name: { kind: "Name", value: "Income" },
                        },
                        selectionSet: {
                            kind: "SelectionSet",
                            selections: [
                                {
                                    kind: "Field",
                                    name: { kind: "Name", value: "to" },
                                    selectionSet: {
                                        kind: "SelectionSet",
                                        selections: [
                                            {
                                                kind: "FragmentSpread",
                                                name: { kind: "Name", value: "PlainAccount" },
                                            },
                                        ],
                                    },
                                },
                            ],
                        },
                    },
                    {
                        kind: "InlineFragment",
                        typeCondition: {
                            kind: "NamedType",
                            name: { kind: "Name", value: "Transfer" },
                        },
                        selectionSet: {
                            kind: "SelectionSet",
                            selections: [
                                {
                                    kind: "Field",
                                    name: { kind: "Name", value: "from" },
                                    selectionSet: {
                                        kind: "SelectionSet",
                                        selections: [
                                            {
                                                kind: "FragmentSpread",
                                                name: { kind: "Name", value: "PlainAccount" },
                                            },
                                        ],
                                    },
                                },
                                {
                                    kind: "Field",
                                    name: { kind: "Name", value: "to" },
                                    selectionSet: {
                                        kind: "SelectionSet",
                                        selections: [
                                            {
                                                kind: "FragmentSpread",
                                                name: { kind: "Name", value: "PlainAccount" },
                                            },
                                        ],
                                    },
                                },
                                {
                                    kind: "Field",
                                    name: { kind: "Name", value: "convertedAmount" },
                                    selectionSet: {
                                        kind: "SelectionSet",
                                        selections: [
                                            {
                                                kind: "Field",
                                                name: { kind: "Name", value: "amount" },
                                            },
                                            {
                                                kind: "Field",
                                                name: { kind: "Name", value: "currency" },
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
                        type: { kind: "NamedType", name: { kind: "Name", value: "MoneyInput" } },
                    },
                },
                {
                    kind: "VariableDefinition",
                    variable: {
                        kind: "Variable",
                        name: { kind: "Name", value: "convertedAmount" },
                    },
                    type: { kind: "NamedType", name: { kind: "Name", value: "MoneyInput" } },
                },
                {
                    kind: "VariableDefinition",
                    variable: { kind: "Variable", name: { kind: "Name", value: "description" } },
                    type: { kind: "NamedType", name: { kind: "Name", value: "String" } },
                },
                {
                    kind: "VariableDefinition",
                    variable: { kind: "Variable", name: { kind: "Name", value: "categoryId" } },
                    type: { kind: "NamedType", name: { kind: "Name", value: "ID" } },
                },
                {
                    kind: "VariableDefinition",
                    variable: { kind: "Variable", name: { kind: "Name", value: "fromAccountId" } },
                    type: {
                        kind: "NonNullType",
                        type: { kind: "NamedType", name: { kind: "Name", value: "ID" } },
                    },
                },
                {
                    kind: "VariableDefinition",
                    variable: { kind: "Variable", name: { kind: "Name", value: "toAccountId" } },
                    type: {
                        kind: "NonNullType",
                        type: { kind: "NamedType", name: { kind: "Name", value: "ID" } },
                    },
                },
                {
                    kind: "VariableDefinition",
                    variable: { kind: "Variable", name: { kind: "Name", value: "occurredAt" } },
                    type: { kind: "NamedType", name: { kind: "Name", value: "String" } },
                },
            ],
            selectionSet: {
                kind: "SelectionSet",
                selections: [
                    {
                        kind: "Field",
                        name: { kind: "Name", value: "transfer" },
                        arguments: [
                            {
                                kind: "Argument",
                                name: { kind: "Name", value: "amount" },
                                value: {
                                    kind: "Variable",
                                    name: { kind: "Name", value: "amount" },
                                },
                            },
                            {
                                kind: "Argument",
                                name: { kind: "Name", value: "convertedAmount" },
                                value: {
                                    kind: "Variable",
                                    name: { kind: "Name", value: "convertedAmount" },
                                },
                            },
                            {
                                kind: "Argument",
                                name: { kind: "Name", value: "description" },
                                value: {
                                    kind: "Variable",
                                    name: { kind: "Name", value: "description" },
                                },
                            },
                            {
                                kind: "Argument",
                                name: { kind: "Name", value: "categoryId" },
                                value: {
                                    kind: "Variable",
                                    name: { kind: "Name", value: "categoryId" },
                                },
                            },
                            {
                                kind: "Argument",
                                name: { kind: "Name", value: "fromAccountId" },
                                value: {
                                    kind: "Variable",
                                    name: { kind: "Name", value: "fromAccountId" },
                                },
                            },
                            {
                                kind: "Argument",
                                name: { kind: "Name", value: "toAccountId" },
                                value: {
                                    kind: "Variable",
                                    name: { kind: "Name", value: "toAccountId" },
                                },
                            },
                            {
                                kind: "Argument",
                                name: { kind: "Name", value: "occurredAt" },
                                value: {
                                    kind: "Variable",
                                    name: { kind: "Name", value: "occurredAt" },
                                },
                            },
                        ],
                        selectionSet: {
                            kind: "SelectionSet",
                            selections: [
                                {
                                    kind: "FragmentSpread",
                                    name: { kind: "Name", value: "PlainTransaction" },
                                },
                            ],
                        },
                    },
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
        {
            kind: "FragmentDefinition",
            name: { kind: "Name", value: "PlainAccount" },
            typeCondition: { kind: "NamedType", name: { kind: "Name", value: "Account" } },
            selectionSet: {
                kind: "SelectionSet",
                selections: [
                    { kind: "Field", name: { kind: "Name", value: "id" } },
                    { kind: "Field", name: { kind: "Name", value: "name" } },
                    {
                        kind: "Field",
                        name: { kind: "Name", value: "balance" },
                        selectionSet: {
                            kind: "SelectionSet",
                            selections: [
                                { kind: "Field", name: { kind: "Name", value: "amount" } },
                                { kind: "Field", name: { kind: "Name", value: "currency" } },
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
                    { kind: "Field", name: { kind: "Name", value: "__typename" } },
                    { kind: "Field", name: { kind: "Name", value: "id" } },
                    {
                        kind: "Field",
                        name: { kind: "Name", value: "amount" },
                        selectionSet: {
                            kind: "SelectionSet",
                            selections: [
                                { kind: "Field", name: { kind: "Name", value: "amount" } },
                                { kind: "Field", name: { kind: "Name", value: "currency" } },
                            ],
                        },
                    },
                    { kind: "Field", name: { kind: "Name", value: "description" } },
                    { kind: "Field", name: { kind: "Name", value: "occurredAt" } },
                    {
                        kind: "Field",
                        name: { kind: "Name", value: "category" },
                        selectionSet: {
                            kind: "SelectionSet",
                            selections: [
                                {
                                    kind: "FragmentSpread",
                                    name: { kind: "Name", value: "PlainCategory" },
                                },
                            ],
                        },
                    },
                    {
                        kind: "InlineFragment",
                        typeCondition: {
                            kind: "NamedType",
                            name: { kind: "Name", value: "Expense" },
                        },
                        selectionSet: {
                            kind: "SelectionSet",
                            selections: [
                                {
                                    kind: "Field",
                                    name: { kind: "Name", value: "from" },
                                    selectionSet: {
                                        kind: "SelectionSet",
                                        selections: [
                                            {
                                                kind: "FragmentSpread",
                                                name: { kind: "Name", value: "PlainAccount" },
                                            },
                                        ],
                                    },
                                },
                            ],
                        },
                    },
                    {
                        kind: "InlineFragment",
                        typeCondition: {
                            kind: "NamedType",
                            name: { kind: "Name", value: "Income" },
                        },
                        selectionSet: {
                            kind: "SelectionSet",
                            selections: [
                                {
                                    kind: "Field",
                                    name: { kind: "Name", value: "to" },
                                    selectionSet: {
                                        kind: "SelectionSet",
                                        selections: [
                                            {
                                                kind: "FragmentSpread",
                                                name: { kind: "Name", value: "PlainAccount" },
                                            },
                                        ],
                                    },
                                },
                            ],
                        },
                    },
                    {
                        kind: "InlineFragment",
                        typeCondition: {
                            kind: "NamedType",
                            name: { kind: "Name", value: "Transfer" },
                        },
                        selectionSet: {
                            kind: "SelectionSet",
                            selections: [
                                {
                                    kind: "Field",
                                    name: { kind: "Name", value: "from" },
                                    selectionSet: {
                                        kind: "SelectionSet",
                                        selections: [
                                            {
                                                kind: "FragmentSpread",
                                                name: { kind: "Name", value: "PlainAccount" },
                                            },
                                        ],
                                    },
                                },
                                {
                                    kind: "Field",
                                    name: { kind: "Name", value: "to" },
                                    selectionSet: {
                                        kind: "SelectionSet",
                                        selections: [
                                            {
                                                kind: "FragmentSpread",
                                                name: { kind: "Name", value: "PlainAccount" },
                                            },
                                        ],
                                    },
                                },
                                {
                                    kind: "Field",
                                    name: { kind: "Name", value: "convertedAmount" },
                                    selectionSet: {
                                        kind: "SelectionSet",
                                        selections: [
                                            {
                                                kind: "Field",
                                                name: { kind: "Name", value: "amount" },
                                            },
                                            {
                                                kind: "Field",
                                                name: { kind: "Name", value: "currency" },
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
                        type: { kind: "NamedType", name: { kind: "Name", value: "ID" } },
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
                                name: { kind: "Name", value: "id" },
                                value: {
                                    kind: "Variable",
                                    name: { kind: "Name", value: "transactionId" },
                                },
                            },
                        ],
                    },
                ],
            },
        },
    ],
} as unknown as DocumentNode<DeleteTransactionMutation, DeleteTransactionMutationVariables>;
export const GetTransactionsPageDocument = {
    kind: "Document",
    definitions: [
        {
            kind: "OperationDefinition",
            operation: "query",
            name: { kind: "Name", value: "GetTransactionsPage" },
            variableDefinitions: [
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
                    type: { kind: "NamedType", name: { kind: "Name", value: "String" } },
                },
                {
                    kind: "VariableDefinition",
                    variable: { kind: "Variable", name: { kind: "Name", value: "accountId" } },
                    type: { kind: "NamedType", name: { kind: "Name", value: "ID" } },
                },
                {
                    kind: "VariableDefinition",
                    variable: { kind: "Variable", name: { kind: "Name", value: "fromDate" } },
                    type: { kind: "NamedType", name: { kind: "Name", value: "String" } },
                },
                {
                    kind: "VariableDefinition",
                    variable: { kind: "Variable", name: { kind: "Name", value: "toDate" } },
                    type: { kind: "NamedType", name: { kind: "Name", value: "String" } },
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
                                name: { kind: "Name", value: "first" },
                                value: { kind: "Variable", name: { kind: "Name", value: "first" } },
                            },
                            {
                                kind: "Argument",
                                name: { kind: "Name", value: "after" },
                                value: { kind: "Variable", name: { kind: "Name", value: "after" } },
                            },
                            {
                                kind: "Argument",
                                name: { kind: "Name", value: "sort" },
                                value: {
                                    kind: "ListValue",
                                    values: [
                                        {
                                            kind: "ObjectValue",
                                            fields: [
                                                {
                                                    kind: "ObjectField",
                                                    name: { kind: "Name", value: "property" },
                                                    value: {
                                                        kind: "StringValue",
                                                        value: "occurredAt",
                                                        block: false,
                                                    },
                                                },
                                                {
                                                    kind: "ObjectField",
                                                    name: { kind: "Name", value: "direction" },
                                                    value: { kind: "EnumValue", value: "DESC" },
                                                },
                                            ],
                                        },
                                        {
                                            kind: "ObjectValue",
                                            fields: [
                                                {
                                                    kind: "ObjectField",
                                                    name: { kind: "Name", value: "property" },
                                                    value: {
                                                        kind: "StringValue",
                                                        value: "id",
                                                        block: false,
                                                    },
                                                },
                                                {
                                                    kind: "ObjectField",
                                                    name: { kind: "Name", value: "direction" },
                                                    value: { kind: "EnumValue", value: "DESC" },
                                                },
                                            ],
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
                                            name: { kind: "Name", value: "accountId" },
                                            value: {
                                                kind: "Variable",
                                                name: { kind: "Name", value: "accountId" },
                                            },
                                        },
                                        {
                                            kind: "ObjectField",
                                            name: { kind: "Name", value: "fromDate" },
                                            value: {
                                                kind: "Variable",
                                                name: { kind: "Name", value: "fromDate" },
                                            },
                                        },
                                        {
                                            kind: "ObjectField",
                                            name: { kind: "Name", value: "toDate" },
                                            value: {
                                                kind: "Variable",
                                                name: { kind: "Name", value: "toDate" },
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
                                    name: { kind: "Name", value: "edges" },
                                    selectionSet: {
                                        kind: "SelectionSet",
                                        selections: [
                                            {
                                                kind: "Field",
                                                name: { kind: "Name", value: "node" },
                                                selectionSet: {
                                                    kind: "SelectionSet",
                                                    selections: [
                                                        {
                                                            kind: "FragmentSpread",
                                                            name: {
                                                                kind: "Name",
                                                                value: "PlainTransaction",
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
                                                name: { kind: "Name", value: "hasNextPage" },
                                            },
                                            {
                                                kind: "Field",
                                                name: { kind: "Name", value: "endCursor" },
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
        {
            kind: "FragmentDefinition",
            name: { kind: "Name", value: "PlainAccount" },
            typeCondition: { kind: "NamedType", name: { kind: "Name", value: "Account" } },
            selectionSet: {
                kind: "SelectionSet",
                selections: [
                    { kind: "Field", name: { kind: "Name", value: "id" } },
                    { kind: "Field", name: { kind: "Name", value: "name" } },
                    {
                        kind: "Field",
                        name: { kind: "Name", value: "balance" },
                        selectionSet: {
                            kind: "SelectionSet",
                            selections: [
                                { kind: "Field", name: { kind: "Name", value: "amount" } },
                                { kind: "Field", name: { kind: "Name", value: "currency" } },
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
                    { kind: "Field", name: { kind: "Name", value: "__typename" } },
                    { kind: "Field", name: { kind: "Name", value: "id" } },
                    {
                        kind: "Field",
                        name: { kind: "Name", value: "amount" },
                        selectionSet: {
                            kind: "SelectionSet",
                            selections: [
                                { kind: "Field", name: { kind: "Name", value: "amount" } },
                                { kind: "Field", name: { kind: "Name", value: "currency" } },
                            ],
                        },
                    },
                    { kind: "Field", name: { kind: "Name", value: "description" } },
                    { kind: "Field", name: { kind: "Name", value: "occurredAt" } },
                    {
                        kind: "Field",
                        name: { kind: "Name", value: "category" },
                        selectionSet: {
                            kind: "SelectionSet",
                            selections: [
                                {
                                    kind: "FragmentSpread",
                                    name: { kind: "Name", value: "PlainCategory" },
                                },
                            ],
                        },
                    },
                    {
                        kind: "InlineFragment",
                        typeCondition: {
                            kind: "NamedType",
                            name: { kind: "Name", value: "Expense" },
                        },
                        selectionSet: {
                            kind: "SelectionSet",
                            selections: [
                                {
                                    kind: "Field",
                                    name: { kind: "Name", value: "from" },
                                    selectionSet: {
                                        kind: "SelectionSet",
                                        selections: [
                                            {
                                                kind: "FragmentSpread",
                                                name: { kind: "Name", value: "PlainAccount" },
                                            },
                                        ],
                                    },
                                },
                            ],
                        },
                    },
                    {
                        kind: "InlineFragment",
                        typeCondition: {
                            kind: "NamedType",
                            name: { kind: "Name", value: "Income" },
                        },
                        selectionSet: {
                            kind: "SelectionSet",
                            selections: [
                                {
                                    kind: "Field",
                                    name: { kind: "Name", value: "to" },
                                    selectionSet: {
                                        kind: "SelectionSet",
                                        selections: [
                                            {
                                                kind: "FragmentSpread",
                                                name: { kind: "Name", value: "PlainAccount" },
                                            },
                                        ],
                                    },
                                },
                            ],
                        },
                    },
                    {
                        kind: "InlineFragment",
                        typeCondition: {
                            kind: "NamedType",
                            name: { kind: "Name", value: "Transfer" },
                        },
                        selectionSet: {
                            kind: "SelectionSet",
                            selections: [
                                {
                                    kind: "Field",
                                    name: { kind: "Name", value: "from" },
                                    selectionSet: {
                                        kind: "SelectionSet",
                                        selections: [
                                            {
                                                kind: "FragmentSpread",
                                                name: { kind: "Name", value: "PlainAccount" },
                                            },
                                        ],
                                    },
                                },
                                {
                                    kind: "Field",
                                    name: { kind: "Name", value: "to" },
                                    selectionSet: {
                                        kind: "SelectionSet",
                                        selections: [
                                            {
                                                kind: "FragmentSpread",
                                                name: { kind: "Name", value: "PlainAccount" },
                                            },
                                        ],
                                    },
                                },
                                {
                                    kind: "Field",
                                    name: { kind: "Name", value: "convertedAmount" },
                                    selectionSet: {
                                        kind: "SelectionSet",
                                        selections: [
                                            {
                                                kind: "Field",
                                                name: { kind: "Name", value: "amount" },
                                            },
                                            {
                                                kind: "Field",
                                                name: { kind: "Name", value: "currency" },
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
} as unknown as DocumentNode<GetTransactionsPageQuery, GetTransactionsPageQueryVariables>;
export const PatchExpenseDocument = {
    kind: "Document",
    definitions: [
        {
            kind: "OperationDefinition",
            operation: "mutation",
            name: { kind: "Name", value: "PatchExpense" },
            variableDefinitions: [
                {
                    kind: "VariableDefinition",
                    variable: { kind: "Variable", name: { kind: "Name", value: "id" } },
                    type: {
                        kind: "NonNullType",
                        type: { kind: "NamedType", name: { kind: "Name", value: "ID" } },
                    },
                },
                {
                    kind: "VariableDefinition",
                    variable: { kind: "Variable", name: { kind: "Name", value: "amount" } },
                    type: { kind: "NamedType", name: { kind: "Name", value: "MoneyInput" } },
                },
                {
                    kind: "VariableDefinition",
                    variable: { kind: "Variable", name: { kind: "Name", value: "categoryId" } },
                    type: { kind: "NamedType", name: { kind: "Name", value: "ID" } },
                },
                {
                    kind: "VariableDefinition",
                    variable: { kind: "Variable", name: { kind: "Name", value: "description" } },
                    type: { kind: "NamedType", name: { kind: "Name", value: "String" } },
                },
                {
                    kind: "VariableDefinition",
                    variable: { kind: "Variable", name: { kind: "Name", value: "occurredAt" } },
                    type: { kind: "NamedType", name: { kind: "Name", value: "String" } },
                },
            ],
            selectionSet: {
                kind: "SelectionSet",
                selections: [
                    {
                        kind: "Field",
                        name: { kind: "Name", value: "patchExpense" },
                        arguments: [
                            {
                                kind: "Argument",
                                name: { kind: "Name", value: "id" },
                                value: { kind: "Variable", name: { kind: "Name", value: "id" } },
                            },
                            {
                                kind: "Argument",
                                name: { kind: "Name", value: "amount" },
                                value: {
                                    kind: "Variable",
                                    name: { kind: "Name", value: "amount" },
                                },
                            },
                            {
                                kind: "Argument",
                                name: { kind: "Name", value: "categoryId" },
                                value: {
                                    kind: "Variable",
                                    name: { kind: "Name", value: "categoryId" },
                                },
                            },
                            {
                                kind: "Argument",
                                name: { kind: "Name", value: "description" },
                                value: {
                                    kind: "Variable",
                                    name: { kind: "Name", value: "description" },
                                },
                            },
                            {
                                kind: "Argument",
                                name: { kind: "Name", value: "occurredAt" },
                                value: {
                                    kind: "Variable",
                                    name: { kind: "Name", value: "occurredAt" },
                                },
                            },
                        ],
                        selectionSet: {
                            kind: "SelectionSet",
                            selections: [
                                {
                                    kind: "FragmentSpread",
                                    name: { kind: "Name", value: "PlainTransaction" },
                                },
                            ],
                        },
                    },
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
        {
            kind: "FragmentDefinition",
            name: { kind: "Name", value: "PlainAccount" },
            typeCondition: { kind: "NamedType", name: { kind: "Name", value: "Account" } },
            selectionSet: {
                kind: "SelectionSet",
                selections: [
                    { kind: "Field", name: { kind: "Name", value: "id" } },
                    { kind: "Field", name: { kind: "Name", value: "name" } },
                    {
                        kind: "Field",
                        name: { kind: "Name", value: "balance" },
                        selectionSet: {
                            kind: "SelectionSet",
                            selections: [
                                { kind: "Field", name: { kind: "Name", value: "amount" } },
                                { kind: "Field", name: { kind: "Name", value: "currency" } },
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
                    { kind: "Field", name: { kind: "Name", value: "__typename" } },
                    { kind: "Field", name: { kind: "Name", value: "id" } },
                    {
                        kind: "Field",
                        name: { kind: "Name", value: "amount" },
                        selectionSet: {
                            kind: "SelectionSet",
                            selections: [
                                { kind: "Field", name: { kind: "Name", value: "amount" } },
                                { kind: "Field", name: { kind: "Name", value: "currency" } },
                            ],
                        },
                    },
                    { kind: "Field", name: { kind: "Name", value: "description" } },
                    { kind: "Field", name: { kind: "Name", value: "occurredAt" } },
                    {
                        kind: "Field",
                        name: { kind: "Name", value: "category" },
                        selectionSet: {
                            kind: "SelectionSet",
                            selections: [
                                {
                                    kind: "FragmentSpread",
                                    name: { kind: "Name", value: "PlainCategory" },
                                },
                            ],
                        },
                    },
                    {
                        kind: "InlineFragment",
                        typeCondition: {
                            kind: "NamedType",
                            name: { kind: "Name", value: "Expense" },
                        },
                        selectionSet: {
                            kind: "SelectionSet",
                            selections: [
                                {
                                    kind: "Field",
                                    name: { kind: "Name", value: "from" },
                                    selectionSet: {
                                        kind: "SelectionSet",
                                        selections: [
                                            {
                                                kind: "FragmentSpread",
                                                name: { kind: "Name", value: "PlainAccount" },
                                            },
                                        ],
                                    },
                                },
                            ],
                        },
                    },
                    {
                        kind: "InlineFragment",
                        typeCondition: {
                            kind: "NamedType",
                            name: { kind: "Name", value: "Income" },
                        },
                        selectionSet: {
                            kind: "SelectionSet",
                            selections: [
                                {
                                    kind: "Field",
                                    name: { kind: "Name", value: "to" },
                                    selectionSet: {
                                        kind: "SelectionSet",
                                        selections: [
                                            {
                                                kind: "FragmentSpread",
                                                name: { kind: "Name", value: "PlainAccount" },
                                            },
                                        ],
                                    },
                                },
                            ],
                        },
                    },
                    {
                        kind: "InlineFragment",
                        typeCondition: {
                            kind: "NamedType",
                            name: { kind: "Name", value: "Transfer" },
                        },
                        selectionSet: {
                            kind: "SelectionSet",
                            selections: [
                                {
                                    kind: "Field",
                                    name: { kind: "Name", value: "from" },
                                    selectionSet: {
                                        kind: "SelectionSet",
                                        selections: [
                                            {
                                                kind: "FragmentSpread",
                                                name: { kind: "Name", value: "PlainAccount" },
                                            },
                                        ],
                                    },
                                },
                                {
                                    kind: "Field",
                                    name: { kind: "Name", value: "to" },
                                    selectionSet: {
                                        kind: "SelectionSet",
                                        selections: [
                                            {
                                                kind: "FragmentSpread",
                                                name: { kind: "Name", value: "PlainAccount" },
                                            },
                                        ],
                                    },
                                },
                                {
                                    kind: "Field",
                                    name: { kind: "Name", value: "convertedAmount" },
                                    selectionSet: {
                                        kind: "SelectionSet",
                                        selections: [
                                            {
                                                kind: "Field",
                                                name: { kind: "Name", value: "amount" },
                                            },
                                            {
                                                kind: "Field",
                                                name: { kind: "Name", value: "currency" },
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
} as unknown as DocumentNode<PatchExpenseMutation, PatchExpenseMutationVariables>;
export const PatchIncomeDocument = {
    kind: "Document",
    definitions: [
        {
            kind: "OperationDefinition",
            operation: "mutation",
            name: { kind: "Name", value: "PatchIncome" },
            variableDefinitions: [
                {
                    kind: "VariableDefinition",
                    variable: { kind: "Variable", name: { kind: "Name", value: "id" } },
                    type: {
                        kind: "NonNullType",
                        type: { kind: "NamedType", name: { kind: "Name", value: "ID" } },
                    },
                },
                {
                    kind: "VariableDefinition",
                    variable: { kind: "Variable", name: { kind: "Name", value: "amount" } },
                    type: { kind: "NamedType", name: { kind: "Name", value: "MoneyInput" } },
                },
                {
                    kind: "VariableDefinition",
                    variable: { kind: "Variable", name: { kind: "Name", value: "categoryId" } },
                    type: { kind: "NamedType", name: { kind: "Name", value: "ID" } },
                },
                {
                    kind: "VariableDefinition",
                    variable: { kind: "Variable", name: { kind: "Name", value: "description" } },
                    type: { kind: "NamedType", name: { kind: "Name", value: "String" } },
                },
                {
                    kind: "VariableDefinition",
                    variable: { kind: "Variable", name: { kind: "Name", value: "occurredAt" } },
                    type: { kind: "NamedType", name: { kind: "Name", value: "String" } },
                },
            ],
            selectionSet: {
                kind: "SelectionSet",
                selections: [
                    {
                        kind: "Field",
                        name: { kind: "Name", value: "patchIncome" },
                        arguments: [
                            {
                                kind: "Argument",
                                name: { kind: "Name", value: "id" },
                                value: { kind: "Variable", name: { kind: "Name", value: "id" } },
                            },
                            {
                                kind: "Argument",
                                name: { kind: "Name", value: "amount" },
                                value: {
                                    kind: "Variable",
                                    name: { kind: "Name", value: "amount" },
                                },
                            },
                            {
                                kind: "Argument",
                                name: { kind: "Name", value: "categoryId" },
                                value: {
                                    kind: "Variable",
                                    name: { kind: "Name", value: "categoryId" },
                                },
                            },
                            {
                                kind: "Argument",
                                name: { kind: "Name", value: "description" },
                                value: {
                                    kind: "Variable",
                                    name: { kind: "Name", value: "description" },
                                },
                            },
                            {
                                kind: "Argument",
                                name: { kind: "Name", value: "occurredAt" },
                                value: {
                                    kind: "Variable",
                                    name: { kind: "Name", value: "occurredAt" },
                                },
                            },
                        ],
                        selectionSet: {
                            kind: "SelectionSet",
                            selections: [
                                {
                                    kind: "FragmentSpread",
                                    name: { kind: "Name", value: "PlainTransaction" },
                                },
                            ],
                        },
                    },
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
        {
            kind: "FragmentDefinition",
            name: { kind: "Name", value: "PlainAccount" },
            typeCondition: { kind: "NamedType", name: { kind: "Name", value: "Account" } },
            selectionSet: {
                kind: "SelectionSet",
                selections: [
                    { kind: "Field", name: { kind: "Name", value: "id" } },
                    { kind: "Field", name: { kind: "Name", value: "name" } },
                    {
                        kind: "Field",
                        name: { kind: "Name", value: "balance" },
                        selectionSet: {
                            kind: "SelectionSet",
                            selections: [
                                { kind: "Field", name: { kind: "Name", value: "amount" } },
                                { kind: "Field", name: { kind: "Name", value: "currency" } },
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
                    { kind: "Field", name: { kind: "Name", value: "__typename" } },
                    { kind: "Field", name: { kind: "Name", value: "id" } },
                    {
                        kind: "Field",
                        name: { kind: "Name", value: "amount" },
                        selectionSet: {
                            kind: "SelectionSet",
                            selections: [
                                { kind: "Field", name: { kind: "Name", value: "amount" } },
                                { kind: "Field", name: { kind: "Name", value: "currency" } },
                            ],
                        },
                    },
                    { kind: "Field", name: { kind: "Name", value: "description" } },
                    { kind: "Field", name: { kind: "Name", value: "occurredAt" } },
                    {
                        kind: "Field",
                        name: { kind: "Name", value: "category" },
                        selectionSet: {
                            kind: "SelectionSet",
                            selections: [
                                {
                                    kind: "FragmentSpread",
                                    name: { kind: "Name", value: "PlainCategory" },
                                },
                            ],
                        },
                    },
                    {
                        kind: "InlineFragment",
                        typeCondition: {
                            kind: "NamedType",
                            name: { kind: "Name", value: "Expense" },
                        },
                        selectionSet: {
                            kind: "SelectionSet",
                            selections: [
                                {
                                    kind: "Field",
                                    name: { kind: "Name", value: "from" },
                                    selectionSet: {
                                        kind: "SelectionSet",
                                        selections: [
                                            {
                                                kind: "FragmentSpread",
                                                name: { kind: "Name", value: "PlainAccount" },
                                            },
                                        ],
                                    },
                                },
                            ],
                        },
                    },
                    {
                        kind: "InlineFragment",
                        typeCondition: {
                            kind: "NamedType",
                            name: { kind: "Name", value: "Income" },
                        },
                        selectionSet: {
                            kind: "SelectionSet",
                            selections: [
                                {
                                    kind: "Field",
                                    name: { kind: "Name", value: "to" },
                                    selectionSet: {
                                        kind: "SelectionSet",
                                        selections: [
                                            {
                                                kind: "FragmentSpread",
                                                name: { kind: "Name", value: "PlainAccount" },
                                            },
                                        ],
                                    },
                                },
                            ],
                        },
                    },
                    {
                        kind: "InlineFragment",
                        typeCondition: {
                            kind: "NamedType",
                            name: { kind: "Name", value: "Transfer" },
                        },
                        selectionSet: {
                            kind: "SelectionSet",
                            selections: [
                                {
                                    kind: "Field",
                                    name: { kind: "Name", value: "from" },
                                    selectionSet: {
                                        kind: "SelectionSet",
                                        selections: [
                                            {
                                                kind: "FragmentSpread",
                                                name: { kind: "Name", value: "PlainAccount" },
                                            },
                                        ],
                                    },
                                },
                                {
                                    kind: "Field",
                                    name: { kind: "Name", value: "to" },
                                    selectionSet: {
                                        kind: "SelectionSet",
                                        selections: [
                                            {
                                                kind: "FragmentSpread",
                                                name: { kind: "Name", value: "PlainAccount" },
                                            },
                                        ],
                                    },
                                },
                                {
                                    kind: "Field",
                                    name: { kind: "Name", value: "convertedAmount" },
                                    selectionSet: {
                                        kind: "SelectionSet",
                                        selections: [
                                            {
                                                kind: "Field",
                                                name: { kind: "Name", value: "amount" },
                                            },
                                            {
                                                kind: "Field",
                                                name: { kind: "Name", value: "currency" },
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
} as unknown as DocumentNode<PatchIncomeMutation, PatchIncomeMutationVariables>;
export const PatchTransferDocument = {
    kind: "Document",
    definitions: [
        {
            kind: "OperationDefinition",
            operation: "mutation",
            name: { kind: "Name", value: "PatchTransfer" },
            variableDefinitions: [
                {
                    kind: "VariableDefinition",
                    variable: { kind: "Variable", name: { kind: "Name", value: "id" } },
                    type: {
                        kind: "NonNullType",
                        type: { kind: "NamedType", name: { kind: "Name", value: "ID" } },
                    },
                },
                {
                    kind: "VariableDefinition",
                    variable: { kind: "Variable", name: { kind: "Name", value: "amount" } },
                    type: { kind: "NamedType", name: { kind: "Name", value: "MoneyInput" } },
                },
                {
                    kind: "VariableDefinition",
                    variable: {
                        kind: "Variable",
                        name: { kind: "Name", value: "convertedAmount" },
                    },
                    type: { kind: "NamedType", name: { kind: "Name", value: "MoneyInput" } },
                },
                {
                    kind: "VariableDefinition",
                    variable: { kind: "Variable", name: { kind: "Name", value: "categoryId" } },
                    type: { kind: "NamedType", name: { kind: "Name", value: "ID" } },
                },
                {
                    kind: "VariableDefinition",
                    variable: { kind: "Variable", name: { kind: "Name", value: "description" } },
                    type: { kind: "NamedType", name: { kind: "Name", value: "String" } },
                },
                {
                    kind: "VariableDefinition",
                    variable: { kind: "Variable", name: { kind: "Name", value: "occurredAt" } },
                    type: { kind: "NamedType", name: { kind: "Name", value: "String" } },
                },
            ],
            selectionSet: {
                kind: "SelectionSet",
                selections: [
                    {
                        kind: "Field",
                        name: { kind: "Name", value: "patchTransfer" },
                        arguments: [
                            {
                                kind: "Argument",
                                name: { kind: "Name", value: "id" },
                                value: { kind: "Variable", name: { kind: "Name", value: "id" } },
                            },
                            {
                                kind: "Argument",
                                name: { kind: "Name", value: "amount" },
                                value: {
                                    kind: "Variable",
                                    name: { kind: "Name", value: "amount" },
                                },
                            },
                            {
                                kind: "Argument",
                                name: { kind: "Name", value: "convertedAmount" },
                                value: {
                                    kind: "Variable",
                                    name: { kind: "Name", value: "convertedAmount" },
                                },
                            },
                            {
                                kind: "Argument",
                                name: { kind: "Name", value: "categoryId" },
                                value: {
                                    kind: "Variable",
                                    name: { kind: "Name", value: "categoryId" },
                                },
                            },
                            {
                                kind: "Argument",
                                name: { kind: "Name", value: "description" },
                                value: {
                                    kind: "Variable",
                                    name: { kind: "Name", value: "description" },
                                },
                            },
                            {
                                kind: "Argument",
                                name: { kind: "Name", value: "occurredAt" },
                                value: {
                                    kind: "Variable",
                                    name: { kind: "Name", value: "occurredAt" },
                                },
                            },
                        ],
                        selectionSet: {
                            kind: "SelectionSet",
                            selections: [
                                {
                                    kind: "FragmentSpread",
                                    name: { kind: "Name", value: "PlainTransaction" },
                                },
                            ],
                        },
                    },
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
        {
            kind: "FragmentDefinition",
            name: { kind: "Name", value: "PlainAccount" },
            typeCondition: { kind: "NamedType", name: { kind: "Name", value: "Account" } },
            selectionSet: {
                kind: "SelectionSet",
                selections: [
                    { kind: "Field", name: { kind: "Name", value: "id" } },
                    { kind: "Field", name: { kind: "Name", value: "name" } },
                    {
                        kind: "Field",
                        name: { kind: "Name", value: "balance" },
                        selectionSet: {
                            kind: "SelectionSet",
                            selections: [
                                { kind: "Field", name: { kind: "Name", value: "amount" } },
                                { kind: "Field", name: { kind: "Name", value: "currency" } },
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
                    { kind: "Field", name: { kind: "Name", value: "__typename" } },
                    { kind: "Field", name: { kind: "Name", value: "id" } },
                    {
                        kind: "Field",
                        name: { kind: "Name", value: "amount" },
                        selectionSet: {
                            kind: "SelectionSet",
                            selections: [
                                { kind: "Field", name: { kind: "Name", value: "amount" } },
                                { kind: "Field", name: { kind: "Name", value: "currency" } },
                            ],
                        },
                    },
                    { kind: "Field", name: { kind: "Name", value: "description" } },
                    { kind: "Field", name: { kind: "Name", value: "occurredAt" } },
                    {
                        kind: "Field",
                        name: { kind: "Name", value: "category" },
                        selectionSet: {
                            kind: "SelectionSet",
                            selections: [
                                {
                                    kind: "FragmentSpread",
                                    name: { kind: "Name", value: "PlainCategory" },
                                },
                            ],
                        },
                    },
                    {
                        kind: "InlineFragment",
                        typeCondition: {
                            kind: "NamedType",
                            name: { kind: "Name", value: "Expense" },
                        },
                        selectionSet: {
                            kind: "SelectionSet",
                            selections: [
                                {
                                    kind: "Field",
                                    name: { kind: "Name", value: "from" },
                                    selectionSet: {
                                        kind: "SelectionSet",
                                        selections: [
                                            {
                                                kind: "FragmentSpread",
                                                name: { kind: "Name", value: "PlainAccount" },
                                            },
                                        ],
                                    },
                                },
                            ],
                        },
                    },
                    {
                        kind: "InlineFragment",
                        typeCondition: {
                            kind: "NamedType",
                            name: { kind: "Name", value: "Income" },
                        },
                        selectionSet: {
                            kind: "SelectionSet",
                            selections: [
                                {
                                    kind: "Field",
                                    name: { kind: "Name", value: "to" },
                                    selectionSet: {
                                        kind: "SelectionSet",
                                        selections: [
                                            {
                                                kind: "FragmentSpread",
                                                name: { kind: "Name", value: "PlainAccount" },
                                            },
                                        ],
                                    },
                                },
                            ],
                        },
                    },
                    {
                        kind: "InlineFragment",
                        typeCondition: {
                            kind: "NamedType",
                            name: { kind: "Name", value: "Transfer" },
                        },
                        selectionSet: {
                            kind: "SelectionSet",
                            selections: [
                                {
                                    kind: "Field",
                                    name: { kind: "Name", value: "from" },
                                    selectionSet: {
                                        kind: "SelectionSet",
                                        selections: [
                                            {
                                                kind: "FragmentSpread",
                                                name: { kind: "Name", value: "PlainAccount" },
                                            },
                                        ],
                                    },
                                },
                                {
                                    kind: "Field",
                                    name: { kind: "Name", value: "to" },
                                    selectionSet: {
                                        kind: "SelectionSet",
                                        selections: [
                                            {
                                                kind: "FragmentSpread",
                                                name: { kind: "Name", value: "PlainAccount" },
                                            },
                                        ],
                                    },
                                },
                                {
                                    kind: "Field",
                                    name: { kind: "Name", value: "convertedAmount" },
                                    selectionSet: {
                                        kind: "SelectionSet",
                                        selections: [
                                            {
                                                kind: "Field",
                                                name: { kind: "Name", value: "amount" },
                                            },
                                            {
                                                kind: "Field",
                                                name: { kind: "Name", value: "currency" },
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
} as unknown as DocumentNode<PatchTransferMutation, PatchTransferMutationVariables>;
export const InitializeUserDocument = {
    kind: "Document",
    definitions: [
        {
            kind: "OperationDefinition",
            operation: "mutation",
            name: { kind: "Name", value: "InitializeUser" },
            selectionSet: {
                kind: "SelectionSet",
                selections: [{ kind: "Field", name: { kind: "Name", value: "initializeUser" } }],
            },
        },
    ],
} as unknown as DocumentNode<InitializeUserMutation, InitializeUserMutationVariables>;
