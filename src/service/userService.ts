import { gql } from "@apollo/client";
import client from "../lib/apollo";
import User from "./model/User";

const CURRENT_USER = gql`
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

export async function getUserData(): Promise<User> {
    const result = await client.mutate({
        mutation: CURRENT_USER,
    });

    if (result.errors) {
        throw new Error(result.errors.map((x) => x.message).join("\n"));
    }

    return {
        categories: result.data.currentUser.owner.categories.nodes,
        accounts: result.data.currentUser.owner.accounts.nodes,
    };
}
