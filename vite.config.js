import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  css: {
    transformer: 'postcss',  // Tvinga PostCSS istället för Lightning CSS
  },
  build: {
    cssMinify: 'lightningcss', // Behåll lightningcss för minifiering
  },
  server: {
    proxy: {
      '/api/fda': {
        target: 'https://api.fda.gov',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/fda/, '')
      }
    }
  }
})