import { InMemoryCache } from "@apollo/client";

/** Shared by the app's client and the tests' mock client. */
export function createCache(): InMemoryCache {
    return new InMemoryCache({
        possibleTypes: {
            Transaction: ["Expense", "Income", "Transfer"],
        },
    });
}
