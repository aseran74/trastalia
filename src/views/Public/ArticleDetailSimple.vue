<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Header -->
    <div class="bg-white shadow-sm">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between items-center py-6">
          <div class="flex items-center">
            <img src="/images/Trastalia3.png" alt="Trastalia" class="h-12 w-auto"/>
          </div>
          <div class="flex items-center space-x-4">
            <router-link to="/articulos" class="text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium">
              ← Volver a Artículos
            </router-link>
            <router-link to="/login" class="bg-blue-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-blue-700">
              Iniciar Sesión
            </router-link>
          </div>
        </div>
      </div>
    </div>

    <!-- Main Content -->
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

      <!-- Loading State -->
      <div v-if="loading" class="flex justify-center py-12">
        <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>

      <!-- Article Detail -->
      <div v-else-if="article" class="bg-white rounded-lg shadow-lg overflow-hidden">
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <!-- Article Image -->
          <div class="aspect-video bg-gray-200 relative">
            <img
              :src="getArticleImage(article)"
              :alt="article.title || article.nombre"
              class="w-full h-full object-cover"
              @error="handleImageError"
            />
            <!-- Badges -->
            <div class="absolute top-4 left-4 flex flex-col space-y-2">
              <span class="bg-blue-500 text-white text-xs px-3 py-1 rounded-full font-semibold">
                {{ getCategoryLabel(article.category || article.categoria) }}
              </span>
              <span class="bg-white/90 text-gray-800 text-xs px-3 py-1 rounded-full font-semibold">
                {{ getConditionLabel(article.condition || article.condicion) }}
              </span>
            </div>
          </div>

          <!-- Article Info -->
          <div class="p-8 flex flex-col justify-between">
            <div>
              <h1 class="text-4xl font-bold text-gray-900 mb-4">
                {{ article.title || article.nombre }}
              </h1>
              
              <p class="text-gray-600 text-lg mb-6 leading-relaxed">
                {{ article.description || article.descripcion }}
              </p>

              <!-- Información adicional -->
              <div class="grid grid-cols-2 gap-4 mb-6">
                <div class="bg-gray-50 p-4 rounded-lg">
                  <h3 class="text-sm font-semibold text-gray-500 uppercase tracking-wide">Categoría</h3>
                  <p class="text-lg font-medium text-gray-900">{{ getCategoryLabel(article.category || article.categoria) }}</p>
                </div>
                <div class="bg-gray-50 p-4 rounded-lg">
                  <h3 class="text-sm font-semibold text-gray-500 uppercase tracking-wide">Estado</h3>
                  <p class="text-lg font-medium text-gray-900">{{ getConditionLabel(article.condition || article.condicion) }}</p>
                </div>
              </div>

              <!-- Precio y Puntos -->
              <div class="mb-8">
                <div class="text-4xl font-bold text-green-600 mb-4">
                  {{ formatPrice(article.price || article.precio_propuesto_vendedor) }}
                </div>
                
                <!-- Opción de puntos si está disponible -->
                <div v-if="getArticlePoints(article)" class="flex items-center space-x-3">
                  <span class="text-lg text-gray-600">o</span>
                  <div class="flex items-center space-x-2 bg-yellow-50 px-4 py-2 rounded-lg">
                    <svg class="w-6 h-6 text-yellow-500" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
                    </svg>
                    <span class="text-2xl font-bold text-yellow-600">
                      {{ formatPoints(getArticlePoints(article)) }} puntos
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <!-- Action Buttons -->
            <div class="space-y-4">
              <!-- Botón de edición para admin -->
              <button
                v-if="isAdmin"
                @click="editArticle"
                class="w-full bg-purple-600 text-white py-4 px-6 rounded-lg hover:bg-purple-700 transition-colors duration-200 flex items-center justify-center text-lg font-semibold shadow-lg hover:shadow-xl"
              >
                <svg class="w-6 h-6 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/>
                </svg>
                Editar Artículo (Admin)
              </button>

              <button
                @click="loginToBuy"
                class="w-full bg-green-600 text-white py-4 px-6 rounded-lg hover:bg-green-700 transition-colors duration-200 flex items-center justify-center text-lg font-semibold shadow-lg hover:shadow-xl"
              >
                <svg class="w-6 h-6 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-2.5 5M7 13l2.5 5m6-5v6a2 2 0 01-2 2H9a2 2 0 01-2-2v-6m8 0V9a2 2 0 00-2-2H9a2 2 0 00-2 2v4.01"></path>
                </svg>
                Comprar con Dinero
              </button>
              
              <button
                v-if="getArticlePoints(article)"
                @click="loginToBuyWithPoints"
                class="w-full bg-yellow-500 text-white py-4 px-6 rounded-lg hover:bg-yellow-600 transition-colors duration-200 flex items-center justify-center text-lg font-semibold shadow-lg hover:shadow-xl"
              >
                <svg class="w-6 h-6 mr-3" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
                </svg>
                Comprar con Puntos
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Error State -->
      <div v-else class="text-center py-12">
        <svg class="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.5 0L4.268 19.5c-.77.833.192 2.5 1.732 2.5z" />
        </svg>
        <h3 class="mt-2 text-sm font-medium text-gray-900">Artículo no encontrado</h3>
        <p class="mt-1 text-sm text-gray-500">No se pudo cargar la información del artículo.</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'

