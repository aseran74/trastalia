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
              to="/signin" 
              class="bg-primary text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-primary/90"
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
        <!-- Filtros básicos -->
        <div class="flex flex-wrap gap-4 items-center mb-6">
          <div class="flex-1 min-w-64">
            <input
              v-model="searchQuery"
              type="text"
              placeholder="Buscar artículos..."
              class="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary focus:border-transparent"
            />
          </div>
          
          <select
            v-model="filterCategory"
            class="px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary focus:border-transparent"
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
            class="px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary focus:border-transparent"
          >
            <option value="newest">Más recientes</option>
            <option value="price-low">Precio: menor a mayor</option>
            <option value="price-high">Precio: mayor a menor</option>
            <option value="name">Nombre A-Z</option>
          </select>
        </div>

        <!-- Filtros avanzados con sliders -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <!-- Filtro de Precio -->
        <div class="filter-card bg-white p-4 rounded-lg shadow-sm border border-gray-200">
          <label class="block text-sm font-semibold text-gray-800 mb-3 flex items-center">
            <svg class="filter-icon w-4 h-4 mr-2 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1"></path>
            </svg>
            Rango de Precio
          </label>
          <div class="mb-2">
            <div class="flex justify-between text-sm font-medium text-gray-600">
              <span>{{ formatPrice(priceRange[0]) }}</span>
              <span>{{ formatPrice(priceRange[1]) }}</span>
            </div>
          </div>
          <div class="slider-container relative h-6">
            <!-- Track de fondo -->
            <div class="absolute top-1/2 left-0 right-0 h-2 bg-gray-200 rounded-full transform -translate-y-1/2"></div>
            <!-- Track activo -->
            <div 
              class="absolute top-1/2 h-2 bg-gradient-to-r from-green-500 to-teal-500 rounded-full transform -translate-y-1/2"
              :style="{ 
                left: ((priceRange[0] - minPrice) / (maxPrice - minPrice)) * 100 + '%',
                width: ((priceRange[1] - priceRange[0]) / (maxPrice - minPrice)) * 100 + '%'
              }"
            ></div>
            <!-- Slider inferior -->
            <input
              type="range"
              :min="minPrice"
              :max="maxPrice"
              v-model="priceRange[0]"
              class="absolute top-1/2 left-0 w-full h-6 opacity-0 cursor-pointer transform -translate-y-1/2"
              @input="updatePriceRange(0, $event.target.value)"
            />
            <!-- Slider superior -->
            <input
              type="range"
              :min="minPrice"
              :max="maxPrice"
              v-model="priceRange[1]"
              class="absolute top-1/2 left-0 w-full h-6 opacity-0 cursor-pointer transform -translate-y-1/2"
              @input="updatePriceRange(1, $event.target.value)"
            />
          </div>
          <div class="flex justify-between text-xs text-gray-400 mt-2">
            <span>{{ formatPrice(minPrice) }}</span>
            <span>{{ formatPrice(maxPrice) }}</span>
          </div>
        </div>

        <!-- Filtro de Puntos -->
        <div class="filter-card bg-white p-4 rounded-lg shadow-sm border border-gray-200">
          <label class="block text-sm font-semibold text-gray-800 mb-3 flex items-center">
            <svg class="filter-icon w-4 h-4 mr-2 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"></path>
            </svg>
            Rango de Puntos
          </label>
          <div class="mb-2">
            <div class="flex justify-between text-sm font-medium text-gray-600">
              <span>{{ formatNumber(pointsRange[0]) }}</span>
              <span>{{ formatNumber(pointsRange[1]) }}</span>
            </div>
          </div>
          <div class="slider-container relative h-6">
            <!-- Track de fondo -->
            <div class="absolute top-1/2 left-0 right-0 h-2 bg-gray-200 rounded-full transform -translate-y-1/2"></div>
            <!-- Track activo -->
            <div 
              class="absolute top-1/2 h-2 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full transform -translate-y-1/2"
              :style="{ 
                left: ((pointsRange[0] - minPoints) / (maxPoints - minPoints)) * 100 + '%',
                width: ((pointsRange[1] - pointsRange[0]) / (maxPoints - minPoints)) * 100 + '%'
              }"
            ></div>
            <!-- Slider inferior -->
            <input
              type="range"
              :min="minPoints"
              :max="maxPoints"
              v-model="pointsRange[0]"
              class="absolute top-1/2 left-0 w-full h-6 opacity-0 cursor-pointer transform -translate-y-1/2"
              @input="updatePointsRange(0, $event.target.value)"
            />
            <!-- Slider superior -->
            <input
              type="range"
              :min="minPoints"
              :max="maxPoints"
              v-model="pointsRange[1]"
              class="absolute top-1/2 left-0 w-full h-6 opacity-0 cursor-pointer transform -translate-y-1/2"
              @input="updatePointsRange(1, $event.target.value)"
            />
          </div>
          <div class="flex justify-between text-xs text-gray-400 mt-2">
            <span>{{ formatNumber(minPoints) }}</span>
            <span>{{ formatNumber(maxPoints) }}</span>
          </div>
        </div>
        </div>

        <!-- Botón para resetear filtros -->
        <div class="mt-4 flex justify-end">
          <button
            @click="resetFilters"
            class="px-4 py-2 text-sm text-gray-600 hover:text-gray-800 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
          >
            Limpiar Filtros
          </button>
        </div>
      </div>

      <!-- Loading State -->
      <div v-if="loading" class="flex justify-center py-12">
        <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>

      <!-- Articles Grid -->
      <div v-else-if="filteredArticles.length > 0" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        <div 
          v-for="article in filteredArticles" 
          :key="article._id"
          class="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200 overflow-hidden"
        >
          <!-- Article Image -->
          <div class="aspect-w-16 aspect-h-12 bg-gray-200">
            <img
              v-if="article.images && article.images.length > 0"
              :src="article.images[0]"
              :alt="article.title || article.nombre"
              class="w-full h-48 object-cover"
            />
            <div v-else class="w-full h-48 bg-gray-200 flex items-center justify-center">
              <svg class="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
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

            <div class="flex items-center justify-between mb-3">
              <span class="text-sm text-gray-500 capitalize">
                {{ article.category || article.categoria }}
              </span>
              <span class="text-sm text-gray-500 capitalize">
                {{ article.condition || article.condicion }}
              </span>
            </div>

            <!-- Price -->
            <div class="flex items-center justify-between mb-4">
              <div class="text-2xl font-bold text-primary">
                {{ formatPrice(article.price || article.precio_propuesto_vendedor) }}
              </div>
              <div class="text-sm text-gray-500">
                {{ article.location || article.ubicacion }}
              </div>
            </div>

            <!-- Action Buttons -->
            <div class="space-y-2">
              <button
                @click="viewArticle(article)"
                class="w-full bg-primary text-white py-2 px-4 rounded-md hover:bg-primary/90 transition-colors duration-200"
              >
                Ver Detalles
              </button>
              
              <button
                @click="loginToBuy"
                class="w-full border border-primary text-primary py-2 px-4 rounded-md hover:bg-primary hover:text-white transition-colors duration-200"
              >
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
    const url = `${API_BASE_URL}/api/articles/public`
    console.log('🔍 Cargando artículos públicos desde:', url)
    
    const response = await fetch(url, {
      headers: {
        'Content-Type': 'application/json'
      }
    })
    
    console.log('📊 Respuesta del servidor:', response.status, response.statusText)
    
    if (response.ok) {
      const data = await response.json()
      articles.value = data.data || []
      console.log('✅ Artículos públicos cargados:', articles.value.length)
      
      // Calcular rangos después de cargar los artículos
      calculateRanges()
    } else {
      const errorText = await response.text()
      console.error('❌ Error del servidor:', errorText)
    }
  } catch (error) {
    console.error('❌ Error cargando artículos públicos:', error)
  } finally {
    loading.value = false
  }
}

