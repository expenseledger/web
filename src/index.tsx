import { ApolloProvider } from "@apollo/client/react";
import { createRoot } from "react-dom/client";
import App from "./components/App";
import GlobalStyle from "./globalStyles";
import "@radix-ui/themes/styles.css";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import apolloClient from "./lib/apollo";

const container = document.getElementById("root") as HTMLElement;
const root = createRoot(container);

root.render(
    // <React.StrictMode>
    <>
        <GlobalStyle />
        <ApolloProvider client={apolloClient}>
            <App />
        </ApolloProvider>
    </>
    // </React.StrictMode>
);
