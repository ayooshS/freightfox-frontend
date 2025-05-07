import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import path from "path"


// https://vite.dev/config/
export default defineConfig({
  plugins: [
      react(),
      tailwindcss(),
  ],
    resolve: {
        alias: {
            "@": path.resolve(__dirname, "./src"),
        },
    },
    server: {
        proxy: {
            '/api': {
                target: 'http://localhost:3000', // JSON Server URL
                changeOrigin: true,
                rewrite: (path) => path.replace(/^\/api/, ''), // Optional: Remove /api prefix
            },
        },
        allowedHosts: ['sure-antelope-smooth.ngrok-free.app','03f4-106-51-217-224.ngrok-free.app', 'dc8d-106-51-217-224.ngrok-free.app'], // 👈 add your ngrok domain here
    }

})
