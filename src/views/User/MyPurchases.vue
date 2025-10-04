<template>
  <div class="min-h-screen xl:flex">
    <app-sidebar />
    <Backdrop />
    <div
      class="flex-1 transition-all duration-300 ease-in-out"
      :class="[isExpanded || isHovered ? 'lg:ml-[290px]' : 'lg:ml-[90px]']"
    >
      <app-header />
      <div class="p-4 mx-auto max-w-(--breakpoint-2xl) md:p-6">
        <div class="mx-auto max-w-screen-2xl p-4 md:p-6 2xl:p-10">
          <!-- Breadcrumb -->
          <BreadcrumbNav />
          
          <!-- Header -->
          <div class="mb-6">
            <h1 class="text-3xl font-bold text-black dark:text-white">
              Mis Compras
            </h1>
            <p class="text-gray-600 dark:text-gray-400">
              Historial de todas tus compras de artículos y puntos
            </p>
          </div>

          <!-- Loading -->
          <div v-if="loading" class="flex justify-center items-center py-12">
            <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>

          <!-- Compras -->
          <div v-else-if="purchases.length > 0" class="space-y-6">
            <div
              v-for="purchase in purchases"
              :key="purchase._id"
              class="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 border border-gray-200 dark:border-gray-700"
            >
              <!-- Header de la compra -->
              <div class="flex justify-between items-start mb-4">
                <div>
                  <h3 class="text-lg font-semibold text-gray-900 dark:text-white">
                    {{ getPurchaseTitle(purchase) }}
                  </h3>
                  <p class="text-sm text-gray-500 dark:text-gray-400">
                    {{ formatDate(purchase.createdAt) }}
                  </p>
                </div>
                <div class="text-right">
                  <span
                    :class="[
                      'px-3 py-1 rounded-full text-xs font-medium',
                      purchase.status === 'completed'
                        ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                        : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
                    ]"
                  >
                    {{ getStatusText(purchase.status) }}
                  </span>
                </div>
              </div>

              <!-- Detalles de la compra -->
              <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <!-- Artículos (si es compra de artículos) -->
                <div v-if="purchase.type === 'article_purchase' && purchase.articles">
                  <h4 class="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Artículos Comprados:
                  </h4>
                  <div class="space-y-2">
                    <div
                      v-for="article in purchase.articles"
                      :key="article.id"
                      class="flex items-center space-x-3 p-2 bg-gray-50 dark:bg-gray-700 rounded"
                    >
                      <img
                        v-if="article.images && article.images.length > 0"
                        :src="article.images[0]"
                        :alt="article.title"
                        class="w-12 h-12 object-cover rounded"
                      />
                      <div class="flex-1">
                        <p class="text-sm font-medium text-gray-900 dark:text-white">
                          {{ article.title }}
                        </p>
                        <p class="text-xs text-gray-500 dark:text-gray-400">
                          {{ article.category }}
                        </p>
                      </div>
                      <span class="text-sm font-semibold text-gray-900 dark:text-white">
                        €{{ article.price }}
                      </span>
                    </div>
                  </div>
                </div>

                <!-- Puntos (si es compra de puntos) -->
                <div v-if="purchase.type === 'points_purchase'">
                  <h4 class="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Puntos Comprados:
                  </h4>
                  <div class="flex items-center space-x-2">
                    <span class="text-2xl">⭐</span>
                    <div>
                      <p class="text-lg font-semibold text-gray-900 dark:text-white">
                        {{ purchase.totalPoints }} puntos
                      </p>
                      <p v-if="purchase.bonusPoints > 0" class="text-sm text-green-600 dark:text-green-400">
                        +{{ purchase.bonusPoints }} de regalo
                      </p>
                    </div>
                  </div>
                </div>

                <!-- Resumen financiero -->
                <div>
                  <h4 class="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Resumen de Pago:
                  </h4>
                  <div class="space-y-1 text-sm">
                    <div class="flex justify-between">
                      <span class="text-gray-600 dark:text-gray-400">Subtotal:</span>
                      <span class="text-gray-900 dark:text-white">€{{ purchase.amount }}</span>
                    </div>
                    <div v-if="purchase.shippingCost > 0" class="flex justify-between">
                      <span class="text-gray-600 dark:text-gray-400">Envío:</span>
                      <span class="text-gray-900 dark:text-white">€{{ purchase.shippingCost }}</span>
                    </div>
                    <div class="flex justify-between border-t border-gray-200 dark:border-gray-600 pt-1">
                      <span class="font-medium text-gray-900 dark:text-white">Total:</span>
                      <span class="font-semibold text-blue-600 dark:text-blue-400">
                        €{{ purchase.totalCost }}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Información adicional -->
              <div class="flex justify-between items-center text-xs text-gray-500 dark:text-gray-400">
                <span>ID de sesión: {{ purchase.stripeSessionId }}</span>
                <span v-if="purchase.packageType" class="capitalize">
                  Paquete: {{ purchase.packageType }}
                </span>
              </div>
            </div>

            <!-- Paginación -->
            <div v-if="pagination.pages > 1" class="flex justify-center">
              <nav class="flex space-x-2">
                <button
                  v-for="page in pagination.pages"
                  :key="page"
                  @click="loadPurchases(page)"
                  :class="[
                    'px-3 py-2 rounded-md text-sm font-medium',
                    page === pagination.page
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-200 text-gray-700 hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600'
                  ]"
                >
                  {{ page }}
                </button>
              </nav>
            </div>
          </div>

          <!-- Sin compras -->
          <div v-else class="text-center py-12">
            <svg class="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"></path>
            </svg>
            <h3 class="mt-2 text-sm font-medium text-gray-900 dark:text-white">No tienes compras</h3>
            <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">
              Cuando realices una compra, aparecerá aquí.
            </p>
            <div class="mt-6">
              <router-link
                to="/comprar-articulos"
                class="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
              >
                Comprar Artículos
              </router-link>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useToast } from '@/composables/useToast'
