<template>
  <div class="mx-auto max-w-screen-2xl p-4 md:p-6 2xl:p-10">
    <!-- Header -->
    <div class="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      <h2 class="text-title-md2 font-semibold text-black dark:text-white">
        Notificaciones
      </h2>
      <div class="flex items-center gap-2">
        <button
          @click="markAllAsRead"
          class="px-4 py-2 text-sm font-medium text-blue-600 bg-blue-50 hover:bg-blue-100 dark:bg-blue-900/20 dark:text-blue-400 dark:hover:bg-blue-900/30 rounded-lg transition-colors"
        >
          Marcar todas como leídas
        </button>
        <button
          @click="clearAll"
          class="px-4 py-2 text-sm font-medium text-red-600 bg-red-50 hover:bg-red-100 dark:bg-red-900/20 dark:text-red-400 dark:hover:bg-red-900/30 rounded-lg transition-colors"
        >
          Limpiar todas
        </button>
      </div>
    </div>

    <!-- Filtros -->
    <div class="mb-6 flex flex-wrap gap-2">
      <button
        v-for="filter in filters"
        :key="filter.key"
        @click="setFilter(filter.key)"
        :class="[
          'px-4 py-2 text-sm font-medium rounded-lg transition-colors',
          currentFilter === filter.key
            ? 'bg-blue-600 text-white'
            : 'bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700'
        ]"
      >
        {{ filter.label }}
        <span v-if="filter.count > 0" class="ml-2 px-2 py-0.5 text-xs bg-white/20 rounded-full">
          {{ filter.count }}
        </span>
      </button>
    </div>

    <!-- Lista de notificaciones -->
    <div class="space-y-4">
      <div
        v-for="notification in filteredNotifications"
        :key="notification.id"
        :class="[
          'p-6 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 hover:shadow-md transition-shadow cursor-pointer',
          !notification.read ? 'border-l-4 border-l-blue-500' : ''
        ]"
        @click="markAsRead(notification.id)"
      >
        <div class="flex items-start space-x-4">
          <!-- Icono -->
          <div
            :class="[
              'w-10 h-10 rounded-full flex items-center justify-center',
              getNotificationIcon(notification.type).bg
            ]"
          >
            <svg class="w-5 h-5" :class="getNotificationIcon(notification.type).text" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" :d="getNotificationIcon(notification.type).path"></path>
            </svg>
          </div>

          <!-- Contenido -->
          <div class="flex-1 min-w-0">
            <div class="flex items-center justify-between">
              <h3 class="text-lg font-semibold text-gray-900 dark:text-white">
                {{ notification.title }}
              </h3>
              <div class="flex items-center space-x-2">
                <span class="text-sm text-gray-500 dark:text-gray-400">
                  {{ formatTime(notification.createdAt) }}
                </span>
                <span
                  v-if="!notification.read"
                  class="w-2 h-2 bg-blue-500 rounded-full"
                ></span>
              </div>
            </div>
            <p class="mt-1 text-gray-600 dark:text-gray-300">
              {{ notification.message }}
            </p>
            <div v-if="notification.actions" class="mt-3 flex space-x-2">
              <button
                v-for="action in notification.actions"
                :key="action.label"
                @click.stop="handleAction(action, notification)"
                :class="[
                  'px-3 py-1 text-sm font-medium rounded-md transition-colors',
                  action.primary
                    ? 'bg-blue-600 text-white hover:bg-blue-700'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600'
                ]"
              >
                {{ action.label }}
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Estado vacío -->
      <div v-if="filteredNotifications.length === 0" class="text-center py-12">
        <svg class="w-12 h-12 mx-auto text-gray-400 dark:text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 17h5l-5 5v-5zM4.828 7l2.586 2.586a2 2 0 002.828 0L12.828 7H4.828zM4 12h16l-1 1H5l-1-1z"></path>
        </svg>
        <h3 class="mt-4 text-lg font-medium text-gray-900 dark:text-white">
          No hay notificaciones
        </h3>
        <p class="mt-2 text-gray-500 dark:text-gray-400">
          {{ currentFilter === 'all' ? 'No tienes notificaciones aún' : `No hay notificaciones ${filters.find(f => f.key === currentFilter)?.label.toLowerCase()}` }}
        </p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'

