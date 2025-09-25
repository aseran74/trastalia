<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Header -->
    <header class="bg-white shadow-sm">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between items-center py-4">
          <div class="flex items-center">
            <img 
              src="/images/Trastalia3.png" 
              alt="Trastalia" 
              class="h-12 w-auto"
            />
          </div>
          <button 
            @click="goBack"
            class="flex items-center text-gray-600 hover:text-gray-900 transition-colors"
          >
            <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path>
            </svg>
            Volver
          </button>
        </div>
      </div>
    </header>

    <!-- Debug Info Always Visible -->
    <div class="bg-blue-100 border border-blue-400 text-blue-700 px-4 py-3 rounded m-4 fixed top-20 left-4 right-4 z-50">
      <strong>🔍 Debug Info (Fijo en pantalla):</strong> 
      <br>Loading: {{ loading }}
      <br>Article: {{ article ? 'Cargado' : 'No cargado' }}
      <br>Route ID: {{ route.params.id }}
      <br>API URL: {{ API_BASE_URL }}
      <br>Timestamp: {{ new Date().toLocaleTimeString() }}
    </div>

    <!-- Loading -->
    <div v-if="loading" class="flex justify-center items-center min-h-96">
      <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
    </div>

    <!-- Article Detail -->
    <div v-else-if="article" class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <!-- Debug Info -->
      <div class="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded mb-4">
        <strong>Debug:</strong> Artículo cargado: {{ article?.title || article?.nombre }}
      </div>
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <!-- Images -->
        <div class="space-y-4">
          <!-- Main Image -->
          <div class="aspect-w-16 aspect-h-12 bg-gray-200 rounded-lg overflow-hidden">
            <img
              :src="getArticleImage(article)"
              :alt="article.title || article.nombre"
              class="w-full h-96 object-cover"
              @error="handleImageError"
            />
          </div>
          
          <!-- Thumbnail Images -->
          <div v-if="article.images && article.images.length > 1" class="grid grid-cols-4 gap-2">
            <div 
              v-for="(image, index) in article.images.slice(0, 4)" 
              :key="index"
              class="aspect-w-16 aspect-h-12 bg-gray-200 rounded-lg overflow-hidden cursor-pointer hover:opacity-75 transition-opacity"
              @click="selectedImage = image"
            >
              <img
                :src="image"
                :alt="`${article.title || article.nombre} - Imagen ${index + 1}`"
                class="w-full h-20 object-cover"
              />
            </div>
          </div>
        </div>

        <!-- Article Info -->
        <div class="space-y-6">
          <!-- Title and Badges -->
          <div>
            <div class="flex items-center gap-2 mb-2">
              <span class="bg-blue-100 text-blue-800 text-sm px-3 py-1 rounded-full font-medium">
                {{ getCategoryLabel(article.category || article.categoria) }}
              </span>
              <span class="bg-gray-100 text-gray-800 text-sm px-3 py-1 rounded-full font-medium">
                {{ getConditionLabel(article.condition || article.condicion) }}
              </span>
            </div>
            <h1 class="text-3xl font-bold text-gray-900 mb-2">
              {{ article.title || article.nombre }}
            </h1>
            <p class="text-gray-600 text-lg">
              {{ article.description || article.descripcion }}
            </p>
          </div>

          <!-- Price Section -->
          <div class="bg-white rounded-lg border border-gray-200 p-6">
            <h3 class="text-lg font-semibold text-gray-900 mb-4">Precio y Opciones de Compra</h3>
            
            <div class="space-y-4">
              <!-- Money Option -->
              <div class="flex items-center justify-between p-4 bg-green-50 rounded-lg border border-green-200">
                <div class="flex items-center">
                  <svg class="w-6 h-6 text-green-600 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1"></path>
                  </svg>
                  <div>
                    <div class="font-medium text-gray-900">Compra con Dinero</div>
                    <div class="text-sm text-gray-600">Pago seguro y rápido</div>
                  </div>
                </div>
                <div class="text-2xl font-bold text-green-600">
                  {{ formatPrice(article.price || article.precio_propuesto_vendedor) }}
                </div>
              </div>

              <!-- Points Option -->
              <div class="flex items-center justify-between p-4 bg-blue-50 rounded-lg border border-blue-200">
                <div class="flex items-center">
                  <svg class="w-6 h-6 text-blue-600 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"></path>
                  </svg>
                  <div>
                    <div class="font-medium text-gray-900">Compra con Puntos</div>
                    <div class="text-sm text-gray-600">Usa tus puntos Trastalia</div>
                  </div>
                </div>
                <div class="text-2xl font-bold text-blue-600">
                  {{ formatNumber(article.price || article.precio_propuesto_vendedor) }} pts
                </div>
              </div>
            </div>
          </div>

          <!-- Article Details -->
          <div class="bg-white rounded-lg border border-gray-200 p-6">
            <h3 class="text-lg font-semibold text-gray-900 mb-4">Detalles del Artículo</h3>
            
            <div class="grid grid-cols-2 gap-4">
              <div>
                <dt class="text-sm font-medium text-gray-500">Categoría</dt>
                <dd class="text-sm text-gray-900">{{ getCategoryLabel(article.category || article.categoria) }}</dd>
              </div>
              <div>
                <dt class="text-sm font-medium text-gray-500">Condición</dt>
                <dd class="text-sm text-gray-900">{{ getConditionLabel(article.condition || article.condicion) }}</dd>
              </div>
              <div>
                <dt class="text-sm font-medium text-gray-500">Ubicación</dt>
                <dd class="text-sm text-gray-900 flex items-center">
                  <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path>
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path>
                  </svg>
                  {{ article.location || article.ubicacion }}
                </dd>
              </div>
              <div>
                <dt class="text-sm font-medium text-gray-500">Fecha de Publicación</dt>
                <dd class="text-sm text-gray-900">{{ formatDate(article.createdAt) }}</dd>
              </div>
            </div>
          </div>

          <!-- Action Buttons -->
          <div class="space-y-3">
            <button
              @click="loginToBuy"
              class="w-full bg-green-600 text-white py-3 px-6 rounded-lg hover:bg-green-700 transition-colors duration-200 flex items-center justify-center text-lg font-medium"
            >
              <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-2.5 5M7 13l2.5 5m6-5v6a2 2 0 01-2 2H9a2 2 0 01-2-2v-6m8 0V9a2 2 0 00-2-2H9a2 2 0 00-2 2v4.01"></path>
              </svg>
              Comprar Ahora (Requiere Login)
            </button>
            
            <button
              @click="shareArticle"
              class="w-full border border-gray-300 text-gray-700 py-3 px-6 rounded-lg hover:bg-gray-50 transition-colors duration-200 flex items-center justify-center"
            >
              <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z"></path>
              </svg>
              Compartir
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Error -->
    <div v-else class="text-center py-12">
      <!-- Debug Info -->
      <div class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4 max-w-md mx-auto">
        <strong>Debug:</strong> 
        <br>Loading: {{ loading }}
        <br>Article: {{ article ? 'Cargado' : 'No cargado' }}
        <br>Route ID: {{ route.params.id }}
      </div>
      
      <svg class="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
      </svg>
      <h3 class="mt-2 text-sm font-medium text-gray-900">Artículo no encontrado</h3>
      <p class="mt-1 text-sm text-gray-500">El artículo que buscas no existe o ha sido eliminado.</p>
      <div class="mt-6">
        <button
          @click="goBack"
          class="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
        >
          Volver a la lista
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import API_BASE_URL from '@/config/api.js'

