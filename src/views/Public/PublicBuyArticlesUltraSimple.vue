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
        <h1 class="text-4xl font-bold text-gray-900 mb-4">Artículos Disponibles - VERSIÓN ULTRA SIMPLE</h1>
        <p class="text-xl text-gray-600 max-w-3xl mx-auto">
          Descubre una amplia selección de artículos de segunda mano verificados y en excelente estado.
        </p>
        <div class="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mt-4">
          ✅ Esta es la versión ULTRA SIMPLE - Sin bucles - Sin computed - Sin watchers
        </div>
      </div>

      <!-- Loading State -->
      <div v-if="loading" class="flex justify-center py-12">
        <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>

      <!-- Articles Grid - PRUEBA 3: Añadir badges y botones -->
      <div v-else-if="articles.length > 0" class="py-6">
        <div class="bg-blue-100 border border-blue-400 text-blue-700 px-4 py-3 rounded mb-4">
          🧪 PRUEBA 3: Añadiendo badges y botones para encontrar el error específico
        </div>
        <div v-for="article in articles" :key="article._id" class="p-4 border-b bg-white rounded mb-2">
          <div class="flex items-start space-x-4">
            <!-- Imagen simple -->
            <img
              :src="getArticleImage(article)"
              :alt="article.title || article.nombre"
              class="w-20 h-20 object-cover rounded"
              @error="handleImageError"
            />
            <!-- Info del artículo -->
            <div class="flex-1">
              <p class="text-lg font-bold">{{ article.title || article.nombre }}</p>
              <p>{{ formatPrice(article.price || article.precio_propuesto_vendedor) }}</p>
              <p class="text-sm text-gray-500">ID: {{ article._id }}</p>
              
              <!-- Badges -->
              <div class="mt-2 space-x-2">
                <span class="bg-white/90 text-gray-800 text-xs px-2 py-1 rounded-full font-medium">
                  {{ getConditionLabel(article.condition || article.condicion) }}
                </span>
                <span class="bg-blue-500/90 text-white text-xs px-2 py-1 rounded-full font-medium">
                  {{ getCategoryLabel(article.category || article.categoria) }}
                </span>
              </div>
              
              <!-- Botones -->
              <div class="mt-3 space-y-2">
                <button
                  @click="viewArticle(article)"
                  class="bg-blue-600 text-white py-1 px-3 rounded text-sm hover:bg-blue-700"
                >
                  Ver Detalles
                </button>
                <button
                  @click="loginToBuy"
                  class="border border-green-600 text-green-600 py-1 px-3 rounded text-sm hover:bg-green-600 hover:text-white"
                >
                  Comprar
                </button>
              </div>
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

const router = useRouter()

// Estado ultra simple - solo lo esencial
const articles = ref([])
const loading = ref(false)

// Cargar artículos públicos - versión ultra simple
const loadPublicArticles = async () => {
  console.log('🚀 Iniciando carga de artículos...')
  loading.value = true
  
  try {
    const response = await fetch('/api/articles/public', {
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
