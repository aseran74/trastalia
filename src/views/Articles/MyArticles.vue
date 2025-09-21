<template>
  <AdminLayout>
    <div class="mx-auto max-w-screen-2xl p-4 md:p-6 2xl:p-10">
      <!-- Breadcrumb -->
      <BreadcrumbNav />
      
      <!-- Header -->
      <div class="mb-6">
        <h1 class="text-3xl font-bold text-black dark:text-white">
          Mis Artículos
        </h1>
        <p class="text-gray-600 dark:text-gray-400">
          Artículos que has publicado y están disponibles para venta o intercambio
        </p>
      </div>

      <!-- Filtros -->
      <div class="mb-6 rounded-sm border border-stroke bg-white p-4 shadow-default dark:border-strokedark dark:bg-boxdark">
        <div class="flex flex-wrap gap-4">
          <div class="flex items-center space-x-2">
            <label class="text-sm font-medium text-gray-700 dark:text-gray-300">Filtrar por:</label>
            <select 
              v-model="filterType" 
              class="rounded border border-stroke bg-transparent px-3 py-2 text-sm dark:border-strokedark"
            >
              <option value="all">Todos</option>
              <option value="sale">Solo venta</option>
              <option value="exchange">Solo intercambio</option>
              <option value="both">Venta e intercambio</option>
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
      <div v-if="loading" class="flex justify-center py-8">
        <div class="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
      </div>

      <!-- Artículos -->
      <div v-else-if="filteredArticles.length > 0" class="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        <div 
          v-for="article in filteredArticles" 
          :key="article.id"
          class="rounded-sm border border-stroke bg-white p-6 shadow-default dark:border-strokedark dark:bg-boxdark"
        >
          <!-- Imagen del artículo -->
          <div class="mb-4 h-48 overflow-hidden rounded-lg bg-gray-100 dark:bg-gray-800">
            <img 
              :src="getImageUrl(article)" 
              :alt="article.title"
              class="h-full w-full object-cover"
              @error="handleImageError"
            />
          </div>

          <!-- Información del artículo -->
          <div class="mb-4">
            <h3 class="mb-2 text-lg font-semibold text-black dark:text-white">
              <router-link 
                :to="`/articulo/${article.id}`" 
                class="hover:text-primary transition-colors"
              >
                {{ article.title }}
              </router-link>
            </h3>
            <p class="mb-3 text-sm text-gray-600 dark:text-gray-400 line-clamp-3">
              {{ article.description }}
            </p>
            
            <!-- Estado del artículo -->
            <div class="mb-3">
              <div class="flex flex-wrap gap-2">
                <span 
                  v-if="article.isForSale" 
                  class="inline-flex items-center rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-medium text-green-800 dark:bg-green-900 dark:text-green-200"
                >
                  <svg class="mr-1 h-3 w-3" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M8.433 7.418c.155-.103.346-.196.567-.267v1.698a2.305 2.305 0 01-.567-.267C8.07 8.34 8 8.114 8 8c0-.114.07-.34.433-.582zM11 12.849v-1.698c.22.071.412.164.567.267.364.243.433.468.433.582 0 .114-.07.34-.433.582a2.305 2.305 0 01-.567.267z"></path>
                    <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-13a1 1 0 10-2 0v.092a4.535 4.535 0 00-1.676.662C6.602 6.234 6 7.009 6 8c0 .99.602 1.765 1.324 2.246.48.32 1.054.545 1.676.662v1.941c-.391-.127-.68-.317-.843-.504a1 1 0 10-1.51 1.31c.562.649 1.313 1.076 2.187 1.276V19a1 1 0 102 0v-.092a4.535 4.535 0 001.676-.662C13.398 17.766 14 16.991 14 16c0-.99-.602-1.765-1.324-2.246A4.535 4.535 0 0011 13.092v-1.941c.391.127.68.317.843.504a1 1 0 101.511-1.31c-.563-.649-1.313-1.076-2.187-1.276V5z" clip-rule="evenodd"></path>
                  </svg>
                  En Venta
                </span>
                <span 
                  v-if="article.isForExchange" 
                  class="inline-flex items-center rounded-full bg-blue-100 px-2.5 py-0.5 text-xs font-medium text-blue-800 dark:bg-blue-900 dark:text-blue-200"
                >
                  <svg class="mr-1 h-3 w-3" fill="currentColor" viewBox="0 0 20 20">
                    <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"></path>
                  </svg>
                  Intercambio
                </span>
                <span 
                  v-if="article.wantsPoints" 
                  class="inline-flex items-center rounded-full bg-yellow-100 px-2.5 py-0.5 text-xs font-medium text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200"
                >
                  <svg class="mr-1 h-3 w-3" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
                  </svg>
                  Por Puntos
                </span>
                <span 
                  v-if="article.wantsDirectExchange" 
                  class="inline-flex items-center rounded-full bg-purple-100 px-2.5 py-0.5 text-xs font-medium text-purple-800 dark:bg-purple-900 dark:text-purple-200"
                >
                  <svg class="mr-1 h-3 w-3" fill="currentColor" viewBox="0 0 20 20">
                    <path fill-rule="evenodd" d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" clip-rule="evenodd"></path>
                  </svg>
                  Intercambio Directo
                </span>
              </div>
            </div>

            <!-- Precio -->
            <div v-if="article.price" class="mb-3 flex items-center justify-between">
              <span class="text-sm text-gray-600 dark:text-gray-400">Precio:</span>
              <span class="text-lg font-bold text-green-600">{{ article.price }}€</span>
            </div>

            <!-- Puntos -->
            <div v-if="article.pointsPrice" class="mb-3 flex items-center justify-between">
              <span class="text-sm text-gray-600 dark:text-gray-400">Puntos:</span>
              <span class="text-lg font-bold text-yellow-600">{{ article.pointsPrice }} pts</span>
            </div>

            <!-- Ubicación -->
            <div class="mb-3 flex items-center text-sm text-gray-600 dark:text-gray-400">
              <svg class="mr-2 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path>
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path>
              </svg>
              {{ article.location }}
            </div>

            <!-- Fecha de publicación -->
            <div class="mb-4 flex items-center text-sm text-gray-600 dark:text-gray-400">
              <svg class="mr-2 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
              </svg>
              Publicado: {{ formatDate(article.createdAt) }}
            </div>
          </div>

          <!-- Botones de acción -->
          <div class="space-y-2">
            <div class="flex space-x-2">
              <router-link
                :to="`/articulo/${article.id}`"
                class="flex-1 rounded bg-primary px-4 py-2 text-center text-sm font-medium text-white hover:bg-primary/90"
              >
                Ver Detalle
              </router-link>
              <button
                @click="editArticle(article)"
                class="flex-1 rounded border border-stroke bg-transparent px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 dark:border-strokedark dark:text-gray-300 dark:hover:bg-gray-800"
              >
                Editar
              </button>
            </div>
            <button
              @click="deleteArticle(article)"
              class="w-full rounded bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700"
            >
              Eliminar
            </button>
          </div>
        </div>
      </div>

      <!-- Sin artículos -->
      <div v-else class="text-center py-12">
        <svg class="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"></path>
        </svg>
        <h3 class="mt-2 text-sm font-medium text-gray-900 dark:text-white">No tienes artículos publicados</h3>
        <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">Comienza publicando tu primer artículo para vender o intercambiar.</p>
        <div class="mt-6">
          <router-link
            to="/vender-articulo"
            class="inline-flex items-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-white hover:bg-primary/90"
          >
            <svg class="mr-2 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
            </svg>
            Publicar Artículo
          </router-link>
        </div>
      </div>
    </div>
  </AdminLayout>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import AdminLayout from '@/components/layout/AdminLayout.vue'
