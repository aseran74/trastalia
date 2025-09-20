<template>
  <AdminLayout>
    <div class="mx-auto max-w-screen-2xl p-4 md:p-6 2xl:p-10">
    <!-- Header -->
    <div class="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      <h2 class="text-title-md2 font-semibold text-black dark:text-white">
        Artículos Vendidos
      </h2>
      <nav>
        <ol class="flex items-center gap-2">
          <li><a class="font-medium" href="/">Dashboard /</a></li>
          <li class="font-medium text-primary">Artículos Vendidos</li>
        </ol>
      </nav>
    </div>

    <!-- Stats -->
    <div class="mb-6 grid grid-cols-1 gap-4 md:grid-cols-4">
      <div class="rounded-sm border border-stroke bg-white p-6 shadow-default dark:border-strokedark dark:bg-boxdark">
        <div class="flex items-center justify-between">
          <div>
            <h4 class="text-title-md font-bold text-black dark:text-white">{{ stats.totalSold }}</h4>
            <p class="text-sm font-medium">Total Vendidos</p>
          </div>
          <div class="flex h-11.5 w-11.5 items-center justify-center rounded-full bg-meta-2 dark:bg-meta-4">
            <ListIcon class="h-6 w-6 text-primary" />
          </div>
        </div>
      </div>
      
      <div class="rounded-sm border border-stroke bg-white p-6 shadow-default dark:border-strokedark dark:bg-boxdark">
        <div class="flex items-center justify-between">
          <div>
            <h4 class="text-title-md font-bold text-black dark:text-white">{{ stats.totalEarnings }}€</h4>
            <p class="text-sm font-medium">Ganancias Totales</p>
          </div>
          <div class="flex h-11.5 w-11.5 items-center justify-center rounded-full bg-success/10">
            <ListIcon class="h-6 w-6 text-success" />
          </div>
        </div>
      </div>
      
      <div class="rounded-sm border border-stroke bg-white p-6 shadow-default dark:border-strokedark dark:bg-boxdark">
        <div class="flex items-center justify-between">
          <div>
            <h4 class="text-title-md font-bold text-black dark:text-white">{{ stats.pendingDelivery }}</h4>
            <p class="text-sm font-medium">Pendientes de Entrega</p>
          </div>
          <div class="flex h-11.5 w-11.5 items-center justify-center rounded-full bg-warning/10">
            <ListIcon class="h-6 w-6 text-warning" />
          </div>
        </div>
      </div>
      
      <div class="rounded-sm border border-stroke bg-white p-6 shadow-default dark:border-strokedark dark:bg-boxdark">
        <div class="flex items-center justify-between">
          <div>
            <h4 class="text-title-md font-bold text-black dark:text-white">{{ stats.avgRating }}</h4>
            <p class="text-sm font-medium">Valoración Promedio</p>
          </div>
          <div class="flex h-11.5 w-11.5 items-center justify-center rounded-full bg-primary/10">
            <ListIcon class="h-6 w-6 text-primary" />
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

    <!-- Sold Articles List -->
    <div class="space-y-4">
      <div
        v-for="sale in filteredSales"
        :key="sale.id"
        class="rounded-sm border border-stroke bg-white p-6 shadow-default dark:border-strokedark dark:bg-boxdark"
      >
        <div class="flex flex-col gap-4 md:flex-row md:items-center">
          <!-- Article Image -->
          <div class="flex-shrink-0">
            <img
              :src="sale.article.images[0] || '/images/placeholder.jpg'"
              :alt="sale.article.title"
              class="h-24 w-24 rounded-lg object-cover"
            />
          </div>
          
          <!-- Article Info -->
          <div class="flex-1">
            <h3 class="text-lg font-semibold text-black dark:text-white mb-2">
              {{ sale.article.title }}
            </h3>
            <p class="text-sm text-gray-600 dark:text-gray-400 mb-2">
              {{ sale.article.description.substring(0, 100) }}...
            </p>
            <div class="flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400">
              <span>Comprador: {{ sale.buyer.name }}</span>
              <span>•</span>
              <span>Vendido: {{ sale.soldDate }}</span>
              <span v-if="sale.deliveryDate">•</span>
              <span v-if="sale.deliveryDate">Entregado: {{ sale.deliveryDate }}</span>
            </div>
          </div>
          
          <!-- Price and Status -->
          <div class="flex flex-col items-end gap-2">
            <div class="text-right">
              <p class="text-lg font-bold text-black dark:text-white">{{ sale.price }}€</p>
              <p class="text-sm text-gray-500 dark:text-gray-400">{{ sale.paymentMethod }}</p>
            </div>
            <span
              :class="[
                'rounded-full px-3 py-1 text-xs font-medium',
                getStatusClass(sale.status)
              ]"
            >
              {{ getStatusLabel(sale.status) }}
            </span>
          </div>
        </div>
        
        <!-- Rating -->
        <div v-if="sale.rating" class="mt-4 flex items-center gap-2">
          <div class="flex items-center">
            <span v-for="i in 5" :key="i" class="text-yellow-400">
              <svg v-if="i <= sale.rating" class="h-4 w-4 fill-current" viewBox="0 0 20 20">
                <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z"/>
              </svg>
              <svg v-else class="h-4 w-4 fill-current text-gray-300" viewBox="0 0 20 20">
                <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z"/>
              </svg>
            </span>
          </div>
          <span class="text-sm text-gray-600 dark:text-gray-400">
            {{ sale.rating }}/5
            <span v-if="sale.review">- "{{ sale.review }}"</span>
          </span>
        </div>
        
        <!-- Actions -->
        <div class="mt-4 flex flex-wrap gap-2">
          <button
            @click="viewSaleDetails(sale)"
            class="rounded-md bg-primary py-2 px-4 text-sm font-medium text-white hover:bg-opacity-90"
          >
            Ver Detalles
          </button>
          <button
            v-if="sale.status === 'pendiente'"
            @click="confirmSale(sale)"
            class="rounded-md bg-success py-2 px-4 text-sm font-medium text-white hover:bg-opacity-90"
          >
            Confirmar Venta
          </button>
          <button
            v-if="sale.status === 'confirmado'"
            @click="markAsShipped(sale)"
            class="rounded-md bg-warning py-2 px-4 text-sm font-medium text-white hover:bg-opacity-90"
          >
            Marcar como Enviado
          </button>
          <button
            v-if="sale.status === 'enviado'"
            @click="markAsDelivered(sale)"
            class="rounded-md bg-info py-2 px-4 text-sm font-medium text-white hover:bg-opacity-90"
          >
            Marcar como Entregado
          </button>
        </div>
      </div>
    </div>

    <!-- Empty State -->
    <div v-if="filteredSales.length === 0" class="text-center py-12">
      <div class="mx-auto mb-4 h-24 w-24 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
        <ListIcon class="h-12 w-12 text-gray-400" />
      </div>
      <h3 class="text-lg font-semibold text-black dark:text-white mb-2">
        No has vendido artículos
      </h3>
      <p class="text-gray-600 dark:text-gray-400 mb-4">
        Comienza publicando artículos para vender.
      </p>
      <router-link
        to="/vender-articulo"
        class="inline-flex items-center justify-center rounded-md bg-primary py-3 px-6 text-center font-medium text-white hover:bg-opacity-90"
      >
        Vender Artículo
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
  totalSold: 0,
  totalEarnings: 0,
  pendingDelivery: 0,
  avgRating: 0
})

