<template>
  <div class="min-h-screen bg-gray-50 p-8">
    <h1 class="text-3xl font-bold mb-4">Vista Detalle Simple</h1>
    
    <div class="bg-blue-100 border border-blue-400 text-blue-700 px-4 py-3 rounded mb-4">
      <strong>Debug Info:</strong> 
      <br>Loading: {{ loading }}
      <br>Article: {{ article ? 'Cargado' : 'No cargado' }}
      <br>Route ID: {{ route.params.id }}
      <br>API URL: {{ API_BASE_URL }}
    </div>

    <div v-if="loading" class="text-center py-8">
      <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
      <p class="mt-4">Cargando artículo...</p>
    </div>

    <div v-else-if="article" class="bg-white rounded-lg shadow-md p-6">
      <h2 class="text-2xl font-bold mb-4">{{ article.title || article.nombre }}</h2>
      <p class="text-gray-600 mb-4">{{ article.description || article.descripcion }}</p>
      <div class="text-xl font-bold text-green-600">
        {{ formatPrice(article.price || article.precio_propuesto_vendedor) }}
      </div>
    </div>

    <div v-else class="text-center py-8">
      <p class="text-red-600">No se pudo cargar el artículo</p>
    </div>

    <button 
      @click="goBack"
      class="mt-4 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
    >
      Volver
    </button>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import API_BASE_URL from '@/config/api.js'

const router = useRouter()
const route = useRoute()

const article = ref(null)
const loading = ref(false)

const loadArticle = async () => {
  console.log('🔍 Iniciando carga de artículo...')
  loading.value = true
  
  try {
    const articleId = route.params.id
    const url = `${API_BASE_URL}/api/articles/${articleId}`
    
    console.log('URL:', url)
    
    const response = await fetch(url)
    const data = await response.json()
    
    console.log('Respuesta:', data)
    
    if (data.success) {
      article.value = data.data
    }
  } catch (error) {
    console.error('Error:', error)
  } finally {
    loading.value = false
  }
}

const formatPrice = (price) => {
  return new Intl.NumberFormat('es-ES', {
    style: 'currency',
    currency: 'EUR'
  }).format(price)
}

const goBack = () => {
  router.go(-1)
}

onMounted(() => {
  loadArticle()
})
</script>
