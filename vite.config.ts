// vite.config.ts
import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import path from 'path'

export default defineConfig(({ mode }) => {
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
            port: Number(env.PORT) || 7002,
            allowedHosts: [
                env.ALLOWED_HOST || 'all',
            ],
        },
        preview: {
            port: 4173,
            host: true,
            allowedHosts: ["e5f2-2401-4900-61ae-8e11-ed79-7181-a196-94fc.ngrok-free.app"], // ✅ critical for ngrok!
        },
        define: {
            'process.env': env,
        },
    }
})
