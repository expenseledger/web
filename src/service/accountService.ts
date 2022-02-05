import { gql } from "@apollo/client";
import { log } from "../common/utils";
import client from "../lib/apollo";
import { mapAccountFromServer, mapAccountTypeToString } from "./helper/accountHelper";
import {
    CreateAccountRequest,
    DeleteAccountRequest,
    GetAccountRequest,
} from "./model/Requests/index";
import {
    CreateAccountResponse,
    DeleteAccountResponse,
    GetAccountResponse,
    GetAllAccountResponse,
} from "./model/Responses/index";

const GET_ALL_WALLETS = gql`
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
`;

const GET_WALLET_BY_ID = gql`
    query GetAccountById($id: Int!) {
        getAccount(id: $id) {
            id
            name
            balance
            type
        }
    }
`;

const CREATE_WALET = gql`
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
`;

const DELETE_WALLET_BY_ID = gql`
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
`;

export const accountFragment = gql`
    fragment PlainAccount on Account {
        id
        name
        type
        balance
    }
`;

export async function getAllAccount(): Promise<GetAllAccountResponse> {
    const response = await client.query({
        query: GET_ALL_WALLETS,
    });

    if (response.errors) {
        log("Cannot get all accounts.", response.errors);
        return {
            accounts: [],
        };
    }

    const toReturn = response.data.accounts.nodes.map(mapAccountFromServer);

    return {
        accounts: toReturn,
    };
}

export async function getAccount(request: GetAccountRequest): Promise<GetAccountResponse> {
    const response = await client.query({
        query: GET_WALLET_BY_ID,
        variables: {
            id: request.id,
        },
    });

    if (response.errors) {
        log(`Cannet get account by id: ${request.id}`, response.errors);

        return {
            account: null,
        };
    }

    return {
        account: mapAccountFromServer(response.data.getAccount),
    };
}

export async function createAccount(request: CreateAccountRequest): Promise<CreateAccountResponse> {
    const response = await client.mutate({
        mutation: CREATE_WALET,
        variables: {
            name: request.name,
            type: mapAccountTypeToString(request.type, true),
        },
    });

    if (response.errors) {
        log(`Cannot create account`, response.errors);

        return {
            account: null,
        };
    }

    return {
        account: mapAccountFromServer(response.data.createAccount.account),
    };
}

export async function deleteAccount(request: DeleteAccountRequest): Promise<DeleteAccountResponse> {
    const response = await client.mutate({
        mutation: DELETE_WALLET_BY_ID,
        variables: {
            id: request.id,
        },
    });

    if (response.errors) {
        log(`Cannot delete account id: ${request.id}`, response.errors);

        return {
            isSuccess: false,
        };
    }

    return {
        isSuccess: true,
    };
}
