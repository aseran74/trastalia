<template>
  <AdminLayout>
    <div class="mx-auto max-w-screen-2xl p-4 md:p-6 2xl:p-10">
      <!-- Breadcrumb -->
      <BreadcrumbNav />
      
      <!-- Loading -->
      <div v-if="loading" class="flex justify-center py-8">
        <div class="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
      </div>

      <!-- Error -->
      <div v-else-if="error" class="text-center py-12">
        <svg class="mx-auto h-12 w-12 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"></path>
        </svg>
        <h3 class="mt-2 text-sm font-medium text-gray-900 dark:text-white">Error al cargar el artículo</h3>
        <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">{{ error }}</p>
        <div class="mt-6">
          <router-link to="/comprar-articulo" class="text-primary hover:text-primary-dark">
            ← Volver a la lista de artículos
          </router-link>
        </div>
      </div>

      <!-- Artículo -->
      <div v-else-if="article" class="grid grid-cols-1 gap-8 lg:grid-cols-2">
        <!-- Imágenes -->
        <div class="space-y-4">
          <!-- Imagen principal -->
          <div class="aspect-square overflow-hidden rounded-lg bg-gray-100 dark:bg-gray-800">
            <img 
              v-if="article.image || (article.images && article.images.length > 0)" 
              :src="getArticleImageUrl(article)" 
              :alt="article.title"
              class="h-full w-full object-cover"
              @error="handleImageError"
            />
            <div v-else class="flex h-full items-center justify-center text-gray-400">
              <svg class="h-24 w-24" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
              </svg>
            </div>
          </div>

          <!-- Imágenes adicionales (si las hay) -->
          <div v-if="article.images && article.images.length > 0" class="grid grid-cols-4 gap-2">
            <div 
              v-for="(image, index) in article.images" 
              :key="index"
              class="aspect-square overflow-hidden rounded-lg bg-gray-100 dark:bg-gray-800 cursor-pointer"
              @click="setMainImage(image)"
            >
              <img 
                :src="getImageUrl(image)" 
                :alt="`${article.title} - Imagen ${index + 1}`"
                class="h-full w-full object-cover hover:opacity-75"
                @error="handleImageError"
              />
            </div>
          </div>
        </div>

        <!-- Información del artículo -->
        <div class="space-y-6">
          <!-- Título y precio -->
          <div>
            <h1 class="text-3xl font-bold text-black dark:text-white mb-4">
              {{ article.title }}
            </h1>
            
            <!-- Precios -->
            <div class="space-y-3">
              <div v-if="article.price > 0" class="flex items-center justify-between rounded-lg bg-green-50 p-4 dark:bg-green-900/20">
                <div class="flex items-center">
                  <svg class="h-6 w-6 text-green-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1"></path>
                  </svg>
                  <span class="text-lg font-medium text-gray-700 dark:text-gray-300">Precio en dinero:</span>
                </div>
                <span class="text-3xl font-bold text-green-600">{{ article.price }}€</span>
              </div>

              <div v-if="article.pointsPrice > 0" class="flex items-center justify-between rounded-lg bg-blue-50 p-4 dark:bg-blue-900/20">
                <div class="flex items-center">
                  <svg class="h-6 w-6 text-blue-600 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
                  </svg>
                  <span class="text-lg font-medium text-gray-700 dark:text-gray-300">Precio en puntos:</span>
                </div>
                <span class="text-3xl font-bold text-blue-600">{{ article.pointsPrice }} pts</span>
              </div>
            </div>
          </div>

          <!-- Descripción -->
          <div>
            <h2 class="text-xl font-semibold text-black dark:text-white mb-3">Descripción</h2>
            <p class="text-gray-600 dark:text-gray-400 leading-relaxed">
              {{ article.description }}
            </p>
          </div>

          <!-- Información del vendedor -->
          <div class="rounded-lg border border-stroke bg-white p-6 dark:border-strokedark dark:bg-boxdark">
            <h3 class="text-lg font-semibold text-black dark:text-white mb-4">Información del vendedor</h3>
            <div class="flex items-center space-x-4">
              <div class="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                <svg class="h-6 w-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
                </svg>
              </div>
              <div>
                <p class="font-medium text-black dark:text-white">{{ article.seller?.name || 'Usuario' }}</p>
                <p class="text-sm text-gray-600 dark:text-gray-400">Miembro desde {{ formatDate(article.seller?.createdAt) }}</p>
              </div>
            </div>
          </div>

          <!-- Ubicación -->
          <div class="rounded-lg border border-stroke bg-white p-6 dark:border-strokedark dark:bg-boxdark">
            <h3 class="text-lg font-semibold text-black dark:text-white mb-4">Ubicación</h3>
            <div class="flex items-center space-x-2">
              <svg class="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path>
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path>
              </svg>
              <span class="text-gray-600 dark:text-gray-400">{{ article.location }}</span>
            </div>
          </div>

          <!-- Opciones de compra/intercambio -->
          <div class="space-y-4">
            <div v-if="article.price > 0 || article.pointsPrice > 0" class="space-y-3">
              <h3 class="text-lg font-semibold text-black dark:text-white">Opciones de compra</h3>
              <div class="flex space-x-3">
                <button
                  v-if="article.price > 0"
                  @click="buyWithMoney(article)"
                  class="flex-1 rounded bg-green-600 px-6 py-3 text-lg font-medium text-white hover:bg-green-700"
                >
                  Comprar con Dinero ({{ article.price }}€)
                </button>
                <button
                  v-if="article.pointsPrice > 0"
                  @click="buyWithPoints(article)"
                  class="flex-1 rounded bg-blue-600 px-6 py-3 text-lg font-medium text-white hover:bg-blue-700"
                >
                  Comprar con Puntos ({{ article.pointsPrice }} pts)
                </button>
              </div>
            </div>

            <div v-if="article.wantsDirectExchange || article.wantsPoints" class="space-y-3">
              <h3 class="text-lg font-semibold text-black dark:text-white">Opciones de intercambio</h3>
              <div class="flex space-x-3">
                <button
                  v-if="article.wantsDirectExchange"
                  @click="proposeDirectExchange(article)"
                  class="flex-1 rounded bg-purple-600 px-6 py-3 text-lg font-medium text-white hover:bg-purple-700"
                >
                  Proponer Intercambio Directo
                </button>
                <button
                  v-if="article.wantsPoints"
                  @click="proposePointsExchange(article)"
                  class="flex-1 rounded bg-orange-600 px-6 py-3 text-lg font-medium text-white hover:bg-orange-700"
                >
                  Proponer Intercambio por Puntos
                </button>
              </div>
            </div>
          </div>

          <!-- Información adicional -->
          <div class="text-sm text-gray-500 dark:text-gray-400">
            <p>Publicado el {{ formatDate(article.createdAt) }}</p>
            <p v-if="article.updatedAt !== article.createdAt">Actualizado el {{ formatDate(article.updatedAt) }}</p>
          </div>
        </div>
      </div>
    </div>
  </AdminLayout>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import AdminLayout from '@/components/layout/AdminLayout.vue'
