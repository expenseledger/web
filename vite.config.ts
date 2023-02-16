import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";
import { VitePWA } from "vite-plugin-pwa";
import svgrPlugin from "vite-plugin-svgr";

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [
        react(),
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
    },
});
