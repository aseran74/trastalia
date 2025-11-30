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
                  Gestión de Artículos
                </h1>
                <p class="text-gray-600 dark:text-gray-400">
                  Administra todos los artículos del sistema
                </p>
              </div>
              
              <!-- Botón de crear artículo -->
              <button
                @click="createNewArticle"
                class="bg-primary hover:bg-primary/90 text-white px-4 py-2 rounded-lg transition-colors flex items-center space-x-2"
              >
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
                </svg>
                <span>Crear Artículo</span>
              </button>
            </div>
          </div>

          <!-- Filtros -->
          <div class="mb-6 rounded-sm border border-stroke bg-white p-4 shadow-default dark:border-strokedark dark:bg-boxdark">
            <div class="flex flex-wrap gap-4">
              <div class="flex items-center space-x-2">
                <label class="text-sm font-medium text-gray-700 dark:text-gray-300">Estado:</label>
                <select 
                  v-model="filterStatus" 
                  class="rounded border border-stroke bg-transparent px-3 py-2 text-sm dark:border-strokedark"
                >
                  <option value="all">Todos</option>
                  <option value="pending">Pendientes</option>
                  <option value="pending_valuation">Pendientes de Valoración</option>
                  <option value="approved_money">Aprobados (Dinero)</option>
                  <option value="approved_points">Aprobados (Puntos)</option>
                  <option value="rejected">Rechazados</option>
                </select>
              </div>
              
              <div class="flex items-center space-x-2">
                <label class="text-sm font-medium text-gray-700 dark:text-gray-300">Categoría:</label>
                <select 
                  v-model="filterCategory" 
                  class="rounded border border-stroke bg-transparent px-3 py-2 text-sm dark:border-strokedark"
                >
                  <option value="all">Todas</option>
                  <option value="tecnologia">Tecnología</option>
                  <option value="hogar">Hogar</option>
                  <option value="deportes">Deportes</option>
                  <option value="juegos">Juegos</option>
                  <option value="moda">Moda</option>
                  <option value="libros">Libros</option>
                </select>
              </div>
              
              <div class="flex items-center space-x-2">
                <label class="text-sm font-medium text-gray-700 dark:text-gray-300">Ordenar por:</label>
                <select 
                  v-model="sortBy" 
                  class="rounded border border-stroke bg-transparent px-3 py-2 text-sm dark:border-strokedark"
                >
                  <option value="newest">Más recientes</option>
                  <option value="oldest">Más antiguos</option>
                  <option value="price-low">Precio: menor a mayor</option>
                  <option value="price-high">Precio: mayor a menor</option>
                  <option value="title">Título A-Z</option>
                </select>
              </div>
            </div>
          </div>

          <!-- Loading -->
          <div v-if="loading" class="flex justify-center py-12">
            <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>

          <!-- Artículos con diseño moderno -->
          <div v-else-if="filteredArticles.length > 0" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            <div 
              v-for="article in filteredArticles" 
              :key="article._id" 
              class="group bg-white rounded-lg shadow-md overflow-hidden flex flex-col transition-transform duration-300 hover:shadow-xl hover:-translate-y-1 dark:bg-boxdark"
            >
              <div class="relative">
                <div class="aspect-video w-full">
                  <img
                    :src="getArticleImage(article)"
                    :alt="article.title || article.nombre"
                    class="w-full h-full object-cover"
                    @error="handleImageError"
                  />
                </div>
                <span class="absolute top-3 right-3 bg-white/90 text-gray-800 text-xs px-2 py-1 rounded-full font-semibold shadow">
                  {{ getConditionLabel(article.condition || article.condicion) }}
                </span>
                <span class="absolute top-3 left-3 bg-blue-500 text-white text-xs px-2 py-1 rounded-full font-semibold shadow">
                  {{ getStatusLabel(article.adminStatus) }}
                </span>
              </div>

              <div class="p-4 flex flex-col flex-grow">
                <p class="text-xs font-semibold text-blue-600 uppercase tracking-wide">
                  {{ getCategoryLabel(article.category || article.categoria) }}
                </p>

                <h3 class="mt-2 text-lg font-bold text-gray-900 dark:text-white">
                  <span class="line-clamp-2">
                    {{ article.title || article.nombre }}
                  </span>
                </h3>
                
                <!-- Precio y Puntos -->
                <div class="mt-4 space-y-2">
                  <p class="text-2xl font-extrabold text-gray-800 dark:text-white">
                    {{ formatPrice(article.price || article.precio_propuesto_vendedor) }}
                  </p>
                  
                  <!-- Opción de puntos si está disponible -->
                  <div v-if="getArticlePoints(article)" class="flex items-center space-x-2">
                    <span class="text-sm text-gray-600 dark:text-gray-400">o</span>
                    <div class="flex items-center space-x-1">
                      <svg class="w-4 h-4 text-yellow-500" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
                      </svg>
                      <span class="text-lg font-bold text-yellow-600">
                        {{ formatPoints(getArticlePoints(article)) }} puntos
                      </span>
                    </div>
                  </div>
                </div>

                <!-- Vendedor -->
                <div class="mt-3 flex items-center text-sm text-gray-600 dark:text-gray-400">
                  <svg class="mr-2 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
                  </svg>
                  {{ article.id_vendedor?.name || article.seller?.name || 'Usuario' }}
                </div>

                <div class="mt-auto pt-4 space-y-2">
                  <button
                    @click="viewArticle(article)"
                    class="w-full bg-blue-600 text-white py-2 px-4 rounded-md text-sm font-semibold hover:bg-blue-700 transition-colors"
                  >
                    Ver Detalles
                  </button>
                  
                  <!-- Botón especial para artículos pendientes de valoración -->
                  <button
                    v-if="article.estado_articulo === 'PENDIENTE_VALORACION_PRECIO_TIENDA'"
                    @click="openPriceModal(article)"
                    class="w-full bg-orange-600 text-white py-2 px-4 rounded-md text-sm font-semibold hover:bg-orange-700 transition-colors"
                  >
                    Establecer Precio de Tienda
                  </button>
                  
                  <div class="flex space-x-2">
                    <button
                      @click="editArticle(article)"
                      class="flex-1 bg-purple-600 text-white py-2 px-4 rounded-md text-sm font-semibold hover:bg-purple-700 transition-colors"
                    >
                      Editar
                    </button>
                    
                    <button
                      @click="deleteArticle(article)"
                      class="flex-1 bg-red-600 text-white py-2 px-4 rounded-md text-sm font-semibold hover:bg-red-700 transition-colors"
                    >
                      Eliminar
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Sin artículos -->
          <div v-else class="text-center py-12">
            <svg class="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"></path>
            </svg>
            <h3 class="mt-2 text-sm font-medium text-gray-900 dark:text-white">No hay artículos disponibles</h3>
            <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">No se encontraron artículos que coincidan con los filtros seleccionados.</p>
          </div>
        </div>
      </div>
    </div>

    <!-- Modal para establecer precio de tienda -->
    <div v-if="showPriceModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div class="bg-white dark:bg-boxdark rounded-lg p-6 w-full max-w-md mx-4">
        <h3 class="text-lg font-semibold text-black dark:text-white mb-4">
          Establecer Precio de Tienda
        </h3>
        
        <div class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Precio de Venta (€)
            </label>
            <input
              v-model="priceForm.storePrice"
              type="number"
              step="0.01"
              min="0"
              class="w-full rounded border border-stroke bg-transparent px-3 py-2 text-sm dark:border-strokedark"
              placeholder="0.00"
            />
          </div>
          
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Puntos de Venta
            </label>
            <input
              v-model="priceForm.storePoints"
              type="number"
              min="0"
              class="w-full rounded border border-stroke bg-transparent px-3 py-2 text-sm dark:border-strokedark"
              placeholder="0"
            />
          </div>
        </div>
        
        <div class="flex space-x-3 mt-6">
          <button
            @click="closePriceModal"
            class="flex-1 bg-gray-300 hover:bg-gray-400 text-gray-700 py-2 px-4 rounded-md text-sm font-semibold transition-colors"
          >
            Cancelar
          </button>
          <button
            @click="setStorePrice"
            :disabled="!priceForm.storePrice && !priceForm.storePoints"
            class="flex-1 bg-primary hover:bg-primary/90 disabled:bg-gray-300 disabled:cursor-not-allowed text-white py-2 px-4 rounded-md text-sm font-semibold transition-colors"
          >
            Establecer Precio
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useToast } from '@/composables/useToast'
import AppSidebar from '@/components/layout/AppSidebar.vue'
import AppHeader from '@/components/layout/AppHeader.vue'
import Backdrop from '@/components/layout/Backdrop.vue'
import { useSidebar } from '@/composables/useSidebar'

