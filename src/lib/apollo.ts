import { ApolloClient, InMemoryCache } from "@apollo/client";
import { HttpLink } from "@apollo/client/link/http";
import { SetContextLink } from "@apollo/client/link/context";
import { auth } from "./firebase";
import { getServerUrl } from "./rr";

const httpLink = new HttpLink({
    uri: getServerUrl,
});

const getAuthToken = async (retry = 0): Promise<string> => {
    const token = await auth.currentUser?.getIdToken();

    if (retry === 3) {
        return token;
    } else if (token === undefined || token === null) {
        await new Promise((resolve) => setTimeout(resolve, 1000));
        return getAuthToken(++retry);
    } else {
        return token;
    }
};

const authLink = new SetContextLink(async (prevContext) => {
    const token = await getAuthToken();

    return {
        headers: {
            ...prevContext.headers,
            authorization: token ? `Bearer ${token}` : "",
        },
    };
});

const client = new ApolloClient({
    link: authLink.concat(httpLink),
    cache: new InMemoryCache(),
});

export default client;
