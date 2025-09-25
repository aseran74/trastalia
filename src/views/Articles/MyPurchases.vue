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
                  Mis Canjes
                </h1>
                <p class="text-gray-600 dark:text-gray-400">
                  Historial de artículos canjeados con puntos
                </p>
              </div>
              <!-- Estadísticas -->
              <div v-if="!loading" class="text-right">
                <div class="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
                  <p class="text-sm text-gray-600 dark:text-gray-400">Total de canjes</p>
                  <p class="text-2xl font-bold text-blue-600 dark:text-blue-400">{{ totalExchanges }}</p>
                  <p class="text-sm text-gray-600 dark:text-gray-400">Puntos gastados</p>
                  <p class="text-lg font-semibold text-yellow-600 dark:text-yellow-400">{{ formatPoints(totalPointsSpent) }}</p>
                </div>
              </div>
            </div>
          </div>

          <!-- Loading -->
          <div v-if="loading" class="flex justify-center py-12">
            <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>

          <!-- Compras -->
          <div v-else-if="purchases.length > 0" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            <div 
              v-for="purchase in purchases" 
              :key="purchase._id" 
              class="group bg-white rounded-lg shadow-md overflow-hidden flex flex-col transition-transform duration-300 hover:shadow-xl hover:-translate-y-1 dark:bg-boxdark"
            >
              <div class="relative">
                <div class="aspect-video w-full">
                  <img
                    :src="getArticleImage(purchase)"
                    :alt="purchase.title || purchase.nombre"
                    class="w-full h-full object-cover"
                    @error="handleImageError"
                  />
                </div>
                <span class="absolute top-3 right-3 text-white text-xs px-2 py-1 rounded-full font-semibold shadow" :class="getStatusBadgeClass(purchase.estado_articulo)">
                  {{ getStatusLabel(purchase.estado_articulo) }}
                </span>
                <span class="absolute top-3 left-3 bg-blue-500 text-white text-xs px-2 py-1 rounded-full font-semibold shadow">
                  Con Puntos
                </span>
              </div>

              <div class="p-4 flex flex-col flex-grow">
                <p class="text-xs font-semibold text-blue-600 uppercase tracking-wide">
                  {{ getCategoryLabel(purchase.category || purchase.categoria) }}
                </p>

                <h3 class="mt-2 text-lg font-bold text-gray-900 dark:text-white">
                  <span class="line-clamp-2">
                    {{ purchase.title || purchase.nombre }}
                  </span>
                </h3>
                
                <!-- Puntos utilizados -->
                <div class="mt-4 space-y-2">
                  <div class="flex items-center space-x-2">
                    <svg class="w-5 h-5 text-yellow-500" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
                    </svg>
                    <span class="text-lg font-bold text-yellow-600">
                      {{ formatPoints(getPurchasePoints(purchase)) }} puntos
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

                <!-- Fecha de canje -->
                <div class="mt-2 flex items-center text-sm text-gray-600 dark:text-gray-400">
                  <svg class="mr-2 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                  </svg>
                  Canjeado el {{ formatDate(purchase.exchangeDate || purchase.updatedAt) }}
                </div>

                <div class="mt-auto pt-4">
                  <button
                    @click="viewArticle(purchase)"
                    class="w-full bg-blue-600 text-white py-2 px-4 rounded-md text-sm font-semibold hover:bg-blue-700 transition-colors"
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
            <h3 class="mt-2 text-sm font-medium text-gray-900 dark:text-white">No tienes canjes aún</h3>
            <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">Explora artículos disponibles y canjea con tus puntos.</p>
            <div class="mt-6">
              <router-link 
                to="/comprar-articulos" 
                class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
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
const totalExchanges = ref(0)
const totalPointsSpent = ref(0)

// Cargar compras del usuario
const loadPurchases = async () => {
  loading.value = true
  try {
    const token = localStorage.getItem('auth_token') || sessionStorage.getItem('auth_token')
    const url = `${API_BASE_URL}/api/articles/my-exchanges`
    console.log('🔍 Cargando canjes del usuario desde:', url)
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
      console.log('📄 Datos completos del servidor:', data)
      purchases.value = data.data.exchanges || []
      totalExchanges.value = data.data.totalExchanges || 0
      totalPointsSpent.value = data.data.totalPointsSpent || 0
      console.log('✅ Canjes cargados:', purchases.value.length)
      console.log('📊 Total canjes:', totalExchanges.value)
      console.log('💰 Puntos gastados:', totalPointsSpent.value)
      console.log('🔍 Verificando valores reactivos:', {
        purchases: purchases.value.length,
        totalExchanges: totalExchanges.value,
        totalPointsSpent: totalPointsSpent.value
      })
    } else {
      const errorText = await response.text()
      console.error('❌ Error del servidor:', errorText)
      console.error('Error cargando canjes:', response.statusText)
    }
  } catch (error) {
    console.error('❌ Error cargando canjes:', error)
  } finally {
    loading.value = false
  }
}

// Formatear puntos
const formatPoints = (points) => {
  if (!points) return '0'
  return new Intl.NumberFormat('es-ES').format(points)
}

// Obtener puntos de la compra
const getPurchasePoints = (purchase) => {
  // Prioridad 1: pointsUsed (del servidor)
  if (purchase.pointsUsed) {
    return purchase.pointsUsed
  }
  // Prioridad 2: adminDecision.finalPoints (puntos realmente usados)
  if (purchase.adminDecision && purchase.adminDecision.finalPoints) {
    return purchase.adminDecision.finalPoints
  }
  // Prioridad 3: adminDecision.pointsAmount
  if (purchase.adminDecision && purchase.adminDecision.pointsAmount) {
    return purchase.adminDecision.pointsAmount
  }
  // Prioridad 4: campos directos
  if (purchase.precio_puntos) {
    return purchase.precio_puntos
  }
  if (purchase.points) {
    return purchase.points
  }
  return 0
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
  if (article.fotos && article.fotos.length > 0) {
    return article.fotos[0]
  }
  
  const title = article.title || article.nombre || 'Artículo'
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
    'VENDIDO_PUNTOS': 'Comprado',
    'ENVIADO': 'Enviado',
    'ENTREGADO': 'Entregado',
    'RECHAZADO_ENVIO': 'Rechazado'
  }
  return labels[status] || 'Comprado'
}

// Obtener clase CSS del badge según el estado
const getStatusBadgeClass = (status) => {
  const classes = {
    'VENDIDO_PUNTOS': 'bg-green-500',
    'ENVIADO': 'bg-yellow-500',
    'ENTREGADO': 'bg-blue-500',
    'RECHAZADO_ENVIO': 'bg-red-500'
  }
  return classes[status] || 'bg-green-500'
}

// Ver artículo
const viewArticle = (article) => {
  window.open(`/articulos/${article._id}`, '_blank')
}

// Cargar compras al montar el componente
onMounted(() => {
  loadPurchases()
})
</script>