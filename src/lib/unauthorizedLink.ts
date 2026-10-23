import { ServerError } from "@apollo/client/errors";
import { ErrorLink } from "@apollo/client/link/error";
import { catchError, from, switchMap, throwError } from "rxjs";

interface UnauthorizedLinkOptions {
    /** Force-refreshes the ID token; resolves to nothing when signed out. */
    refreshToken: () => Promise<string | null | undefined>;
    onUnauthorized: () => void;
}

const isUnauthorized = (error: unknown) => ServerError.is(error) && error.statusCode === 401;

/**
 * API v3 answers a missing or rejected token with HTTP 401, not a GraphQL
 * error. Retry once with a refreshed token (the auth link after this one
 * picks it up); if that fails too, give up and sign out.
 */
export function createUnauthorizedLink(options: UnauthorizedLinkOptions): ErrorLink {
    return new ErrorLink(({ error, operation, forward }) => {
        if (!isUnauthorized(error)) {
            return;
        }

        return from(options.refreshToken()).pipe(
            switchMap((token) => {
                if (!token) {
                    throw error;
                }

                // Errors of this retry don't come back through the ErrorLink.
                return forward(operation);
            }),
            catchError((retryError) => {
                if (isUnauthorized(retryError)) {
                    options.onUnauthorized();
                }

                return throwError(() => retryError);
            })
        );
    });
}
