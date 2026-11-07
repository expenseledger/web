import { ApolloLink } from "@apollo/client";
import { SetContextLink } from "@apollo/client/link/context";
import { ServerError } from "@apollo/client/errors";
import { RetryLink } from "@apollo/client/link/retry";
import { createUnauthorizedLink } from "./unauthorizedLink";

interface LinkOptions {
    /** The terminating link that talks to the server. */
    httpLink: ApolloLink;
    /** The current ID token, if any. */
    getToken: () => Promise<string | null | undefined>;
    /** Force-refreshes the ID token; resolves to nothing when signed out. */
    refreshToken: () => Promise<string | null | undefined>;
    onUnauthorized: () => void;
    /** Milliseconds to wait before retry `attempt` (1-based). */
    retryDelay?: (attempt: number) => number;
}

export function createLink(options: LinkOptions): ApolloLink {
    const authLink = new SetContextLink(async (prevContext) => {
        const token = await options.getToken();

        return {
            headers: {
                ...prevContext.headers,
                authorization: token ? `Bearer ${token}` : "",
            },
        };
    });

    const unauthorizedLink = createUnauthorizedLink({
        refreshToken: options.refreshToken,
        onUnauthorized: options.onUnauthorized,
    });

    const retryLink = new RetryLink({
        attempts: {
            max: 5,
            // A 4xx won't change on retry (a 401 is the unauthorized link's job).
            retryIf: (error, operation) =>
                operation.operationType === "query" &&
                !(ServerError.is(error) && error.statusCode >= 400 && error.statusCode < 500),
        },
        delay: options.retryDelay ?? ((attempt) => 1000 * 2 ** (attempt - 1)),
    });

    // The HTTP link terminates the chain, so it goes last. Retries pass through
    // authLink again, so each attempt sends the current token.
    return ApolloLink.from([unauthorizedLink, retryLink, authLink, options.httpLink]);
}
