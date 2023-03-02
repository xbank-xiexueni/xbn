import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { join } from 'path'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  css: {
    preprocessorOptions: {
      // 预编译支持 less
      less: {
        // 支持内联 JavaScript
        javascriptEnabled: true,
      },
    },
  },

  server: {
    open: true,
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
          'web3-vendors': ['web3'],
        },
      },
    },
  },
  resolve: {
    alias: {
      '@': join(__dirname, 'src'),
    },
  },
})