// Filtrar artículos
const filteredArticles = computed(() => {
  let filtered = articles.value.filter(article => {
    // Filtro por búsqueda
    if (searchQuery.value) {
      const query = searchQuery.value.toLowerCase()
      const title = (article.title || article.nombre || '').toLowerCase()
      const description = (article.description || article.descripcion || '').toLowerCase()
      if (!title.includes(query) && !description.includes(query)) {
        return false
      }
    }
    
    // Filtro por categoría
    if (filterCategory.value) {
      const category = (article.category || article.categoria || '').toLowerCase()
      if (category !== filterCategory.value.toLowerCase()) {
        return false
      }
    }
    
    // Filtro por precio
    const price = article.price || article.precio_propuesto_vendedor || 0
    if (price < priceRange.value[0] || price > priceRange.value[1]) {
      return false
    }
    
    // Filtro por puntos (usando el precio como equivalente a puntos)
    const points = article.price || article.precio_propuesto_vendedor || 0
    if (points < pointsRange.value[0] || points > pointsRange.value[1]) {
      return false
    }
    
    return true
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

// Formatear número
const formatNumber = (num) => {
  return new Intl.NumberFormat('es-ES').format(num)
}

// Calcular rangos de precio y puntos
const calculateRanges = () => {
  if (articles.value.length === 0) return
  
  const prices = articles.value.map(article => 
    article.price || article.precio_propuesto_vendedor || 0
  ).filter(price => price > 0)
  
  if (prices.length > 0) {
    minPrice.value = Math.floor(Math.min(...prices))
    maxPrice.value = Math.ceil(Math.max(...prices))
    priceRange.value = [minPrice.value, maxPrice.value]
    
    minPoints.value = minPrice.value
    maxPoints.value = maxPrice.value
    pointsRange.value = [minPoints.value, maxPoints.value]
  }
}

// Actualizar rango de precio
const updatePriceRange = (index, value) => {
  const numValue = parseInt(value)
  if (index === 0) {
    priceRange.value[0] = Math.min(numValue, priceRange.value[1] - 1)
  } else {
    priceRange.value[1] = Math.max(numValue, priceRange.value[0] + 1)
  }
}

// Actualizar rango de puntos
const updatePointsRange = (index, value) => {
  const numValue = parseInt(value)
  if (index === 0) {
    pointsRange.value[0] = Math.min(numValue, pointsRange.value[1] - 1)
  } else {
    pointsRange.value[1] = Math.max(numValue, pointsRange.value[0] + 1)
  }
}

// Resetear filtros
const resetFilters = () => {
  searchQuery.value = ''
  filterCategory.value = ''
  sortBy.value = 'newest'
  priceRange.value = [minPrice.value, maxPrice.value]
  pointsRange.value = [minPoints.value, maxPoints.value]
}

// Ver artículo
const viewArticle = (article) => {
  // Por ahora, redirigir al login
  router.push('/signin')
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

/* Estilos para los sliders personalizados */
.range-slider {
  position: relative;
  height: 6px;
  background: #e5e7eb;
  border-radius: 3px;
}

.range-slider-track {
  position: absolute;
  top: 0;
  left: 0;
  height: 100%;
  background: linear-gradient(90deg, #10b981, #14b8a6);
  border-radius: 3px;
  transition: all 0.2s ease;
}

.range-slider-thumb {
  position: absolute;
  top: 50%;
  width: 20px;
  height: 20px;
  background: white;
  border: 3px solid #10b981;
  border-radius: 50%;
  transform: translateY(-50%);
  cursor: pointer;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.15);
  transition: all 0.2s ease;
}

.range-slider-thumb:hover {
  transform: translateY(-50%) scale(1.1);
  box-shadow: 0 4px 12px rgba(16, 185, 129, 0.3);
}

.range-slider-thumb:active {
  transform: translateY(-50%) scale(1.05);
}

/* Animaciones suaves */
.slider-container {
  transition: all 0.3s ease;
}

.slider-container:hover {
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

/* Efectos de hover para las tarjetas de filtro */
.filter-card {
  transition: all 0.3s ease;
}

.filter-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.1);
}

/* Estilos para los iconos */
.filter-icon {
  transition: all 0.2s ease;
}

.filter-card:hover .filter-icon {
  transform: scale(1.1);
}

/* Responsive design */
@media (max-width: 768px) {
  .filter-card {
    padding: 1rem;
  }
  
  .range-slider-thumb {
    width: 24px;
    height: 24px;
  }
}

/* Estilos para los inputs de rango invisibles */
input[type="range"] {
  -webkit-appearance: none;
  appearance: none;
  background: transparent;
  cursor: pointer;
}

input[type="range"]::-webkit-slider-track {
  background: transparent;
  height: 6px;
}

input[type="range"]::-webkit-slider-thumb {
  -webkit-appearance: none;
  appearance: none;
  background: transparent;
  height: 20px;
  width: 20px;
  border-radius: 50%;
  cursor: pointer;
}

input[type="range"]::-moz-range-track {
  background: transparent;
  height: 6px;
  border: none;
}

input[type="range"]::-moz-range-thumb {
  background: transparent;
  height: 20px;
  width: 20px;
  border-radius: 50%;
  cursor: pointer;
  border: none;
}
</style>
