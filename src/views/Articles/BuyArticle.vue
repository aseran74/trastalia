<template>
  <div class="min-h-screen xl:flex">
    <app-sidebar />
    <Backdrop />
    <div
      class="flex-1 transition-all duration-300 ease-in-out"
      :class="[isExpanded || isHovered ? 'lg:ml-[290px]' : 'lg:ml-[90px]']"
    >
      <app-header />
      <div class="p-4 mx-auto max-w-(--breakpoint-2xl) md:p-6">
        <div class="mx-auto max-w-screen-2xl p-4 md:p-6 2xl:p-10">
          <!-- Breadcrumb -->
          <BreadcrumbNav />
          
          <!-- Header -->
          <div class="mb-6">
            <div class="flex justify-between items-start">
              <div>
                <h1 class="text-3xl font-bold text-black dark:text-white">
                  Comprar Artículos de Trastalia
                </h1>
                <p class="text-gray-600 dark:text-gray-400">
                  Artículos que Trastalia ha comprado y están disponibles para ti
                </p>
              </div>
              
              <!-- Botón del carrito -->
              <button
                @click="openCart"
                class="relative bg-primary hover:bg-primary/90 text-white px-4 py-2 rounded-lg transition-colors flex items-center space-x-2"
              >
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-2.5 5M7 13l2.5 5m6-5v6a2 2 0 11-4 0v-6m4 0V9a2 2 0 00-2-2H9a2 2 0 00-2 2v4.01"></path>
                </svg>
                <span>Carrito</span>
                <span v-if="cartStore.totalItems > 0" class="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {{ cartStore.totalItems }}
                </span>
              </button>
            </div>
          </div>

          <!-- Filtros -->
          <div class="mb-6 rounded-sm border border-stroke bg-white p-4 shadow-default dark:border-strokedark dark:bg-boxdark">
            <div class="flex flex-wrap gap-4">
              <div class="flex items-center space-x-2">
                <label class="text-sm font-medium text-gray-700 dark:text-gray-300">Filtrar por:</label>
                <select 
                  v-model="filterType" 
                  class="rounded border border-stroke bg-transparent px-3 py-2 text-sm dark:border-strokedark"
                >
                  <option value="all">Todos</option>
                  <option value="money">Solo dinero</option>
                  <option value="points">Solo puntos</option>
                  <option value="both">Dinero y puntos</option>
                </select>
              </div>
              
              <div class="flex items-center space-x-2">
                <label class="text-sm font-medium text-gray-700 dark:text-gray-300">Ordenar por:</label>
                <select 
                  v-model="sortBy" 
                  class="rounded border border-stroke bg-transparent px-3 py-2 text-sm dark:border-strokedark"
                >
                  <option value="newest">Más recientes</option>
                  <option value="price-low">Precio: menor a mayor</option>
                  <option value="price-high">Precio: mayor a menor</option>
                  <option value="points-low">Puntos: menor a mayor</option>
                  <option value="points-high">Puntos: mayor a menor</option>
                </select>
              </div>
            </div>
          </div>

          <!-- Loading -->
          <div v-if="loading" class="flex justify-center py-12">
            <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>

          <!-- Artículos con diseño moderno -->
          <div v-else-if="filteredArticles.length > 0" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            <div 
              v-for="article in filteredArticles" 
              :key="article._id" 
              class="group bg-white rounded-lg shadow-md overflow-hidden flex flex-col transition-transform duration-300 hover:shadow-xl hover:-translate-y-1 dark:bg-boxdark"
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

                <h3 class="mt-2 text-lg font-bold text-gray-900 dark:text-white">
                  <span class="line-clamp-2">
                    {{ article.title || article.nombre }}
                  </span>
                </h3>
                
                <!-- Precio y Puntos -->
                <div class="mt-4 space-y-2">
                  <p class="text-2xl font-extrabold text-gray-800 dark:text-white">
                    {{ formatPrice(article.price || article.precio_propuesto_vendedor) }}
                  </p>
                  
                  <!-- Opción de puntos si está disponible -->
                  <div v-if="getArticlePoints(article)" class="flex items-center space-x-2">
                    <span class="text-sm text-gray-600 dark:text-gray-400">o</span>
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

                <!-- Ubicación -->
                <div class="mt-3 flex items-center text-sm text-gray-600 dark:text-gray-400">
                  <svg class="mr-2 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path>
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path>
                  </svg>
                  {{ article.location || article.ubicacion }}
                </div>

                <div class="mt-auto pt-4 space-y-2">
                  <button
                    @click="viewArticle(article)"
                    class="w-full bg-blue-600 text-white py-2 px-4 rounded-md text-sm font-semibold hover:bg-blue-700 transition-colors"
                  >
                    Ver Detalles
                  </button>
                  
                  <div class="flex space-x-2">
                    <button
                      @click="buyWithMoney(article)"
                      class="flex-1 bg-green-600 text-white py-2 px-4 rounded-md text-sm font-semibold hover:bg-green-700 transition-colors"
                    >
                      Comprar con Dinero
                    </button>
                    
                    <button
                      v-if="getArticlePoints(article)"
                      @click="buyWithPoints(article)"
                      class="flex-1 bg-yellow-500 text-white py-2 px-4 rounded-md text-sm font-semibold hover:bg-yellow-600 transition-colors"
                    >
                      Comprar con Puntos
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Sin artículos -->
          <div v-else class="text-center py-12">
            <svg class="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"></path>
            </svg>
            <h3 class="mt-2 text-sm font-medium text-gray-900 dark:text-white">No hay artículos disponibles</h3>
            <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">No se encontraron artículos que coincidan con los filtros seleccionados.</p>
          </div>
        </div>
      </div>
    </div>

    <!-- Modal del carrito de compra -->
    <ShoppingCartModal
      :is-open="showCartModal"
      :cart-items="cartStore.items"
      @close="closeCart"
      @proceed-to-payment="proceedToPayment"
      @remove-item="cartStore.removeItem"
    />

    <!-- Modal de pasarela de pago -->
    <PaymentModal
      :is-open="showPaymentModal"
      :cart-items="cartStore.items"
      @close="closePayment"
      @payment-success="handlePaymentSuccess"
    />

    <!-- Modal de confirmación de compra con puntos -->
    <PointsPurchaseConfirmModal
      :is-open="showPointsConfirmModal"
      :article="selectedArticleForPoints"
      @close="closePointsConfirmModal"
      @confirmed="confirmPointsPurchase"
    />
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useCartStore } from '@/stores/cart'
import { useToast } from '@/composables/useToast'
import AppSidebar from '@/components/layout/AppSidebar.vue'
import AppHeader from '@/components/layout/AppHeader.vue'
import Backdrop from '@/components/layout/Backdrop.vue'
import { useSidebar } from '@/composables/useSidebar'

