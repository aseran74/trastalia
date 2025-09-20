<template>
  <div class="relative">
    <!-- Botón de notificaciones -->
    <button
      @click="toggleNotifications"
      class="relative p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
    >
      <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 17h5l-5 5v-5zM4.828 7l2.586 2.586a2 2 0 002.828 0L12.828 7H4.828zM4 12h16l-1 1H5l-1-1z"></path>
      </svg>
      
      <!-- Indicador de notificaciones -->
      <span
        v-if="unreadCount > 0"
        class="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center"
      >
        {{ unreadCount > 9 ? '9+' : unreadCount }}
      </span>
    </button>

    <!-- Panel de notificaciones -->
    <div
      v-if="isOpen"
      class="absolute right-0 mt-2 w-80 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 z-50"
    >
      <!-- Header -->
      <div class="px-4 py-3 border-b border-gray-200 dark:border-gray-700">
        <div class="flex items-center justify-between">
          <h3 class="text-lg font-semibold text-gray-900 dark:text-white">
            Notificaciones
          </h3>
          <button
            @click="markAllAsRead"
            class="text-sm text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
          >
            Marcar todas como leídas
          </button>
        </div>
      </div>

      <!-- Lista de notificaciones -->
      <div class="max-h-96 overflow-y-auto">
        <div v-if="notifications.length === 0" class="p-4 text-center text-gray-500 dark:text-gray-400">
          No hay notificaciones
        </div>
        
        <div
          v-for="notification in notifications"
          :key="notification.id"
          :class="[
            'px-4 py-3 border-b border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer',
            !notification.read ? 'bg-blue-50 dark:bg-blue-900/20' : ''
          ]"
          @click="markAsRead(notification.id)"
        >
          <div class="flex items-start space-x-3">
            <div
              :class="[
                'w-2 h-2 rounded-full mt-2',
                !notification.read ? 'bg-blue-500' : 'bg-gray-300 dark:bg-gray-600'
              ]"
            ></div>
            <div class="flex-1 min-w-0">
              <p class="text-sm font-medium text-gray-900 dark:text-white">
                {{ notification.title }}
              </p>
              <p class="text-sm text-gray-500 dark:text-gray-400">
                {{ notification.message }}
              </p>
              <p class="text-xs text-gray-400 dark:text-gray-500 mt-1">
                {{ formatTime(notification.createdAt) }}
              </p>
            </div>
          </div>
        </div>
      </div>

      <!-- Footer -->
      <div class="px-4 py-3 border-t border-gray-200 dark:border-gray-700">
        <router-link
          to="/notifications"
          class="text-sm text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
          @click="closeNotifications"
        >
          Ver todas las notificaciones
        </router-link>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'

const isOpen = ref(false)
const notifications = ref([
  {
    id: 1,
    title: 'Nueva compra realizada',
    message: 'Has comprado un iPhone 13 Pro Max por 899€',
    read: false,
    createdAt: new Date(Date.now() - 1000 * 60 * 30) // 30 minutos atrás
  },
  {
    id: 2,
    title: 'Artículo vendido',
    message: 'Tu MacBook Air M1 ha sido vendido',
    read: false,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 2) // 2 horas atrás
  },
  {
    id: 3,
    title: 'Puntos Trastalia',
    message: 'Has ganado 4500 puntos por tu venta',
    read: true,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24) // 1 día atrás
  },
  {
    id: 4,
    title: 'Centro logístico',
    message: 'Tu artículo ha sido almacenado en la nave',
    read: true,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2) // 2 días atrás
  }
])

const unreadCount = computed(() => {
  return notifications.value.filter(n => !n.read).length
})

const toggleNotifications = () => {
  isOpen.value = !isOpen.value
}

const closeNotifications = () => {
  isOpen.value = false
}

const markAsRead = (id) => {
  const notification = notifications.value.find(n => n.id === id)
  if (notification) {
    notification.read = true
  }
}

const markAllAsRead = () => {
  notifications.value.forEach(notification => {
    notification.read = true
  })
}

const formatTime = (date) => {
  const now = new Date()
  const diff = now - date
  const minutes = Math.floor(diff / (1000 * 60))
  const hours = Math.floor(diff / (1000 * 60 * 60))
  const days = Math.floor(diff / (1000 * 60 * 60 * 24))

  if (minutes < 60) {
    return `Hace ${minutes} min`
  } else if (hours < 24) {
    return `Hace ${hours}h`
  } else {
    return `Hace ${days} días`
  }
}

// Cerrar notificaciones al hacer clic fuera
const handleClickOutside = (event) => {
  if (isOpen.value && !event.target.closest('.relative')) {
    isOpen.value = false
  }
}

onMounted(() => {
  document.addEventListener('click', handleClickOutside)
})

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
})
</script>





