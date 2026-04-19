import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { VitePWA } from "vite-plugin-pwa";

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: "autoUpdate",
      // Mantém habilitado para você testar no Termux
      devOptions: { 
        enabled: true, 
        type: 'module' 
      },
      // Configuração de cache para produção (Render)
      workbox: {
        globPatterns: ['**/*.{js,css,html,ico,png,svg,json}'],
        cleanupOutdatedCaches: true,
        clientsClaim: true,
        skipWaiting: true
      },
      manifest: {
        name: "CityHouse",
        short_name: "CityHouse",
        start_url: "/",
        display: "standalone",
        background_color: "#ffffff",
        theme_color: "#000000",
        icons: [
          { 
            src: "favicon.svg", 
            sizes: "any", 
            type: "image/svg+xml",
            purpose: "any" 
          },
          { 
            src: "icons/icon-192.png", 
            sizes: "192x192", 
            type: "image/png" 
          },
          { 
            src: "icons/icon-512.png", 
            sizes: "512x512", 
            type: "image/png",
            purpose: "maskable" 
          }
        ]
      }
    })
  ],
  define: { 'process.env': {} },
  server: { 
    host: true, 
    port: 5173 
  },
  preview: { 
    host: true, 
    port: 4173 
  }
});
