import { gql } from "@apollo/client";
import { log } from "../common/utils";
import client from "../lib/apollo";
import { categoryFragment } from "./categoryService";
import { mapTransactionFromServer } from "./helper/transactoinHelper";
import {
    AddExpenseRequest,
    AddIncomeRequest,
    AddTransferRequest,
    DeleteTranactionRequest,
} from "./model/Requests";
import {
    AddExpenseResponse,
    AddIncomeResponse,
    AddTransferResponse,
    ListTransactionsResponse,
} from "./model/Responses";
import { DeleteTransactionResponse } from "./model/Responses/index";
import { accountFragment } from "./walletService";

const transactionFragment = gql`
    fragment PlainTransaction on Transaction {
        id
        amount
        description
        type
        date
        categoryId
        fromAccountId
        toAccountId
    }
`;

export const ADD_EXPENSE = gql`
    mutation AddExpense(
        $amount: Float!
        $description: String!
        $categoryId: Int!
        $fromAccountId: Int!
        $occurredAt: Datetime!
    ) {
        spend(
            input: {
                amount: $amount
                description: $description
                categoryId: $categoryId
                fromAccountId: $fromAccountId
                occurredAt: $occurredAt
            }
        ) {
            transaction {
                ...PlainTransaction
                fromAccount {
                    ...PlainAccount
                }
                category {
                    ...PlainCategory
                }
            }
        }
    }
    ${transactionFragment}
    ${accountFragment}
    ${categoryFragment}
`;

export const ADD_INCOME = gql`
    mutation AddIncome(
        $amount: Float!
        $description: String!
        $categoryId: Int!
        $toAccountId: Int!
        $occurredAt: Datetime!
    ) {
        receive(
            input: {
                amount: $amount
                description: $description
                categoryId: $categoryId
                toAccountId: $toAccountId
                occurredAt: $occurredAt
            }
        ) {
            transaction {
                ...PlainTransaction
                toAccount {
                    ...PlainAccount
                }
                category {
                    ...PlainCategory
                }
            }
        }
    }
    ${transactionFragment}
    ${accountFragment}
    ${categoryFragment}
`;

export const ADD_TRANSFER = gql`
    mutation AddTransfer(
        $amount: Float!
        $description: String!
        $fromAccountId: Int!
        $toAccountId: Int!
        $occurredAt: Datetime!
    ) {
        transfer(
            input: {
                amount: $amount
                description: $description
                fromAccountId: $fromAccountId
                toAccountId: $toAccountId
                occurredAt: $occurredAt
            }
        ) {
            transaction {
                ...PlainTransaction
                fromAccount {
                    ...PlainAccount
                }
                toAccount {
                    ...PlainAccount
                }
                category {
                    ...PlainCategory
                }
            }
        }
    }
    ${transactionFragment}
    ${accountFragment}
    ${categoryFragment}
`;

export const DELETE_TRANSACTION = gql`
    mutation DeleteTransaction($transactionId: Int!) {
        deleteTransaction(input: { id: $transactionId }) {
            transaction {
                ...PlainTransaction
                fromAccount {
                    ...PlainAccount
                }
                toAccount {
                    ...PlainAccount
                }
                category {
                    ...PlainCategory
                }
            }
        }
    }
    ${transactionFragment}
    ${accountFragment}
    ${categoryFragment}
`;

export const GET_TRANSACTIONS = gql`
    query GetTransactions {
        transactions {
            nodes {
                ...PlainTransaction
                toAccount {
                    ...PlainAccount
                }
                fromAccount {
                    ...PlainAccount
                }
                category {
                    ...PlainCategory
                }
            }
            totalCount
        }
    }
    ${transactionFragment}
    ${accountFragment}
    ${categoryFragment}
`;

export async function addExpense(
    request: AddExpenseRequest
): Promise<AddExpenseResponse> {
    const response = await client.mutate({
        mutation: ADD_EXPENSE,
        variables: {
            amount: request.amount,
            categoryId: request.categoryId,
            description: request.description,
            fromAccountId: request.fromAccountId,
            occurredAt: request.date,
        },
    });

    if (response.errors) {
        log(`Add expense failed`, response.errors);

        return null;
    }

    return {
        transaction: mapTransactionFromServer(response.data.spend.transaction),
    };
}

export async function addIncome(
    request: AddIncomeRequest
): Promise<AddIncomeResponse> {
    const response = await client.mutate({
        mutation: ADD_INCOME,
        variables: {
            amount: request.amount,
            description: request.description,
            categoryId: request.categoryId,
            toAccountId: request.toAccountId,
            occurredAt: request.date,
        },
    });

    if (response.errors) {
        log("Add income failed", response.errors);

        return null;
    }

    return {
        transaction: mapTransactionFromServer(
            response.data.receive.transaction
        ),
    };
}

export async function addTransfer(
    request: AddTransferRequest
): Promise<AddTransferResponse> {
    const response = await client.mutate({
        mutation: ADD_TRANSFER,
        variables: {
            amount: request.amount,
            description: request.description,
            fromAccountId: request.fromAccountId,
            toAccountId: request.toAccountId,
            occurredAt: request.date,
        },
    });

    if (response.errors) {
        log("Add transfer failed", response.errors);

        return null;
    }

    return {
        transaction: mapTransactionFromServer(
            response.data.transfer.transaction
        ),
    };
}

export async function listTransactions(): Promise<ListTransactionsResponse> {
    const response = await client.query({
        query: GET_TRANSACTIONS,
    });

    if (response.errors) {
        log("list transactions failed", response.errors);

        return {
            length: 0,
            items: [],
        };
    }

    return {
        length: response.data.transactions.totalCount,
        items: response.data.transactions.nodes.map(mapTransactionFromServer),
    };
}

export async function deleteTransaction(
    request: DeleteTranactionRequest
): Promise<DeleteTransactionResponse> {
    const response = await client.mutate({
        mutation: DELETE_TRANSACTION,
        variables: {
            transactionId: request.id,
        },
    });

    if (response.errors) {
        log("list transactions failed", response.errors);

        return {
            isSuccess: false,
        };
    }

    return {
        isSuccess: true,
    };
}
