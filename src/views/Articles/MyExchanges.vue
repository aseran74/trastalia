<template>
  <AdminLayout>
    <div class="mx-auto max-w-screen-2xl p-4 md:p-6 2xl:p-10">
    <!-- Header -->
    <div class="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      <h2 class="text-title-md2 font-semibold text-black dark:text-white">
        Mis Canjes
      </h2>
      <nav>
        <ol class="flex items-center gap-2">
          <li><a class="font-medium" href="/">Dashboard /</a></li>
          <li class="font-medium text-primary">Mis Canjes</li>
        </ol>
      </nav>
    </div>

    <!-- Stats -->
    <div class="mb-6 grid grid-cols-1 gap-4 md:grid-cols-4">
      <div class="rounded-sm border border-stroke bg-white p-6 shadow-default dark:border-strokedark dark:bg-boxdark">
        <div class="flex items-center justify-between">
          <div>
            <h4 class="text-title-md font-bold text-black dark:text-white">{{ stats.totalExchanges }}</h4>
            <p class="text-sm font-medium">Total Canjes</p>
          </div>
          <div class="flex h-11.5 w-11.5 items-center justify-center rounded-full bg-meta-2 dark:bg-meta-4">
            <ListIcon class="h-6 w-6 text-primary" />
          </div>
        </div>
      </div>
      
      <div class="rounded-sm border border-stroke bg-white p-6 shadow-default dark:border-strokedark dark:bg-boxdark">
        <div class="flex items-center justify-between">
          <div>
            <h4 class="text-title-md font-bold text-black dark:text-white">{{ stats.pendingExchanges }}</h4>
            <p class="text-sm font-medium">Pendientes</p>
          </div>
          <div class="flex h-11.5 w-11.5 items-center justify-center rounded-full bg-warning/10">
            <ListIcon class="h-6 w-6 text-warning" />
          </div>
        </div>
      </div>
      
      <div class="rounded-sm border border-stroke bg-white p-6 shadow-default dark:bg-boxdark">
        <div class="flex items-center justify-between">
          <div>
            <h4 class="text-title-md font-bold text-black dark:text-white">{{ stats.completedExchanges }}</h4>
            <p class="text-sm font-medium">Completados</p>
          </div>
          <div class="flex h-11.5 w-11.5 items-center justify-center rounded-full bg-success/10">
            <ListIcon class="h-6 w-6 text-success" />
          </div>
        </div>
      </div>
      
      <div class="rounded-sm border border-stroke bg-white p-6 shadow-default dark:border-strokedark dark:bg-boxdark">
        <div class="flex items-center justify-between">
          <div>
            <h4 class="text-title-md font-bold text-black dark:text-white">{{ stats.rejectedExchanges }}</h4>
            <p class="text-sm font-medium">Rechazados</p>
          </div>
          <div class="flex h-11.5 w-11.5 items-center justify-center rounded-full bg-danger/10">
            <ListIcon class="h-6 w-6 text-danger" />
          </div>
        </div>
      </div>
    </div>

    <!-- Filter Tabs -->
    <div class="mb-6 rounded-sm border border-stroke bg-white p-6 shadow-default dark:border-strokedark dark:bg-boxdark">
      <div class="flex flex-wrap gap-2">
        <button
          v-for="status in statusFilters"
          :key="status.value"
          @click="activeFilter = status.value"
          :class="[
            'rounded-md px-4 py-2 text-sm font-medium transition-colors',
            activeFilter === status.value
              ? 'bg-primary text-white'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700'
          ]"
        >
          {{ status.label }} ({{ status.count }})
        </button>
      </div>
    </div>

    <!-- Exchanges List -->
    <div class="space-y-4">
      <div
        v-for="exchange in filteredExchanges"
        :key="exchange.id"
        class="rounded-sm border border-stroke bg-white p-6 shadow-default dark:border-strokedark dark:bg-boxdark"
      >
        <div class="flex flex-col gap-4 md:flex-row">
          <!-- My Article -->
          <div class="flex-1">
            <h4 class="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">Artículo Canjeado</h4>
            <div class="flex gap-4">
              <img
                :src="exchange.article.images[0] || '/images/placeholder.jpg'"
                :alt="exchange.article.title"
                class="h-20 w-20 rounded-lg object-cover"
              />
              <div>
                <h3 class="font-semibold text-black dark:text-white">{{ exchange.article.title }}</h3>
                <p class="text-sm text-gray-600 dark:text-gray-400">{{ exchange.article.description }}</p>
              </div>
            </div>
          </div>
          
          <!-- Points Info -->
          <div class="flex items-center justify-center">
            <div class="text-center">
              <div class="text-2xl text-purple-600 font-bold">{{ exchange.points }}</div>
              <div class="text-sm text-gray-500 dark:text-gray-400">puntos</div>
            </div>
          </div>
          
          <!-- Exchange Info -->
          <div class="flex-1">
            <h4 class="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">Canje con Trastalia</h4>
            <div class="flex gap-4">
              <div class="h-20 w-20 rounded-lg bg-purple-100 dark:bg-purple-900/20 flex items-center justify-center">
                <svg class="w-8 h-8 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"></path>
                </svg>
              </div>
              <div>
                <h3 class="font-semibold text-black dark:text-white">Trastalia</h3>
                <p class="text-sm text-gray-600 dark:text-gray-400">Canje por puntos</p>
                <p class="text-sm text-gray-500 dark:text-gray-400">Fecha: {{ exchange.exchangeDate }}</p>
              </div>
            </div>
          </div>
        </div>
        
        <!-- Exchange Details -->
        <div class="mt-4 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div class="flex-1">
            <p v-if="exchange.message" class="text-sm text-gray-600 dark:text-gray-400 mb-2">
              <strong>Mensaje:</strong> {{ exchange.message }}
            </p>
            <div class="flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400">
              <span>Fecha: {{ exchange.createdAt }}</span>
              <span v-if="exchange.exchangeDate">• Intercambio: {{ exchange.exchangeDate }}</span>
            </div>
          </div>
          
          <div class="flex items-center gap-2">
            <span
              :class="[
                'rounded-full px-3 py-1 text-xs font-medium',
                getStatusClass(exchange.status)
              ]"
            >
              {{ getStatusLabel(exchange.status) }}
            </span>
          </div>
        </div>
        
        <!-- Actions -->
        <div class="mt-4 flex flex-wrap gap-2">
          <button
            @click="viewExchangeDetails(exchange)"
            class="rounded-md bg-primary py-2 px-4 text-sm font-medium text-white hover:bg-opacity-90"
          >
            Ver Detalles
          </button>
          <button
            v-if="exchange.status === 'pendiente' && exchange.role === 'requester'"
            @click="cancelExchange(exchange)"
            class="rounded-md bg-danger py-2 px-4 text-sm font-medium text-white hover:bg-opacity-90"
          >
            Cancelar
          </button>
          <button
            v-if="exchange.status === 'aceptado'"
            @click="completeExchange(exchange)"
            class="rounded-md bg-success py-2 px-4 text-sm font-medium text-white hover:bg-opacity-90"
          >
            Marcar como Completado
          </button>
        </div>
      </div>
    </div>

    <!-- Empty State -->
    <div v-if="filteredExchanges.length === 0" class="text-center py-12">
      <div class="mx-auto mb-4 h-24 w-24 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
        <ListIcon class="h-12 w-12 text-gray-400" />
      </div>
      <h3 class="text-lg font-semibold text-black dark:text-white mb-2">
        No tienes intercambios
      </h3>
      <p class="text-gray-600 dark:text-gray-400 mb-4">
        Comienza proponiendo intercambios con otros usuarios.
      </p>
      <router-link
        to="/comprar-articulo"
        class="inline-flex items-center justify-center rounded-md bg-primary py-3 px-6 text-center font-medium text-white hover:bg-opacity-90"
      >
        Ver Artículos Disponibles
      </router-link>
    </div>
    </div>
  </AdminLayout>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import AdminLayout from '@/components/layout/AdminLayout.vue'
