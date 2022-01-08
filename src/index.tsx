import { ApolloProvider } from "@apollo/client";
import "@fortawesome/fontawesome-free/css/all.css";
import "bulma/css/bulma.css";
import React from "react";
import ReactDOM from "react-dom";
import { RecoilRoot } from "recoil";
import SwiperCore, { Pagination } from "swiper";
import "swiper/css";
import "swiper/css/pagination";
import App from "./components/App";
import "./index.scss";
import apolloClient from "./lib/apollo";
import { register } from "./serviceWorkerRegistration";

SwiperCore.use([Pagination]);

ReactDOM.render(
    <RecoilRoot>
        <ApolloProvider client={apolloClient}>
            <App />
        </ApolloProvider>
    </RecoilRoot>,
    document.getElementById("root") as HTMLElement
);

register();
