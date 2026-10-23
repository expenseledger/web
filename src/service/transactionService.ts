import { log } from "../common/utils";
import client from "../lib/apollo";
import { getErrorCode } from "./helper/errorHelper";
import { fetchAllPages, MAX_PAGE_SIZE } from "./helper/pagingHelper";
import {
    compareTransactionsDesc,
    mapTransactionFromServer,
    monthYearsBetween,
    toOffsetDateTime,
} from "./helper/transactoinHelper";
import { graphql } from "./model/gql";
import {
    AddExpenseRequest,
    AddIncomeRequest,
    AddTransferRequest,
    DeleteTranactionRequest,
    GetTransactionMonthYearListRequest,
    ListTransactionsRequest,
    UpdateTransactionRequest,
} from "./model/Requests";
import {
    AddExpenseResponse,
    AddIncomeResponse,
    AddTransferResponse,
    GetTransactionMonthYearListResponse,
    ListTransactionsResponse,
    UpdateTransactionResponse,
} from "./model/Responses";
import { DeleteTransactionResponse } from "./model/Responses/index";

export const transactionFragment = graphql(`
    fragment PlainTransaction on Transaction {
        __typename
        id
        amount {
            amount
            currency
        }
        description
        occurredAt
        category {
            ...PlainCategory
        }
        ... on Expense {
            from {
                ...PlainAccount
            }
        }
        ... on Income {
            to {
                ...PlainAccount
            }
        }
        ... on Transfer {
            from {
                ...PlainAccount
            }
            to {
                ...PlainAccount
            }
            convertedAmount {
                amount
                currency
            }
        }
    }
`);

const ADD_EXPENSE = graphql(`
    mutation AddExpense(
        $amount: MoneyInput!
        $description: String
        $categoryId: ID
        $fromAccountId: ID!
        $occurredAt: String
    ) {
        withdraw(
            amount: $amount
            description: $description
            categoryId: $categoryId
            fromAccountId: $fromAccountId
            occurredAt: $occurredAt
        ) {
            ...PlainTransaction
        }
    }
`);

const ADD_INCOME = graphql(`
    mutation AddIncome(
        $amount: MoneyInput!
        $description: String
        $categoryId: ID
        $toAccountId: ID!
        $occurredAt: String
    ) {
        deposit(
            amount: $amount
            description: $description
            categoryId: $categoryId
            toAccountId: $toAccountId
            occurredAt: $occurredAt
        ) {
            ...PlainTransaction
        }
    }
`);

const ADD_TRANSFER = graphql(`
    mutation AddTransfer(
        $amount: MoneyInput!
        $convertedAmount: MoneyInput
        $description: String
        $categoryId: ID
        $fromAccountId: ID!
        $toAccountId: ID!
        $occurredAt: String
    ) {
        transfer(
            amount: $amount
            convertedAmount: $convertedAmount
            description: $description
            categoryId: $categoryId
            fromAccountId: $fromAccountId
            toAccountId: $toAccountId
            occurredAt: $occurredAt
        ) {
            ...PlainTransaction
        }
    }
`);

const DELETE_TRANSACTION = graphql(`
    mutation DeleteTransaction($transactionId: ID!) {
        deleteTransaction(id: $transactionId)
    }
`);

const GET_TRANSACTIONS_PAGE = graphql(`
    query GetTransactionsPage(
        $first: Int!
        $after: String
        $accountId: ID
        $fromDate: String
        $toDate: String
    ) {
        transactions(
            first: $first
            after: $after
            sort: [{ property: "occurredAt", direction: DESC }, { property: "id", direction: DESC }]
            filter: { accountId: $accountId, fromDate: $fromDate, toDate: $toDate }
        ) {
            edges {
                node {
                    ...PlainTransaction
                }
            }
            pageInfo {
                hasNextPage
                endCursor
            }
        }
    }
`);

