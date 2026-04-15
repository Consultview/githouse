import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev
export default defineConfig({
  plugins: [react()],
  server: {
    host: true,
    allowedHosts: ['://onrender.com'] // Adicione esta linha
  }
})
