import { ApolloProvider } from "@apollo/client";
import { createRoot } from "react-dom/client";
import { RecoilRoot } from "recoil";
import SwiperCore from "swiper";
import { Navigation, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import App from "./components/App";
import "@radix-ui/themes/styles.css";
import "./index.scss";
import apolloClient from "./lib/apollo";
import { Theme } from "@radix-ui/themes";

SwiperCore.use([Pagination, Navigation]);

const container = document.getElementById("root") as HTMLElement;
const root = createRoot(container);

root.render(
    // <React.StrictMode>
    <RecoilRoot>
        <ApolloProvider client={apolloClient}>
            <Theme>
                <App />
            </Theme>
        </ApolloProvider>
    </RecoilRoot>
    // </React.StrictMode>
);