const GET_TRANSACTION_DATE_RANGE = graphql(`
    query GetTransactionDateRange($accountId: ID) {
        oldest: transactions(
            first: 1
            sort: [{ property: "occurredAt", direction: ASC }]
            filter: { accountId: $accountId }
        ) {
            edges {
                node {
                    occurredAt
                }
            }
        }
        newest: transactions(
            first: 1
            sort: [{ property: "occurredAt", direction: DESC }]
            filter: { accountId: $accountId }
        ) {
            edges {
                node {
                    occurredAt
                }
            }
        }
    }
`);

const PATCH_EXPENSE = graphql(`
    mutation PatchExpense(
        $id: ID!
        $amount: MoneyInput
        $categoryId: ID
        $description: String
        $occurredAt: String
    ) {
        patchExpense(
            id: $id
            amount: $amount
            categoryId: $categoryId
            description: $description
            occurredAt: $occurredAt
        ) {
            ...PlainTransaction
        }
    }
`);

const PATCH_INCOME = graphql(`
    mutation PatchIncome(
        $id: ID!
        $amount: MoneyInput
        $categoryId: ID
        $description: String
        $occurredAt: String
    ) {
        patchIncome(
            id: $id
            amount: $amount
            categoryId: $categoryId
            description: $description
            occurredAt: $occurredAt
        ) {
            ...PlainTransaction
        }
    }
`);

const PATCH_TRANSFER = graphql(`
    mutation PatchTransfer(
        $id: ID!
        $amount: MoneyInput
        $convertedAmount: MoneyInput
        $categoryId: ID
        $description: String
        $occurredAt: String
    ) {
        patchTransfer(
            id: $id
            amount: $amount
            convertedAmount: $convertedAmount
            categoryId: $categoryId
            description: $description
            occurredAt: $occurredAt
        ) {
            ...PlainTransaction
        }
    }
`);

export async function addExpense(request: AddExpenseRequest): Promise<AddExpenseResponse> {
    try {
        const response = await client.mutate({
            mutation: ADD_EXPENSE,
            variables: {
                amount: request.amount,
                categoryId: request.categoryId,
                description: request.description || null,
                fromAccountId: request.fromAccountId,
                occurredAt: toOffsetDateTime(request.date),
            },
        });

        if (response.error) {
            log(`Add expense failed`, response.error);

            return { transaction: null, errorCode: getErrorCode(response.error) };
        }

        return {
            transaction: mapTransactionFromServer(response.data.withdraw),
        };
    } catch (err) {
        log("Add expense failed, unexpected error", err);

        return { transaction: null, errorCode: getErrorCode(err) };
    }
}

export async function addIncome(request: AddIncomeRequest): Promise<AddIncomeResponse> {
    try {
        const response = await client.mutate({
            mutation: ADD_INCOME,
            variables: {
                amount: request.amount,
                description: request.description || null,
                categoryId: request.categoryId,
                toAccountId: request.toAccountId,
                occurredAt: toOffsetDateTime(request.date),
            },
        });

        if (response.error) {
            log("Add income failed", response.error);

            return { transaction: null, errorCode: getErrorCode(response.error) };
        }

        return {
            transaction: mapTransactionFromServer(response.data.deposit),
        };
    } catch (err) {
        log("Add income failed, unexpected error", err);

        return { transaction: null, errorCode: getErrorCode(err) };
    }
}

/** `convertedAmount` is required between currencies and refused otherwise. */
export async function addTransfer(request: AddTransferRequest): Promise<AddTransferResponse> {
    try {
        const response = await client.mutate({
            mutation: ADD_TRANSFER,
            variables: {
                amount: request.amount,
                convertedAmount: request.convertedAmount,
                description: request.description || null,
                categoryId: request.categoryId,
                fromAccountId: request.fromAccountId,
                toAccountId: request.toAccountId,
                occurredAt: toOffsetDateTime(request.date),
            },
        });

        if (response.error) {
            log("Add transfer failed", response.error);

            return { transaction: null, errorCode: getErrorCode(response.error) };
        }

        return {
            transaction: mapTransactionFromServer(response.data.transfer),
        };
    } catch (err) {
        log("Add transfer failed, unexpected error", err);

        return { transaction: null, errorCode: getErrorCode(err) };
    }
}