// Sidebar logic
const { isExpanded, isHovered } = useSidebar()
import BreadcrumbNav from '@/components/BreadcrumbNav.vue'
import ShoppingCartModal from '@/components/modals/ShoppingCartModal.vue'
import PaymentModal from '@/components/modals/PaymentModal.vue'
import PointsPurchaseConfirmModal from '@/components/modals/PointsPurchaseConfirmModal.vue'
import { getSupabaseImageUrl, getImageByCategory } from '@/config/supabase'
import API_BASE_URL from '@/config/api'

// Estado reactivo
const articles = ref([])
const loading = ref(false)
const filterType = ref('all')
const sortBy = ref('newest')

// Store del carrito
const cartStore = useCartStore()
const toast = useToast()

// Estado del carrito de compra
const showCartModal = ref(false)
const showPaymentModal = ref(false)
const showPointsConfirmModal = ref(false)
const selectedArticleForPoints = ref(null)

// Cargar artículos del admin
const loadArticles = async () => {
  loading.value = true
  try {
    const token = localStorage.getItem('auth_token') || sessionStorage.getItem('auth_token')
    const url = `${API_BASE_URL}/api/articles/admin-owned`
    console.log('🔍 Cargando artículos del admin desde:', url)
    console.log('🔑 Token:', token ? 'Presente' : 'Ausente')
    
    const response = await fetch(url, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    })
    
    console.log('📊 Respuesta del servidor:', response.status, response.statusText)
    
    if (response.ok) {
      const data = await response.json()
      articles.value = data.data || []
      console.log('✅ Artículos del admin cargados:', articles.value.length)
    } else {
      const errorText = await response.text()
      console.error('❌ Error del servidor:', errorText)
      console.error('Error cargando artículos del admin:', response.statusText)
    }
  } catch (error) {
    console.error('❌ Error cargando artículos del admin:', error)
  } finally {
    loading.value = false
  }
}

