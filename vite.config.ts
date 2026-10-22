import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { defineConfig } from 'vite';
import tailwindcss from '@tailwindcss/vite';


const rootDir = path.dirname(fileURLToPath(import.meta.url));

// https://vitejs.dev/config/
export default defineConfig(() => {
    return {
        envPrefix: ['VITE_', 'API_', 'DEFAULT_'],
        // Prebundle the renderer with React interop; refresh local tarballs on server startup.
        optimizeDeps: { include: ['@eternal-encoders/konva-floor-plan'], force: true },
        plugins: [tailwindcss()],
        resolve: {
            alias: {
                '@': path.resolve(rootDir, 'src'),
            },
        },
        server: {
            open: false,
            strictPort: true,
            host: '0.0.0.0',
            port: 3000,
            proxy: {
                '/backend': {
                    target: 'https://api.test.how-to-navigate.ru',
                    changeOrigin: true,
                    rewrite: path => path.replace(/^\/backend/, ''),
                },
            },
        }
    }
})
