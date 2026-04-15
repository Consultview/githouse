export default defineConfig({
  plugins: [react()],
  server: {
    allowedHosts: ['cityhouse.onrender.com']
  },
  preview: {
    allowedHosts: ['cityhouse.onrender.com']
  }
})
