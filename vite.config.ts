import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueJsx from '@vitejs/plugin-vue-jsx'
import vueDevTools from 'vite-plugin-vue-devtools'
import { createHtmlPlugin } from 'vite-plugin-html'

// https://vite.dev/config/
export default defineConfig(({ command, mode }) => ({
  base: mode === 'production' ? '/' : '/',
  plugins: [
    vue(),
    vueJsx(),
    // Solo habilitar Vue DevTools en modo desarrollo
    ...(command === 'serve' && mode === 'development' ? [vueDevTools()] : []),
    // Plugin de HTML para controlar el título
    createHtmlPlugin({
      minify: true,
      inject: {
        data: {
          title: 'Trastalia - Nueva manera de vender artículos de segunda mano'
        }
      }
    })
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    },
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: undefined,
        chunkFileNames: 'assets/[name]-[hash].js',
        entryFileNames: 'assets/[name]-[hash].js',
        assetFileNames: 'assets/[name]-[hash].[ext]'
      }
    },
    chunkSizeWarningLimit: 1000
  },
  define: {
    // Deshabilitar Vue DevTools en producción
    __VUE_PROD_DEVTOOLS__: mode === 'development',
  },
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:3002',
        changeOrigin: true,
        secure: false
      }
    }
  }
}))
