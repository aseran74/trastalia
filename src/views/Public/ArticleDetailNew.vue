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
          <!-- Article Image -->
          <div class="aspect-video bg-gray-200 relative">
            <img
              :src="articleImage"
              :alt="article.title || article.nombre"
              class="w-full h-full object-cover"
            />
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

const router = useRouter()
const route = useRoute()
const authStore = useAuthStore()

// Estado
const article = ref(null)
const loading = ref(false)

// Computed
const isAuthenticated = computed(() => authStore.isAuthenticated)
const isAdmin = computed(() => authStore.user?.role === 'admin')

// Imagen del artículo - versión simplificada sin manejo de errores
const articleImage = computed(() => {
  if (!article.value) return 'images/placeholder.jpg'
  
  // Priorizar fotos (campo principal) sobre images (compatibilidad)
  const firstImage = article.value.fotos?.[0] || article.value.images?.[0]
  return firstImage || 'images/placeholder.jpg'
})

// Cargar artículo desde MongoDB
const loadArticle = async () => {
  const articleId = route.params.id
  if (!articleId) return

  loading.value = true
  try {
    const response = await fetch(`/api/articles/${articleId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      }
    })

    if (response.ok) {
      const data = await response.json()
      if (data.success) {
        article.value = data.data
        console.log('✅ Artículo cargado:', data.data)
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

// Lifecycle
onMounted(() => {
  loadArticle()
})
</script>
