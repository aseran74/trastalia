<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Sidebar -->
    <AppSidebar />
    
    <!-- Header -->
    <AppHeader />
    
    <!-- Backdrop -->
    <Backdrop />
    
    <!-- Main Content -->
    <div class="lg:pl-64">
      <div class="p-4 md:p-6 2xl:p-10">
        <!-- Header -->
        <div class="mb-8">
          <h1 class="text-3xl font-bold text-gray-900">Artículos Vendidos</h1>
          <p class="text-gray-600 mt-2">Artículos que has vendido a otros usuarios o al administrador</p>
        </div>

        <!-- Stats Cards -->
        <div class="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div class="bg-white rounded-lg shadow p-6">
            <div class="flex items-center">
              <div class="p-2 bg-green-100 rounded-lg">
                <svg class="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1"></path>
                </svg>
              </div>
              <div class="ml-4">
                <p class="text-sm font-medium text-gray-600">Total Vendidos</p>
                <p class="text-2xl font-semibold text-gray-900">{{ totalSold }}</p>
              </div>
            </div>
          </div>

          <div class="bg-white rounded-lg shadow p-6">
            <div class="flex items-center">
              <div class="p-2 bg-blue-100 rounded-lg">
                <svg class="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z"></path>
                </svg>
              </div>
              <div class="ml-4">
                <p class="text-sm font-medium text-gray-600">Ingresos Dinero</p>
                <p class="text-2xl font-semibold text-gray-900">€{{ moneyEarnings.toFixed(2) }}</p>
              </div>
            </div>
          </div>

          <div class="bg-white rounded-lg shadow p-6">
            <div class="flex items-center">
              <div class="p-2 bg-purple-100 rounded-lg">
                <svg class="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"></path>
                </svg>
              </div>
              <div class="ml-4">
                <p class="text-sm font-medium text-gray-600">Puntos Ganados</p>
                <p class="text-2xl font-semibold text-gray-900">{{ pointsEarned }}</p>
              </div>
            </div>
          </div>

          <div class="bg-white rounded-lg shadow p-6">
            <div class="flex items-center">
              <div class="p-2 bg-orange-100 rounded-lg">
                <svg class="w-6 h-6 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
              </div>
              <div class="ml-4">
                <p class="text-sm font-medium text-gray-600">Ventas Exitosas</p>
                <p class="text-2xl font-semibold text-gray-900">{{ successfulSales }}</p>
              </div>
            </div>
          </div>
        </div>

        <!-- Filter Tabs -->
        <div class="mb-6">
          <div class="border-b border-gray-200">
            <nav class="-mb-px flex space-x-8">
              <button
                v-for="filter in filters"
                :key="filter.key"
                @click="activeFilter = filter.key"
                :class="[
                  activeFilter === filter.key
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300',
                  'whitespace-nowrap py-2 px-1 border-b-2 font-medium text-sm'
                ]"
              >
                {{ filter.label }} ({{ getFilterCount(filter.key) }})
              </button>
            </nav>
          </div>
        </div>

        <!-- Loading State -->
        <div v-if="loading" class="flex justify-center items-center py-12">
          <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>

        <!-- Error State -->
        <div v-else-if="error" class="text-center py-12">
          <div class="text-red-600 mb-4">
            <svg class="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"></path>
            </svg>
          </div>
          <h3 class="text-lg font-medium text-gray-900 mb-2">Error al cargar ventas</h3>
          <p class="text-gray-600 mb-4">{{ error }}</p>
          <button @click="loadSoldArticles" class="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">
            Reintentar
          </button>
        </div>

        <!-- Empty State -->
        <div v-else-if="filteredSoldArticles.length === 0" class="text-center py-12">
          <div class="text-gray-400 mb-4">
            <svg class="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"></path>
            </svg>
          </div>
          <h3 class="text-lg font-medium text-gray-900 mb-2">No tienes ventas aún</h3>
          <p class="text-gray-600 mb-4">Cuando vendas artículos, aparecerán aquí</p>
          <router-link to="/vender-articulo" class="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">
            Vender Artículo
          </router-link>
        </div>

        <!-- Sold Articles List -->
        <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div v-for="sale in filteredSoldArticles" :key="sale.id" class="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
            <!-- Article Image -->
            <div class="h-48 bg-gray-200 flex items-center justify-center">
              <img v-if="sale.article.images && sale.article.images.length > 0" 
                   :src="sale.article.images[0]" 
                   :alt="sale.article.title"
                   class="w-full h-full object-cover">
              <div v-else class="text-gray-400">
                <svg class="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                </svg>
              </div>
            </div>

            <!-- Article Info -->
            <div class="p-6">
              <h3 class="text-lg font-semibold text-gray-900 mb-2">{{ sale.article.title }}</h3>
              <p class="text-gray-600 text-sm mb-4 line-clamp-2">{{ sale.article.description }}</p>
              
              <!-- Sale Info -->
              <div class="mb-4">
                <div class="flex items-center justify-between mb-2">
                  <span class="text-sm font-medium text-gray-600">Precio de Venta:</span>
                  <span class="text-lg font-semibold text-green-600">€{{ sale.price }}</span>
                </div>
                
                <div class="flex items-center justify-between mb-2">
                  <span class="text-sm font-medium text-gray-600">Método de Pago:</span>
                  <span class="text-sm font-medium" :class="sale.paymentMethod === 'dinero' ? 'text-green-600' : 'text-purple-600'">
                    {{ sale.paymentMethod === 'dinero' ? 'Dinero' : 'Puntos' }}
                  </span>
                </div>
              </div>

              <!-- Status Badge -->
              <div class="mb-4">
                <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                  {{ sale.status }}
                </span>
              </div>

              <!-- Buyer Info -->
              <div class="border-t pt-4">
                <div class="flex items-center text-sm text-gray-600 mb-2">
                  <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
                  </svg>
                  <span>Comprado por: {{ sale.buyer.name }}</span>
                </div>
                <div class="text-xs text-gray-500">
                  Fecha de venta: {{ formatDate(sale.soldDate) }}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useAuthStore } from '@/stores/auth'
