<template>
  <AdminLayout>
    <div class="mx-auto max-w-screen-2xl p-4 md:p-6 2xl:p-10">
    <!-- Header -->
    <div class="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      <h2 class="text-title-md2 font-semibold text-black dark:text-white">
        Mis Compras
      </h2>
      <nav>
        <ol class="flex items-center gap-2">
          <li><a class="font-medium" href="/">Dashboard /</a></li>
          <li class="font-medium text-primary">Mis Compras</li>
        </ol>
      </nav>
    </div>

    <!-- Stats -->
    <div class="mb-6 grid grid-cols-1 gap-4 md:grid-cols-4">
      <div class="rounded-sm border border-stroke bg-white p-6 shadow-default dark:border-strokedark dark:bg-boxdark">
        <div class="flex items-center justify-between">
          <div>
            <h4 class="text-title-md font-bold text-black dark:text-white">{{ stats.totalPurchases }}</h4>
            <p class="text-sm font-medium">Total Compras</p>
          </div>
          <div class="flex h-11.5 w-11.5 items-center justify-center rounded-full bg-meta-2 dark:bg-meta-4">
            <ListIcon class="h-6 w-6 text-primary" />
          </div>
        </div>
      </div>
      
      <div class="rounded-sm border border-stroke bg-white p-6 shadow-default dark:border-strokedark dark:bg-boxdark">
        <div class="flex items-center justify-between">
          <div>
            <h4 class="text-title-md font-bold text-black dark:text-white">{{ stats.pendingPurchases }}</h4>
            <p class="text-sm font-medium">Pendientes</p>
          </div>
          <div class="flex h-11.5 w-11.5 items-center justify-center rounded-full bg-warning/10">
            <ListIcon class="h-6 w-6 text-warning" />
          </div>
        </div>
      </div>
      
      <div class="rounded-sm border border-stroke bg-white p-6 shadow-default dark:border-strokedark dark:bg-boxdark">
        <div class="flex items-center justify-between">
          <div>
            <h4 class="text-title-md font-bold text-black dark:text-white">{{ stats.completedPurchases }}</h4>
            <p class="text-sm font-medium">Completadas</p>
          </div>
          <div class="flex h-11.5 w-11.5 items-center justify-center rounded-full bg-success/10">
            <ListIcon class="h-6 w-6 text-success" />
          </div>
        </div>
      </div>
      
      <div class="rounded-sm border border-stroke bg-white p-6 shadow-default dark:border-strokedark dark:bg-boxdark">
        <div class="flex items-center justify-between">
          <div>
            <h4 class="text-title-md font-bold text-black dark:text-white">{{ stats.totalSpent }}€</h4>
            <p class="text-sm font-medium">Total Gastado</p>
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

    <!-- Purchases List -->
    <div class="space-y-4">
      <div
        v-for="purchase in filteredPurchases"
        :key="purchase.id"
        class="rounded-sm border border-stroke bg-white p-6 shadow-default dark:border-strokedark dark:bg-boxdark"
      >
        <div class="flex flex-col gap-4 md:flex-row md:items-center">
          <!-- Article Image -->
          <div class="flex-shrink-0">
            <img
              :src="purchase.article.images[0] || '/images/placeholder.jpg'"
              :alt="purchase.article.title"
              class="h-24 w-24 rounded-lg object-cover"
            />
          </div>
          
          <!-- Article Info -->
          <div class="flex-1">
            <h3 class="text-lg font-semibold text-black dark:text-white mb-2">
              {{ purchase.article.title }}
            </h3>
            <p class="text-sm text-gray-600 dark:text-gray-400 mb-2">
              {{ purchase.article.description.substring(0, 100) }}...
            </p>
            <div class="flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400">
              <span>Vendedor: {{ purchase.seller.name }}</span>
              <span>•</span>
              <span>{{ purchase.purchaseDate }}</span>
            </div>
          </div>
          
          <!-- Price and Status -->
          <div class="flex flex-col items-end gap-2">
            <div class="text-right">
              <p class="text-lg font-bold text-black dark:text-white">{{ purchase.price }}€</p>
              <p class="text-sm text-gray-500 dark:text-gray-400">{{ purchase.paymentMethod }}</p>
            </div>
            <span
              :class="[
                'rounded-full px-3 py-1 text-xs font-medium',
                getStatusClass(purchase.status)
              ]"
            >
              {{ getStatusLabel(purchase.status) }}
            </span>
          </div>
        </div>
        
        <!-- Actions -->
        <div class="mt-4 flex flex-wrap gap-2">
          <button
            @click="viewPurchaseDetails(purchase)"
            class="rounded-md bg-primary py-2 px-4 text-sm font-medium text-white hover:bg-opacity-90"
          >
            Ver Detalles
          </button>
          <button
            v-if="purchase.status === 'pendiente'"
            @click="confirmPurchase(purchase)"
            class="rounded-md bg-success py-2 px-4 text-sm font-medium text-white hover:bg-opacity-90"
          >
            Confirmar Compra
          </button>
          <button
            v-if="purchase.status === 'enviado'"
            @click="markAsDelivered(purchase)"
            class="rounded-md bg-warning py-2 px-4 text-sm font-medium text-white hover:bg-opacity-90"
          >
            Marcar como Entregado
          </button>
          <button
            v-if="purchase.status === 'pendiente'"
            @click="cancelPurchase(purchase)"
            class="rounded-md bg-danger py-2 px-4 text-sm font-medium text-white hover:bg-opacity-90"
          >
            Cancelar
          </button>
        </div>
      </div>
    </div>

    <!-- Empty State -->
    <div v-if="filteredPurchases.length === 0" class="text-center py-12">
      <div class="mx-auto mb-4 h-24 w-24 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
        <ListIcon class="h-12 w-12 text-gray-400" />
      </div>
      <h3 class="text-lg font-semibold text-black dark:text-white mb-2">
        No tienes compras
      </h3>
      <p class="text-gray-600 dark:text-gray-400 mb-4">
        Comienza explorando artículos disponibles para comprar.
      </p>
      <router-link
        to="/comprar-articulo"
        class="inline-flex items-center justify-center rounded-md bg-primary py-3 px-6 text-center font-medium text-white hover:bg-opacity-90"
      >
        Comprar Artículos
      </router-link>
    </div>
    </div>
  </AdminLayout>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import AdminLayout from '@/components/layout/AdminLayout.vue'
