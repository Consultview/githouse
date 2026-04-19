import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { VitePWA } from "vite-plugin-pwa";

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: "autoUpdate",
      includeAssets: ["icons/favicon.svg", "icons/icon-192.png", "icons/icon-512.png"],
      devOptions: {
        enabled: true,
        type: "module"
      },
      workbox: {
        cleanupOutdatedCaches: true,
        clientsClaim: true,
        skipWaiting: true,
        // Ajuste para silenciar o aviso no Termux/Dev:
        globDirectory: 'dist',
        globPatterns: [] 
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
            src: "icons/favicon.svg", 
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
    allowedHosts: ['.onrender.com']
  },
  preview: {
    allowedHosts: ['.onrender.com']
  },
  // Garante que o build encontre os caminhos corretos no servidor
  base: './' 
});
