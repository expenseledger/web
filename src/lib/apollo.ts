import { ApolloClient, createHttpLink, InMemoryCache } from "@apollo/client";
import { setContext } from "@apollo/client/link/context";
import { onAuthStateChanged, User } from "firebase/auth";
import { auth } from "./firebase";
import { getServerUrl } from "./rr";

let user: User | null = null;

onAuthStateChanged(auth, (signedInUser) => (user = signedInUser));

const httpLink = createHttpLink({
    uri: getServerUrl,
});

const authLink = setContext(async (_, { headers }) => {
    const token = await user?.getIdToken();

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
