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
            <router-link to="/articulos" class="text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium">
              ← Volver a Artículos
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
      <!-- Loading State -->
      <div v-if="loading" class="flex justify-center py-12">
        <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>

      <!-- Article Detail -->
      <div v-else-if="article" class="bg-white rounded-lg shadow-sm overflow-hidden">
        <!-- Article Image -->
        <div class="aspect-w-16 aspect-h-12 bg-gray-200 relative">
          <img
            :src="getArticleImage(article)"
            :alt="article.title || article.nombre"
            class="w-full h-96 object-cover"
            @error="handleImageError"
          />
        </div>

        <!-- Article Info -->
        <div class="p-8">
          <h1 class="text-3xl font-bold text-gray-900 mb-4">
            {{ article.title || article.nombre }}
          </h1>
          
          <p class="text-gray-600 text-lg mb-6">
            {{ article.description || article.descripcion }}
          </p>

          <!-- Price -->
          <div class="text-4xl font-bold text-green-600 mb-6">
            {{ formatPrice(article.price || article.precio_propuesto_vendedor) }}
          </div>

          <!-- Action Buttons -->
          <div class="space-y-4">
            <button
              @click="loginToBuy"
              class="w-full bg-green-600 text-white py-3 px-6 rounded-md hover:bg-green-700 transition-colors duration-200 flex items-center justify-center text-lg"
            >
              <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-2.5 5M7 13l2.5 5m6-5v6a2 2 0 01-2 2H9a2 2 0 01-2-2v-6m8 0V9a2 2 0 00-2-2H9a2 2 0 00-2 2v4.01"></path>
              </svg>
              Comprar (Requiere Login)
            </button>
          </div>
        </div>
      </div>

      <!-- Error State -->
      <div v-else class="text-center py-12">
        <svg class="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.5 0L4.268 19.5c-.77.833.192 2.5 1.732 2.5z" />
        </svg>
        <h3 class="mt-2 text-sm font-medium text-gray-900">Artículo no encontrado</h3>
        <p class="mt-1 text-sm text-gray-500">No se pudo cargar la información del artículo.</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'

const router = useRouter()
const route = useRoute()

// Estado simple
const article = ref(null)
const loading = ref(false)

// Cargar artículo
const loadArticle = async () => {
  const articleId = route.params.id
  if (!articleId) return

  loading.value = true
  try {
    const response = await fetch(`/api/articles/${articleId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      }
    })
    
    if (response.ok) {
      const data = await response.json()
      article.value = data.data || data
    } else {
      console.error('Error cargando artículo:', response.status)
    }
  } catch (error) {
    console.error('Error cargando artículo:', error)
  } finally {
    loading.value = false
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
  const placeholderSrc = 'https://via.placeholder.com/800x600/cccccc/666666?text=Imagen+no+disponible'
  
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
  return `https://via.placeholder.com/800x600/cccccc/666666?text=${encodeURIComponent(title)}`
}

// Login para comprar
const loginToBuy = () => {
  router.push('/signin')
}

onMounted(() => {
  loadArticle()
})
</script>

<style scoped>
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
