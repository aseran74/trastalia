<template>
  <div class="bg-white rounded-2xl shadow-lg p-6">
    <div class="flex items-center justify-between mb-6">
      <h3 class="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
        📸 Gestión de Fotos
      </h3>
      <button
        @click="refreshPhotos"
        :disabled="loading"
        class="px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-xl hover:from-blue-600 hover:to-purple-700 transition-all duration-300 shadow-lg hover:shadow-xl disabled:opacity-50"
      >
        🔄 Actualizar
      </button>
    </div>

    <!-- Fotos guardadas del artículo -->
    <div v-if="articlePhotos.length > 0" class="mb-6">
      <h4 class="text-lg font-semibold text-gray-800 mb-4">Fotos del artículo</h4>
      <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        <div
          v-for="photo in articlePhotos"
          :key="photo._id"
          class="group relative overflow-hidden rounded-xl border-2 transition-all duration-300"
          :class="photo.isPrimary ? 'border-yellow-500 bg-yellow-50' : 'border-gray-200'"
        >
          <img
            :src="photo.thumbUrl || photo.url"
            :alt="photo.altDescription || 'Foto del artículo'"
            class="w-full h-32 object-cover"
          />
          <div class="p-3">
            <div class="flex items-center justify-between">
              <span v-if="photo.isPrimary" class="text-xs font-medium text-yellow-600 bg-yellow-100 px-2 py-1 rounded">
                ⭐ Principal
              </span>
              <div class="flex gap-1">
                <button
                  v-if="!photo.isPrimary"
                  @click="setPrimaryPhoto(photo._id)"
                  class="text-xs bg-blue-500 text-white px-2 py-1 rounded hover:bg-blue-600 transition-colors"
                >
                  ⭐
                </button>
                <button
                  @click="deletePhoto(photo._id)"
                  class="text-xs bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600 transition-colors"
                >
                  🗑️
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Loading -->
    <div v-if="loading" class="flex items-center justify-center py-8">
      <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
      <span class="ml-3 text-gray-600">Cargando fotos...</span>
    </div>

    <!-- Mensaje cuando no hay fotos -->
    <div v-if="!loading && articlePhotos.length === 0" class="text-center py-8 text-gray-500">
      <div class="text-4xl mb-4">📷</div>
      <p>No hay fotos guardadas para este artículo</p>
      <p class="text-sm">Las fotos se pueden añadir desde el script de carga o desde el backend</p>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import getApiUrl from '@/config/api'

const route = useRoute()
const articleId = route.params.id || 'new'

// Estado reactivo
const loading = ref(false)
const articlePhotos = ref([])

// Cargar fotos del artículo
const loadArticlePhotos = async () => {
  if (articleId === 'new') return
  
  loading.value = true
  try {
    const response = await fetch(`${getApiUrl()}/api/photos/article/${articleId}`)
    const data = await response.json()
    
    if (data.success) {
      articlePhotos.value = data.data
    }
  } catch (error) {
    console.error('Error loading article photos:', error)
  } finally {
    loading.value = false
  }
}

// Marcar como foto principal
const setPrimaryPhoto = async (photoId) => {
  try {
    const token = localStorage.getItem('auth_token') || sessionStorage.getItem('auth_token')
    const response = await fetch(`${getApiUrl()}/api/photos/${photoId}/primary`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })
    
    const data = await response.json()
    if (data.success) {
      await loadArticlePhotos()
    }
  } catch (error) {
    console.error('Error setting primary photo:', error)
  }
}

// Eliminar foto
const deletePhoto = async (photoId) => {
  if (!confirm('¿Estás seguro de que quieres eliminar esta foto?')) return
  
  try {
    const token = localStorage.getItem('auth_token') || sessionStorage.getItem('auth_token')
    const response = await fetch(`${getApiUrl()}/api/photos/${photoId}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })
    
    const data = await response.json()
    if (data.success) {
      await loadArticlePhotos()
    }
  } catch (error) {
    console.error('Error deleting photo:', error)
  }
}

// Refrescar fotos
const refreshPhotos = () => {
  loadArticlePhotos()
}

// Inicializar
onMounted(() => {
  loadArticlePhotos()
})
</script>
