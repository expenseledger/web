import client from "../lib/apollo";
import { fetchAllAccounts } from "./accountService";
import { fetchAllCategories } from "./categoryService";
import { graphql } from "./model/gql";
import User from "./model/User";

const INITIALIZE_USER = graphql(`
    mutation InitializeUser {
        initializeUser
    }
`);

/** Seeds the user's default categories and accounts (idempotent), then loads everything. */
export async function getUserData(): Promise<User> {
    const result = await client.mutate({
        mutation: INITIALIZE_USER,
    });

    if (result.error) {
        throw new Error(result.error.message);
    }

    const [accounts, categories] = await Promise.all([fetchAllAccounts(), fetchAllCategories()]);

    return {
        categories,
        accounts,
    };
}
