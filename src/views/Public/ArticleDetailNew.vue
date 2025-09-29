<template>
  <div class="min-h-screen bg-gray-50 py-8">
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
              <div class="flex space-x-4 pt-4">
                <button
                  v-if="!isAuthenticated"
                  @click="loginToBuy"
                  class="flex-1 bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
                >
                  Iniciar Sesión para Comprar
                </button>
                <button
                  v-else
                  @click="buyArticle"
                  class="flex-1 bg-green-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-green-700 transition-colors"
                >
                  Comprar Artículo
                </button>
                <button
                  v-if="isAdmin"
                  @click="editArticle"
                  class="bg-gray-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-gray-700 transition-colors"
                >
                  Editar
                </button>
              </div>
              
              <!-- Botón temporal para añadir imágenes de prueba -->
              <div class="mt-4 pt-4 border-t">
                <button
                  @click="addTestImages"
                  :disabled="addingImages"
                  class="bg-yellow-500 text-white px-4 py-2 rounded-lg text-sm hover:bg-yellow-600 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
                >
                  {{ addingImages ? '⏳ Añadiendo...' : '🖼️ Añadir Imágenes de Prueba' }}
                </button>
                <p class="text-xs text-gray-500 mt-1">Temporal: Añade imágenes de ejemplo para probar</p>
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
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import API_BASE_URL from '@/config/api.js'

const router = useRouter()
const route = useRoute()
const authStore = useAuthStore()

// Estado
const article = ref(null)
const loading = ref(false)
const addingImages = ref(false)
const currentImageIndex = ref(0)

// Computed
const isAuthenticated = computed(() => authStore.isAuthenticated)
const isAdmin = computed(() => authStore.user?.role === 'admin')

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

const buyArticle = () => {
  // Implementar lógica de compra
  console.log('Comprando artículo:', article.value?.id)
}

const editArticle = () => {
  router.push(`/admin/articulos/${article.value?.id}/editar`)
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

// Función temporal para añadir imágenes de prueba
const addTestImages = async () => {
  console.log('🖼️ Botón clickeado - Iniciando proceso...')
  console.log('📄 Article data:', article.value)
  console.log('🆔 Article ID:', article.value?._id)
  
  if (!article.value?._id) {
    console.error('❌ No hay ID de artículo disponible')
    return
  }
  
  addingImages.value = true
  
  try {
    const apiUrl = `${API_BASE_URL}/api/articles/${article.value._id}/add-images`
    console.log('🌐 API URL:', apiUrl)
    console.log('🔧 API_BASE_URL:', API_BASE_URL)
    
    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      }
    })
    
    console.log('📡 Response status:', response.status)
    console.log('📡 Response ok:', response.ok)
    
    if (response.ok) {
      const data = await response.json()
      console.log('📄 Response data:', data)
      
      if (data.success) {
        console.log('✅ Imágenes añadidas exitosamente:', data.data)
        // Recargar el artículo para mostrar las nuevas imágenes
        console.log('🔄 Recargando artículo...')
        await loadArticle()
        console.log('✅ Artículo recargado')
      } else {
        console.error('❌ Error en respuesta:', data.message)
      }
    } else {
      const errorText = await response.text()
      console.error('❌ Error HTTP:', response.status, errorText)
    }
  } catch (error) {
    console.error('❌ Error en fetch:', error)
  } finally {
    addingImages.value = false
  }
}

// Lifecycle
onMounted(() => {
  loadArticle()
})
</script>
