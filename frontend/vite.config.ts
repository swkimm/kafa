/* eslint-disable @typescript-eslint/naming-convention */
import ckeditor5 from '@ckeditor/vite-plugin-ckeditor5'
import react from '@vitejs/plugin-react-swc'
import { fileURLToPath, URL } from 'url'
import { defineConfig } from 'vite'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    ckeditor5({ theme: require.resolve('@ckeditor/ckeditor5-theme-lark') })
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  },
  define: {
    global: 'window'
  },
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:4000',
        changeOrigin: true
      }
    }
  }
})
