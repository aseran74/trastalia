<template>
  <div class="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
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
              
              <!-- Si está autenticado, mostrar menú de usuario -->
              <UserProfileMenu v-if="isAuthenticated" />
              
              <!-- Si NO está autenticado, mostrar botón de login -->
              <router-link 
                v-else 
                to="/login" 
                class="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-2 rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-300 transform hover:scale-105"
              >
                Iniciar Sesión
              </router-link>
            </div>

            <!-- Mobile Menu -->
            <div class="md:hidden flex items-center space-x-4">
              <!-- Si está autenticado -->
              <UserProfileMenu v-if="isAuthenticated" />
              
              <!-- Si NO está autenticado -->
              <router-link 
                v-else 
                to="/login" 
                class="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-4 py-2 rounded-lg text-sm"
              >
                Login
              </router-link>
            </div>
          </div>
        </div>
      </nav>
    </header>

    <!-- Main Content -->
    <div class="pt-28 pb-12">
      <div class="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
        <!-- Loading State -->
        <div v-if="loading" class="flex justify-center items-center min-h-[400px]">
          <div class="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500"></div>
        </div>

        <!-- Article Detail -->
        <div v-else-if="article" class="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
          <div class="grid grid-cols-1 lg:grid-cols-2 gap-0">
            <!-- Article Image Gallery -->
            <div class="p-8 space-y-6">
              <!-- Main Image -->
              <div class="aspect-[4/3] bg-gradient-to-br from-gray-100 to-gray-200 relative rounded-xl overflow-hidden shadow-lg">
                <img
                  :src="currentImage"
                  :alt="article.title || article.nombre"
                  class="w-full h-full object-cover transition-all duration-300"
                />
                
                <!-- Navigation Arrows -->
                <button
                  v-if="hasMultipleImages"
                  @click="previousImage"
                  class="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white/90 backdrop-blur-sm text-gray-800 p-3 rounded-full hover:bg-white shadow-lg transition-all duration-300 hover:scale-110"
                >
                  <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"></path>
                  </svg>
                </button>
                <button
                  v-if="hasMultipleImages"
                  @click="nextImage"
                  class="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white/90 backdrop-blur-sm text-gray-800 p-3 rounded-full hover:bg-white shadow-lg transition-all duration-300 hover:scale-110"
                >
                  <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path>
                  </svg>
                </button>
                
                <!-- Image Counter -->
                <div v-if="hasMultipleImages" class="absolute bottom-4 right-4 bg-white/90 backdrop-blur-sm text-gray-800 text-sm px-4 py-2 rounded-full font-medium shadow-lg">
                  {{ currentImageIndex + 1 }} / {{ allImages.length }}
                </div>
                
                <!-- Badges -->
                <div class="absolute top-4 left-4 flex flex-col space-y-2">
                  <span class="bg-gradient-to-r from-blue-500 to-blue-600 text-white text-xs px-4 py-2 rounded-full font-semibold shadow-lg">
                    {{ getCategoryLabel(article.category || article.categoria) }}
                  </span>
                  <span v-if="article.tipo_venta === 'gestionada'" class="bg-gradient-to-r from-green-500 to-green-600 text-white text-xs px-4 py-2 rounded-full font-semibold shadow-lg">
                    Gestionado por Trastalia
                  </span>
                </div>
              </div>
              
              <!-- Thumbnail Gallery -->
              <div v-if="hasMultipleImages" class="flex space-x-3 overflow-x-auto pb-2">
                <button
                  v-for="(image, index) in allImages"
                  :key="index"
                  @click="selectImage(index)"
                  :class="[
                    'flex-shrink-0 w-24 h-24 rounded-xl overflow-hidden border-3 transition-all duration-300 shadow-md hover:shadow-lg',
                    currentImageIndex === index 
                      ? 'border-blue-500 ring-4 ring-blue-200 scale-105' 
                      : 'border-gray-200 hover:border-gray-400 hover:scale-105'
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
            <div class="p-8 bg-gradient-to-br from-gray-50 to-white">
              <div class="space-y-6">
                <h1 class="text-4xl font-bold text-gray-900 leading-tight">
                  {{ article.title || article.nombre }}
                </h1>

                <!-- Price -->
                <div class="space-y-4">
                  <div class="flex items-baseline space-x-4">
                    <span class="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                      €{{ article.price || article.precio }}
                    </span>
                    <span v-if="article.tipo_venta === 'gestionada'" class="text-sm text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
                      +5% comisión Trastalia
                    </span>
                  </div>
                  
                  <!-- Precio en puntos -->
                  <div class="bg-gradient-to-r from-purple-100 to-purple-200 p-4 rounded-xl border border-purple-300">
                    <div class="flex items-center space-x-3">
                      <svg class="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"></path>
                      </svg>
                      <div>
                        <span class="text-2xl font-bold text-purple-800">{{ articlePoints }} puntos</span>
                        <p class="text-sm text-purple-600">Equivalente en puntos (1 punto = 1€)</p>
                      </div>
                    </div>
                  </div>
                </div>

                <!-- Description -->
                <div class="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
                  <h3 class="text-lg font-semibold text-gray-900 mb-3 flex items-center">
                    <svg class="w-5 h-5 mr-2 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                    </svg>
                    Descripción
                  </h3>
                  <p class="text-gray-700 leading-relaxed">{{ article.description || article.descripcion }}</p>
                </div>

                <!-- Condition -->
                <div class="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
                  <h3 class="text-lg font-semibold text-gray-900 mb-3 flex items-center">
                    <svg class="w-5 h-5 mr-2 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                    </svg>
                    Estado del Artículo
                  </h3>
                  <span class="inline-flex items-center px-4 py-2 rounded-full text-sm font-medium bg-gradient-to-r from-green-100 to-green-200 text-green-800 border border-green-300">
                    {{ article.condition || article.estado || 'Bueno' }}
                  </span>
                </div>

                <!-- Seller Info -->
                <div class="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
                  <h3 class="text-lg font-semibold text-gray-900 mb-3 flex items-center">
                    <svg class="w-5 h-5 mr-2 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
                    </svg>
                    Vendedor
                  </h3>
                  <div class="flex items-center space-x-4 mb-4">
                    <div class="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center shadow-lg">
                      <span class="text-white font-bold text-lg">
                        {{ (article.seller?.name || article.vendedor?.nombre || 'Usuario')[0].toUpperCase() }}
                      </span>
                    </div>
                    <div>
                      <p class="font-semibold text-gray-900 text-lg">
                        {{ article.seller?.name || article.vendedor?.nombre || 'Usuario' }}
                      </p>
                      <p class="text-sm text-gray-500">
                        {{ article.seller?.email || article.vendedor?.email || '' }}
                      </p>
                    </div>
                  </div>
                  
                  <!-- Mensaje al vendedor -->
                  <button
                    v-if="isAuthenticated"
                    @click="openMessageModal"
                    class="w-full bg-gradient-to-r from-orange-500 to-orange-600 text-white px-6 py-3 rounded-lg font-semibold hover:from-orange-600 hover:to-orange-700 transition-all duration-300 transform hover:scale-105 shadow-lg flex items-center justify-center space-x-2"
                  >
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path>
                    </svg>
                    <span>Mensaje al Vendedor</span>
                  </button>
                </div>

                <!-- Action Buttons -->
                <div class="space-y-4 pt-6">
                  <!-- Botones de compra - Si NO está autenticado -->
                  <div v-if="!isAuthenticated" class="space-y-3">
                    <p class="text-sm text-gray-600 text-center bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                      🔒 Inicia sesión para comprar este artículo
                    </p>
                    <button
                      @click="loginToBuy"
                      class="w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white px-8 py-4 rounded-xl font-semibold hover:from-blue-700 hover:to-blue-800 transition-all duration-300 transform hover:scale-105 shadow-lg"
                    >
                      <div class="flex items-center justify-center space-x-2">
                        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1"></path>
                        </svg>
                        <span>Iniciar Sesión para Comprar</span>
                      </div>
                    </button>
                  </div>
                  
                  <div v-else class="space-y-4">
                    <!-- Compra con dinero -->
                    <button
                      @click="buyWithMoney"
                      class="w-full bg-gradient-to-r from-green-600 to-green-700 text-white px-8 py-4 rounded-xl font-semibold hover:from-green-700 hover:to-green-800 transition-all duration-300 transform hover:scale-105 shadow-lg flex items-center justify-center space-x-3"
                    >
                      <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1"></path>
                      </svg>
                      <span class="text-lg">Comprar por €{{ article.price || article.precio_propuesto_vendedor }}</span>
                    </button>
                    
                    <!-- Compra con puntos -->
                    <button
                      v-if="userPoints >= articlePoints"
                      @click="buyWithPoints"
                      class="w-full bg-gradient-to-r from-purple-600 to-purple-700 text-white px-8 py-4 rounded-xl font-semibold hover:from-purple-700 hover:to-purple-800 transition-all duration-300 transform hover:scale-105 shadow-lg flex items-center justify-center space-x-3"
                    >
                      <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"></path>
                      </svg>
                      <span class="text-lg">Comprar por {{ articlePoints }} puntos</span>
                    </button>
                    
                  </div>
                  
                  <!-- Botón de edición para admin -->
                  <div v-if="isAdmin" class="pt-4 border-t border-gray-200">
                    <button
                      @click="editArticle"
                      class="w-full bg-gradient-to-r from-gray-600 to-gray-700 text-white px-8 py-4 rounded-xl font-semibold hover:from-gray-700 hover:to-gray-800 transition-all duration-300 transform hover:scale-105 shadow-lg flex items-center justify-center space-x-3"
                    >
                      <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path>
                      </svg>
                      <span class="text-lg">Editar Artículo</span>
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
  </div>

  <!-- Message Modal -->
  <MessageToSellerModal
    :is-open="showMessageModal"
    :seller="article?.seller"
    :article="article"
    @close="closeMessageModal"
    @message-sent="onMessageSent"
  />

  <!-- Stripe Payment Modal -->
  <StripePaymentModal
    :is-open="showPaymentModal"
    :cart-items="cartItem ? [cartItem] : []"
    @close="closePaymentModal"
    @payment-success="handlePaymentSuccess"
  />