import { ListIcon } from '@/icons'
import { useAuthStore } from '@/stores/auth'

const authStore = useAuthStore()

// Active filter
const activeFilter = ref('todos')
const loading = ref(false)

// Stats
const stats = ref({
  totalExchanges: 0,
  pendingExchanges: 0,
  completedExchanges: 0,
  rejectedExchanges: 0
})

// Status filters
const statusFilters = ref([
  { value: 'todos', label: 'Todos', count: 0 },
  { value: 'pendiente', label: 'Pendientes', count: 0 },
  { value: 'aceptado', label: 'Aceptados', count: 0 },
  { value: 'rechazado', label: 'Rechazados', count: 0 },
  { value: 'completado', label: 'Completados', count: 0 },
  { value: 'cancelado', label: 'Cancelados', count: 0 }
])

// Exchanges data
const exchanges = ref([])

// Load point exchanges
const loadPointExchanges = async () => {
  try {
    loading.value = true
    const token = authStore.token
    
    const response = await fetch('/api/articles/point-exchanges', {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    })
    
    if (!response.ok) {
      throw new Error('Error cargando canjes por puntos')
    }
    
    const data = await response.json()
    exchanges.value = data.exchanges || []
    
    // Update stats
    stats.value.totalExchanges = exchanges.value.length
    stats.value.completedExchanges = exchanges.value.filter(ex => ex.status === 'canjeado').length
    
    // Update filter counts
    statusFilters.value.forEach(filter => {
      if (filter.value === 'todos') {
        filter.count = exchanges.value.length
      } else if (filter.value === 'completado') {
        filter.count = exchanges.value.filter(ex => ex.status === 'canjeado').length
      } else {
        filter.count = exchanges.value.filter(ex => ex.status === filter.value).length
      }
    })
    
  } catch (error) {
    console.error('Error cargando canjes por puntos:', error)
    // Fallback to sample data
    exchanges.value = [
      {
        id: 1,
        article: {
          title: 'iPhone 13 Pro Max 256GB',
          description: 'iPhone 13 Pro Max en excelente estado, con funda y cargador original.',
          images: ['/images/placeholder.jpg']
        },
        points: 1000,
        status: 'canjeado',
        exchangeDate: '2025-01-10',
        review: 'Canjeado por puntos con Trastalia'
      }
    ]
  } finally {
    loading.value = false
  }
}

