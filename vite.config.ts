import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { defineConfig } from 'vite';
import tailwindcss from '@tailwindcss/vite';

import react from '@vitejs/plugin-react-swc';

const rootDir = path.dirname(fileURLToPath(import.meta.url));

// https://vitejs.dev/config/
export default defineConfig(() => {
    return {
        plugins: [react(), tailwindcss()],
        resolve: {
            alias: {
                '@': path.resolve(rootDir, 'src'),
            },
        },
        server: {
            open: true,
            strictPort: true,
            host: true,
            port: 3000,
        }
    }
})
