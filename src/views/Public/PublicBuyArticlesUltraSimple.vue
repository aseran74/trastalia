<template>
  <div class="min-h-screen bg-gray-100">
    <div class="bg-white shadow-sm">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between items-center py-6">
          <div class="flex items-center">
            <img src="/images/Trastalia3.png" alt="Trastalia" class="h-12 w-auto"/>
          </div>
          <div class="flex items-center space-x-4">
            <router-link to="/" class="text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium">
              Inicio
            </router-link>
            <router-link to="/signin" class="bg-blue-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-blue-700">
              Iniciar Sesión
            </router-link>
          </div>
        </div>
      </div>
    </div>

    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div class="text-center mb-12">
        <h1 class="text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl">Artículos Disponibles</h1>
        <p class="mt-4 text-xl text-gray-600 max-w-3xl mx-auto">
          Descubre una amplia selección de artículos de segunda mano verificados y en excelente estado.
        </p>
      </div>

      <div v-if="loading" class="flex justify-center py-12">
        <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>

      <div v-else-if="articles.length > 0" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
        <div 
          v-for="article in articles" 
          :key="article._id" 
          class="group bg-white rounded-lg shadow-md overflow-hidden flex flex-col transition-transform duration-300 hover:shadow-xl hover:-translate-y-1"
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
          </div>

          <div class="p-4 flex flex-col flex-grow">
            <p class="text-xs font-semibold text-blue-600 uppercase tracking-wide">
              {{ getCategoryLabel(article.category || article.categoria) }}
            </p>

            <h3 class="mt-2 text-lg font-bold text-gray-900">
              <span class="line-clamp-2">
                {{ article.title || article.nombre }}
              </span>
            </h3>
            
            <!-- Precio y Puntos -->
            <div class="mt-4 space-y-2">
              <p class="text-2xl font-extrabold text-gray-800">
                {{ formatPrice(article.price || article.precio_propuesto_vendedor) }}
              </p>
              
              <!-- Opción de puntos si está disponible -->
              <div v-if="getArticlePoints(article)" class="flex items-center space-x-2">
                <span class="text-sm text-gray-600">o</span>
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

            <div class="mt-auto pt-4 space-y-2">
              <button
                @click="viewArticle(article)"
                class="w-full bg-blue-600 text-white py-2 px-4 rounded-md text-sm font-semibold hover:bg-blue-700 transition-colors"
              >
                Ver Detalles
              </button>
              
              <button
                @click="loginToBuy"
                class="w-full border border-green-600 text-green-600 py-2 px-4 rounded-md text-sm font-semibold hover:bg-green-600 hover:text-white transition-colors"
              >
                Comprar (Requiere Login)
              </button>
            </div>
          </div>
        </div>
      </div>

      <div v-else class="text-center py-12">
         <svg class="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
           <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
         </svg>
        <h3 class="mt-2 text-sm font-medium text-gray-900">No hay artículos disponibles</h3>
        <p class="mt-1 text-sm text-gray-500">No se encontraron artículos en este momento.</p>
      </div>
    </div>

    <footer class="bg-gray-800 text-white py-12">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="text-center">
          <img src="/images/Trastalia3.png" alt="Trastalia" class="h-16 w-auto mx-auto mb-4"/>
          <p class="text-gray-400">© 2025 Trastalia. Todos los derechos reservados.</p>
        </div>
      </div>
    </footer>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import API_BASE_URL from '@/config/api'

const router = useRouter()

// Estado ultra simple - solo lo esencial
const articles = ref([])
const loading = ref(false)

// Cargar artículos públicos - versión ultra simple
const loadPublicArticles = async () => {
  console.log('🚀 Iniciando carga de artículos...')
  loading.value = true
  
  try {
    const url = API_BASE_URL ? `${API_BASE_URL}/api/articles-public` : '/api/articles-public'
    console.log('🔍 Cargando artículos desde:', url)
    
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      }
    })
    
    console.log('📡 Respuesta del servidor:', response.status)
    
    if (response.ok) {
      const data = await response.json()
      articles.value = data.data || []
      console.log('✅ Artículos cargados:', articles.value.length)
      console.log('📋 Primer artículo:', articles.value[0])
    } else {
      console.error('❌ Error del servidor:', response.status, response.statusText)
    }
  } catch (error) {
    console.error('❌ Error cargando artículos:', error)
  } finally {
    loading.value = false
    console.log('🏁 Carga completada - Loading:', loading.value, 'Articles:', articles.value.length)
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

// Manejar error de imagen
const handleImageError = (event) => {
  const placeholderSrc = 'https://via.placeholder.com/400x300/cccccc/666666?text=Imagen+no+disponible'
  
  // ✅ CORRECCIÓN: Evita el bucle comprobando si ya estamos usando el placeholder
  if (event.target.src !== placeholderSrc) {
    event.target.src = placeholderSrc
  }
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

// Ver artículo
const viewArticle = (article) => {
  router.push(`/articulos/${article._id}`)
}

// Login para comprar
const loginToBuy = () => {
  router.push('/signin')
}

onMounted(() => {
  console.log('🎯 Componente montado, cargando artículos...')
  loadPublicArticles()
})
</script>