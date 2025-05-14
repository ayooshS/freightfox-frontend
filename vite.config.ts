import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import path from 'path'

export default defineConfig(({ mode }) => {
    // Load all .env files based on the current mode
    const env = loadEnv(mode, process.cwd(), '')

    return {
        plugins: [
            react(),
            tailwindcss(),
        ],
        resolve: {
            alias: {
                '@': path.resolve(__dirname, './src'),
            },
        },
        server: {
            port: Number(env.PORT) || 7002, // fallback to 7002 if PORT is not set
            allowedHosts: [
                env.ALLOWED_HOST || 'sure-antelope-smooth.ngrok-free.app', // optional
            ],
        },
        define: {
            // Makes env vars available globally in the code (if needed)
            'process.env': env,
        },
    }
})
