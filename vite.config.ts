import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import path from "path";

// https://vite.dev/config/
export default defineConfig({
    plugins: [react(), tailwindcss()],
    resolve: {
        alias: {
            "@": path.resolve(__dirname, "./src"),
        },
    },
    server: {
        allowedHosts: [
            "sure-antelope-smooth.ngrok-free.app",
            "7bf5a057-7a03-49d8-8426-14d6bcbfec9d-00-36g3647l70hve.pike.replit.dev",
        ], // 👈 add your ngrok domain here
    },
});
