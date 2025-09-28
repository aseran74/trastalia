<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Header -->
    <div class="bg-white shadow-sm">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between items-center py-6">
          <!-- Logo -->
          <div class="flex items-center">
            <img 
              src="/images/Trastalia3.png" 
              alt="Trastalia" 
              class="h-12 w-auto"
            />
          </div>
          
          <!-- Navigation -->
          <div class="flex items-center space-x-4">
            <router-link 
              to="/" 
              class="text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium"
            >
              Inicio
            </router-link>
            <router-link 
              to="/login" 
              class="bg-blue-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-blue-700"
            >
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
        <h1 class="text-4xl font-bold text-gray-900 mb-4">
          Artículos Disponibles
        </h1>
        <p class="text-xl text-gray-600 max-w-3xl mx-auto">
          Descubre una amplia selección de artículos de segunda mano verificados y en excelente estado. 
          Encuentra lo que necesitas a precios increíbles.
        </p>
      </div>

      <!-- Filtros -->
      <div class="bg-white rounded-lg shadow-sm p-6 mb-8">
        <div class="flex flex-wrap gap-4 items-center mb-6">
          <div class="flex-1 min-w-64">
            <input
              v-model="searchQuery"
              type="text"
              placeholder="Buscar artículos..."
              class="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          
          <select
            v-model="filterCategory"
            class="px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="">Todas las categorías</option>
            <option value="tecnologia">Tecnología</option>
            <option value="hogar">Hogar</option>
            <option value="deportes">Deportes</option>
            <option value="juegos">Juegos</option>
            <option value="moda">Moda</option>
          </select>
          
          <select
            v-model="sortBy"
            class="px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="newest">Más recientes</option>
            <option value="price-low">Precio: menor a mayor</option>
            <option value="price-high">Precio: mayor a menor</option>
            <option value="name">Nombre A-Z</option>
          </select>
        </div>

        <!-- Filtros con sliders -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <!-- Filtro de Precio -->
          <div class="bg-gray-50 p-4 rounded-lg">
            <label class="block text-sm font-semibold text-gray-800 mb-3">
              Rango de Precio: {{ formatPrice(priceRange[0]) }} - {{ formatPrice(priceRange[1]) }}
            </label>
            <div class="space-y-2">
              <input
                type="range"
                :min="minPrice"
                :max="maxPrice"
                v-model="priceRange[0]"
                class="w-full"
                @input="updatePriceRange(0, $event.target.value)"
              />
              <input
                type="range"
                :min="minPrice"
                :max="maxPrice"
                v-model="priceRange[1]"
                class="w-full"
                @input="updatePriceRange(1, $event.target.value)"
              />
            </div>
            <div class="flex justify-between text-xs text-gray-500 mt-1">
              <span>Min: {{ formatPrice(minPrice) }}</span>
              <span>Max: {{ formatPrice(maxPrice) }}</span>
            </div>
          </div>

          <!-- Filtro de Puntos -->
          <div class="bg-gray-50 p-4 rounded-lg">
            <label class="block text-sm font-semibold text-gray-800 mb-3">
              Rango de Puntos: {{ formatNumber(pointsRange[0]) }} - {{ formatNumber(pointsRange[1]) }}
            </label>
            <div class="space-y-2">
              <input
                type="range"
                :min="minPoints"
                :max="maxPoints"
                v-model="pointsRange[0]"
                class="w-full"
                @input="updatePointsRange(0, $event.target.value)"
              />
              <input
                type="range"
                :min="minPoints"
                :max="maxPoints"
                v-model="pointsRange[1]"
                class="w-full"
                @input="updatePointsRange(1, $event.target.value)"
              />
            </div>
            <div class="flex justify-between text-xs text-gray-500 mt-1">
              <span>Min: {{ formatNumber(minPoints) }}</span>
              <span>Max: {{ formatNumber(maxPoints) }}</span>
            </div>
          </div>
        </div>

        <!-- Botón para resetear filtros -->
        <div class="mt-4 flex justify-end">
          <button
            @click="resetFilters"
            class="px-4 py-2 text-sm text-gray-600 hover:text-gray-800 border border-gray-300 rounded-md hover:bg-gray-50"
          >
            Limpiar Filtros
          </button>
        </div>
      </div>

      <!-- Loading State -->
      <div v-if="loading" class="flex justify-center py-12">
        <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>

      <!-- Articles Grid -->
      <div v-else-if="filteredArticles.length > 0" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        <div 
          v-for="article in filteredArticles" 
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
            <!-- Badge de condición -->
            <div class="absolute top-2 right-2">
              <span class="bg-white/90 text-gray-800 text-xs px-2 py-1 rounded-full font-medium">
                {{ getConditionLabel(article.condition || article.condicion) }}
              </span>
            </div>
            <!-- Badge de categoría -->
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

            <!-- Precio y ubicación -->
            <div class="flex items-center justify-between mb-3">
              <div class="text-2xl font-bold text-green-600">
                {{ formatPrice(article.price || article.precio_propuesto_vendedor) }}
              </div>
              <div class="text-sm text-gray-500 flex items-center">
                <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path>
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path>
                </svg>
                {{ article.location || article.ubicacion }}
              </div>
            </div>

            <!-- Opciones de compra -->
            <div class="bg-gray-50 rounded-lg p-3 mb-4">
              <div class="text-sm font-medium text-gray-700 mb-2">Opciones de compra:</div>
              <div class="space-y-1">
                <div class="flex justify-between items-center text-sm">
                  <span class="flex items-center text-green-600">
                    <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1"></path>
                    </svg>
                    Dinero
                  </span>
                  <span class="font-semibold">{{ formatPrice(article.price || article.precio_propuesto_vendedor) }}</span>
                </div>
                <div class="flex justify-between items-center text-sm">
                  <span class="flex items-center text-blue-600">
                    <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"></path>
                    </svg>
                    Puntos
                  </span>
                  <span class="font-semibold">{{ formatNumber(article.price || article.precio_propuesto_vendedor) }} pts</span>
                </div>
              </div>
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
        <p class="mt-1 text-sm text-gray-500">No se encontraron artículos que coincidan con los filtros seleccionados.</p>
      </div>
    </div>

    <!-- Footer -->
    <footer class="bg-gray-900 text-white py-12">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="text-center">
          <img 
            src="/images/Trastalia3.png" 
            alt="Trastalia" 
            class="h-16 w-auto mx-auto mb-4"
          />
          <p class="text-gray-400">
            © 2024 Trastalia. Todos los derechos reservados.
          </p>
        </div>
      </div>
    </footer>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import API_BASE_URL from '@/config/api.js'

