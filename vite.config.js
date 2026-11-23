import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    // Semua request /api diteruskan ke server Express lokal
    proxy: { '/api': 'http://localhost:4000' },
  },
})
