import { defineConfig  } from 'vite'

import react from '@vitejs/plugin-react-swc'
import path from 'path'

// https://vitejs.dev/config/
export default defineConfig(({}) => {
  return {
    plugins: [react()],
    server: {
      open: true,
      strictPort: true,
      host: true,
      port: 3000,
    }
  }
})
