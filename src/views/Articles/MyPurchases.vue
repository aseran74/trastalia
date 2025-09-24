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
      <div class="p-6">
        <!-- Header -->
        <div class="mb-8">
          <h1 class="text-3xl font-bold text-gray-900">Mis Compras</h1>
          <p class="text-gray-600 mt-2">Artículos que has comprado con dinero</p>
        </div>

        <!-- Stats Cards -->
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div class="bg-white rounded-lg shadow p-6">
            <div class="flex items-center">
              <div class="p-2 bg-green-100 rounded-lg">
                <svg class="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1"></path>
                </svg>
              </div>
              <div class="ml-4">
                <p class="text-sm font-medium text-gray-600">Total Compras</p>
                <p class="text-2xl font-semibold text-gray-900">{{ totalPurchases }}</p>
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
                <p class="text-sm font-medium text-gray-600">Gasto Total</p>
                <p class="text-2xl font-semibold text-gray-900">€{{ totalSpent.toFixed(2) }}</p>
              </div>
            </div>
          </div>

          <div class="bg-white rounded-lg shadow p-6">
            <div class="flex items-center">
              <div class="p-2 bg-purple-100 rounded-lg">
                <svg class="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
              </div>
              <div class="ml-4">
                <p class="text-sm font-medium text-gray-600">Artículos Únicos</p>
                <p class="text-2xl font-semibold text-gray-900">{{ uniqueItems }}</p>
              </div>
            </div>
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
          <h3 class="text-lg font-medium text-gray-900 mb-2">Error al cargar compras</h3>
          <p class="text-gray-600 mb-4">{{ error }}</p>
          <button @click="loadPurchases" class="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">
            Reintentar
          </button>
        </div>

        <!-- Empty State -->
        <div v-else-if="purchases.length === 0" class="text-center py-12">
          <div class="text-gray-400 mb-4">
            <svg class="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"></path>
            </svg>
          </div>
          <h3 class="text-lg font-medium text-gray-900 mb-2">No tienes compras aún</h3>
          <p class="text-gray-600 mb-4">Cuando compres artículos con dinero, aparecerán aquí</p>
          <router-link to="/comprar-articulos" class="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">
            Ver Artículos
          </router-link>
        </div>

        <!-- Purchases List -->
        <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div v-for="purchase in purchases" :key="purchase._id" class="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
            <!-- Article Image -->
            <div class="h-48 bg-gray-200 flex items-center justify-center">
              <img v-if="purchase.fotos && purchase.fotos.length > 0" 
                   :src="purchase.fotos[0]" 
                   :alt="purchase.nombre"
                   class="w-full h-full object-cover">
              <div v-else class="text-gray-400">
                <svg class="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                </svg>
              </div>
            </div>

            <!-- Article Info -->
            <div class="p-6">
              <h3 class="text-lg font-semibold text-gray-900 mb-2">{{ purchase.nombre }}</h3>
              <p class="text-gray-600 text-sm mb-4 line-clamp-2">{{ purchase.descripcion }}</p>
              
              <!-- Price Info -->
              <div class="flex items-center justify-between mb-4">
                <div class="text-2xl font-bold text-green-600">
                  €{{ purchase.oferta_admin?.precio_ofertado || purchase.precio_sugerido }}
                </div>
                <span class="bg-green-100 text-green-800 text-xs font-medium px-2.5 py-0.5 rounded">
                  Comprado
                </span>
              </div>

              <!-- Seller Info -->
              <div class="border-t pt-4">
                <div class="flex items-center text-sm text-gray-600">
                  <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
                  </svg>
                  <span>Vendedor: {{ purchase.vendedor_id?.name || 'N/A' }}</span>
                </div>
                <div class="flex items-center text-sm text-gray-600 mt-1">
                  <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path>
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path>
                  </svg>
                  <span>{{ purchase.ubicacion }}</span>
                </div>
              </div>

              <!-- Purchase Date -->
              <div class="mt-4 text-xs text-gray-500">
                Comprado el {{ formatDate(purchase.updatedAt) }}
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
const purchases = ref([])
const loading = ref(false)
const error = ref('')

// Computed properties
const totalPurchases = computed(() => purchases.value.length)
const totalSpent = computed(() => {
  return purchases.value.reduce((total, purchase) => {
    return total + (purchase.oferta_admin?.precio_ofertado || purchase.precio_sugerido || 0)
  }, 0)
})
const uniqueItems = computed(() => {
  const uniqueNames = new Set(purchases.value.map(p => p.nombre))
  return uniqueNames.size
})

// Methods
const loadPurchases = async () => {
  loading.value = true
  error.value = ''
  
  try {
    const response = await fetch('/api/articles/my-purchases', {
      headers: {
        'Authorization': `Bearer ${authStore.token}`
      }
    })

    if (!response.ok) {
      throw new Error(`Error ${response.status}: ${response.statusText}`)
    }

    const data = await response.json()
    purchases.value = data.data || []
  } catch (err: any) {
    console.error('Error cargando compras:', err)
    error.value = err.message || 'Error al cargar las compras'
  } finally {
    loading.value = false
  }
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
  loadPurchases()
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