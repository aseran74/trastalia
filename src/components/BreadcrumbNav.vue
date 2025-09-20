<template>
  <nav class="flex items-center space-x-2 text-sm text-gray-500 dark:text-gray-400">
    <router-link
      to="/"
      class="hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
    >
      <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2-2z"></path>
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 5a2 2 0 012-2h4a2 2 0 012 2v6H8V5z"></path>
      </svg>
    </router-link>
    
    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path>
    </svg>
    
    <span class="text-gray-900 dark:text-white font-medium">
      {{ currentPageTitle }}
    </span>
  </nav>
</template>

<script setup>
import { computed } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()

const currentPageTitle = computed(() => {
  const titleMap = {
    '/': 'Landing',
    '/dashboard': 'Dashboard',
    '/comprar-articulo': 'Comprar Artículo',
    '/vender-articulo': 'Vender Artículo',
    '/mis-articulos': 'Mis Artículos',
    '/mis-compras': 'Mis Compras',
    '/mis-intercambios': 'Mis Intercambios',
    '/articulos-vendidos': 'Artículos Vendidos',
    '/mi-nave': 'Mi Nave',
    '/centros-logisticos': 'Centros Logísticos',
    '/servicios-logisticos': 'Servicios Logísticos',
    '/profile': 'Mi Perfil',
    '/google-places-example': 'Google Places Example'
  }
  
  // Verificar si es una ruta de detalle de artículo
  if (route.path.startsWith('/articulo/')) {
    return 'Detalle del Artículo'
  }
  
  return titleMap[route.path] || route.meta.title || 'Página'
})
</script>
