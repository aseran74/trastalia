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
            <div class="flex justify-between items-start">
              <div>
                <h1 class="text-3xl font-bold text-black dark:text-white">
                  Mis Compras
                </h1>
                <p class="text-gray-600 dark:text-gray-400">
                  Historial de artículos comprados con dinero
                </p>
              </div>
              <!-- Estadísticas -->
              <div v-if="!loading && purchases.length > 0" class="text-right">
                <div class="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg">
                  <p class="text-sm text-gray-600 dark:text-gray-400">Total de compras</p>
                  <p class="text-2xl font-bold text-green-600 dark:text-green-400">{{ totalPurchases }}</p>
                  <p class="text-sm text-gray-600 dark:text-gray-400">Dinero gastado</p>
                  <p class="text-lg font-semibold text-green-600 dark:text-green-400">{{ formatMoney(totalSpent) }}</p>
                </div>
              </div>
            </div>
          </div>

          <!-- Loading -->
          <div v-if="loading" class="flex justify-center py-12">
            <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
          </div>

          <!-- Compras -->
          <div v-else-if="purchases.length > 0" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            <div 
              v-for="purchase in purchases" 
              :key="purchase.id" 
              class="group bg-white rounded-lg shadow-md overflow-hidden flex flex-col transition-transform duration-300 hover:shadow-xl hover:-translate-y-1 dark:bg-boxdark"
            >
              <div class="relative">
                <div class="aspect-video w-full">
                  <img
                    :src="getArticleImage(purchase)"
                    :alt="purchase.title"
                    class="w-full h-full object-cover"
                    @error="handleImageError"
                  />
                </div>
                <span class="absolute top-3 right-3 text-white text-xs px-2 py-1 rounded-full font-semibold shadow" :class="getStatusBadgeClass(purchase.currentStatus)">
                  {{ getStatusLabel(purchase.currentStatus) }}
                </span>
                <span class="absolute top-3 left-3 bg-green-500 text-white text-xs px-2 py-1 rounded-full font-semibold shadow">
                  Con Dinero
                </span>
              </div>

              <div class="p-4 flex flex-col flex-grow">
                <p class="text-xs font-semibold text-green-600 uppercase tracking-wide">
                  {{ getCategoryLabel(purchase.category) }}
                </p>

                <h3 class="mt-2 text-lg font-bold text-gray-900 dark:text-white">
                  <span class="line-clamp-2">
                    {{ purchase.title }}
                  </span>
                </h3>
                
                <!-- Precio pagado -->
                <div class="mt-4 space-y-2">
                  <div class="flex items-center space-x-2">
                    <svg class="w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M8.433 7.418c.155-.103.346-.196.567-.267v1.698a2.305 2.305 0 01-.567-.267C8.07 8.34 8 8.114 8 8c0-.114.07-.34.433-.582zM11 12.849v-1.698c.22.071.412.164.567.267.364.243.433.468.433.582 0 .114-.07.34-.433.582a2.305 2.305 0 01-.567.267z"/>
                      <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-13a1 1 0 10-2 0v.092a4.535 4.535 0 00-1.676.662C6.602 6.234 6 7.009 6 8c0 .99.602 1.765 1.324 2.246.48.32 1.054.545 1.676.662v1.941c-.391-.127-.68-.317-.843-.504a1 1 0 10-1.51 1.31c.562.649 1.413 1.076 2.353 1.253V15a1 1 0 102 0v-.092a4.535 4.535 0 001.676-.662C13.398 13.766 14 12.991 14 12c0-.99-.602-1.765-1.324-2.246A4.535 4.535 0 0011 9.092V7.151c.391.127.68.317.843.504a1 1 0 101.511-1.31c-.563-.649-1.413-1.076-2.354-1.253V5z" clip-rule="evenodd"/>
                    </svg>
                    <span class="text-lg font-bold text-green-600">
                      {{ formatMoney(purchase.purchasePrice) }}
                    </span>
                  </div>
                </div>

                <!-- Información del vendedor -->
                <div class="mt-3 flex items-center text-sm text-gray-600 dark:text-gray-400">
                  <svg class="mr-2 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
                  </svg>
                  Vendido por: {{ purchase.seller?.name || 'Usuario' }}
                </div>

                <!-- Fecha de compra -->
                <div class="mt-2 flex items-center text-sm text-gray-600 dark:text-gray-400">
                  <svg class="mr-2 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                  </svg>
                  Comprado el {{ formatDate(purchase.purchaseDate) }}
                </div>

                <div class="mt-auto pt-4">
                  <button
                    @click="viewArticle(purchase)"
                    class="w-full bg-green-600 text-white py-2 px-4 rounded-md text-sm font-semibold hover:bg-green-700 transition-colors"
                  >
                    Ver Detalles
                  </button>
                </div>
              </div>
            </div>
          </div>

          <!-- Sin compras -->
          <div v-else class="text-center py-12">
            <svg class="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"></path>
            </svg>
            <h3 class="mt-2 text-sm font-medium text-gray-900 dark:text-white">No tienes compras aún</h3>
            <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">Explora artículos disponibles y compra con dinero.</p>
            <div class="mt-6">
              <router-link 
                to="/comprar-articulos" 
                class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700"
              >
                Ver Artículos Disponibles
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
import { useRouter } from 'vue-router'
import AppSidebar from '@/components/layout/AppSidebar.vue'
import AppHeader from '@/components/layout/AppHeader.vue'
import Backdrop from '@/components/layout/Backdrop.vue'
import { useSidebar } from '@/composables/useSidebar'
import BreadcrumbNav from '@/components/BreadcrumbNav.vue'
import API_BASE_URL from '@/config/api'