const router = useRouter()
const route = useRoute()

// Estado reactivo
const article = ref(null)
const loading = ref(false)
const selectedImage = ref(null)

// Cargar artículo
const loadArticle = async () => {
  loading.value = true
  try {
    const articleId = route.params.id
    const url = `${API_BASE_URL}/api/articles/${articleId}`
    
    console.log('🔍 Cargando artículo detalle:', {
      articleId,
      url,
      API_BASE_URL
    })
    
    // Agregar delay para poder ver el debug
    await new Promise(resolve => setTimeout(resolve, 2000))
    
    const response = await fetch(url, {
      headers: {
        'Content-Type': 'application/json'
      }
    })
    
    console.log('📡 Respuesta del servidor:', {
      status: response.status,
      ok: response.ok,
      statusText: response.statusText
    })
    
    if (response.ok) {
      const data = await response.json()
      console.log('✅ Datos del artículo:', data)
      article.value = data.data
      selectedImage.value = getArticleImage(data.data)
    } else {
      console.error('❌ Error cargando artículo:', response.statusText)
    }
  } catch (error) {
    console.error('❌ Error:', error)
  } finally {
    loading.value = false
  }
}

// Obtener imagen del artículo
const getArticleImage = (article) => {
  if (article?.images && article.images.length > 0) {
    return article.images[0]
  }
  if (article?.fotos && article.fotos.length > 0) {
    return article.fotos[0]
  }
  
  // Generar imagen de Unsplash basada en la categoría
  const category = article?.category || article?.categoria || 'product'
  const searchTerm = encodeURIComponent(article?.title || article?.nombre || category)
  return `https://source.unsplash.com/800x600/?${searchTerm}`
}

// Manejar error de imagen
const handleImageError = (event) => {
  event.target.src = '/images/placeholder-article.jpg'
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

// Formatear precio
const formatPrice = (price) => {
  if (!price) return 'Precio no disponible'
  return new Intl.NumberFormat('es-ES', {
    style: 'currency',
    currency: 'EUR'
  }).format(price)
}

// Formatear número
const formatNumber = (num) => {
  return new Intl.NumberFormat('es-ES').format(num)
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

// Navegar hacia atrás
const goBack = () => {
  router.go(-1)
}

// Login para comprar
const loginToBuy = () => {
  router.push('/signin')
}

// Compartir artículo
const shareArticle = async () => {
  if (navigator.share) {
    try {
      await navigator.share({
        title: article.value?.title || article.value?.nombre,
        text: article.value?.description || article.value?.descripcion,
        url: window.location.href
      })
    } catch (error) {
      console.log('Error compartiendo:', error)
    }
  } else {
    // Fallback: copiar URL al portapapeles
    navigator.clipboard.writeText(window.location.href)
    alert('URL copiada al portapapeles')
  }
}

// Cargar artículo al montar el componente
onMounted(() => {
  loadArticle()
})
</script>

<style scoped>
.aspect-w-16 {
  position: relative;
  padding-bottom: 75%; /* 16:12 aspect ratio */
}

.aspect-h-12 {
  position: absolute;
  height: 100%;
  width: 100%;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
}
</style>
