import { graphql } from "./model/gql";
import { log } from "../common/utils";
import client from "../lib/apollo";
import { mapAccountFromServer } from "./helper/accountHelper";
import { getErrorCode } from "./helper/errorHelper";
import { roundMoney } from "./helper/moneyHelper";
import { fetchAllPages, MAX_PAGE_SIZE } from "./helper/pagingHelper";
import Account from "./model/Account";
import {
    CreateAccountRequest,
    DeleteAccountRequest,
    GetAccountRequest,
    PatchAccountRequest,
} from "./model/Requests/index";
import {
    CreateAccountResponse,
    DeleteAccountResponse,
    GetAccountResponse,
    GetAllAccountResponse,
    PatchAccountResponse,
} from "./model/Responses/index";

export const accountFragment = graphql(`
    fragment PlainAccount on Account {
        id
        name
        balance {
            amount
            currency
        }
    }
`);

const GET_ACCOUNTS_PAGE = graphql(`
    query GetAccountsPage($first: Int!, $after: String) {
        accounts(first: $first, after: $after, sort: [{ property: "name", direction: ASC }]) {
            edges {
                node {
                    ...PlainAccount
                }
            }
            pageInfo {
                hasNextPage
                endCursor
            }
        }
    }
`);

const GET_ACCOUNT_BY_ID = graphql(`
    query GetAccountById($id: ID!) {
        account(id: $id) {
            ...PlainAccount
        }
    }
`);

const CREATE_ACCOUNT = graphql(`
    mutation CreateAccount($name: String!, $balance: MoneyInput!) {
        createAccount(name: $name, balance: $balance) {
            ...PlainAccount
        }
    }
`);

const PATCH_ACCOUNT = graphql(`
    mutation PatchAccount($id: ID!, $name: String, $balance: MoneyInput) {
        patchAccount(id: $id, name: $name, balance: $balance) {
            ...PlainAccount
        }
    }
`);

const DELETE_ACCOUNT_BY_ID = graphql(`
    mutation DeleteAccount($id: ID!) {
        deleteAccount(id: $id)
    }
`);

/** Every account, sorted by name. Throws on failure. */
export async function fetchAllAccounts(): Promise<Account[]> {
    const nodes = await fetchAllPages(async (after) => {
        const response = await client.query({
            query: GET_ACCOUNTS_PAGE,
            variables: { first: MAX_PAGE_SIZE, after },
            fetchPolicy: "network-only",
        });

        if (response.error) {
            throw response.error;
        }

        return response.data.accounts;
    });

    return nodes.map(mapAccountFromServer);
}

export async function getAllAccount(): Promise<GetAllAccountResponse> {
    try {
        return {
            accounts: await fetchAllAccounts(),
        };
    } catch (err) {
        log("cannot get all accounts.", err);
        return {
            accounts: [],
        };
    }
}

export async function getAccount(request: GetAccountRequest): Promise<GetAccountResponse> {
    try {
        const response = await client.query({
            query: GET_ACCOUNT_BY_ID,
            variables: {
                id: request.id,
            },
            fetchPolicy: "network-only",
        });

        if (response.error) {
            log(`cannot get account by id: ${request.id}`, response.error);

            return {
                account: null,
            };
        }

        return {
            account: mapAccountFromServer(response.data.account),
        };
    } catch (err) {
        log(`cannot get account by id: ${request.id}, unexpected error`, err);

        return {
            account: null,
        };
    }
}

/** Creates the account with a zero balance; set the balance with `patchAccount`. */
export async function createAccount(request: CreateAccountRequest): Promise<CreateAccountResponse> {
    try {
        const response = await client.mutate({
            mutation: CREATE_ACCOUNT,
            variables: {
                name: request.name,
                balance: { amount: 0, currency: request.currency },
            },
        });

        if (response.error) {
            log("cannot create account", response.error);

            return {
                account: null,
                errorCode: getErrorCode(response.error),
            };
        }

        return {
            account: mapAccountFromServer(response.data.createAccount),
        };
    } catch (err) {
        log("cannot create account, unexpected error", err);

        return {
            account: null,
            errorCode: getErrorCode(err),
        };
    }
}

/** Renames the account and/or sets its balance directly (no transaction). */
export async function patchAccount(request: PatchAccountRequest): Promise<PatchAccountResponse> {
    try {
        const response = await client.mutate({
            mutation: PATCH_ACCOUNT,
            variables: {
                id: request.id,
                name: request.name,
                balance: roundMoney(request.balance),
            },
        });

        if (response.error) {
            log(`cannot patch account id: ${request.id}`, response.error);

            return {
                account: null,
                errorCode: getErrorCode(response.error),
            };
        }

        return {
            account: mapAccountFromServer(response.data.patchAccount),
        };
    } catch (err) {
        log(`cannot patch account id: ${request.id}, unexpected error`, err);

        return {
            account: null,
            errorCode: getErrorCode(err),
        };
    }
}

/**
 * Deletes the account and its expenses and incomes; its transfers become
 * expenses or incomes of the other account (balances stay as they are).
 */
export async function deleteAccount(request: DeleteAccountRequest): Promise<DeleteAccountResponse> {
    try {
        const response = await client.mutate({
            mutation: DELETE_ACCOUNT_BY_ID,
            variables: {
                id: request.id,
            },
        });

        if (response.error) {
            log(`Cannot delete account id: ${request.id}`, response.error);

            return {
                isSuccess: false,
                errorCode: getErrorCode(response.error),
            };
        }

        return {
            isSuccess: true,
        };
    } catch (err) {
        log(`cannot delete account id: ${request.id}, unexpected error`, err);

        return {
            isSuccess: false,
            errorCode: getErrorCode(err),
        };
    }
}