</template>

<script setup>
import { ref, onMounted, onUnmounted, computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { useToast } from '@/composables/useToast'
import API_BASE_URL from '@/config/api.js'
import MessageToSellerModal from '@/components/modals/MessageToSellerModal.vue'
import StripePaymentModal from '@/components/modals/StripePaymentModal.vue'
import UserProfileMenu from '@/components/landing/UserProfileMenu.vue'

const router = useRouter()
const route = useRoute()
const authStore = useAuthStore()
const toast = useToast()

// Estado
const article = ref(null)
const loading = ref(false)
const currentImageIndex = ref(0)
const showMessageModal = ref(false)
const showPaymentModal = ref(false)
const isScrolled = ref(false)

// Computed
const isAuthenticated = computed(() => {
  const auth = authStore.isAuthenticated
  console.log('🔐 isAuthenticated computed:', auth, {
    user: authStore.user,
    token: authStore.token,
    hasLocalToken: !!localStorage.getItem('auth_token'),
    hasSessionToken: !!sessionStorage.getItem('auth_token')
  })
  return auth
})
const isAdmin = computed(() => authStore.user?.role === 'admin')
const userPoints = computed(() => authStore.user?.points || 0)

// Cart item para el modal de pago
const cartItem = computed(() => {
  if (!article.value) return null
  return {
    id: article.value._id,
    article: {
      title: article.value.title || article.value.nombre,
      description: article.value.description || article.value.descripcion,
      images: article.value.images || article.value.fotos || []
    },
    price: article.value.price || article.value.precio_propuesto_vendedor || 0,
    originalArticle: article.value
  }
})

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

// Acciones
const loginToBuy = () => {
  router.push('/login')
}

// Funciones de compra
const buyWithMoney = () => {
  if (!article.value?._id) {
    console.error('❌ No hay artículo para comprar')
    return
  }
  
  console.log('💰 Comprando con dinero:', article.value._id)
  console.log('🔐 Usuario autenticado:', isAuthenticated.value)
  
  // Verificar autenticación
  if (!isAuthenticated.value) {
    console.log('❌ Usuario no autenticado, redirigiendo a login...')
    router.push('/login')
    return
  }
  
  // Abrir modal de pago
  showPaymentModal.value = true
}

// Cerrar modal de pago
const closePaymentModal = () => {
  showPaymentModal.value = false
}

// Manejar pago exitoso
const handlePaymentSuccess = async (paymentData) => {
  console.log('💳 Pago exitoso:', paymentData)
  
  try {
    // Procesar la compra en el backend
    const response = await fetch(`${API_BASE_URL}/api/articles/${article.value._id}/buy-money`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('auth_token') || sessionStorage.getItem('auth_token')}`
      },
      body: JSON.stringify({
        paymentMethod: paymentData.method,
        amount: paymentData.amount
      })
    })
    
    if (response.ok) {
      const data = await response.json()
      if (data.success) {
        toast.success(
          '¡Compra realizada!',
          'El artículo ha sido comprado exitosamente. Recibirás más información por email.',
          { duration: 5000 }
        )
        
        // Recargar el artículo para actualizar el estado
        await loadArticle()
      } else {
        toast.error(
          'Error en la compra',
          data.message || 'No se pudo completar la compra',
          { duration: 5000 }
        )
      }
    } else {
      toast.error(
        'Error al procesar',
        'No se pudo procesar la compra. Por favor, intenta de nuevo.',
        { duration: 5000 }
      )
    }
  } catch (error) {
    console.error('Error comprando con dinero:', error)
    toast.error(
      'Error de conexión',
      'Hubo un problema al procesar la compra. Por favor, intenta de nuevo.',
      { duration: 5000 }
    )
  }
}

const buyWithPoints = async () => {
  if (!article.value?._id) {
    console.error('❌ No hay artículo para comprar')
    return
  }
  
  console.log('⭐ Comprando con puntos:', article.value._id)
  console.log('🔐 Usuario autenticado:', isAuthenticated.value)
  
  // Verificar autenticación
  if (!isAuthenticated.value) {
    console.log('❌ Usuario no autenticado, redirigiendo a login...')
    router.push('/login')
    return
  }
  
  if (userPoints.value < articlePoints.value) {
    toast.warning(
      'Puntos insuficientes',
      `No tienes suficientes puntos. Necesitas ${articlePoints.value} puntos y tienes ${userPoints.value}`,
      { duration: 5000 }
    )
    return
  }
  
  try {
    const token = localStorage.getItem('auth_token') || sessionStorage.getItem('auth_token')
    console.log('🔑 Token presente:', !!token)
    
    const response = await fetch(`${API_BASE_URL}/api/articles/${article.value._id}/buy-points`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      }
    })
    
    console.log('📡 Respuesta del servidor:', response.status)
    
    if (response.ok) {
      const data = await response.json()
      if (data.success) {
        toast.success(
          '¡Compra exitosa!',
          'El artículo ha sido comprado con puntos exitosamente.',
          { duration: 5000 }
        )
        // Recargar el artículo y actualizar puntos del usuario
        await loadArticle()
        await authStore.checkAuth()
        
        // Redirigir a mis compras después de 2 segundos
        setTimeout(() => {
          router.push('/mis-compras')
        }, 2000)
      } else {
        toast.error(
          'Error en la compra',
          data.message || 'No se pudo completar la compra con puntos',
          { duration: 5000 }
        )
      }
    } else {
      const errorData = await response.json().catch(() => ({}))
      toast.error(
        'Error al procesar',
        errorData.message || 'No se pudo procesar la compra con puntos. Por favor, intenta de nuevo.',
        { duration: 5000 }
      )
    }
  } catch (error) {
    console.error('Error comprando con puntos:', error)
    toast.error(
      'Error de conexión',
      'Hubo un problema al procesar la compra. Por favor, intenta de nuevo.',
      { duration: 5000 }
    )
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

// Función para obtener etiqueta de categoría
const getCategoryLabel = (category) => {
  const categories = {
    'tecnologia': 'Tecnología',
    'hogar': 'Hogar',
    'deportes': 'Deportes',
    'moda': 'Moda',
    'libros': 'Libros',
    'juegos': 'Juegos',
    'otros': 'Otros'
  }
  return categories[category] || category || 'Sin categoría'
}

// Función para manejar el scroll
const handleScroll = () => {
  isScrolled.value = window.scrollY > 50
}

// Lifecycle
onMounted(async () => {
  console.log('🎬 ArticleDetailNew - onMounted iniciado')
  
  // Verificar autenticación al cargar la página
  try {
    await authStore.checkAuth()
    console.log('✅ checkAuth completado:', {
      isAuthenticated: authStore.isAuthenticated,
      user: authStore.user
    })
  } catch (error) {
    console.error('❌ Error en checkAuth:', error)
  }
  
  // Log final del estado de autenticación
  console.log('🔐 Estado final de autenticación:', {
    isAuthenticated: authStore.isAuthenticated,
    hasUser: !!authStore.user,
    hasToken: !!authStore.token,
    userEmail: authStore.user?.email
  })
  
  // Cargar artículo
  loadArticle()
  
  // Listener de scroll
  window.addEventListener('scroll', handleScroll)
})

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll)
})
</script>