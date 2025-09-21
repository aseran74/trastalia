import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueJsx from '@vitejs/plugin-vue-jsx'
import vueDevTools from 'vite-plugin-vue-devtools'

// https://vite.dev/config/
export default defineConfig(({ command, mode }) => ({
  plugins: [
    vue(),
    vueJsx(),
    // Solo habilitar Vue DevTools en modo desarrollo
    ...(command === 'serve' && mode === 'development' ? [vueDevTools()] : []),
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    },
  },
  build: {
    rollupOptions: {
      external: (id) => {
        // Excluir archivos de imágenes de public de la resolución de módulos
        return id.startsWith('/images/')
      }
    }
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
