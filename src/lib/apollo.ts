import { ApolloClient, createHttpLink, InMemoryCache } from "@apollo/client";
import { setContext } from "@apollo/client/link/context";
import firebase from "./firebase";

let user: firebase.User | null = null;

firebase.auth().onAuthStateChanged((signedInUser) => (user = signedInUser));

const httpLink = createHttpLink({
    uri: `${process.env.REACT_APP_SERVER_URL}/graphql`,
});

const authLink = setContext(async (_, { headers }) => {
    const token = await user?.getIdToken();
    console.log(token);
    return {
        headers: {
            ...headers,
            authorization: token ? `Bearer ${token}` : "",
        },
    };
});

const client = new ApolloClient({
    link: authLink.concat(httpLink),
    cache: new InMemoryCache({ addTypename: false }),
});

export default client;
