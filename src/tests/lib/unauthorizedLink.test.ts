import { ApolloClient, ApolloLink, gql, InMemoryCache } from "@apollo/client";
import { ServerError } from "@apollo/client/errors";
import { Observable, of, throwError } from "rxjs";
import { createUnauthorizedLink } from "../../lib/unauthorizedLink";

const MUTATION = gql`
    mutation {
        initializeUser
    }
`;

function serverError(status: number) {
    return new ServerError("HTTP error", { response: { status } as Response, bodyText: "" });
}

/** A client whose server answers with `statuses` in turn, then succeeds. */
function setup(statuses: number[], token: string | null = "fresh-token") {
    const refreshToken = jest.fn().mockResolvedValue(token);
    const onUnauthorized = jest.fn();
    let requests = 0;
    const server = new ApolloLink((): Observable<ApolloLink.Result> => {
        const status = statuses[requests++];

        return status
            ? throwError(() => serverError(status))
            : of({ data: { initializeUser: true } });
    });
    const client = new ApolloClient({
        link: createUnauthorizedLink({ refreshToken, onUnauthorized }).concat(server),
        cache: new InMemoryCache(),
    });

    return {
        mutate: () => client.mutate({ mutation: MUTATION }),
        refreshToken,
        onUnauthorized,
        requests: () => requests,
    };
}

describe("unauthorizedLink", () => {
    it("refreshes the token and retries once after a 401", async () => {
        const { mutate, refreshToken, onUnauthorized, requests } = setup([401]);

        const result = await mutate();

        expect(result.data).toEqual({ initializeUser: true });
        expect(refreshToken).toHaveBeenCalledTimes(1);
        expect(onUnauthorized).not.toHaveBeenCalled();
        expect(requests()).toBe(2);
    });

    it("signs out when the retry is still unauthorized", async () => {
        const { mutate, onUnauthorized, requests } = setup([401, 401]);

        await expect(mutate()).rejects.toThrow("HTTP error");

        expect(onUnauthorized).toHaveBeenCalledTimes(1);
        expect(requests()).toBe(2);
    });

    it("signs out without retrying when there is no token", async () => {
        const { mutate, onUnauthorized, requests } = setup([401], null);

        await expect(mutate()).rejects.toThrow("HTTP error");

        expect(onUnauthorized).toHaveBeenCalledTimes(1);
        expect(requests()).toBe(1);
    });

    it("leaves other errors alone", async () => {
        const { mutate, refreshToken, onUnauthorized } = setup([500]);

        await expect(mutate()).rejects.toThrow("HTTP error");

        expect(refreshToken).not.toHaveBeenCalled();
        expect(onUnauthorized).not.toHaveBeenCalled();
    });
});