const currentFilter = ref('all')

const notifications = ref([
  {
    id: 1,
    type: 'purchase',
    title: 'Nueva compra realizada',
    message: 'Has comprado un iPhone 13 Pro Max por 899€. El vendedor ha sido notificado.',
    read: false,
    createdAt: new Date(Date.now() - 1000 * 60 * 30),
    actions: [
      { label: 'Ver compra', primary: true, action: 'view_purchase' },
      { label: 'Contactar vendedor', primary: false, action: 'contact_seller' }
    ]
  },
  {
    id: 2,
    type: 'sale',
    title: 'Artículo vendido',
    message: 'Tu MacBook Air M1 ha sido vendido por 750€. Los fondos están disponibles.',
    read: false,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 2),
    actions: [
      { label: 'Ver venta', primary: true, action: 'view_sale' },
      { label: 'Retirar fondos', primary: false, action: 'withdraw_funds' }
    ]
  },
  {
    id: 3,
    type: 'points',
    title: 'Puntos Trastalia ganados',
    message: 'Has ganado 4500 puntos por tu venta. ¡Sigue así!',
    read: true,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24)
  },
  {
    id: 4,
    type: 'logistics',
    title: 'Centro logístico actualizado',
    message: 'Tu artículo ha sido almacenado en la nave. Está listo para la venta.',
    read: true,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2)
  },
  {
    id: 5,
    type: 'exchange',
    title: 'Nueva propuesta de intercambio',
    message: 'Alguien quiere intercambiar su bicicleta por tu guitarra.',
    read: false,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 3),
    actions: [
      { label: 'Ver propuesta', primary: true, action: 'view_exchange' },
      { label: 'Rechazar', primary: false, action: 'reject_exchange' }
    ]
  }
])

const filters = computed(() => [
  { key: 'all', label: 'Todas', count: notifications.value.length },
  { key: 'unread', label: 'No leídas', count: notifications.value.filter(n => !n.read).length },
  { key: 'purchase', label: 'Compras', count: notifications.value.filter(n => n.type === 'purchase').length },
  { key: 'sale', label: 'Ventas', count: notifications.value.filter(n => n.type === 'sale').length },
  { key: 'points', label: 'Puntos', count: notifications.value.filter(n => n.type === 'points').length },
  { key: 'logistics', label: 'Logística', count: notifications.value.filter(n => n.type === 'logistics').length },
  { key: 'exchange', label: 'Intercambios', count: notifications.value.filter(n => n.type === 'exchange').length }
])

const filteredNotifications = computed(() => {
  if (currentFilter.value === 'all') {
    return notifications.value
  } else if (currentFilter.value === 'unread') {
    return notifications.value.filter(n => !n.read)
  } else {
    return notifications.value.filter(n => n.type === currentFilter.value)
  }
})

const setFilter = (filter) => {
  currentFilter.value = filter
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

const clearAll = () => {
  notifications.value = []
}

const handleAction = (action, notification) => {
  console.log('Acción:', action.action, 'Notificación:', notification.id)
  // Aquí implementarías la lógica para cada acción
}

const getNotificationIcon = (type) => {
  const icons = {
    purchase: {
      bg: 'bg-green-100 dark:bg-green-900/20',
      text: 'text-green-600 dark:text-green-400',
      path: 'M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z'
    },
    sale: {
      bg: 'bg-blue-100 dark:bg-blue-900/20',
      text: 'text-blue-600 dark:text-blue-400',
      path: 'M12 6v6m0 0v6m0-6h6m-6 0H6'
    },
    points: {
      bg: 'bg-yellow-100 dark:bg-yellow-900/20',
      text: 'text-yellow-600 dark:text-yellow-400',
      path: 'M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z'
    },
    logistics: {
      bg: 'bg-purple-100 dark:bg-purple-900/20',
      text: 'text-purple-600 dark:text-purple-400',
      path: 'M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4'
    },
    exchange: {
      bg: 'bg-orange-100 dark:bg-orange-900/20',
      text: 'text-orange-600 dark:text-orange-400',
      path: 'M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4'
    }
  }
  return icons[type] || icons.purchase
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
</script>





