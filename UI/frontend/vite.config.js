import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { Buffer } from 'buffer'
import path from 'path'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  assetsInclude: ['**/*.md'], // Treat .md files as assets
  define: {
    global: 'globalThis',
  },
  resolve: {
    alias: {
      buffer: 'buffer',
      '@': path.resolve(__dirname, './src'),
      '@content': path.resolve(__dirname, '../../'),
    },
  },
  optimizeDeps: {
    include: ['buffer'],
  },
  // Serve static assets from the root imgs folder
  publicDir: path.resolve(__dirname, '../../imgs'),
  server: {
    // Allow serving files from parent directories
    fs: {
      allow: ['..', '../..'],
    },
  },
})
