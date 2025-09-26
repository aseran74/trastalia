<template>
  <div class="min-h-screen bg-gray-100">
    <!-- Header -->
    <header 
      :class="[
        'fixed top-0 left-0 right-0 z-50 transition-all duration-300',
        isScrolled ? 'bg-white/95 backdrop-blur-sm border-b border-gray-200 shadow-sm' : 'bg-transparent'
      ]"
    >
      <!-- Navigation -->
      <nav class="relative z-10 px-4 py-3">
        <div class="mx-auto max-w-5xl">
          <div class="flex items-center justify-between">
            <div class="flex items-center space-x-2">
              <img src="/images/Trastalia3.png" alt="Trastalia" class="h-16 w-auto sm:h-18 md:h-20">
            </div>
            
            <!-- Desktop Menu -->
            <div class="hidden md:flex items-center space-x-6">
              <router-link to="/" class="text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white transition-colors">Inicio</router-link>
              <a href="#categorias" class="text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white transition-colors">Categorías</a>
              <a href="#destacados" class="text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white transition-colors">Destacados</a>
              <router-link to="/articulos" class="text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white transition-colors">Ver Artículos</router-link>
              
              <!-- Menú de perfil si está logueado, botón de login si no -->
              <UserProfileMenu v-if="authStore.isAuthenticated" />
              <router-link v-else to="/signin" class="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-2 rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-300 transform hover:scale-105">
                Iniciar Sesión
              </router-link>
            </div>

            <!-- Mobile Menu Button -->
            <div class="md:hidden flex items-center space-x-4">
              
              <UserProfileMenu v-if="authStore.isAuthenticated" />
              
              <!-- Botón de menú hamburguesa -->
              <button
                @click="toggleMobileMenu"
                class="text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white transition-colors"
              >
                <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>
            </div>
          </div>

          <!-- Mobile Menu -->
          <div v-if="mobileMenuOpen" class="md:hidden mt-4 py-4 border-t border-gray-200 dark:border-gray-700">
            <div class="flex flex-col space-y-4">
              
              <router-link to="/" class="text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white transition-colors" @click="mobileMenuOpen = false">Inicio</router-link>
              <a href="#categorias" class="text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white transition-colors" @click="mobileMenuOpen = false">Categorías</a>
              <a href="#destacados" class="text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white transition-colors" @click="mobileMenuOpen = false">Destacados</a>
              <router-link to="/articulos" class="text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white transition-colors" @click="mobileMenuOpen = false">Ver Artículos</router-link>
              
              <!-- Botón de login para móvil si no está logueado -->
              <router-link v-if="!authStore.isAuthenticated" to="/signin" class="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-2 rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-300 text-center" @click="mobileMenuOpen = false">
                Iniciar Sesión
              </router-link>
            </div>
          </div>
        </div>
      </nav>
    </header>

    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 pt-24">
      <!-- Hero Section Mejorado -->
      <div class="text-center mb-16">
        <div class="relative">
          <!-- Badge superior -->
          <div class="inline-flex items-center px-4 py-2 rounded-full bg-gradient-to-r from-blue-100 to-purple-100 text-blue-800 text-sm font-semibold mb-6 shadow-sm">
            <svg class="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"/>
            </svg>
            Artículos Verificados
          </div>
          
          <!-- Título principal -->
          <h1 class="text-5xl lg:text-7xl font-bold tracking-tight text-gray-900 mb-6">
            Artículos
            <span class="bg-gradient-to-r from-blue-600 via-purple-600 to-green-600 bg-clip-text text-transparent">
              Disponibles
            </span>
          </h1>
          
          <!-- Subtítulo mejorado -->
          <p class="text-xl lg:text-2xl text-gray-600 max-w-4xl mx-auto leading-relaxed mb-8">
            Descubre una <span class="font-semibold text-gray-800">amplia selección</span> de artículos de segunda mano 
            <span class="font-semibold text-blue-600">verificados</span> y en 
            <span class="font-semibold text-green-600">excelente estado</span>
          </p>
          
          <!-- Estadísticas rápidas -->
          <div class="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-2xl mx-auto mb-8">
            <div class="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
              <div class="text-2xl font-bold text-blue-600">1000+</div>
              <div class="text-sm text-gray-600">Artículos</div>
            </div>
            <div class="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
              <div class="text-2xl font-bold text-purple-600">500+</div>
              <div class="text-sm text-gray-600">Usuarios</div>
            </div>
            <div class="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
              <div class="text-2xl font-bold text-green-600">95%</div>
              <div class="text-sm text-gray-600">Satisfacción</div>
            </div>
          </div>
          
          <!-- CTA buttons -->
          <div class="flex flex-col sm:flex-row gap-4 justify-center">
            <button class="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-4 rounded-xl text-lg font-semibold hover:from-blue-700 hover:to-purple-700 transition-all duration-300 transform hover:scale-105 shadow-lg">
              🔍 Explorar Artículos
            </button>
            <button class="border-2 border-gray-300 text-gray-700 px-8 py-4 rounded-xl text-lg font-semibold hover:border-blue-600 hover:text-blue-600 transition-all duration-300">
              📱 Ver en App
            </button>
          </div>
        </div>
      </div>

      <!-- Sección de Categorías -->
      <section id="categorias" class="mb-16">
        <div class="text-center mb-12">
          <h2 class="text-3xl font-bold text-gray-900 mb-4">Categorías Populares</h2>
          <p class="text-gray-600 max-w-2xl mx-auto">Explora artículos por categoría</p>
        </div>
        
        <div class="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
          <div class="bg-white rounded-lg p-4 text-center shadow-sm hover:shadow-md transition-shadow cursor-pointer">
            <div class="text-2xl mb-2">📱</div>
            <div class="text-sm font-medium text-gray-700">Tecnología</div>
          </div>
          <div class="bg-white rounded-lg p-4 text-center shadow-sm hover:shadow-md transition-shadow cursor-pointer">
            <div class="text-2xl mb-2">👕</div>
            <div class="text-sm font-medium text-gray-700">Ropa</div>
          </div>
          <div class="bg-white rounded-lg p-4 text-center shadow-sm hover:shadow-md transition-shadow cursor-pointer">
            <div class="text-2xl mb-2">🏠</div>
            <div class="text-sm font-medium text-gray-700">Hogar</div>
          </div>
          <div class="bg-white rounded-lg p-4 text-center shadow-sm hover:shadow-md transition-shadow cursor-pointer">
            <div class="text-2xl mb-2">🚗</div>
            <div class="text-sm font-medium text-gray-700">Automóviles</div>
          </div>
          <div class="bg-white rounded-lg p-4 text-center shadow-sm hover:shadow-md transition-shadow cursor-pointer">
            <div class="text-2xl mb-2">🎮</div>
            <div class="text-sm font-medium text-gray-700">Gaming</div>
          </div>
          <div class="bg-white rounded-lg p-4 text-center shadow-sm hover:shadow-md transition-shadow cursor-pointer">
            <div class="text-2xl mb-2">📚</div>
            <div class="text-sm font-medium text-gray-700">Libros</div>
          </div>
        </div>
      </section>

      <!-- Sección de Destacados -->
      <section id="destacados" class="mb-16">
        <div class="text-center mb-12">
          <h2 class="text-3xl font-bold text-gray-900 mb-4">Artículos Destacados</h2>
          <p class="text-gray-600 max-w-2xl mx-auto">Los artículos más populares de la semana</p>
        </div>
        
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div class="bg-white rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow">
            <div class="text-center">
              <div class="text-4xl mb-4">🏆</div>
              <h3 class="font-semibold text-gray-900 mb-2">Más Vendidos</h3>
              <p class="text-sm text-gray-600">Los artículos con más compras</p>
            </div>
          </div>
          <div class="bg-white rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow">
            <div class="text-center">
              <div class="text-4xl mb-4">⭐</div>
              <h3 class="font-semibold text-gray-900 mb-2">Mejor Valorados</h3>
              <p class="text-sm text-gray-600">Los artículos con mejor calidad</p>
            </div>
          </div>
          <div class="bg-white rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow">
            <div class="text-center">
              <div class="text-4xl mb-4">🆕</div>
              <h3 class="font-semibold text-gray-900 mb-2">Recién Llegados</h3>
              <p class="text-sm text-gray-600">Los artículos más recientes</p>
            </div>
          </div>
        </div>
      </section>

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
              
              <!-- Opciones de compra -->
              <div class="space-y-2">
                <button
                  @click="addToCart(article, 'money')"
                  class="w-full bg-gradient-to-r from-green-600 to-emerald-600 text-white py-2 px-4 rounded-md text-sm font-semibold hover:from-green-700 hover:to-emerald-700 transition-all duration-300 transform hover:scale-105 shadow-lg"
                >
                  💰 Comprar con Dinero
                </button>
                
                <button
                  v-if="getArticlePoints(article)"
                  @click="addToCart(article, 'points')"
                  class="w-full bg-gradient-to-r from-yellow-500 to-orange-500 text-white py-2 px-4 rounded-md text-sm font-semibold hover:from-yellow-600 hover:to-orange-600 transition-all duration-300 transform hover:scale-105 shadow-lg"
                >
                  ⭐ Comprar con Puntos
                </button>
              </div>
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

    <!-- Modal de Login/Registro -->
    <div v-if="showLoginModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div class="bg-white rounded-lg p-6 max-w-md w-full mx-4">
        <div class="text-center">
          <div class="mx-auto flex items-center justify-center h-12 w-12 rounded-full mb-4" 
               :class="purchaseType === 'money' ? 'bg-green-100' : 'bg-yellow-100'">
            <svg v-if="purchaseType === 'money'" class="h-6 w-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
            </svg>
            <svg v-else class="h-6 w-6 text-yellow-600" fill="currentColor" viewBox="0 0 20 20">
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
            </svg>
          </div>
          
          <h3 class="text-lg font-medium text-gray-900 mb-2">
            Inicia sesión para comprar
          </h3>
          
          <div v-if="selectedArticle" class="mb-4 p-3 bg-gray-50 rounded-lg">
            <p class="text-sm font-medium text-gray-900 mb-1">
              {{ selectedArticle.title || selectedArticle.nombre }}
            </p>
            <div class="flex items-center justify-between">
              <span class="text-sm text-gray-600">
                {{ purchaseType === 'money' ? 'Precio:' : 'Puntos:' }}
              </span>
              <span class="text-sm font-bold text-gray-900">
                {{ purchaseType === 'money' 
                  ? formatPrice(selectedArticle.price || selectedArticle.precio_propuesto_vendedor)
                  : formatPoints(getArticlePoints(selectedArticle)) + ' puntos'
                }}
              </span>
            </div>
          </div>
          
          <p class="text-sm text-gray-500 mb-6">
            Necesitas una cuenta para {{ purchaseType === 'money' ? 'comprar con dinero' : 'comprar con puntos' }}.
          </p>
          
          <div class="space-y-3">
            <button
              @click="goToLogin"
              class="w-full bg-blue-600 text-white py-2 px-4 rounded-md text-sm font-semibold hover:bg-blue-700 transition-colors"
            >
              Iniciar Sesión
            </button>
            
            <button
              @click="goToRegister"
              class="w-full border border-gray-300 text-gray-700 py-2 px-4 rounded-md text-sm font-semibold hover:bg-gray-50 transition-colors"
            >
              Crear Cuenta
            </button>
            
            <button
              @click="showLoginModal = false"
              class="w-full text-gray-500 py-2 px-4 text-sm hover:text-gray-700 transition-colors"
            >
              Cancelar
            </button>
          </div>
        </div>
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
import { ref, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import UserProfileMenu from '@/components/landing/UserProfileMenu.vue'
import API_BASE_URL from '@/config/api'

const router = useRouter()
const authStore = useAuthStore()

// Estado ultra simple - solo lo esencial
const articles = ref([])
const loading = ref(false)

// Modal de login/registro
const showLoginModal = ref(false)
const selectedArticle = ref(null)
const purchaseType = ref('money') // 'money' o 'points'

// Estados para la navbar
const mobileMenuOpen = ref(false)
const isScrolled = ref(false)

// Cargar artículos públicos - versión ultra simple
const loadPublicArticles = async () => {
  console.log('🚀 Iniciando carga de artículos...')
  loading.value = true
  
  try {
    const baseUrl = API_BASE_URL ? `${API_BASE_URL}/api/articles/public` : '/api/articles/public'
    const url = `${baseUrl}?t=${Date.now()}`
    console.log('🔍 Cargando artículos desde:', url)
    console.log('🔧 API_BASE_URL:', API_BASE_URL)
    console.log('🔧 PROD:', import.meta.env.PROD)
    console.log('🔧 DEV:', import.meta.env.DEV)
    
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
      const errorText = await response.text()
      console.error('❌ Error response body:', errorText)
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

// Agregar al carrito (requiere login)
const addToCart = (article, type = 'money') => {
  // Mostrar modal de opciones de login/registro
  showLoginModal.value = true
  selectedArticle.value = article
  purchaseType.value = type
}

// Redirigir a login
const goToLogin = () => {
  showLoginModal.value = false
  router.push('/signin')
}

// Redirigir a registro
const goToRegister = () => {
  showLoginModal.value = false
  router.push('/signup')
}

// Funciones para la navbar
const toggleMobileMenu = () => {
  mobileMenuOpen.value = !mobileMenuOpen.value
}

const handleScroll = () => {
  isScrolled.value = window.scrollY > 50
}

onMounted(() => {
  console.log('🎯 Componente montado, cargando artículos...')
  loadPublicArticles()
  
  // Add scroll event listener
  window.addEventListener('scroll', handleScroll)
  
  // Smooth scrolling for anchor links
  const links = document.querySelectorAll('a[href^="#"]')
  links.forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault()
      const target = document.querySelector(link.getAttribute('href') || '')
      if (target) {
        target.scrollIntoView({
          behavior: 'smooth',
          block: 'start'
        })
      }
    })
  })
})

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll)
})
</script>