import AppSidebar from '@/components/layout/AppSidebar.vue'
import AppHeader from '@/components/layout/AppHeader.vue'
import Backdrop from '@/components/layout/Backdrop.vue'
import { useSidebar } from '@/composables/useSidebar'
import BreadcrumbNav from '@/components/BreadcrumbNav.vue'
import API_BASE_URL from '@/config/api'

// Sidebar logic
const { isExpanded, isHovered } = useSidebar()

const toast = useToast()
const loading = ref(false)
const purchases = ref([])
const pagination = ref({
  page: 1,
  limit: 10,
  total: 0,
  pages: 0
})

const loadPurchases = async (page = 1) => {
  loading.value = true
  
  try {
    const token = localStorage.getItem('auth_token') || sessionStorage.getItem('auth_token')
    
    if (!token) {
      toast.error('No autenticado', 'Por favor, inicia sesión para ver tus compras.')
      return
    }

    const response = await fetch(`${API_BASE_URL}/api/articles/my-purchases?page=${page}&limit=${pagination.value.limit}`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })

    if (!response.ok) {
      throw new Error('Error al cargar las compras')
    }

    const data = await response.json()
    
    if (data.success) {
      // El endpoint /api/articles/my-purchases devuelve data.purchases directamente
      purchases.value = data.data.purchases || []
      // No hay paginación en este endpoint, así que simulamos la estructura
      pagination.value = {
        page: 1,
        limit: 10,
        total: data.data.totalPurchases || purchases.value.length,
        pages: 1
      }
    } else {
      throw new Error(data.message || 'Error al cargar las compras')
    }

  } catch (error) {
    console.error('Error cargando compras:', error)
    toast.error('Error', 'No se pudieron cargar las compras.')
  } finally {
    loading.value = false
  }
}

const getPurchaseTitle = (purchase) => {
  // Para el endpoint /api/articles/my-purchases, cada elemento es un artículo comprado
  return purchase.title || purchase.nombre || 'Artículo comprado'
}

const getStatusText = (status) => {
  const statusMap = {
    'completed': 'Completado',
    'pending': 'Pendiente',
    'failed': 'Fallido',
    'cancelled': 'Cancelado'
  }
  return statusMap[status] || status
}

const formatDate = (dateString) => {
  const date = new Date(dateString)
  return date.toLocaleDateString('es-ES', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

onMounted(() => {
  loadPurchases()
})
</script>
