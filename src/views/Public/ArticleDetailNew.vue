<template>
  <div class="min-h-screen bg-gray-50">
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
              <router-link to="/">
                <img src="/images/Trastalia3.png" alt="Trastalia" class="h-16 w-auto sm:h-18 md:h-20">
              </router-link>
            </div>
            
            <!-- Desktop Menu -->
            <div class="hidden md:flex items-center space-x-6">
              <router-link to="/" class="text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white transition-colors">Inicio</router-link>
              <router-link to="/articulos" class="text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white transition-colors">Ver Artículos</router-link>
              
              <!-- Menú de perfil si está logueado, botón de login si no -->
              <UserProfileMenu v-if="authStore.isAuthenticated" />
              <router-link v-else to="/login" class="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-2 rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-300 transform hover:scale-105">
                Iniciar Sesión
              </router-link>
            </div>

            <!-- Mobile Menu Button -->
            <div class="md:hidden flex items-center space-x-4">
              <UserProfileMenu v-if="authStore.isAuthenticated" />
              <router-link v-else to="/login" class="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-4 py-2 rounded-lg text-sm">
                Login
              </router-link>
            </div>
          </div>
        </div>
      </nav>
    </header>

    <!-- Main Content -->
    <div class="pt-20 pb-8">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <!-- Loading State -->
      <div v-if="loading" class="flex justify-center items-center min-h-[400px]">
        <div class="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500"></div>
      </div>

      <!-- Article Detail -->
      <div v-else-if="article" class="bg-white rounded-lg shadow-lg overflow-hidden">
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <!-- Article Image Gallery -->
          <div class="space-y-4">
            <!-- Main Image -->
            <div class="aspect-video bg-gray-200 relative rounded-lg overflow-hidden">
              <img
                :src="currentImage"
                :alt="article.title || article.nombre"
                class="w-full h-full object-cover transition-all duration-300"
              />
              
              <!-- Navigation Arrows -->
              <button
                v-if="hasMultipleImages"
                @click="previousImage"
                class="absolute left-4 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-70 transition-all"
              >
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"></path>
                </svg>
              </button>
              <button
                v-if="hasMultipleImages"
                @click="nextImage"
                class="absolute right-4 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-70 transition-all"
              >
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path>
                </svg>
              </button>
              
              <!-- Image Counter -->
              <div v-if="hasMultipleImages" class="absolute bottom-4 right-4 bg-black bg-opacity-50 text-white text-sm px-3 py-1 rounded-full">
                {{ currentImageIndex + 1 }} / {{ allImages.length }}
              </div>
              
              <!-- Badges -->
              <div class="absolute top-4 left-4 flex flex-col space-y-2">
                <span class="bg-blue-500 text-white text-xs px-3 py-1 rounded-full font-semibold">
                  {{ getCategoryLabel(article.category || article.categoria) }}
                </span>
                <span v-if="article.tipo_venta === 'gestionada'" class="bg-green-500 text-white text-xs px-3 py-1 rounded-full font-semibold">
                  Gestionado por Trastalia
                </span>
              </div>
            </div>
            
            <!-- Thumbnail Gallery -->
            <div v-if="hasMultipleImages" class="flex space-x-2 overflow-x-auto pb-2">
              <button
                v-for="(image, index) in allImages"
                :key="index"
                @click="selectImage(index)"
                :class="[
                  'flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition-all',
                  currentImageIndex === index 
                    ? 'border-blue-500 ring-2 ring-blue-200' 
                    : 'border-gray-200 hover:border-gray-300'
                ]"
              >
                <img
                  :src="image"
                  :alt="`Thumbnail ${index + 1}`"
                  class="w-full h-full object-cover"
                />
              </button>
            </div>
          </div>

          <!-- Article Info -->
          <div class="p-6">
            <h1 class="text-3xl font-bold text-gray-900 mb-4">
              {{ article.title || article.nombre }}
            </h1>
            
            <div class="space-y-4">
              <!-- Price -->
              <div class="flex items-center space-x-4">
                <span class="text-3xl font-bold text-blue-600">
                  €{{ article.price || article.precio }}
                </span>
                <span v-if="article.tipo_venta === 'gestionada'" class="text-sm text-gray-500">
                  (+5% comisión Trastalia)
                </span>
              </div>

              <!-- Description -->
              <div>
                <h3 class="text-lg font-semibold text-gray-900 mb-2">Descripción</h3>
                <p class="text-gray-700">{{ article.description || article.descripcion }}</p>
              </div>

              <!-- Condition -->
              <div>
                <h3 class="text-lg font-semibold text-gray-900 mb-2">Estado</h3>
                <span class="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
                  {{ article.condition || article.estado || 'Bueno' }}
                </span>
              </div>

              <!-- Seller Info -->
              <div class="border-t pt-4">
                <h3 class="text-lg font-semibold text-gray-900 mb-2">Vendedor</h3>
                <div class="flex items-center space-x-3">
                  <div class="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center">
                    <span class="text-gray-600 font-semibold">
                      {{ (article.seller?.name || article.vendedor?.nombre || 'Usuario')[0].toUpperCase() }}
                    </span>
                  </div>
                  <div>
                    <p class="font-medium text-gray-900">
                      {{ article.seller?.name || article.vendedor?.nombre || 'Usuario' }}
                    </p>
                    <p class="text-sm text-gray-500">
                      {{ article.seller?.email || article.vendedor?.email || '' }}
                    </p>
                  </div>
                </div>
              </div>

              <!-- Action Buttons -->
              <div class="space-y-4 pt-4">
                <!-- Botones de compra -->
                <div v-if="!isAuthenticated" class="flex space-x-4">
                  <button
                    @click="loginToBuy"
                    class="flex-1 bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
                  >
                    Iniciar Sesión para Comprar
                  </button>
                </div>
                
                <div v-else class="space-y-3">
                  <!-- Compra con dinero -->
                  <button
                    @click="buyWithMoney"
                    class="w-full bg-green-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-green-700 transition-colors flex items-center justify-center space-x-2"
                  >
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1"></path>
                    </svg>
                    <span>Comprar por €{{ article.price || article.precio_propuesto_vendedor }}</span>
                  </button>
                  
                  <!-- Compra con puntos -->
                  <button
                    v-if="userPoints >= articlePoints"
                    @click="buyWithPoints"
                    class="w-full bg-purple-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-purple-700 transition-colors flex items-center justify-center space-x-2"
                  >
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"></path>
                    </svg>
                    <span>Comprar por {{ articlePoints }} puntos</span>
                  </button>
                  
                  <!-- Mensaje al vendedor -->
                  <button
                    @click="openMessageModal"
                    class="w-full bg-blue-500 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-600 transition-colors flex items-center justify-center space-x-2"
                  >
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"></path>
                    </svg>
                    <span>Mensaje al Vendedor</span>
                  </button>
                </div>
                
                <!-- Botón de edición para admin -->
                <div v-if="isAdmin" class="pt-2 border-t">
                  <button
                    @click="editArticle"
                    class="w-full bg-gray-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-gray-700 transition-colors"
                  >
                    Editar Artículo
                  </button>
                </div>
              </div>
              
            </div>
          </div>
        </div>
      </div>

      <!-- Article Not Found -->
      <div v-else class="text-center py-12">
        <div class="max-w-md mx-auto">
          <div class="w-24 h-24 mx-auto mb-4 bg-gray-200 rounded-full flex items-center justify-center">
            <svg class="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.172 16.172a4 4 0 015.656 0M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
            </svg>
          </div>
          <h3 class="mt-2 text-sm font-medium text-gray-900">Artículo no encontrado</h3>
          <p class="mt-1 text-sm text-gray-500">No se pudo cargar la información del artículo.</p>
        </div>
      </div>
    </div>
  </div>

  <!-- Message Modal -->
  <MessageToSellerModal
    :is-open="showMessageModal"
    :seller="article?.seller"
    :article="article"
    @close="closeMessageModal"
    @message-sent="onMessageSent"
  />
