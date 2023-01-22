import { gql } from "@apollo/client";
import { log } from "../common/utils";
import client from "../lib/apollo";
import { accountFragment } from "./accountService";
import { categoryFragment } from "./categoryService";
import { mapTransactionFromServer } from "./helper/transactoinHelper";
import {
    AddExpenseRequest,
    AddIncomeRequest,
    AddTransferRequest,
    DeleteTranactionRequest,
    GetTransactionMonthYearListRequest,
    ListTransactionsRequest,
} from "./model/Requests";
import {
    AddExpenseResponse,
    AddIncomeResponse,
    AddTransferResponse,
    GetTransactionMonthYearListResponse,
    ListTransactionsResponse,
} from "./model/Responses";
import { DeleteTransactionResponse } from "./model/Responses/index";
import { Transaction } from "./model/Transaction";

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

const ADD_EXPENSE = gql`
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

const ADD_INCOME = gql`
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

const ADD_TRANSFER = gql`
    mutation AddTransfer(
        $amount: Float!
        $description: String!
        $categoryId: Int!
        $fromAccountId: Int!
        $toAccountId: Int!
        $occurredAt: Datetime!
    ) {
        transferV2(
            input: {
                amount: $amount
                description: $description
                categoryId: $categoryId
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

const DELETE_TRANSACTION = gql`
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

const GET_TRANSACTIONS_BY_TO_ACCOUNT_ID = gql`
    query GetTransactions($accountId: Int!, $from: Datetime!, $until: Datetime!) {
        transactions(
            condition: { toAccountId: $accountId }
            filter: { date: { greaterThanOrEqualTo: $from, lessThan: $until } }
        ) {
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

const GET_TRANSACTIONS_BY_FROM_ACCOUNT_ID = gql`
    query GetTransactions($accountId: Int!, $from: Datetime!, $until: Datetime!) {
        transactions(
            condition: { fromAccountId: $accountId }
            filter: { date: { greaterThanOrEqualTo: $from, lessThan: $until } }
        ) {
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

const GET_TRANSACTION_MONTH_YEAR_LIST_BY_ACCOUNT_ID = gql`
    query GetTransactionMonthYearListByAccountId($accountId: Int!) {
        transactionMonthYearListByAccountId(accountId: $accountId) {
            nodes
        }
    }
`;

export async function addExpense(request: AddExpenseRequest): Promise<AddExpenseResponse> {
    try {
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
    } catch (err) {
        log("Add expense failed, unexpected error", err);

        return null;
    }
}

export async function addIncome(request: AddIncomeRequest): Promise<AddIncomeResponse> {
    try {
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
            transaction: mapTransactionFromServer(response.data.receive.transaction),
        };
    } catch (err) {
        log("Add income failed, unexpected error", err);

        return null;
    }
}

export async function addTransfer(request: AddTransferRequest): Promise<AddTransferResponse> {
    try {
        const response = await client.mutate({
            mutation: ADD_TRANSFER,
            variables: {
                amount: request.amount,
                description: request.description,
                categoryId: request.categoryId,
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
            transaction: mapTransactionFromServer(response.data.transferV2.transaction),
        };
    } catch (err) {
        log("Add transfer failed, unexpected error", err);

        return null;
    }
}

export async function listTransactions(
    request: ListTransactionsRequest
): Promise<ListTransactionsResponse> {
    try {
        const [resToAcc, resFromAcc] = await Promise.all([
            client.query({
                query: GET_TRANSACTIONS_BY_TO_ACCOUNT_ID,
                variables: {
                    accountId: request.accountId,
                    from: request.from,
                    until: request.until,
                },
                fetchPolicy: request.useCache ? "cache-first" : "network-only",
            }),
            client.query({
                query: GET_TRANSACTIONS_BY_FROM_ACCOUNT_ID,
                variables: {
                    accountId: request.accountId,
                    from: request.from,
                    until: request.until,
                },
                fetchPolicy: request.useCache ? "cache-first" : "network-only",
            }),
        ]);
        const result = {
            transactions: [
                ...resToAcc.data.transactions.nodes,
                ...resFromAcc.data.transactions.nodes,
            ],
            totalCount:
                resToAcc.data.transactions.totalCount + resFromAcc.data.transactions.totalCount,
        };

        if (resToAcc.errors || resFromAcc.errors) {
            if (resToAcc.errors) {
                log("list transactions failed", resToAcc.errors);
            }
            if (resFromAcc.errors) {
                log("list transactions failed", resFromAcc.errors);
            }

            return {
                length: 0,
                items: [],
            };
        }

        return {
            length: result.totalCount,
            items: result.transactions
                .map(mapTransactionFromServer)
                .sort((a: Transaction, b: Transaction) => {
                    if (b.date > a.date) {
                        return 1;
                    }

                    if (b.date < a.date) {
                        return -1;
                    }

                    if (b.id > a.id) {
                        return 1;
                    }

                    if (b.id < a.id) {
                        return -1;
                    }

                    return 0;
                }),
        };
    } catch (err) {
        log("list transactions failed, unexpected error", err);

        return {
            length: 0,
            items: [],
        };
    }
}

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

        if (response.errors) {
            log("delete transaction failed", response.errors);

            return {
                isSuccess: false,
            };
        }

        return {
            isSuccess: true,
        };
    } catch (err) {
        log("delete transaction failed, unexpected error", err);

        return {
            isSuccess: false,
        };
    }
}

export async function getTransactionMonthYearList(
    request: GetTransactionMonthYearListRequest
): Promise<GetTransactionMonthYearListResponse> {
    try {
        const response = await client.query({
            query: GET_TRANSACTION_MONTH_YEAR_LIST_BY_ACCOUNT_ID,
            variables: {
                accountId: request.accountId,
            },
        });

        if (response.errors) {
            log("get transaction month year list failed", response.errors);

            return {
                monthYears: [],
            };
        }

        return {
            monthYears: response.data.transactionMonthYearListByAccountId.nodes,
        };
    } catch (err) {
        log("get transaction month year list failed, unexpected error", err);

        return {
            monthYears: [],
        };
    }
}