import BreadcrumbNav from '@/components/BreadcrumbNav.vue'
import { getSupabaseImageUrl, getImageByCategory } from '@/config/supabase'
import API_BASE_URL from '@/config/api'

// Estado reactivo
const articles = ref([])
const loading = ref(false)
const filterType = ref('all')
const sortBy = ref('newest')

// Cargar artículos del usuario
const loadMyArticles = async () => {
  loading.value = true
  try {
    const token = localStorage.getItem('auth_token') || sessionStorage.getItem('auth_token')
    const response = await fetch(`${API_BASE_URL}/api/articles/my-articles`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })
    
    if (response.ok) {
      const data = await response.json()
      console.log('🔍 Mis artículos recibidos:', data)
      articles.value = data.data || []
    } else {
      console.error('Error cargando mis artículos:', response.statusText)
    }
  } catch (error) {
    console.error('Error cargando mis artículos:', error)
  } finally {
    loading.value = false
  }
}

// Filtrar artículos
const filteredArticles = computed(() => {
  let filtered = articles.value.filter(article => {
    // Filtrar por tipo
    switch (filterType.value) {
      case 'sale':
        return article.isForSale && !article.isForExchange
      case 'exchange':
        return article.isForExchange && !article.isForSale
      case 'both':
        return article.isForSale && article.isForExchange
      default:
        return true
    }
  })

  // Ordenar
  switch (sortBy.value) {
    case 'oldest':
      return filtered.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt))
    case 'price-low':
      return filtered.sort((a, b) => (a.price || 0) - (b.price || 0))
    case 'price-high':
      return filtered.sort((a, b) => (b.price || 0) - (a.price || 0))
    case 'title':
      return filtered.sort((a, b) => a.title.localeCompare(b.title))
    default:
      return filtered.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
  }
})