// Sidebar logic
const { isExpanded, isHovered } = useSidebar()
import BreadcrumbNav from '@/components/BreadcrumbNav.vue'
import getApiUrl from '@/config/api'

const router = useRouter()
const toast = useToast()

// Estado reactivo
const articles = ref([])
const loading = ref(false)
const filterStatus = ref('all')
const filterCategory = ref('all')
const sortBy = ref('newest')

// Modal de precio
const showPriceModal = ref(false)
const selectedArticle = ref(null)
const priceForm = ref({
  storePrice: '',
  storePoints: ''
})

// Cargar todos los artículos
const loadArticles = async () => {
  loading.value = true
  try {
    const token = localStorage.getItem('auth_token') || sessionStorage.getItem('auth_token')
    const apiBaseUrl = getApiUrl()
    const url = `${apiBaseUrl}/api/articles`
    console.log('🔍 Cargando todos los artículos desde:', url)
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
      articles.value = data.data || []
      console.log('✅ Artículos cargados:', articles.value.length)
    } else {
      const errorText = await response.text()
      console.error('❌ Error del servidor:', errorText)
      console.error('Error cargando artículos:', response.statusText)
    }
  } catch (error) {
    console.error('❌ Error cargando artículos:', error)
  } finally {
    loading.value = false
  }
}

