import axios from "axios";
import { gql } from "@apollo/client";

import * as Constants from "./Constants";
import {
    AddExpenseRequest,
    AddIncomeRequest,
    AddTransferRequest,
    ListTransactionsRequest,
} from "./model/Requests";
import { DeleteTranactionRequest } from "./model/Requests";
import {
    AddExpenseResponse,
    AddIncomeResponse,
    AddTransferResponse,
    ListTransactionsResponse,
} from "./model/Responses";
import { DeleteTransactionResponse } from "./model/Responses";
import Transaction from "./model/Transaction";
import { callAxios, isReturnSuccessStatus, log } from "./Utils";

const transactionUrl = process.env.REACT_APP_SERVER_URL + "/transaction";

function mapJsonToTransaction(json: any): Transaction {
    return {
        id: json.id,
        srcWallet: json.src_wallet,
        dstWallet: json.dst_wallet,
        amount: json.amount,
        type: json.type,
        category: json.category,
        description: json.description,
        date: new Date(json.date),
    };
}

export async function addExpense(
    request: AddExpenseRequest
): Promise<AddExpenseResponse> {
    const response = await callAxios(
        axios.post,
        transactionUrl + "/createExpense",
        request
    );

    if (response.status !== Constants.httpStatus.ok || !response.success) {
        log(
            `AddExpense failed, status: ${response.status}, ${
                response.error ? response.error.message : ""
            }`
        );
        return null;
    }

    return {
        srcWallet: response.data.src_wallet,
        transaction: mapJsonToTransaction(response.data.transaction),
    };
}

export async function addIncome(
    request: AddIncomeRequest
): Promise<AddIncomeResponse> {
    const response = await callAxios(
        axios.post,
        transactionUrl + "/createIncome",
        request
    );

    if (!isReturnSuccessStatus(response)) {
        log(
            `AddIncome failed, status: ${response.status}, ${
                response.error ? response.error.message : ""
            }`
        );
        return null;
    }

    return {
        dstWallet: response.data.dst_wallet,
        transaction: mapJsonToTransaction(response.data.transaction),
    };
}

export async function addTransfer(
    request: AddTransferRequest
): Promise<AddTransferResponse> {
    const response = await callAxios(
        axios.post,
        transactionUrl + "/createTransfer",
        request
    );

    if (!isReturnSuccessStatus(response)) {
        log(
            `AddTransfer failed, status: ${response.status}, ${
                response.error ? response.error.message : ""
            }`
        );
        return null;
    }

    return {
        dstWallet: response.data.dst_wallet,
        srcWallet: response.data.src_wallet,
        transaction: mapJsonToTransaction(response.data.transaction),
    };
}

export async function listTransactions(
    request: ListTransactionsRequest
): Promise<ListTransactionsResponse> {
    const response = await callAxios(
        axios.post,
        transactionUrl + "/list",
        request
    );

    if (!isReturnSuccessStatus(response)) {
        log(
            `ListTransactions failed, status: ${response.status}, ${
                response.error ? response.error.message : ""
            }`
        );

        return {
            length: 0,
            items: [],
        };
    }

    return {
        length: response.data.length,
        items: response.data.items.map(mapJsonToTransaction),
    };
}

export async function deleteTransaction(
    request: DeleteTranactionRequest
): Promise<DeleteTransactionResponse> {
    const response = await callAxios(
        axios.post,
        transactionUrl + "/delete",
        request
    );

    if (!isReturnSuccessStatus(response)) {
        log(
            `DeleteTransaction failed, status: ${response.status}, ${
                response.error ? response.error.message : ""
            }`
        );

        return {
            isSuccess: false,
        };
    }

    return {
        isSuccess: true,
    };
}

const accountFragment = gql`
    fragment PlainAccount on Account {
        id
        name
        type
        balance
    }
`;

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
    ) {
        spend(
            input: {
                amount: $amount
                description: $description
                categoryId: $categoryId
                fromAccountId: $fromAccountId
            }
        ) {
            transaction {
                ...PlainTransaction
                fromAccount {
                    ...PlainAccount
                }
            }
        }
    }
    ${transactionFragment}
    ${accountFragment}
`;
