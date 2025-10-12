import client from "../lib/apollo";
import { graphql } from "./model/gql";
import User from "./model/User";

const CURRENT_USER = graphql(`
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
                        type
                    }
                }
            }
        }
    }
`);

export async function getUserData(): Promise<User> {
    const result = await client.mutate({
        mutation: CURRENT_USER,
    });

    if (result.error) {
        throw new Error(result.error.message);
    }

    return {
        categories: result.data.currentUser.owner.categories.nodes,
        accounts: result.data.currentUser.owner.accounts.nodes,
    };
}
