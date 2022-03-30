import { ApolloProvider } from "@apollo/client";
import "@fortawesome/fontawesome-free/css/all.css";
import "bulma/css/bulma.css";
import React from "react";
import { createRoot } from "react-dom/client";
import { RecoilRoot } from "recoil";
import SwiperCore, { Navigation, Pagination } from "swiper";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import App from "./components/App";
import "./index.scss";
import apolloClient from "./lib/apollo";
import { register } from "./serviceWorkerRegistration";

SwiperCore.use([Pagination, Navigation]);

const container = document.getElementById("root");
const root = createRoot(container);

root.render(
    <RecoilRoot>
        <ApolloProvider client={apolloClient}>
            <App />
        </ApolloProvider>
    </RecoilRoot>
);

register();