// Filtrar artículos
const filteredArticles = computed(() => {
  let filtered = articles.value.filter(article => {
    // Filtrar por estado
    if (filterStatus.value !== 'all') {
      if (filterStatus.value === 'pending' && article.adminStatus !== 'pending') return false
      if (filterStatus.value === 'pending_valuation' && article.estado_articulo !== 'PENDIENTE_VALORACION_PRECIO_TIENDA') return false
      if (filterStatus.value === 'approved_money' && article.adminStatus !== 'approved_money') return false
      if (filterStatus.value === 'approved_points' && article.adminStatus !== 'approved_points') return false
      if (filterStatus.value === 'rejected' && article.adminStatus !== 'rejected') return false
    }
    
    // Filtrar por categoría
    if (filterCategory.value !== 'all') {
      const category = article.category || article.categoria
      if (category !== filterCategory.value) return false
    }
    
    return true
  })

  // Ordenar
  switch (sortBy.value) {
    case 'price-low':
      return filtered.sort((a, b) => (a.price || a.precio_propuesto_vendedor || 0) - (b.price || b.precio_propuesto_vendedor || 0))
    case 'price-high':
      return filtered.sort((a, b) => (b.price || b.precio_propuesto_vendedor || 0) - (a.price || a.precio_propuesto_vendedor || 0))
    case 'oldest':
      return filtered.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt))
    case 'title':
      return filtered.sort((a, b) => (a.title || a.nombre || '').localeCompare(b.title || b.nombre || ''))
    default:
      return filtered.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
  }
})

