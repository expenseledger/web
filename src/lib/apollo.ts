import { ApolloClient } from "@apollo/client";
import { HttpLink } from "@apollo/client/link/http";
import { auth } from "./firebase";
import { getServerUrl } from "./rr";
import { createCache } from "./apolloCache";
import { createLink } from "./apolloLink";

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

const client = new ApolloClient({
    link: createLink({
        httpLink: new HttpLink({ uri: getServerUrl }),
        getToken: () => getAuthToken(),
        refreshToken: async () => auth.currentUser?.getIdToken(true),
        // Signing out makes the auth listeners send the user to the sign-in page.
        onUnauthorized: () => auth.signOut(),
    }),
    cache: createCache(),
});

export default client;