import BreadcrumbNav from '@/components/BreadcrumbNav.vue'
import { getSupabaseImageUrl, getImageByCategory } from '@/config/supabase'

const route = useRoute()
const router = useRouter()

// Estado reactivo
const article = ref(null)
const loading = ref(true)
const error = ref(null)

// Cargar artículo
const loadArticle = async () => {
  loading.value = true
  error.value = null
  
  try {
    console.log('🔍 Cargando artículo con ID:', route.params.id)
    const token = localStorage.getItem('auth_token') || sessionStorage.getItem('auth_token')
    const url = `http://localhost:3002/api/articles/${route.params.id}`
    console.log('🔗 URL de la API:', url)
    
    const response = await fetch(url, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })
    
    console.log('📡 Respuesta del servidor:', response.status)
    
    if (response.ok) {
      const data = await response.json()
      console.log('📋 Datos del artículo:', data)
      article.value = data.data
    } else if (response.status === 404) {
      error.value = 'Artículo no encontrado'
    } else {
      error.value = 'Error al cargar el artículo'
    }
  } catch (err) {
    error.value = 'Error de conexión'
    console.error('Error cargando artículo:', err)
  } finally {
    loading.value = false
  }
}

// Obtener URL de imagen (compatible con Supabase)
const getImageUrl = (imagePath) => {
  if (!imagePath) {
    return getImageByCategory(article.value?.category || 'default')
  }
  console.log('🔍 Debug getImageUrl (Detail):', imagePath.substring(0, 100) + '...')
  return getSupabaseImageUrl(imagePath)
}

// Obtener URL de imagen del artículo
const getArticleImageUrl = (article) => {
  console.log('🔍 Debug getArticleImageUrl:', {
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

// Establecer imagen principal
const setMainImage = (image) => {
  if (article.value) {
    article.value.image = image
  }
}

// Formatear fecha
const formatDate = (dateString) => {
  if (!dateString) return 'Fecha no disponible'
  return new Date(dateString).toLocaleDateString('es-ES', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}

// Comprar con dinero
const buyWithMoney = (article) => {
  if (!article.price || article.price <= 0) {
    alert('Este artículo no está disponible para compra con dinero')
    return
  }
  
  const token = localStorage.getItem('auth_token') || sessionStorage.getItem('auth_token')
  if (!token) {
    alert('Debes iniciar sesión para comprar artículos')
    return
  }
  
  alert(`Comprando "${article.title}" por ${article.price}€`)
}

// Comprar con puntos
const buyWithPoints = (article) => {
  if (!article.pointsPrice || article.pointsPrice <= 0) {
    alert('Este artículo no está disponible para compra con puntos')
    return
  }
  
  const token = localStorage.getItem('auth_token') || sessionStorage.getItem('auth_token')
  if (!token) {
    alert('Debes iniciar sesión para comprar artículos')
    return
  }
  
  alert(`Comprando "${article.title}" por ${article.pointsPrice} puntos`)
}

// Proponer intercambio directo
const proposeDirectExchange = (article) => {
  if (!article.wantsDirectExchange) {
    alert('Este artículo no está disponible para intercambio directo')
    return
  }
  
  const token = localStorage.getItem('auth_token') || sessionStorage.getItem('auth_token')
  if (!token) {
    alert('Debes iniciar sesión para proponer intercambios')
    return
  }
  
  alert(`Proponiendo intercambio directo para "${article.title}"`)
}

// Proponer intercambio por puntos
const proposePointsExchange = (article) => {
  if (!article.wantsPoints) {
    alert('Este artículo no está disponible para intercambio por puntos')
    return
  }
  
  const token = localStorage.getItem('auth_token') || sessionStorage.getItem('auth_token')
  if (!token) {
    alert('Debes iniciar sesión para proponer intercambios')
    return
  }
  
  alert(`Proponiendo intercambio por puntos para "${article.title}" (${article.pointsPrice} puntos)`)
}

// Cargar artículo al montar el componente
onMounted(() => {
  loadArticle()
})
</script>
