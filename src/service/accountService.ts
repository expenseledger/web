import { graphql } from "./model/gql";
import { log } from "../common/utils";
import client from "../lib/apollo";
import { mapAccountFromServer } from "./helper/accountHelper";
import {
    CreateAccountRequest,
    DeleteAccountRequest,
    GetAccountRequest,
    UpdateAccountRequest,
} from "./model/Requests/index";
import {
    CreateAccountResponse,
    DeleteAccountResponse,
    GetAccountResponse,
    GetAllAccountResponse,
    UpdateAccountResponse,
} from "./model/Responses/index";
import { AccountType } from "./model/gql/graphql";

const GET_ALL_ACCOUNTS = graphql(`
    query GetAllAccounts {
        accounts {
            nodes {
                id
                balance
                name
                type
            }
        }
    }
`);

const GET_ACCOUNT_BY_ID = graphql(`
    query GetAccountById($id: Int!) {
        account(id: $id) {
            id
            name
            balance
            type
        }
    }
`);

const CREATE_ACCOUNT = graphql(`
    mutation CreateAccount($name: String!, $type: AccountType!) {
        createAccount(input: { name: $name, type: $type, balance: 0.0 }) {
            account {
                balance
                id
                name
                type
            }
        }
    }
`);

const DELETE_ACCOUNT_BY_ID = graphql(`
    mutation DeleteAccount($id: Int!) {
        closeAccount(input: { id: $id }) {
            account {
                balance
                id
                name
                type
            }
        }
    }
`);

const UPDATE_ACCOUNT_BY_ID = graphql(`
    mutation UpdateAccount($id: Int!, $name: String!, $type: AccountType!) {
        updateAccount(input: { id: $id, name: $name, type: $type }) {
            account {
                balance
                id
                name
                type
            }
        }
    }
`);

export const accountFragment = graphql(`
    fragment PlainAccount on Account {
        id
        name
        type
        balance
    }
`);

export async function getAllAccount(): Promise<GetAllAccountResponse> {
    try {
        const response = await client.query({
            query: GET_ALL_ACCOUNTS,
        });

        if (response.error) {
            log("cannot get all accounts.", response.error);
            return {
                accounts: [],
            };
        }

        const toReturn = response.data.accounts.nodes.map(mapAccountFromServer);

        return {
            accounts: toReturn,
        };
    } catch (err) {
        log("cannot get all accounts, unexpected error", err);
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

export async function createAccount(request: CreateAccountRequest): Promise<CreateAccountResponse> {
    try {
        const response = await client.mutate({
            mutation: CREATE_ACCOUNT,
            variables: {
                name: request.name,
                type: request.type as AccountType,
            },
        });

        if (response.error) {
            log("cannot create account", response.error);

            return {
                account: null,
            };
        }

        return {
            account: mapAccountFromServer(response.data.createAccount.account),
        };
    } catch (err) {
        log("cannot create account, unexpected error", err);

        return {
            account: null,
        };
    }
}

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
            };
        }

        return {
            isSuccess: true,
        };
    } catch (err) {
        log(`cannot delete account id: ${request.id}, unexpected error`, err);

        return {
            isSuccess: false,
        };
    }
}

export async function updateAccount(request: UpdateAccountRequest): Promise<UpdateAccountResponse> {
    try {
        const response = await client.mutate({
            mutation: UPDATE_ACCOUNT_BY_ID,
            variables: {
                id: request.id,
                name: request.name,
                type: request.type as AccountType,
            },
        });

        if (response.error) {
            log(`Cannot update account`, response.error);

            return {
                account: null,
            };
        }

        return {
            account: mapAccountFromServer(response.data.updateAccount.account),
        };
    } catch (err) {
        log("cannot update account, unexpected error", err);

        return {
            account: null,
        };
    }
}