const router = useRouter()
const { isExpanded, isHovered } = useSidebar()

// Estado reactivo
const purchases = ref([])
const loading = ref(false)
const totalPurchases = ref(0)
const totalSpent = ref(0)

// Cargar compras del usuario
const loadPurchases = async () => {
  loading.value = true
  try {
    const token = localStorage.getItem('auth_token') || sessionStorage.getItem('auth_token')
    const url = `${API_BASE_URL}/api/articles/my-purchases`
    console.log('🔍 Cargando compras del usuario desde:', url)
    console.log('🔑 Token:', token ? 'Presente' : 'Ausente')
    
    const response = await fetch(url, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    })
    
    console.log('📊 Respuesta del servidor:', response.status, response.statusText)
    
    if (response.ok) {
      const data = await response.json()
      purchases.value = data.data.purchases || []
      totalPurchases.value = data.data.totalPurchases || 0
      totalSpent.value = data.data.totalSpent || 0
      console.log('✅ Compras cargadas:', purchases.value.length)
      console.log('📊 Total compras:', totalPurchases.value)
      console.log('💰 Dinero gastado:', totalSpent.value)
    } else {
      const errorText = await response.text()
      console.error('❌ Error del servidor:', errorText)
      console.error('Error cargando compras:', response.statusText)
    }
  } catch (error) {
    console.error('❌ Error cargando compras:', error)
  } finally {
    loading.value = false
  }
}

// Formatear dinero
const formatMoney = (amount) => {
  if (!amount) return '0,00 €'
  return new Intl.NumberFormat('es-ES', {
    style: 'currency',
    currency: 'EUR'
  }).format(amount)
}

// Obtener etiqueta de categoría
const getCategoryLabel = (category) => {
  const labels = {
    'tecnologia': 'Tecnología',
    'hogar': 'Hogar',
    'deportes': 'Deportes',
    'juegos': 'Juegos',
    'moda': 'Moda',
    'libros': 'Libros',
    'musica': 'Música',
    'cocina': 'Cocina',
    'jardineria': 'Jardinería',
    'automoviles': 'Automóviles',
    'belleza': 'Belleza',
    'salud': 'Salud'
  }
  return labels[category] || category
}

// Obtener imagen del artículo
const getArticleImage = (article) => {
  if (article.images && article.images.length > 0) {
    return article.images[0]
  }
  
  const title = article.title || 'Artículo'
  return `https://via.placeholder.com/400x300/cccccc/666666?text=${encodeURIComponent(title)}`
}

// Manejar error de imagen
const handleImageError = (event) => {
  const placeholderSrc = 'https://via.placeholder.com/400x300/cccccc/666666?text=Imagen+no+disponible'
  
  if (event.target.src !== placeholderSrc) {
    event.target.src = placeholderSrc
  }
}

// Formatear fecha
const formatDate = (date) => {
  return new Date(date).toLocaleDateString('es-ES', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}

// Obtener etiqueta del estado
const getStatusLabel = (status) => {
  const labels = {
    'VENDIDO_DINERO': 'Comprado',
    'ENVIADO': 'Enviado',
    'ENTREGADO': 'Entregado',
    'RECHAZADO_ENVIO': 'Rechazado'
  }
  return labels[status] || 'Comprado'
}

// Obtener clase CSS del badge según el estado
const getStatusBadgeClass = (status) => {
  const classes = {
    'VENDIDO_DINERO': 'bg-green-500',
    'ENVIADO': 'bg-yellow-500',
    'ENTREGADO': 'bg-blue-500',
    'RECHAZADO_ENVIO': 'bg-red-500'
  }
  return classes[status] || 'bg-green-500'
}

// Ver artículo
const viewArticle = (article) => {
  window.open(`/articulos/${article.id}`, '_blank')
}

// Cargar compras al montar el componente
onMounted(() => {
  loadPurchases()
})
</script>
