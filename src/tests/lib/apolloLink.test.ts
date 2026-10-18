import { ApolloClient, ApolloLink, gql, InMemoryCache } from "@apollo/client";
import { ServerError } from "@apollo/client/errors";
import { Observable, of, throwError } from "rxjs";
import { createLink } from "../../lib/apolloLink";

const QUERY = gql`
    {
        accounts(first: 1) {
            pageInfo {
                hasNextPage
            }
        }
    }
`;

const RESULT = { accounts: { pageInfo: { hasNextPage: false } } };

/** A client whose server fails with `failures` in turn, then succeeds. */
function setup(failures: Error[] = []) {
    const onUnauthorized = jest.fn();
    const tokens: string[] = [];
    let requests = 0;
    const httpLink = new ApolloLink((operation): Observable<ApolloLink.Result> => {
        tokens.push(operation.getContext().headers.authorization);
        const failure = failures[requests++];

        return failure ? throwError(() => failure) : of({ data: RESULT });
    });
    const client = new ApolloClient({
        link: createLink({
            httpLink,
            getToken: async () => "token",
            refreshToken: async () => "fresh-token",
            onUnauthorized,
            retryDelay: () => 0,
        }),
        cache: new InMemoryCache(),
    });

    return {
        query: () => client.query({ query: QUERY, fetchPolicy: "network-only" }),
        onUnauthorized,
        tokens,
        requests: () => requests,
    };
}

const httpError = (status: number) =>
    new ServerError("HTTP error", { response: { status } as Response, bodyText: "" });

describe("createLink", () => {
    it("sends the bearer token", async () => {
        const { query, tokens } = setup();

        expect((await query()).data).toEqual(RESULT);
        expect(tokens).toEqual(["Bearer token"]);
    });

    it("signs out after a 401 that a fresh token doesn't fix", async () => {
        const { query, onUnauthorized, requests } = setup([httpError(401), httpError(401)]);

        await expect(query()).rejects.toThrow("HTTP error");

        expect(onUnauthorized).toHaveBeenCalledTimes(1);
        expect(requests()).toBe(2);
    });
});