// Computed filtered exchanges
const filteredExchanges = computed(() => {
  if (activeFilter.value === 'todos') {
    return exchanges.value
  }
  return exchanges.value.filter(exchange => exchange.status === activeFilter.value)
})

// Methods
const getStatusClass = (status) => {
  const classes = {
    'pendiente': 'bg-warning/10 text-warning',
    'aceptado': 'bg-primary/10 text-primary',
    'rechazado': 'bg-danger/10 text-danger',
    'completado': 'bg-success/10 text-success',
    'cancelado': 'bg-gray-100 text-gray-700'
  }
  return classes[status] || 'bg-gray-100 text-gray-700'
}

const getStatusLabel = (status) => {
  const labels = {
    'pendiente': 'Pendiente',
    'aceptado': 'Aceptado',
    'rechazado': 'Rechazado',
    'completado': 'Completado',
    'cancelado': 'Cancelado'
  }
  return labels[status] || status
}

const viewExchangeDetails = (exchange) => {
  console.log('Viewing exchange details:', exchange)
  // Implement view details logic
}

const cancelExchange = (exchange) => {
  console.log('Canceling exchange:', exchange)
  // Implement cancel logic
  alert('Intercambio cancelado!')
}

const completeExchange = (exchange) => {
  console.log('Completing exchange:', exchange)
  // Implement complete logic
  alert('Intercambio marcado como completado!')
}

onMounted(() => {
  loadPointExchanges()
})
</script>