</template>

<script setup>
import { ref, onMounted, onUnmounted, computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import API_BASE_URL from '@/config/api.js'
import MessageToSellerModal from '@/components/modals/MessageToSellerModal.vue'
import UserProfileMenu from '@/components/landing/UserProfileMenu.vue'

const router = useRouter()
const route = useRoute()
const authStore = useAuthStore()

// Estado
const article = ref(null)
const loading = ref(false)
const currentImageIndex = ref(0)
const showMessageModal = ref(false)
const isScrolled = ref(false)

// Computed
const isAuthenticated = computed(() => authStore.isAuthenticated)
const isAdmin = computed(() => authStore.user?.role === 'admin')
const userPoints = computed(() => authStore.user?.points || 0)

// Puntos necesarios para comprar el artículo (1 punto = 1€)
const articlePoints = computed(() => {
  const price = article.value?.price || article.value?.precio_propuesto_vendedor || 0
  return Math.ceil(price)
})

// Todas las imágenes del artículo
const allImages = computed(() => {
  if (!article.value) return ['images/placeholder.jpg']
  
  // Combinar fotos e images, priorizando fotos
  const fotos = article.value.fotos || []
  const images = article.value.images || []
  
  // Crear array único de imágenes
  const combinedImages = [...fotos, ...images.filter(img => !fotos.includes(img))]
  
  console.log('🖼️ All images:', {
    fotos: fotos,
    images: images,
    combined: combinedImages
  })
  
  return combinedImages.length > 0 ? combinedImages : ['images/placeholder.jpg']
})

// Imagen actual seleccionada
const currentImage = computed(() => {
  return allImages.value[currentImageIndex.value] || 'images/placeholder.jpg'
})

// Si hay múltiples imágenes
const hasMultipleImages = computed(() => {
  return allImages.value.length > 1
})

// Cargar artículo desde MongoDB
const loadArticle = async () => {
  const articleId = route.params.id
  if (!articleId) return

  loading.value = true
  try {
    const apiUrl = `${API_BASE_URL}/api/articles/${articleId}`
    console.log('🌐 Llamando a API:', apiUrl)
    
    const response = await fetch(apiUrl, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      }
    })

    if (response.ok) {
      const data = await response.json()
      if (data.success) {
        article.value = data.data
        currentImageIndex.value = 0 // Resetear índice de imagen
        console.log('✅ Artículo cargado:', data.data)
        console.log('🖼️ Imágenes disponibles:', {
          fotos: data.data.fotos,
          images: data.data.images
        })
      } else {
        console.error('❌ Error en respuesta:', data.message)
      }
    } else {
      console.error('❌ Error HTTP:', response.status)
    }
  } catch (error) {
    console.error('❌ Error cargando artículo:', error)
  } finally {
    loading.value = false
  }
}