// Formatear fecha
const formatDate = (dateString) => {
  const date = new Date(dateString)
  return date.toLocaleDateString('es-ES', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}

// Editar artículo
const editArticle = (article) => {
  // Redirigir a la página de edición
  router.push(`/editar-articulo/${article.id}`)
}

// Eliminar artículo
const deleteArticle = async (article) => {
  if (!confirm(`¿Estás seguro de que quieres eliminar "${article.title}"?`)) {
    return
  }
  
  try {
    const token = localStorage.getItem('auth_token') || sessionStorage.getItem('auth_token')
    const response = await fetch(`${API_BASE_URL}/api/articles/${article.id}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })
    
    if (response.ok) {
      // Eliminar de la lista local
      articles.value = articles.value.filter(a => a.id !== article.id)
      alert('Artículo eliminado correctamente')
    } else {
      alert('Error al eliminar el artículo')
    }
  } catch (error) {
    console.error('Error eliminando artículo:', error)
    alert('Error al eliminar el artículo')
  }
}

// Función para obtener la URL de imagen
const getImageUrl = (article) => {
  console.log('🔍 Debug getImageUrl (MyArticles):', {
    article: article.title,
    image: article.image,
    images: article.images,
    category: article.category
  })
  
  // Si el artículo tiene imagen principal, usar la función de Supabase
  if (article.image) {
    const url = getSupabaseImageUrl(article.image)
    console.log('📸 Usando imagen principal:', url.substring(0, 100) + '...')
    return url
  }
  
  // Si tiene imágenes en array, usar la primera
  if (article.images && article.images.length > 0) {
    const url = getSupabaseImageUrl(article.images[0])
    console.log('📸 Usando primera imagen del array:', url.substring(0, 100) + '...')
    return url
  }
  
  // Si no tiene imagen, usar imagen basada en categoría
  const fallbackUrl = getImageByCategory(article.category)
  console.log('📸 Usando imagen de categoría:', fallbackUrl)
  return fallbackUrl
}

// Manejar error de imagen
const handleImageError = (event) => {
  console.log('Error cargando imagen:', event.target.src)
  event.target.style.display = 'none'
}

// Cargar artículos al montar el componente
onMounted(() => {
  loadMyArticles()
})
</script>