/** Every transaction on either side of the account, within whole local days. */
export async function listTransactions(
    request: ListTransactionsRequest
): Promise<ListTransactionsResponse> {
    try {
        const nodes = await fetchAllPages(async (after) => {
            const response = await client.query({
                query: GET_TRANSACTIONS_PAGE,
                variables: {
                    first: MAX_PAGE_SIZE,
                    after,
                    accountId: request.accountId,
                    fromDate: toOffsetDateTime(request.fromDate),
                    toDate: toOffsetDateTime(request.toDate),
                },
                fetchPolicy: "network-only",
            });

            if (response.error) {
                throw response.error;
            }

            return response.data.transactions;
        });

        return {
            items: nodes.map(mapTransactionFromServer).sort(compareTransactionsDesc),
        };
    } catch (err) {
        log("list transactions failed", err);

        return {
            items: [],
        };
    }
}

/** Reverses the balance change and deletes the transaction. */
export async function deleteTransaction(
    request: DeleteTranactionRequest
): Promise<DeleteTransactionResponse> {
    try {
        const response = await client.mutate({
            mutation: DELETE_TRANSACTION,
            variables: {
                transactionId: request.id,
            },
        });

        if (response.error) {
            log("delete transaction failed", response.error);

            return {
                isSuccess: false,
                errorCode: getErrorCode(response.error),
            };
        }

        return {
            isSuccess: true,
        };
    } catch (err) {
        log("delete transaction failed, unexpected error", err);

        return {
            isSuccess: false,
            errorCode: getErrorCode(err),
        };
    }
}

/**
 * Every month from the account's oldest to its newest transaction, newest first.
 * API v3 has no month list, so months without transactions are included.
 */
export async function getTransactionMonthYearList(
    request: GetTransactionMonthYearListRequest
): Promise<GetTransactionMonthYearListResponse> {
    try {
        const response = await client.query({
            query: GET_TRANSACTION_DATE_RANGE,
            variables: {
                accountId: request.accountId,
            },
            fetchPolicy: "network-only",
        });

        if (response.error) {
            log("get transaction month year list failed", response.error);

            return {
                monthYears: [],
            };
        }

        const oldest = response.data.oldest.edges[0]?.node.occurredAt;
        const newest = response.data.newest.edges[0]?.node.occurredAt;

        return {
            monthYears: oldest ? monthYearsBetween(new Date(oldest), new Date(newest)) : [],
        };
    } catch (err) {
        log("get transaction month year list failed, unexpected error", err);

        return {
            monthYears: [],
        };
    }
}

async function patchTransaction(request: UpdateTransactionRequest) {
    const variables = {
        id: request.id,
        amount: request.amount,
        categoryId: request.categoryId,
        description: request.description,
        occurredAt: request.occurredAt && toOffsetDateTime(request.occurredAt),
    };

    switch (request.type) {
        case "EXPENSE": {
            const response = await client.mutate({ mutation: PATCH_EXPENSE, variables });

            return { error: response.error, data: response.data?.patchExpense };
        }
        case "INCOME": {
            const response = await client.mutate({ mutation: PATCH_INCOME, variables });

            return { error: response.error, data: response.data?.patchIncome };
        }
        case "TRANSFER": {
            const response = await client.mutate({
                mutation: PATCH_TRANSFER,
                variables: { ...variables, convertedAmount: request.convertedAmount },
            });

            return { error: response.error, data: response.data?.patchTransfer };
        }
    }
}

/** Changes only the request's given fields; the type can't change. */
export async function updateTransaction(
    request: UpdateTransactionRequest
): Promise<UpdateTransactionResponse> {
    try {
        const response = await patchTransaction(request);

        if (response.error) {
            log("update transaction failed", response.error);

            return {
                updatedTransaction: null,
                errorCode: getErrorCode(response.error),
            };
        }

        return {
            updatedTransaction: mapTransactionFromServer(response.data),
        };
    } catch (err) {
        log("update transaction failed, unexpected error", err);

        return {
            updatedTransaction: null,
            errorCode: getErrorCode(err),
        };
    }
}