// Filtrar artículos
const filteredArticles = computed(() => {
  let filtered = articles.value.filter(article => {
    // Usar precio_sugerido en lugar de price para la nueva lógica
    const price = article.precio_sugerido || article.price || 0
    
    // Los artículos del admin que están disponibles para compra
    const isAvailableForPurchase = article.estado_articulo === 'COMPRADO_POR_ADMIN' || 
                                  article.estado_articulo === 'VENDIDO_A_TRASTALIA_DINERO' ||
                                  article.estado_articulo === 'VENDIDO_A_TRASTALIA_PUNTOS'
    
    if (!isAvailableForPurchase) return false
    
    // Filtrar por tipo de venta
    switch (filterType.value) {
      case 'money':
        return price > 0 && (
          article.adminDecision?.money === true ||
          article.oferta_admin?.tipo_oferta === 'dinero' || 
          article.oferta_admin?.tipo_oferta === 'ambos'
        )
      case 'points':
        return price > 0 && (
          article.adminDecision?.points === true ||
          article.oferta_admin?.tipo_oferta === 'puntos' || 
          article.oferta_admin?.tipo_oferta === 'ambos'
        )
      case 'both':
        return price > 0 && (
          (article.adminDecision?.money === true || article.adminDecision?.points === true) ||
          article.oferta_admin?.tipo_oferta === 'dinero' || 
          article.oferta_admin?.tipo_oferta === 'puntos' || 
          article.oferta_admin?.tipo_oferta === 'ambos'
        )
      default:
        return price > 0
    }
  })

  // Ordenar
  switch (sortBy.value) {
    case 'price-low':
      return filtered.sort((a, b) => (a.precio_sugerido || a.price || 0) - (b.precio_sugerido || b.price || 0))
    case 'price-high':
      return filtered.sort((a, b) => (b.precio_sugerido || b.price || 0) - (a.precio_sugerido || a.price || 0))
    case 'points-low':
      return filtered.sort((a, b) => (a.precio_sugerido || a.price || 0) - (b.precio_sugerido || b.price || 0)) // Los puntos equivalen al precio
    case 'points-high':
      return filtered.sort((a, b) => (b.precio_sugerido || b.price || 0) - (a.precio_sugerido || a.price || 0)) // Los puntos equivalen al precio
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

// Manejar error de imagen
const handleImageError = (event) => {
  const placeholderSrc = 'https://via.placeholder.com/400x300/cccccc/666666?text=Imagen+no+disponible'
  
  // ✅ CORRECCIÓN: Evita el bucle comprobando si ya estamos usando el placeholder
  if (event.target.src !== placeholderSrc) {
    event.target.src = placeholderSrc
  }
}

// Ver artículo
const viewArticle = (article) => {
  // Redirigir a la vista de detalles del artículo
  window.open(`/articulos/${article._id}`, '_blank')
}

// Comprar con dinero
const buyWithMoney = (article) => {
  const price = article.precio_sugerido || article.price
  if (!price || price <= 0) {
    alert('Este artículo no está disponible para compra con dinero')
    return
  }
  
  // Verificar autenticación
  const token = localStorage.getItem('auth_token') || sessionStorage.getItem('auth_token')
  if (!token) {
    alert('Debes iniciar sesión para comprar artículos')
    return
  }
  
  // Agregar al carrito
  addToCart(article)
}

// Funciones del carrito de compra
const addToCart = (article) => {
  const cartItem = {
    id: article._id,
    article: {
      title: article.title,
      description: article.description,
      images: article.images || []
    },
    price: article.price,
    originalArticle: article
  }
  
  // Usar el store del carrito
  const added = cartStore.addItem(cartItem)
  if (added) {
    toast.success(
      '¡Artículo añadido!',
      `"${article.title}" se ha añadido a tu carrito de compra.`,
      { duration: 3000 }
    )
    showCartModal.value = true
  } else {
    toast.warning(
      'Artículo ya en el carrito',
      `"${article.title}" ya está en tu carrito de compra.`,
      { duration: 3000 }
    )
  }
}

const openCart = () => {
  showCartModal.value = true
}

const closeCart = () => {
  showCartModal.value = false
}

const proceedToPayment = () => {
  showCartModal.value = false
  showPaymentModal.value = true
}

const closePayment = () => {
  showPaymentModal.value = false
}

const handlePaymentSuccess = (paymentData) => {
  // Procesar el pago exitoso
  console.log('Pago exitoso:', paymentData)
  
  // Mostrar toast de éxito
  toast.success(
    '¡Pago exitoso!',
    `Se han procesado €${paymentData.amount} por ${paymentData.items.length} artículos. Recibirás una confirmación por email.`,
    { duration: 6000 }
  )
  
  // Limpiar el carrito
  cartStore.clearCart()
  
  // Recargar los artículos
  loadArticles()
  
  closePayment()
}

// Comprar con puntos
const buyWithPoints = (article) => {
  const price = article.precio_sugerido || article.price
  if (!price || price <= 0) {
    toast.warning(
      'Artículo no disponible',
      'Este artículo no está disponible para compra con puntos.',
      { duration: 4000 }
    )
    return
  }
  
  // Verificar autenticación
  const token = localStorage.getItem('auth_token') || sessionStorage.getItem('auth_token')
  if (!token) {
    toast.warning(
      'Inicio de sesión requerido',
      'Debes iniciar sesión para comprar artículos con puntos.',
      { duration: 4000 }
    )
    return
  }
  
  // Mostrar modal de confirmación
  selectedArticleForPoints.value = article
  showPointsConfirmModal.value = true
}

// Cerrar modal de confirmación de puntos
const closePointsConfirmModal = () => {
  showPointsConfirmModal.value = false
  selectedArticleForPoints.value = null
}

// Confirmar compra con puntos
const confirmPointsPurchase = (article) => {
  // Cerrar modal
  closePointsConfirmModal()
  
  // Recargar artículos para actualizar la lista
  loadArticles()
  
  toast.success(
    '¡Compra realizada con éxito!',
    `"${article.title}" se ha añadido a tus canjes.`,
    { duration: 5000 }
  )
}

// Cargar artículos al montar el componente
onMounted(() => {
  loadArticles()
})
</script>