// Formatear precio
const formatPrice = (price) => {
  if (!price) return 'Precio no disponible'
  return new Intl.NumberFormat('es-ES', {
    style: 'currency',
    currency: 'EUR'
  }).format(price)
}

// Formatear puntos
const formatPoints = (points) => {
  if (!points) return '0'
  return new Intl.NumberFormat('es-ES').format(points)
}

// Obtener puntos del artículo (desde adminDecision o campos directos)
const getArticlePoints = (article) => {
  // Prioridad 1: adminDecision.pointsAmount
  if (article.adminDecision && article.adminDecision.pointsAmount) {
    return article.adminDecision.pointsAmount
  }
  // Prioridad 2: campos directos
  if (article.precio_puntos) {
    return article.precio_puntos
  }
  if (article.points) {
    return article.points
  }
  return null
}

// Obtener etiqueta de condición
const getConditionLabel = (condition) => {
  const labels = {
    'nuevo': 'Nuevo',
    'como_nuevo': 'Como Nuevo',
    'bueno': 'Bueno',
    'aceptable': 'Aceptable'
  }
  return labels[condition] || condition
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

// Obtener etiqueta de estado
const getStatusLabel = (status) => {
  const labels = {
    'pending': 'Pendiente',
    'approved_money': 'Aprobado €',
    'approved_points': 'Aprobado ⭐',
    'rejected': 'Rechazado'
  }
  return labels[status] || status
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

// Ver artículo
const viewArticle = (article) => {
  window.open(`/articulos/${article._id}`, '_blank')
}

// Editar artículo
const editArticle = (article) => {
  router.push(`/admin/articulos/${article._id}/editar`)
}

// Eliminar artículo
const deleteArticle = async (article) => {
  if (!confirm(`¿Estás seguro de que quieres eliminar "${article.title || article.nombre}"?`)) {
    return
  }
  
  try {
    const token = localStorage.getItem('auth_token') || sessionStorage.getItem('auth_token')
    const apiBaseUrl = getApiUrl()
    const response = await fetch(`${apiBaseUrl}/api/articles/${article._id}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    })
    
    if (response.ok) {
      toast.success('Artículo eliminado', 'El artículo se ha eliminado correctamente.')
      loadArticles() // Recargar la lista
    } else {
      toast.error('Error', 'No se pudo eliminar el artículo.')
    }
  } catch (error) {
    console.error('Error eliminando artículo:', error)
    toast.error('Error', 'No se pudo eliminar el artículo.')
  }
}

// Crear nuevo artículo
const createNewArticle = () => {
  router.push('/vender-articulo')
}

// Abrir modal de precio
const openPriceModal = (article) => {
  selectedArticle.value = article
  priceForm.value = {
    storePrice: '',
    storePoints: ''
  }
  showPriceModal.value = true
}

// Cerrar modal de precio
const closePriceModal = () => {
  showPriceModal.value = false
  selectedArticle.value = null
  priceForm.value = {
    storePrice: '',
    storePoints: ''
  }
}

// Establecer precio de tienda
const setStorePrice = async () => {
  if (!selectedArticle.value) return
  
  try {
    const token = localStorage.getItem('auth_token') || sessionStorage.getItem('auth_token')
    const apiBaseUrl = getApiUrl()
    const response = await fetch(`${apiBaseUrl}/api/articles/set-store-price`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        articleId: selectedArticle.value._id,
        storePrice: parseFloat(priceForm.value.storePrice) || 0,
        storePoints: parseInt(priceForm.value.storePoints) || 0
      })
    })
    
    if (response.ok) {
      const data = await response.json()
      toast.success('Precio establecido', data.message)
      closePriceModal()
      loadArticles() // Recargar la lista
    } else {
      const errorData = await response.json()
      toast.error('Error', errorData.message)
    }
  } catch (error) {
    console.error('Error estableciendo precio:', error)
    toast.error('Error', 'No se pudo establecer el precio.')
  }
}

// Cargar artículos al montar el componente
onMounted(() => {
  loadArticles()
})
</script>