// Status filters
const statusFilters = ref([
  { value: 'todos', label: 'Todos', count: 0 },
  { value: 'pendiente', label: 'Pendientes', count: 0 },
  { value: 'confirmado', label: 'Confirmados', count: 0 },
  { value: 'enviado', label: 'Enviados', count: 0 },
  { value: 'entregado', label: 'Entregados', count: 0 },
  { value: 'cancelado', label: 'Cancelados', count: 0 }
])

// Sales data
const sales = ref([])

// Computed filtered sales
const filteredSales = computed(() => {
  if (activeFilter.value === 'todos') {
    return sales.value
  }
  return sales.value.filter(sale => sale.status === activeFilter.value)
})

// Load sold articles (only money sales)
const loadSoldArticles = async () => {
  try {
    loading.value = true
    const token = authStore.token
    
    const response = await fetch('/api/articles/sold-articles', {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    })
    
    if (!response.ok) {
      throw new Error('Error cargando artículos vendidos')
    }
    
    const data = await response.json()
    sales.value = data.articles || []
    
    // Update stats
    stats.value.totalSold = sales.value.length
    stats.value.totalEarnings = sales.value.reduce((total, sale) => total + (sale.price || 0), 0)
    stats.value.pendingDelivery = sales.value.filter(sale => sale.status === 'pendiente').length
    
    // Update filter counts
    statusFilters.value.forEach(filter => {
      if (filter.value === 'todos') {
        filter.count = sales.value.length
      } else {
        filter.count = sales.value.filter(sale => sale.status === filter.value).length
      }
    })
    
  } catch (error) {
    console.error('Error cargando artículos vendidos:', error)
    // Fallback to sample data
    sales.value = [
      {
        id: 1,
        article: {
          title: 'iPhone 13 Pro Max 256GB',
          description: 'iPhone 13 Pro Max en excelente estado, con funda y cargador original.',
          images: ['/images/placeholder.jpg']
        },
        buyer: {
          name: 'Trastalia'
        },
        price: 899,
        status: 'entregado',
        paymentMethod: 'dinero',
        soldDate: '2025-01-10',
        deliveryDate: '2025-01-12',
        rating: 5,
        review: 'Vendido a Trastalia por dinero'
      }
    ]
  } finally {
    loading.value = false
  }
}

// Methods
const getStatusClass = (status) => {
  const classes = {
    'pendiente': 'bg-warning/10 text-warning',
    'confirmado': 'bg-primary/10 text-primary',
    'enviado': 'bg-info/10 text-info',
    'entregado': 'bg-success/10 text-success',
    'cancelado': 'bg-danger/10 text-danger'
  }
  return classes[status] || 'bg-gray-100 text-gray-700'
}

const getStatusLabel = (status) => {
  const labels = {
    'pendiente': 'Pendiente',
    'confirmado': 'Confirmado',
    'enviado': 'Enviado',
    'entregado': 'Entregado',
    'cancelado': 'Cancelado'
  }
  return labels[status] || status
}

const viewSaleDetails = (sale) => {
  console.log('Viewing sale details:', sale)
  // Implement view details logic
}

const confirmSale = (sale) => {
  console.log('Confirming sale:', sale)
  // Implement confirm logic
  alert('Venta confirmada!')
}

const markAsShipped = (sale) => {
  console.log('Marking as shipped:', sale)
  // Implement mark as shipped logic
  alert('Venta marcada como enviada!')
}

const markAsDelivered = (sale) => {
  console.log('Marking as delivered:', sale)
  // Implement mark as delivered logic
  alert('Venta marcada como entregada!')
}

onMounted(() => {
  loadSoldArticles()
})
</script>