const router = useRouter()
const route = useRoute()

// Estado simple
const article = ref(null)
const loading = ref(false)
const isAdmin = ref(false)

// Cargar artículo
const loadArticle = async () => {
  const articleId = route.params.id
  if (!articleId) return

  loading.value = true
  try {
    const response = await fetch(`/api/articles/${articleId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      }
    })
    
    if (response.ok) {
      const data = await response.json()
      article.value = data.data || data
    } else {
      console.error('Error cargando artículo:', response.status)
    }
  } catch (error) {
    console.error('Error cargando artículo:', error)
  } finally {
    loading.value = false
  }
}

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
  return labels[condition] || condition || 'No especificado'
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
  return labels[category] || category || 'General'
}

// Manejar error de imagen
const handleImageError = (event) => {
  const placeholderSrc = 'https://via.placeholder.com/800x600/cccccc/666666?text=Imagen+no+disponible'
  
  // ✅ CORRECCIÓN: Evita el bucle comprobando si ya estamos usando el placeholder
  if (event.target.src !== placeholderSrc) {
    event.target.src = placeholderSrc
  }
}

// Obtener imagen del artículo
const getArticleImage = (article) => {
  console.log('🖼️ ArticleDetail - Getting image for article:', article.title || article.nombre, {
    images: article.images,
    fotos: article.fotos
  })
  
  if (article.images && article.images.length > 0) {
    console.log('✅ ArticleDetail - Using images[0]:', article.images[0])
    return article.images[0]
  }
  if (article.fotos && article.fotos.length > 0) {
    console.log('✅ ArticleDetail - Using fotos[0]:', article.fotos[0])
    return article.fotos[0]
  }
  
  const title = article.title || article.nombre || 'Artículo'
  const placeholderUrl = `https://via.placeholder.com/800x600/cccccc/666666?text=${encodeURIComponent(title)}`
  console.log('🔄 ArticleDetail - Using placeholder:', placeholderUrl)
  return placeholderUrl
}

// Login para comprar
const loginToBuy = () => {
  router.push('/login')
}

// Login para comprar con puntos
const loginToBuyWithPoints = () => {
  router.push('/login')
}

// Verificar si el usuario es admin
const checkAdminStatus = () => {
  const token = localStorage.getItem('auth_token') || sessionStorage.getItem('auth_token')
  console.log('🔍 Verificando admin status...')
  console.log('Token encontrado:', !!token)
  
  if (token) {
    try {
      const payload = JSON.parse(atob(token.split('.')[1]))
      console.log('Payload del token:', payload)
      console.log('Rol del usuario:', payload.role)
      isAdmin.value = payload.role === 'admin'
      console.log('¿Es admin?', isAdmin.value)
    } catch (error) {
      console.error('Error verificando token:', error)
      isAdmin.value = false
    }
  } else {
    console.log('No hay token en localStorage')
    isAdmin.value = false
  }
}

// Editar artículo
const editArticle = () => {
  router.push(`/admin/articulos/${article.value._id}/editar`)
}

onMounted(() => {
  checkAdminStatus()
  loadArticle()
})
</script>