import { ListIcon } from '@/icons'

// Active filter
const activeFilter = ref('todos')

// Stats
const stats = ref({
  totalPurchases: 0,
  pendingPurchases: 0,
  completedPurchases: 0,
  totalSpent: 0
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

// Sample purchases data
const purchases = ref([
  {
    id: 1,
    article: {
      title: 'iPhone 13 Pro Max 256GB',
      description: 'iPhone 13 Pro Max en excelente estado, con funda y cargador original.',
      images: ['/images/placeholder.jpg']
    },
    seller: {
      name: 'Juan Pérez'
    },
    price: 899,
    status: 'entregado',
    paymentMethod: 'transferencia',
    purchaseDate: '2025-09-10',
    deliveryDate: '2025-09-12'
  },
  {
    id: 2,
    article: {
      title: 'Bicicleta Trek Mountain',
      description: 'Bicicleta de montaña Trek modelo 2022, perfecta para senderos.',
      images: ['/images/placeholder.jpg']
    },
    seller: {
      name: 'María García'
    },
    price: 450,
    status: 'enviado',
    paymentMethod: 'efectivo',
    purchaseDate: '2025-09-14'
  },
  {
    id: 3,
    article: {
      title: 'Sofá 3 plazas gris',
      description: 'Sofá de 3 plazas en color gris, tapizado en tela.',
      images: ['/images/placeholder.jpg']
    },
    seller: {
      name: 'Carlos López'
    },
    price: 300,
    status: 'pendiente',
    paymentMethod: 'paypal',
    purchaseDate: '2025-09-15'
  }
])

// Computed filtered purchases
const filteredPurchases = computed(() => {
  if (activeFilter.value === 'todos') {
    return purchases.value
  }
  return purchases.value.filter(purchase => purchase.status === activeFilter.value)
})

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

const viewPurchaseDetails = (purchase) => {
  console.log('Viewing purchase details:', purchase)
  // Implement view details logic
}

const confirmPurchase = (purchase) => {
  console.log('Confirming purchase:', purchase)
  // Implement confirm logic
  alert('Compra confirmada!')
}

const markAsDelivered = (purchase) => {
  console.log('Marking as delivered:', purchase)
  // Implement mark as delivered logic
  alert('Compra marcada como entregada!')
}

const cancelPurchase = (purchase) => {
  console.log('Canceling purchase:', purchase)
  // Implement cancel logic
  alert('Compra cancelada!')
}

const loadPurchases = () => {
  // Calculate stats
  stats.value = {
    totalPurchases: purchases.value.length,
    pendingPurchases: purchases.value.filter(p => p.status === 'pendiente').length,
    completedPurchases: purchases.value.filter(p => p.status === 'entregado').length,
    totalSpent: purchases.value.reduce((sum, p) => sum + p.price, 0)
  }
  
  // Update filter counts
  statusFilters.value.forEach(filter => {
    if (filter.value === 'todos') {
      filter.count = purchases.value.length
    } else {
      filter.count = purchases.value.filter(p => p.status === filter.value).length
    }
  })
}

onMounted(() => {
  loadPurchases()
})
</script>

