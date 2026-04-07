import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev
export default defineConfig({
  plugins: [react()],
  server: {
    host: true, // Isso permite o acesso via IP na sua rede local
    
  }
})
