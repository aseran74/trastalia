<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Header -->
    <header class="bg-white shadow-sm">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between items-center py-4">
          <div class="flex items-center">
            <img src="/images/Trastalia3.png" alt="Trastalia" class="h-12 w-auto"/>
          </div>
          <button @click="goBack" class="flex items-center text-gray-600 hover:text-gray-900 transition-colors">
            <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path>
            </svg>
            Volver
          </button>
        </div>
      </div>
    </header>

    <!-- Debug Info -->
    <div class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 m-4 rounded">
      <strong>🔍 Debug Info:</strong> 
      <br>Loading: {{ loading }}
      <br>Article: {{ article ? 'Cargado' : 'No cargado' }}
      <br>Route ID: {{ route.params.id }}
      <br>API URL: {{ API_BASE_URL }}
      <br>Timestamp: {{ new Date().toLocaleTimeString() }}
    </div>

    <!-- Loading -->
    <div v-if="loading" class="flex justify-center items-center min-h-96">
      <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
    </div>

    <!-- Article Content -->
    <div v-else-if="article" class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div class="bg-white rounded-lg shadow-lg overflow-hidden">
        <!-- Image -->
        <div class="aspect-w-16 aspect-h-9">
          <img 
            :src="articleImage" 
            :alt="article.title || article.nombre" 
            class="w-full h-96 object-cover"
            @error="handleImageError"
          />
        </div>
        
        <!-- Content -->
        <div class="p-6">
          <h1 class="text-3xl font-bold text-gray-900 mb-4">
            {{ article.title || article.nombre }}
          </h1>
          
          <p class="text-gray-700 text-lg mb-6">
            {{ article.description || article.descripcion }}
          </p>
          
          <!-- Price -->
          <div class="text-3xl font-bold text-green-600 mb-6">
            {{ formatPrice(article.price || article.precio_propuesto_vendedor) }}
          </div>
          
          <!-- Purchase Options -->
          <div class="bg-gray-50 rounded-lg p-4 mb-6">
            <h3 class="text-lg font-semibold mb-3">Opciones de compra:</h3>
            <div class="space-y-2">
              <div class="flex justify-between items-center">
                <span class="flex items-center text-green-600">
                  <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1"></path>
                  </svg>
                  Dinero
                </span>
                <span class="font-semibold">{{ formatPrice(article.price || article.precio_propuesto_vendedor) }}</span>
              </div>
              <div class="flex justify-between items-center">
                <span class="flex items-center text-blue-600">
                  <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"></path>
                  </svg>
                  Puntos
                </span>
                <span class="font-semibold">{{ formatNumber(article.price || article.precio_propuesto_vendedor) }} pts</span>
              </div>
            </div>
          </div>
          
          <!-- Actions -->
          <div class="flex space-x-4">
            <button 
              @click="loginToBuy"
              class="flex-1 bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
            >
              Iniciar Sesión para Comprar
            </button>
            <button 
              @click="shareArticle"
              class="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-50 transition-colors"
            >
              Compartir
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Error State -->
    <div v-else class="text-center py-12">
      <h3 class="mt-2 text-sm font-medium text-gray-900">Artículo no encontrado</h3>
      <div class="mt-6">
        <button 
          @click="goBack" 
          class="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
        >
          Volver a la lista
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import API_BASE_URL from '@/config/api.js'

const router = useRouter()
const route = useRoute()

const article = ref(null)
const loading = ref(false)
const hasLoaded = ref(false)
const articleImage = ref('')

// Cargar artículo solo una vez
const loadArticle = async () => {
  if (hasLoaded.value) {
    console.log('🚫 Evitando carga duplicada')
    return
  }
  
  hasLoaded.value = true
  loading.value = true
  
  try {
    const articleId = route.params.id
    const url = API_BASE_URL ? `${API_BASE_URL}/api/articles/${articleId}` : `/api/articles/${articleId}`
    
    console.log('🔍 Cargando artículo:', { articleId, url })
    
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      }
    })
    
    if (response.ok) {
      const data = await response.json()
      console.log('✅ Artículo cargado:', data)
      
      if (data.success) {
        article.value = data.data
        // Calcular imagen una sola vez
        articleImage.value = getArticleImage(data.data)
      }
    } else {
      console.error('❌ Error del servidor:', response.status, response.statusText)
    }
  } catch (error) {
    console.error('❌ Error:', error)
  } finally {
    loading.value = false
  }
}

// Funciones auxiliares
const getArticleImage = (article) => {
  // Usar imagen placeholder simple para evitar bucles
  const title = article?.title || article?.nombre || 'Artículo'
  return `https://via.placeholder.com/800x600/cccccc/666666?text=${encodeURIComponent(title)}`
}

const handleImageError = (event) => {
  // Usar placeholder simple si falla la imagen
  event.target.src = 'https://via.placeholder.com/800x600/cccccc/666666?text=Imagen+no+disponible'
}

const formatPrice = (price) => {
  return new Intl.NumberFormat('es-ES', {
    style: 'currency',
    currency: 'EUR'
  }).format(price)
}

const formatNumber = (number) => {
  return new Intl.NumberFormat('es-ES').format(number)
}

const goBack = () => {
  router.back()
}

const loginToBuy = () => {
  router.push('/signin')
}

const shareArticle = () => {
  if (navigator.share) {
    navigator.share({
      title: article.value?.title || article.value?.nombre,
      text: article.value?.description || article.value?.descripcion,
      url: window.location.href
    })
  } else {
    // Fallback: copiar URL al portapapeles
    navigator.clipboard.writeText(window.location.href)
    alert('URL copiada al portapapeles')
  }
}

// Solo cargar una vez al montar
onMounted(() => {
  console.log('🚀 Componente montado, cargando artículo...')
  loadArticle()
})

// Watch para cambios de ruta (opcional)
watch(() => route.params.id, (newId) => {
  if (newId && newId !== route.params.id) {
    hasLoaded.value = false
    loadArticle()
  }
})
</script>