import AppSidebar from '@/components/layout/AppSidebar.vue'
import AppHeader from '@/components/layout/AppHeader.vue'
import Backdrop from '@/components/layout/Backdrop.vue'
import { useSidebar } from '@/composables/useSidebar'

const { isOpen } = useSidebar()
const authStore = useAuthStore()

// Reactive data
const soldArticles = ref([])
const loading = ref(false)
const error = ref('')
const activeFilter = ref('all')

// Filter options
const filters = [
  { key: 'all', label: 'Todos' },
  { key: 'vendido_a_comprador', label: 'Vendido a Usuario' },
  { key: 'vendido_a_admin_dinero', label: 'Vendido a Admin (Dinero)' },
  { key: 'vendido_a_admin_puntos', label: 'Vendido a Admin (Puntos)' }
]

// Computed properties
const totalSold = computed(() => soldArticles.value.length)

const moneyEarnings = computed(() => {
  return soldArticles.value
    .filter(sale => sale.paymentMethod === 'dinero')
    .reduce((total, sale) => {
      return total + (sale.price || 0)
    }, 0)
})

const pointsEarned = computed(() => {
  return soldArticles.value
    .filter(sale => sale.paymentMethod === 'puntos')
    .reduce((total, sale) => {
      return total + (sale.price || 0)
    }, 0)
})

const successfulSales = computed(() => {
  return soldArticles.value.filter(sale => sale.status === 'entregado').length
})

const filteredSoldArticles = computed(() => {
  if (activeFilter.value === 'all') {
    return soldArticles.value
  }
  return soldArticles.value.filter(sale => {
    if (activeFilter.value === 'vendido_a_admin_dinero') {
      return sale.paymentMethod === 'dinero' && sale.buyer.name === 'Trastalia'
    }
    if (activeFilter.value === 'vendido_a_admin_puntos') {
      return sale.paymentMethod === 'puntos' && sale.buyer.name === 'Trastalia'
    }
    if (activeFilter.value === 'vendido_a_comprador') {
      return sale.buyer.name !== 'Trastalia'
    }
    return true
  })
})

// Methods
const loadSoldArticles = async () => {
  loading.value = true
  error.value = ''
  
  try {
    const response = await fetch('/api/articles/sold-articles', {
      headers: {
        'Authorization': `Bearer ${authStore.token}`
      }
    })

    if (!response.ok) {
      throw new Error(`Error ${response.status}: ${response.statusText}`)
    }

    const data = await response.json()
    soldArticles.value = data.articles || data.data || []
  } catch (err: any) {
    console.error('Error cargando artículos vendidos:', err)
    error.value = err.message || 'Error al cargar los artículos vendidos'
  } finally {
    loading.value = false
  }
}

const getFilterCount = (filterKey: string) => {
  if (filterKey === 'all') return soldArticles.value.length
  return soldArticles.value.filter(article => article.estado === filterKey).length
}

const getStatusBadgeClass = (estado: string) => {
  const classes = {
    'vendido_a_comprador': 'bg-green-100 text-green-800',
    'vendido_a_admin_dinero': 'bg-blue-100 text-blue-800',
    'vendido_a_admin_puntos': 'bg-purple-100 text-purple-800'
  }
  return classes[estado] || 'bg-gray-100 text-gray-800'
}

const getStatusText = (estado: string) => {
  const texts = {
    'vendido_a_comprador': 'Vendido a Usuario',
    'vendido_a_admin_dinero': 'Vendido a Admin (Dinero)',
    'vendido_a_admin_puntos': 'Vendido a Admin (Puntos)'
  }
  return texts[estado] || estado
}

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('es-ES', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}

// Lifecycle
onMounted(() => {
  loadSoldArticles()
})
</script>

<style scoped>
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>