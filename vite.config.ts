import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";
import { VitePWA } from "vite-plugin-pwa";
import svgrPlugin from "vite-plugin-svgr";

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [
        react(),
        svgrPlugin(),
        VitePWA({ registerType: "autoUpdate", devOptions: { enabled: true } }),
    ],
    build: {
        outDir: "build",
    },
    server: {
        open: true,
        port: 3000,
    },
});
