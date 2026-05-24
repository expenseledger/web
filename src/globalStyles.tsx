import { createGlobalStyle } from "styled-components";

const GlobalStyle = createGlobalStyle`
    @font-face {
        src: url("./assets/fonts/line_seed/LINESeedSans_W_Rg.woff2") format("woff2");
        font-display: swap;
        font-family: "LineSeedSans";
        font-weight: 400;
    }

    @font-face {
        src: url("./assets/fonts/line_seed/LINESeedSans_W_Bd.woff2") format("woff2");
        font-display: swap;
        font-family: "LineSeedSans";
        font-weight: 700;
    }

    @font-face {
        src: url("./assets/fonts/line_seed/LINESeedSans_W_XBd.woff2") format("woff2");
        font-display: fallback;
        font-family: "LineSeedSans";
        font-weight: 800;
    }

    @font-face {
        src: url("./assets/fonts/line_seed/LINESeedSansTH_W_Rg.woff2") format("woff2");
        font-display: swap;
        font-family: "LineSeedSansTH";
        font-weight: 400;
    }

    @font-face {
        src: url("./assets/fonts/line_seed/LINESeedSansTH_W_Bd.woff2") format("woff2");
        font-display: swap;
        font-family: "LineSeedSansTH";
        font-weight: 700;
    }

    @font-face {
        src: url("./assets/fonts/line_seed/LINESeedSansTH_W_XBd.woff2") format("woff2");
        font-display: swap;
        font-family: "LineSeedSansTH";
        font-weight: 800;
    }

    .radix-themes {
        --default-font-family: "LineSeedSans", "LineSeedSansTH", sans-serif;
    }

    body {
        margin: 0;
    }

    a {
        text-decoration: none;
        color: inherit;
    }
`;

export default GlobalStyle;
