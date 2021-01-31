import { gql } from "@apollo/client";
import client from "../lib/apollo";
import User from "./model/User";

export const CURRENT_USER = gql`
    mutation CurrentUser {
        currentUser(input: {}) {
            owner {
                accounts(orderBy: [NAME_ASC]) {
                    nodes {
                        id
                        name
                        type
                        balance
                    }
                }
                categories(orderBy: [NAME_ASC]) {
                    nodes {
                        id
                        name
                    }
                }
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

export async function getUserData(): Promise<User> {
    const result = await client.mutate({
        mutation: CURRENT_USER,
    });

    if (result.errors) {
        throw new Error(result.errors.map((x) => x.message).join("\n"));
    }

    return {
        categories: result.data.currentUser.owner.categories.nodes,
        wallets: result.data.currentUser.owner.accounts.nodes,
    };
}
