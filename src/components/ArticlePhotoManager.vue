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

    <!-- Selector de categoría -->
    <div class="mb-6">
      <label class="block text-sm font-medium text-gray-700 mb-2">
        Categoría del artículo
      </label>
      <select
        v-model="selectedCategory"
        @change="searchPhotos"
        class="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
      >
        <option value="">Selecciona una categoría</option>
        <option v-for="category in categories" :key="category" :value="category">
          {{ category.charAt(0).toUpperCase() + category.slice(1) }}
        </option>
      </select>
    </div>

    <!-- Búsqueda de fotos -->
    <div v-if="selectedCategory" class="mb-6">
      <div class="flex gap-4 mb-4">
        <button
          @click="searchPhotos"
          :disabled="loading"
          class="px-6 py-3 bg-gradient-to-r from-green-500 to-teal-600 text-white rounded-xl hover:from-green-600 hover:to-teal-700 transition-all duration-300 shadow-lg hover:shadow-xl disabled:opacity-50"
        >
          🔍 Buscar Fotos
        </button>
        <button
          @click="getRandomPhotos"
          :disabled="loading"
          class="px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-600 text-white rounded-xl hover:from-purple-600 hover:to-pink-700 transition-all duration-300 shadow-lg hover:shadow-xl disabled:opacity-50"
        >
          🎲 Fotos Aleatorias
        </button>
      </div>

      <!-- Grid de fotos de Unsplash -->
      <div v-if="unsplashPhotos.length > 0" class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mb-6">
        <div
          v-for="photo in unsplashPhotos"
          :key="photo.id"
          class="group relative overflow-hidden rounded-xl border-2 border-gray-200 hover:border-blue-500 transition-all duration-300 cursor-pointer"
          @click="selectPhoto(photo)"
        >
          <img
            :src="photo.thumbUrl"
            :alt="photo.altDescription"
            class="w-full h-32 object-cover group-hover:scale-105 transition-transform duration-300"
          />
          <div class="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all duration-300 flex items-center justify-center">
            <div class="opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <button class="bg-blue-500 text-white px-3 py-1 rounded-lg text-sm font-medium">
                Seleccionar
              </button>
            </div>
          </div>
          <div class="absolute top-2 right-2">
            <div class="bg-white bg-opacity-90 px-2 py-1 rounded-lg text-xs font-medium">
              {{ photo.photographer.name }}
            </div>
          </div>
        </div>
      </div>

      <!-- Paginación -->
      <div v-if="pagination.totalPages > 1" class="flex justify-center gap-2 mb-6">
        <button
          v-for="page in pagination.totalPages"
          :key="page"
          @click="goToPage(page)"
          :class="[
            'px-3 py-2 rounded-lg transition-all duration-300',
            page === pagination.page
              ? 'bg-blue-500 text-white shadow-lg'
              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
          ]"
        >
          {{ page }}
        </button>
      </div>
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
            :src="photo.thumbUrl"
            :alt="photo.altDescription"
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
    <div v-if="!loading && articlePhotos.length === 0 && selectedCategory" class="text-center py-8 text-gray-500">
      <div class="text-4xl mb-4">📷</div>
      <p>No hay fotos guardadas para este artículo</p>
      <p class="text-sm">Selecciona fotos de Unsplash para añadirlas</p>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()
const articleId = route.params.id || 'new'

// Estado reactivo
const loading = ref(false)
const selectedCategory = ref('')
const categories = ref([])
const unsplashPhotos = ref([])
const articlePhotos = ref([])
const pagination = ref({
  page: 1,
  perPage: 12,
  total: 0,
  totalPages: 0
})

// API base URL
const getApiUrl = () => {
  return import.meta.env.PROD ? 'https://trastalia.onrender.com' : 'http://localhost:3001'
}

// Cargar categorías
const loadCategories = async () => {
  try {
    const response = await fetch(`${getApiUrl()}/api/photos/categories')
    const data = await response.json()
    if (data.success) {
      categories.value = data.data
    }
  } catch (error) {
    console.error('Error loading categories:', error)
  }
}

// Buscar fotos en Unsplash
const searchPhotos = async () => {
  if (!selectedCategory.value) return
  
  loading.value = true
  try {
    const response = await fetch(
      `${getApiUrl()}/api/photos/search/${selectedCategory.value}?page=${pagination.value.page}&perPage=${pagination.value.perPage}`
    )
    const data = await response.json()
    
    if (data.success) {
      unsplashPhotos.value = data.data
      pagination.value = data.pagination
    }
  } catch (error) {
    console.error('Error searching photos:', error)
  } finally {
    loading.value = false
  }
}

// Obtener fotos aleatorias
const getRandomPhotos = async () => {
  if (!selectedCategory.value) return
  
  loading.value = true
  try {
    const response = await fetch(`${getApiUrl()}/api/photos/random/${selectedCategory.value}?count=8`)
    const data = await response.json()
    
    if (data.success) {
      unsplashPhotos.value = data.data
    }
  } catch (error) {
    console.error('Error getting random photos:', error)
  } finally {
    loading.value = false
  }
}

// Seleccionar foto
const selectPhoto = async (photo) => {
  loading.value = true
  try {
    const response = await fetch(`${getApiUrl()}/api/photos/save`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('authToken')}`
      },
      body: JSON.stringify({
        articleId,
        unsplashId: photo.id,
        url: photo.url,
        thumbUrl: photo.thumbUrl,
        altDescription: photo.altDescription,
        photographer: photo.photographer,
        dimensions: photo.dimensions,
        color: photo.color,
        category: selectedCategory.value,
        tags: photo.tags,
        isPrimary: articlePhotos.value.length === 0 // Primera foto es principal
      })
    })
    
    const data = await response.json()
    if (data.success) {
      await loadArticlePhotos()
      unsplashPhotos.value = unsplashPhotos.value.filter(p => p.id !== photo.id)
    }
  } catch (error) {
    console.error('Error saving photo:', error)
  } finally {
    loading.value = false
  }
}

// Cargar fotos del artículo
const loadArticlePhotos = async () => {
  if (articleId === 'new') return
  
  try {
    const response = await fetch(`${getApiUrl()}/api/photos/article/${articleId}`)
    const data = await response.json()
    
    if (data.success) {
      articlePhotos.value = data.data
    }
  } catch (error) {
    console.error('Error loading article photos:', error)
  }
}

// Marcar como foto principal
const setPrimaryPhoto = async (photoId) => {
  try {
    const response = await fetch(`${getApiUrl()}/api/photos/${photoId}/primary`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('authToken')}`
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
    const response = await fetch(`${getApiUrl()}/api/photos/${photoId}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('authToken')}`
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

// Ir a página
const goToPage = (page) => {
  pagination.value.page = page
  searchPhotos()
}

// Refrescar fotos
const refreshPhotos = () => {
  loadArticlePhotos()
}

// Inicializar
onMounted(() => {
  loadCategories()
  loadArticlePhotos()
})
</script>
