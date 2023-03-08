import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'
import nodePolyfills from 'rollup-plugin-polyfill-node'

// https://vitejs.dev/config/
/** @type {import('vite').UserConfig} */
export default defineConfig({
  plugins: [react(), nodePolyfills()],

  server: {
    port: 8000,
    proxy: {
      '^/lending/api': {
        // mock
        target: 'https://xbank.global',
        changeOrigin: true,
        secure: false,
        rewrite: (path) => path.replace(/^\/api/, ''),
      },
      '/api/ver2/': {
        target: 'https://xcr.tratao.com',
        changeOrigin: true,
        secure: false,
      },
    },
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          'react-venders': ['react', 'react-dom', 'react-router-dom'],
          'chakra-vendors': ['@chakra-ui/react'],
        },
      },
    },
  },
  resolve: {
    alias: {
      '@': path.join(__dirname, 'src'),
      process: 'process/browser',
      zlib: 'browserify-zlib',
      util: 'util',
    },
  },
  optimizeDeps: {
    esbuildOptions: {
      define: {
        global: 'globalThis',
      },
    },
  },
})
