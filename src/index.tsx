import "@fortawesome/fontawesome-free/css/all.css";
import "bulma/css/bulma.css";
import * as React from "react";
import * as ReactDOM from "react-dom";
import { RecoilRoot } from "recoil";
import { ApolloProvider } from "@apollo/client";

import App from "./container/App";
import "./index.scss";
import registerServiceWorker from "./registerServiceWorker";
import apolloClient from "./lib/apollo";

ReactDOM.render(
    <RecoilRoot>
        <ApolloProvider client={apolloClient}>
            <App />
        </ApolloProvider>
    </RecoilRoot>,
    document.getElementById("root") as HTMLElement
);
registerServiceWorker();
