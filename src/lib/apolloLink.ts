import { ApolloLink } from "@apollo/client";
import { SetContextLink } from "@apollo/client/link/context";
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
            retryIf: (error, operation) => operation.operationType === "query",
        },
        delay: options.retryDelay ?? ((attempt) => 1000 * 2 ** (attempt - 1)),
    });

    return unauthorizedLink.concat(authLink).concat(options.httpLink).concat(retryLink);
}
