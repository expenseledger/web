import { ApolloProvider } from "@apollo/client";
import { createRoot } from "react-dom/client";
import App from "./components/App";
import "@radix-ui/themes/styles.css";
import "./index.scss";
import apolloClient from "./lib/apollo";
import { Theme } from "@radix-ui/themes";
import { color } from "./common/constants";

const container = document.getElementById("root") as HTMLElement;
const root = createRoot(container);

root.render(
    // <React.StrictMode>
    <ApolloProvider client={apolloClient}>
        <Theme accentColor={color.primary}>
            <App />
        </Theme>
    </ApolloProvider>
    // </React.StrictMode>
);