// Obtener etiqueta de categoría
const getCategoryLabel = (category) => {
  const labels = {
    'electronica': 'Electrónica',
    'hogar': 'Hogar',
    'deportes': 'Deportes',
    'libros': 'Libros',
    'ropa': 'Ropa',
    'juguetes': 'Juguetes',
    'herramientas': 'Herramientas',
    'muebles': 'Muebles',
    'coches': 'Coches',
    'salud': 'Salud'
  }
  return labels[category] || category || 'General'
}

// Acciones
const loginToBuy = () => {
  router.push('/login')
}

// Funciones de compra
const buyWithMoney = async () => {
  if (!article.value?._id) return
  
  try {
    const response = await fetch(`${API_BASE_URL}/api/articles/${article.value._id}/buy-money`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('auth_token') || sessionStorage.getItem('auth_token')}`
      }
    })
    
    if (response.ok) {
      const data = await response.json()
      if (data.success) {
        alert('¡Artículo comprado exitosamente!')
        // Recargar el artículo para actualizar el estado
        await loadArticle()
      } else {
        alert('Error al comprar: ' + data.message)
      }
    } else {
      alert('Error al procesar la compra')
    }
  } catch (error) {
    console.error('Error comprando con dinero:', error)
    alert('Error al procesar la compra')
  }
}

const buyWithPoints = async () => {
  if (!article.value?._id) return
  
  if (userPoints.value < articlePoints.value) {
    alert(`No tienes suficientes puntos. Necesitas ${articlePoints.value} puntos y tienes ${userPoints.value}`)
    return
  }
  
  try {
    const response = await fetch(`${API_BASE_URL}/api/articles/${article.value._id}/buy-points`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('auth_token') || sessionStorage.getItem('auth_token')}`
      }
    })
    
    if (response.ok) {
      const data = await response.json()
      if (data.success) {
        alert('¡Artículo comprado con puntos exitosamente!')
        // Recargar el artículo y actualizar puntos del usuario
        await loadArticle()
        await authStore.checkAuth()
      } else {
        alert('Error al comprar: ' + data.message)
      }
    } else {
      alert('Error al procesar la compra con puntos')
    }
  } catch (error) {
    console.error('Error comprando con puntos:', error)
    alert('Error al procesar la compra')
  }
}

const editArticle = () => {
  router.push(`/admin/articulos/${article.value?.id}/editar`)
}

// Función para abrir modal de mensajes
const openMessageModal = () => {
  showMessageModal.value = true
}

const closeMessageModal = () => {
  showMessageModal.value = false
}

const onMessageSent = () => {
  // Opcional: mostrar confirmación o actualizar algo
  console.log('Mensaje enviado exitosamente')
}

// Funciones para navegar entre imágenes
const selectImage = (index) => {
  currentImageIndex.value = index
}

const nextImage = () => {
  if (currentImageIndex.value < allImages.value.length - 1) {
    currentImageIndex.value++
  } else {
    currentImageIndex.value = 0 // Volver al inicio
  }
}

const previousImage = () => {
  if (currentImageIndex.value > 0) {
    currentImageIndex.value--
  } else {
    currentImageIndex.value = allImages.value.length - 1 // Ir al final
  }
}


// Función para manejar el scroll
const handleScroll = () => {
  isScrolled.value = window.scrollY > 50
}

// Lifecycle
onMounted(() => {
  loadArticle()
  window.addEventListener('scroll', handleScroll)
})

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll)
})
</script>
