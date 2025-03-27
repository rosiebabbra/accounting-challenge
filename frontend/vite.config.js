import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'


export default defineConfig({
  plugins: [react(), tailwindcss()],
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './test/setupTests.ts',
  },
  server: {
    proxy: {
      '/api': 'http://127.0.0.1:5000',
    },
  },
})
