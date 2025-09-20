<template>
  <div class="flex items-center space-x-4">
    <!-- Puntos del usuario -->
    <div class="hidden lg:flex items-center space-x-2 px-3 py-2 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
      <svg class="w-4 h-4 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"></path>
      </svg>
      <span class="text-sm font-medium text-blue-800 dark:text-blue-200">
        {{ user?.points || 0 }} pts
      </span>
    </div>

    <!-- Nivel logístico -->
    <div class="hidden lg:flex items-center space-x-2 px-3 py-2 bg-green-50 dark:bg-green-900/20 rounded-lg">
      <svg class="w-4 h-4 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"></path>
      </svg>
      <span class="text-sm font-medium text-green-800 dark:text-green-200">
        {{ getLogisticsLevelText(user?.logisticsLevel) }}
      </span>
    </div>

    <!-- Estado de conexión -->
    <div class="flex items-center space-x-2">
      <div class="flex items-center space-x-1">
        <div 
          :class="[
            'w-2 h-2 rounded-full',
            isOnline ? 'bg-green-500' : 'bg-red-500'
          ]"
        ></div>
        <span class="text-xs text-gray-500 dark:text-gray-400">
          {{ isOnline ? 'En línea' : 'Desconectado' }}
        </span>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useAuthStore } from '@/stores/auth'

const authStore = useAuthStore()
const isOnline = ref(navigator.onLine)

const user = computed(() => authStore.user)

const getLogisticsLevelText = (level) => {
  const levels = {
    'civil': 'Civil',
    'comerciante': 'Comerciante',
    'transportista': 'Transportista',
    'capitán': 'Capitán',
    'almirante': 'Almirante'
  }
  return levels[level] || 'Civil'
}

// Escuchar cambios de estado de conexión
const handleOnline = () => {
  isOnline.value = true
}

const handleOffline = () => {
  isOnline.value = false
}

onMounted(() => {
  window.addEventListener('online', handleOnline)
  window.addEventListener('offline', handleOffline)
})

onUnmounted(() => {
  window.removeEventListener('online', handleOnline)
  window.removeEventListener('offline', handleOffline)
})
</script>





