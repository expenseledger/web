import { gql } from "@apollo/client";
import { log } from "../common/utils";
import client from "../lib/apollo";
import {
    mapWalletFromServer,
    mapWalletTypeToString,
} from "./helper/walletHelper";
import {
    CreateWalletRequest,
    DeleteWalletRequest,
    GetWalletRequest,
} from "./model/Requests/index";
import {
    CreateWalletResponse,
    DeleteWalletResponse,
    GetAllWalletResponse,
    GetWalletResponse,
} from "./model/Responses/index";

const GET_ALL_WALLETS = gql`
    query GetAllWallets {
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
    query GetWalletById($id: Int!) {
        getAccount(id: $id) {
            id
            name
            balance
            type
        }
    }
`;

const CREATE_WALET = gql`
    mutation CreateWallet($name: String!, $type: AccountType!) {
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
    mutation DeleteWallet($id: Int!) {
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

export async function getAllWallet(): Promise<GetAllWalletResponse> {
    const response = await client.query({
        query: GET_ALL_WALLETS,
    });

    if (response.errors) {
        log("Cannot get all wallets.", response.errors);
        return {
            wallets: [],
        };
    }

    const toReturn = response.data.accounts.nodes.map(mapWalletFromServer);

    return {
        wallets: toReturn,
    };
}

export async function getWallet(
    request: GetWalletRequest
): Promise<GetWalletResponse> {
    const response = await client.query({
        query: GET_WALLET_BY_ID,
        variables: {
            id: request.id,
        },
    });

    if (response.errors) {
        log(`Cannet get wallet by id: ${request.id}`, response.errors);

        return {
            wallet: null,
        };
    }

    return {
        wallet: mapWalletFromServer(response.data.getAccount),
    };
}

export async function createWallet(
    request: CreateWalletRequest
): Promise<CreateWalletResponse> {
    const response = await client.mutate({
        mutation: CREATE_WALET,
        variables: {
            name: request.name,
            type: mapWalletTypeToString(request.type, true),
        },
    });

    if (response.errors) {
        log(`Cannot create wallet`, response.errors);

        return {
            wallet: null,
        };
    }

    return {
        wallet: mapWalletFromServer(response.data.createAccount.account),
    };
}

export async function deleteWallet(
    request: DeleteWalletRequest
): Promise<DeleteWalletResponse> {
    const response = await client.mutate({
        mutation: DELETE_WALLET_BY_ID,
        variables: {
            id: request.id,
        },
    });

    if (response.errors) {
        log(`Cannot delete wallet id: ${request.id}`, response.errors);

        return {
            isSuccess: false,
        };
    }

    return {
        isSuccess: true,
    };
}
