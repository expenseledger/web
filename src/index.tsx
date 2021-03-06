import { ApolloProvider } from "@apollo/client";
import "@fortawesome/fontawesome-free/css/all.css";
import "bulma/css/bulma.css";
import React from "react";
import ReactDOM from "react-dom";
import { RecoilRoot } from "recoil";
import "slick-carousel/slick/slick-theme.css";
import "slick-carousel/slick/slick.css";
import App from "./components/App";
import "./index.scss";
import apolloClient from "./lib/apollo";
import { register } from "./serviceWorkerRegistration";

ReactDOM.render(
    <RecoilRoot>
        <ApolloProvider client={apolloClient}>
            <App />
        </ApolloProvider>
    </RecoilRoot>,
    document.getElementById("root") as HTMLElement
);

register();
