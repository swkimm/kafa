/* eslint-disable @typescript-eslint/naming-convention */
import react from '@vitejs/plugin-react-swc'
import { fileURLToPath, URL } from 'url'
import { defineConfig } from 'vite'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    },
    dedupe: ['react-redux']
  },
  define: {
    global: 'window'
  }
})
