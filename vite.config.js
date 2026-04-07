import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  base: '/cliphair-scoping-tool/',
  plugins: [react()],
  server: {
    host: true,
    watch: {
      usePolling: true,
    },
  },
})
