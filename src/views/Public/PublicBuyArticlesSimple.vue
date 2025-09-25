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

    <!-- Main Content -->
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <!-- Header Section -->
      <div class="text-center mb-8">
        <h1 class="text-4xl font-bold text-gray-900 mb-4">Artículos Disponibles</h1>
        <p class="text-xl text-gray-600 max-w-3xl mx-auto">
          Descubre una amplia selección de artículos de segunda mano verificados y en excelente estado.
        </p>
      </div>

      <!-- Loading State -->
      <div v-if="loading" class="flex justify-center py-12">
        <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>

      <!-- Articles Grid -->
      <div v-else-if="articles.length > 0" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        <div 
          v-for="article in articles" 
          :key="article._id"
          class="bg-white rounded-lg shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden"
        >
          <!-- Article Image -->
          <div class="aspect-w-16 aspect-h-12 bg-gray-200 relative">
            <img
              :src="getArticleImage(article)"
              :alt="article.title || article.nombre"
              class="w-full h-48 object-cover"
              @error="handleImageError"
            />
            <div class="absolute top-2 right-2">
              <span class="bg-white/90 text-gray-800 text-xs px-2 py-1 rounded-full font-medium">
                {{ getConditionLabel(article.condition || article.condicion) }}
              </span>
            </div>
            <div class="absolute top-2 left-2">
              <span class="bg-blue-500/90 text-white text-xs px-2 py-1 rounded-full font-medium">
                {{ getCategoryLabel(article.category || article.categoria) }}
              </span>
            </div>
          </div>

          <!-- Article Info -->
          <div class="p-4">
            <h3 class="text-lg font-semibold text-gray-900 mb-2 line-clamp-2">
              {{ article.title || article.nombre }}
            </h3>
            
            <p class="text-gray-600 text-sm mb-3 line-clamp-2">
              {{ article.description || article.descripcion }}
            </p>

            <!-- Precio -->
            <div class="text-2xl font-bold text-green-600 mb-4">
              {{ formatPrice(article.price || article.precio_propuesto_vendedor) }}
            </div>

            <!-- Action Buttons -->
            <div class="space-y-2">
              <button
                @click="viewArticle(article)"
                class="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors duration-200 flex items-center justify-center"
              >
                <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path>
                </svg>
                Ver Detalles
              </button>
              
              <button
                @click="loginToBuy"
                class="w-full border border-green-600 text-green-600 py-2 px-4 rounded-md hover:bg-green-600 hover:text-white transition-colors duration-200 flex items-center justify-center"
              >
                <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-2.5 5M7 13l2.5 5m6-5v6a2 2 0 01-2 2H9a2 2 0 01-2-2v-6m8 0V9a2 2 0 00-2-2H9a2 2 0 00-2 2v4.01"></path>
                </svg>
                Comprar (Requiere Login)
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- No Articles -->
      <div v-else class="text-center py-12">
        <svg class="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
        </svg>
        <h3 class="mt-2 text-sm font-medium text-gray-900">No hay artículos disponibles</h3>
        <p class="mt-1 text-sm text-gray-500">No se encontraron artículos en este momento.</p>
      </div>
    </div>

    <!-- Footer -->
    <footer class="bg-gray-900 text-white py-12">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="text-center">
          <img src="/images/Trastalia3.png" alt="Trastalia" class="h-16 w-auto mx-auto mb-4"/>
          <p class="text-gray-400">© 2024 Trastalia. Todos los derechos reservados.</p>
        </div>
      </div>
    </footer>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import API_BASE_URL from '@/config/api.js'

const router = useRouter()

// Estado simple
const articles = ref([])
const loading = ref(false)

// Cargar artículos públicos - versión simple
const loadPublicArticles = async () => {
  loading.value = true
  try {
    const url = API_BASE_URL ? `${API_BASE_URL}/api/articles/public` : '/api/articles/public'
    console.log('🔍 Cargando artículos públicos desde:', url)
    
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      }
    })
    
    if (response.ok) {
      const data = await response.json()
      articles.value = data.data || []
      console.log('✅ Artículos públicos cargados:', articles.value.length)
    } else {
      console.error('❌ Error del servidor:', response.status, response.statusText)
    }
  } catch (error) {
    console.error('❌ Error cargando artículos públicos:', error)
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

// Manejar error de imagen
const handleImageError = (event) => {
  event.target.src = 'https://via.placeholder.com/400x300/cccccc/666666?text=Imagen+no+disponible'
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
  loadPublicArticles()
})
</script>

<style scoped>
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.aspect-w-16 {
  position: relative;
  padding-bottom: 75%;
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
