import { CombinedGraphQLErrors } from "@apollo/client";

/** The API v3 `extensions.code` of a GraphQL error, e.g. `NAME_TAKEN`. */
export function getErrorCode(error: unknown): string | undefined {
    if (!CombinedGraphQLErrors.is(error)) {
        return undefined;
    }

    const code = error.errors[0]?.extensions?.code;

    return typeof code === "string" ? code : undefined;
}