const router = useRouter()

// Estado reactivo
const articles = ref([])
const loading = ref(false)
const searchQuery = ref('')
const filterCategory = ref('')
const sortBy = ref('newest')

// Filtros con sliders
const priceRange = ref([0, 1000])
const pointsRange = ref([0, 10000])
const minPrice = ref(0)
const maxPrice = ref(1000)
const minPoints = ref(0)
const maxPoints = ref(10000)

// Cargar artículos públicos
const loadPublicArticles = async () => {
  loading.value = true
  try {
    const url = API_BASE_URL ? `${API_BASE_URL}/api/articles-public` : '/api/articles-public'
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
      calculateRanges()
    } else {
      console.error('❌ Error del servidor:', response.status, response.statusText)
    }
  } catch (error) {
    console.error('❌ Error cargando artículos públicos:', error)
  } finally {
    loading.value = false
  }
}

// Filtrar artículos - versión simplificada
const filteredArticles = computed(() => {
  if (!articles.value || articles.value.length === 0) {
    return []
  }
  
  let filtered = [...articles.value]
  
  // Filtro por búsqueda
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    filtered = filtered.filter(article => {
      const title = (article.title || article.nombre || '').toLowerCase()
      const description = (article.description || article.descripcion || '').toLowerCase()
      return title.includes(query) || description.includes(query)
    })
  }
  
  // Filtro por categoría
  if (filterCategory.value) {
    filtered = filtered.filter(article => {
      const category = (article.category || article.categoria || '').toLowerCase()
      return category === filterCategory.value.toLowerCase()
    })
  }
  
  // Filtro por precio
  filtered = filtered.filter(article => {
    const price = article.price || article.precio_propuesto_vendedor || 0
    return price >= priceRange.value[0] && price <= priceRange.value[1]
  })
  
  // Ordenar
  switch (sortBy.value) {
    case 'price-low':
      return filtered.sort((a, b) => (a.price || a.precio_propuesto_vendedor || 0) - (b.price || b.precio_propuesto_vendedor || 0))
    case 'price-high':
      return filtered.sort((a, b) => (b.price || b.precio_propuesto_vendedor || 0) - (a.price || a.precio_propuesto_vendedor || 0))
    case 'name':
      return filtered.sort((a, b) => (a.title || a.nombre || '').localeCompare(b.title || b.nombre || ''))
    default:
      return filtered.sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0))
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

// Formatear número
const formatNumber = (num) => {
  return new Intl.NumberFormat('es-ES').format(num)
}

// Calcular rangos de precio y puntos - versión simplificada
const calculateRanges = () => {
  if (!articles.value || articles.value.length === 0) {
    return
  }
  
  const prices = articles.value
    .map(article => article.price || article.precio_propuesto_vendedor || 0)
    .filter(price => price > 0)
  
  if (prices.length > 0) {
    const min = Math.floor(Math.min(...prices))
    const max = Math.ceil(Math.max(...prices))
    
    minPrice.value = min
    maxPrice.value = max
    priceRange.value = [min, max]
    
    minPoints.value = min
    maxPoints.value = max
    pointsRange.value = [min, max]
  }
}

// Actualizar rango de precio - versión simplificada
const updatePriceRange = (index, value) => {
  const numValue = parseInt(value) || 0
  const newRange = [...priceRange.value]
  
  if (index === 0) {
    newRange[0] = Math.min(numValue, newRange[1] - 1)
  } else {
    newRange[1] = Math.max(numValue, newRange[0] + 1)
  }
  
  priceRange.value = newRange
}

// Actualizar rango de puntos - versión simplificada
const updatePointsRange = (index, value) => {
  const numValue = parseInt(value) || 0
  const newRange = [...pointsRange.value]
  
  if (index === 0) {
    newRange[0] = Math.min(numValue, newRange[1] - 1)
  } else {
    newRange[1] = Math.max(numValue, newRange[0] + 1)
  }
  
  pointsRange.value = newRange
}

// Resetear filtros
const resetFilters = () => {
  searchQuery.value = ''
  filterCategory.value = ''
  sortBy.value = 'newest'
  priceRange.value = [minPrice.value, maxPrice.value]
  pointsRange.value = [minPoints.value, maxPoints.value]
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
  router.push('/login')
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
