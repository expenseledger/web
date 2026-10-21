import react from "@vitejs/plugin-react";
import { readFileSync } from "node:fs";
import { graphql } from "graphql";
import { defineConfig, loadEnv, Plugin, ProxyOptions } from "vite";
import { VitePWA } from "vite-plugin-pwa";
import svgrPlugin from "vite-plugin-svgr";
import babel from "@rolldown/plugin-babel";
import { createMockV3 } from "./src/mock/mockV3";

/**
 * Serves the in-memory API v3 at /mock/graphql in `npm start`, seeded
 * with a few accounts. Use it with VITE_SERVER_URL=http://localhost:3000/mock/graphql.
 * Data lives until the dev server restarts; auth is ignored.
 */
function mockApiV3(): Plugin {
    return {
        name: "mock-api-v3",
        apply: "serve",
        configureServer(server) {
            const { schema, rootValue } = createMockV3(readFileSync("schema.graphql", "utf8"));
            rootValue.createAccount({ name: "Cash", balance: { amount: 1000, currency: "THB" } });
            rootValue.createAccount({ name: "Bank", balance: { amount: 25000, currency: "THB" } });
            rootValue.createAccount({ name: "Euro", balance: { amount: 100, currency: "EUR" } });

            server.middlewares.use("/mock/graphql", (req, res) => {
                let body = "";
                req.on("data", (chunk) => (body += chunk));
                req.on("end", async () => {
                    const { query, variables, operationName } = JSON.parse(body || "{}");
                    const result = await graphql({
                        schema,
                        rootValue,
                        source: query,
                        variableValues: variables,
                        operationName,
                    });
                    res.setHeader("Content-Type", "application/json");
                    res.end(JSON.stringify(result));
                });
            });
        },
    };
}

function apiProxy(target: string | undefined): Record<string, ProxyOptions> | undefined {
    if (!target) {
        return undefined;
    }

    return {
        "/api/graphql": {
            target,
            changeOrigin: true,
            configure: (proxy) => proxy.on("proxyReq", (req) => req.removeHeader("origin")),
        },
    };
}

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
    plugins: [
        mockApiV3(),
        react(),
        babel({
            plugins: ["babel-plugin-react-compiler"],
        }),
        svgrPlugin(),
        VitePWA({
            registerType: "autoUpdate",
            devOptions: { enabled: true },
            manifest: {
                name: "Expense Ledger",
                short_name: "Expense Ledger",
                description: "Web application for tracking expenses",
                theme_color: "#ffffff",
                background_color: "#ffffff",
                icons: [
                    {
                        src: "favicon.ico",
                        sizes: "64x64 32x32 24x24 16x16",
                        type: "image/x-icon",
                    },
                    {
                        src: "maskable_icon_x192.png",
                        sizes: "192x192",
                        type: "image/png",
                        purpose: "any maskable",
                    },
                    {
                        src: "maskable_icon_x512.png",
                        sizes: "512x512",
                        type: "image/png",
                        purpose: "any maskable",
                    },
                ],
                start_url: "/",
                display: "standalone",
            },
        }),
    ],
    build: {
        outDir: "build",
    },
    server: {
        open: true,
        port: 3000,
        // Forwards /api/graphql to API_PROXY_TARGET (e.g. the deployed API),
        // so local dev works with VITE_SERVER_URL=/api/graphql and no
        // localhost in the API's CORS list. The Origin header is dropped, or
        // Spring rejects the request as cross-origin with a 403.
        proxy: apiProxy(loadEnv(mode, process.cwd(), "").API_PROXY_TARGET),
    },
}));
