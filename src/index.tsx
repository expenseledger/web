import { ApolloProvider } from "@apollo/client/react";
import { createRoot } from "react-dom/client";
import App from "./components/App";
import "@radix-ui/themes/styles.css";
import "./index.scss";
import apolloClient from "./lib/apollo";

const container = document.getElementById("root") as HTMLElement;
const root = createRoot(container);

root.render(
    // <React.StrictMode>
    <ApolloProvider client={apolloClient}>
        <App />
    </ApolloProvider>
    // </React.StrictMode>
);
