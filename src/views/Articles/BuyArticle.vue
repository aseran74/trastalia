<template>
  <AdminLayout>
    <div class="mx-auto max-w-screen-2xl p-4 md:p-6 2xl:p-10">
      <!-- Breadcrumb -->
      <BreadcrumbNav />
      
      <!-- Header -->
      <div class="mb-6">
        <div class="flex justify-between items-start">
          <div>
            <h1 class="text-3xl font-bold text-black dark:text-white">
              Comprar Artículos
            </h1>
            <p class="text-gray-600 dark:text-gray-400">
              Artículos disponibles para compra con dinero o puntos
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
      <div v-if="loading" class="flex justify-center py-8">
        <div class="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
      </div>

      <!-- Artículos -->
      <div v-else-if="filteredArticles.length > 0" class="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        <div 
          v-for="article in filteredArticles" 
          :key="article._id"
          class="rounded-sm border border-stroke bg-white p-6 shadow-default dark:border-strokedark dark:bg-boxdark"
        >
          <!-- Imagen del artículo -->
          <div class="mb-4 h-48 overflow-hidden rounded-lg bg-gray-100 dark:bg-gray-800">
            <img 
              :src="getImageUrl(article)" 
              :alt="article.title"
              class="h-full w-full object-cover"
              @error="handleImageError"
            />
          </div>

          <!-- Información del artículo -->
          <div class="mb-4">
            <h3 class="mb-2 text-lg font-semibold text-black dark:text-white">
              <router-link 
                :to="`/articulo/${article._id}`" 
                class="hover:text-primary transition-colors"
              >
                {{ article.title }}
              </router-link>
            </h3>
            <p class="mb-3 text-sm text-gray-600 dark:text-gray-400 line-clamp-3">
              {{ article.description }}
            </p>
            
            <!-- Precio -->
            <div v-if="article.price > 0" class="mb-3 flex items-center justify-between">
              <span class="text-sm text-gray-600 dark:text-gray-400">Precio:</span>
              <span class="text-lg font-bold text-green-600">{{ article.price }}€</span>
            </div>

            <!-- Ubicación -->
            <div class="mb-3 flex items-center text-sm text-gray-600 dark:text-gray-400">
              <svg class="mr-2 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path>
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path>
              </svg>
              {{ article.location }}
            </div>

            <!-- Vendedor -->
            <div class="mb-4 flex items-center text-sm text-gray-600 dark:text-gray-400">
              <svg class="mr-2 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
              </svg>
              {{ article.seller?.name || 'Usuario' }}
            </div>
          </div>

          <!-- Botones de acción -->
          <div class="space-y-2">
            <div class="flex space-x-2">
              <button
                v-if="article.price > 0"
                @click="buyWithMoney(article)"
                class="flex-1 rounded bg-green-600 px-4 py-2 text-sm font-medium text-white hover:bg-green-700"
              >
                Comprar con Dinero
              </button>
              <button
                v-if="article.pointsPrice > 0"
                @click="buyWithPoints(article)"
                class="flex-1 rounded bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
              >
                Comprar con Puntos
              </button>
            </div>
            <router-link
              :to="`/articulo/${article._id}`"
              class="block w-full rounded border border-stroke bg-transparent px-4 py-2 text-center text-sm font-medium text-gray-700 hover:bg-gray-50 dark:border-strokedark dark:text-gray-300 dark:hover:bg-gray-800"
            >
              Ver Detalle
            </router-link>
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
  </AdminLayout>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useCartStore } from '@/stores/cart'
import { useToast } from '@/composables/useToast'
import AdminLayout from '@/components/layout/AdminLayout.vue'
import BreadcrumbNav from '@/components/BreadcrumbNav.vue'
import ShoppingCartModal from '@/components/modals/ShoppingCartModal.vue'
import PaymentModal from '@/components/modals/PaymentModal.vue'
import { getSupabaseImageUrl, getImageByCategory } from '@/config/supabase'

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

// Cargar artículos
const loadArticles = async () => {
  loading.value = true
  try {
    const token = localStorage.getItem('auth_token') || sessionStorage.getItem('auth_token')
    const response = await fetch('http://localhost:3002/api/articles', {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })
    
    if (response.ok) {
      const data = await response.json()
      articles.value = data.data || []
    } else {
      console.error('Error cargando artículos:', response.statusText)
    }
  } catch (error) {
    console.error('Error cargando artículos:', error)
  } finally {
    loading.value = false
  }
}

// Filtrar artículos
const filteredArticles = computed(() => {
  let filtered = articles.value.filter(article => {
    // Filtrar por tipo de venta
    switch (filterType.value) {
      case 'money':
        return article.price > 0
      case 'points':
        return article.price > 0 // Los puntos equivalen al precio en dinero
      case 'both':
        return article.price > 0 // Si tiene precio, se puede comprar con dinero o puntos
      default:
        return article.price > 0
    }
  })

  // Ordenar
  switch (sortBy.value) {
    case 'price-low':
      return filtered.sort((a, b) => (a.price || 0) - (b.price || 0))
    case 'price-high':
      return filtered.sort((a, b) => (b.price || 0) - (a.price || 0))
    case 'points-low':
      return filtered.sort((a, b) => (a.price || 0) - (b.price || 0)) // Los puntos equivalen al precio
    case 'points-high':
      return filtered.sort((a, b) => (b.price || 0) - (a.price || 0)) // Los puntos equivalen al precio
    default:
      return filtered.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
  }
})

// Comprar con dinero
const buyWithMoney = (article) => {
  if (!article.price || article.price <= 0) {
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
  if (!article.price || article.price <= 0) {
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
  
  // Los puntos equivalen al valor en dinero (1 punto = 1€)
  const pointsNeeded = article.price
  
  // Simular compra con puntos
  toast.success(
    '¡Compra con puntos!',
    `"${article.title}" se ha comprado por ${pointsNeeded} puntos. Los puntos se han descontado de tu balance.`,
    { duration: 5000 }
  )
}

// Función para obtener la URL de imagen
const getImageUrl = (article) => {
  console.log('🔍 Debug getImageUrl:', {
    article: article.title,
    image: article.image,
    images: article.images,
    category: article.category
  })
  
  // Si el artículo tiene imagen principal, usar la función de Supabase
  if (article.image) {
    const url = getSupabaseImageUrl(article.image)
    console.log('📸 Usando imagen principal:', url.substring(0, 100) + '...')
    return url
  }
  
  // Si tiene imágenes en array, usar la primera
  if (article.images && article.images.length > 0) {
    const url = getSupabaseImageUrl(article.images[0])
    console.log('📸 Usando primera imagen del array:', url.substring(0, 100) + '...')
    return url
  }
  
  // Si no tiene imagen, usar imagen basada en categoría
  const fallbackUrl = getImageByCategory(article.category)
  console.log('📸 Usando imagen de categoría:', fallbackUrl)
  return fallbackUrl
}

// Manejar error de imagen
const handleImageError = (event) => {
  console.log('Error cargando imagen:', event.target.src)
  event.target.style.display = 'none'
}

// Cargar artículos al montar el componente
onMounted(() => {
  loadArticles()
})
</script>
