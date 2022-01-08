import { ApolloClient, createHttpLink, InMemoryCache } from "@apollo/client";
import { setContext } from "@apollo/client/link/context";
import { auth } from "./firebase";
import { getServerUrl } from "./rr";

const httpLink = createHttpLink({
    uri: getServerUrl,
});

const authLink = setContext(async (_, { headers }) => {
    const token = await auth.currentUser?.getIdToken();

    return {
        headers: {
            ...headers,
            authorization: token ? `Bearer ${token}` : "",
        },
    };
});

const client = new ApolloClient({
    link: authLink.concat(httpLink),
    cache: new InMemoryCache(),
});

export default client;
