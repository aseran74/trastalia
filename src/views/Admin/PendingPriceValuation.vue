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
          <ToastContainer />
          <div class="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <h2 class="text-title-md2 font-semibold text-black dark:text-white">
              Artículos Pendientes de Valoración
            </h2>
          </div>
          
          <div class="mb-6 rounded-sm border border-stroke bg-white p-4 shadow-default dark:border-strokedark dark:bg-boxdark">
            <p class="text-gray-600 dark:text-gray-300">
              Artículos transferidos a Trastalia que necesitan precio de venta en tienda
            </p>
          </div>

          <!-- Loading state -->
          <div v-if="loading" class="rounded-sm border border-stroke bg-white p-4 shadow-default dark:border-strokedark dark:bg-boxdark">
            <div class="flex justify-center items-center py-12">
              <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            </div>
          </div>

          <!-- Empty state -->
          <div v-else-if="articles.length === 0" class="rounded-sm border border-stroke bg-white p-4 shadow-default dark:border-strokedark dark:bg-boxdark">
            <div class="text-center py-12">
              <div class="text-gray-400 dark:text-gray-500 mb-4">
                <svg class="mx-auto h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <h3 class="text-lg font-medium text-black dark:text-white mb-2">No hay artículos pendientes</h3>
              <p class="text-gray-500 dark:text-gray-400">Todos los artículos transferidos ya tienen precio de tienda establecido.</p>
            </div>
          </div>

          <!-- Articles list -->
          <div v-else class="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            <div 
              v-for="article in articles" 
              :key="article._id"
              class="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark overflow-hidden hover:shadow-lg transition-shadow duration-200"
            >
              <!-- Article Image -->
              <div class="aspect-w-16 aspect-h-9 bg-gray-200 dark:bg-gray-700">
                <img 
                  v-if="article.images && article.images.length > 0"
                  :src="article.images[0]" 
                  :alt="article.title || article.nombre"
                  class="w-full h-48 object-cover"
                  @error="handleImageError"
                />
                <div v-else class="w-full h-48 bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
                  <svg class="h-12 w-12 text-gray-400 dark:text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
              </div>

              <!-- Article Content -->
              <div class="p-4">
                <h3 class="text-lg font-semibold text-black dark:text-white mb-2 line-clamp-2">
                  {{ article.title || article.nombre }}
                </h3>
                
                <p class="text-gray-600 dark:text-gray-300 text-sm mb-3 line-clamp-2">
                  {{ article.description || article.descripcion }}
                </p>

                <!-- Transfer Info -->
                <div class="bg-primary/10 border border-primary/20 rounded-lg p-3 mb-4">
                  <h4 class="text-sm font-semibold text-primary mb-2">Información de Transferencia</h4>
                  <div class="space-y-1 text-xs text-gray-600 dark:text-gray-300">
                    <p><span class="font-medium">Vendedor:</span> {{ article.transferencia_original?.vendedor?.email || 'N/A' }}</p>
                    <p><span class="font-medium">Tipo:</span> {{ article.transferencia_original?.tipo || 'N/A' }}</p>
                    <p><span class="font-medium">Fecha:</span> {{ formatDate(article.transferencia_original?.fecha) }}</p>
                  </div>
                </div>

                <!-- Price Setting Form -->
                <div class="space-y-3">
                  <div>
                    <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Precio de Venta (€)
                    </label>
                    <input
                      v-model="article.storePrice"
                      type="number"
                      step="0.01"
                      min="0"
                      class="w-full rounded border border-stroke bg-transparent px-3 py-2 text-sm dark:border-strokedark"
                      placeholder="0.00"
                    />
                  </div>
                  
                  <div>
                    <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Puntos de Venta
                    </label>
                    <input
                      v-model="article.storePoints"
                      type="number"
                      min="0"
                      class="w-full rounded border border-stroke bg-transparent px-3 py-2 text-sm dark:border-strokedark"
                      placeholder="0"
                    />
                  </div>
                  
                  <button
                    @click="setStorePrice(article)"
                    :disabled="!article.storePrice && !article.storePoints"
                    class="w-full bg-primary hover:bg-primary/90 disabled:bg-gray-300 disabled:cursor-not-allowed text-white py-2 px-4 rounded-md text-sm font-semibold transition-colors"
                  >
                    Establecer Precio de Tienda
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useAuthStore } from '@/stores/auth'
import ToastContainer from '@/components/ui/ToastContainer.vue'
import AppSidebar from '@/components/layout/AppSidebar.vue'
import AppHeader from '@/components/layout/AppHeader.vue'
import Backdrop from '@/components/layout/Backdrop.vue'
import { useSidebar } from '@/composables/useSidebar'

// Sidebar logic
const { isExpanded, isHovered } = useSidebar()

const authStore = useAuthStore()
const articles = ref([])
const loading = ref(false)

// Cargar artículos pendientes de valoración
const loadArticles = async () => {
  loading.value = true
  try {
    const token = localStorage.getItem('auth_token') || sessionStorage.getItem('auth_token')
    const response = await fetch(`${import.meta.env.VITE_API_URL}/api/articles/pending-price-valuation`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    })
    
    if (response.ok) {
      const data = await response.json()
      articles.value = data.data || []
      console.log('📦 Artículos pendientes cargados:', articles.value.length)
    } else {
      console.error('Error cargando artículos pendientes:', response.statusText)
    }
  } catch (error) {
    console.error('Error:', error)
  } finally {
    loading.value = false
  }
}

// Establecer precio de tienda
const setStorePrice = async (article) => {
  try {
    const token = localStorage.getItem('auth_token') || sessionStorage.getItem('auth_token')
    const response = await fetch(`${import.meta.env.VITE_API_URL}/api/articles/set-store-price`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        articleId: article._id,
        storePrice: parseFloat(article.storePrice) || 0,
        storePoints: parseInt(article.storePoints) || 0
      })
    })
    
    if (response.ok) {
      const data = await response.json()
      console.log('✅ Precio establecido:', data.message)
      // Recargar artículos
      await loadArticles()
    } else {
      const errorData = await response.json()
      console.error('Error estableciendo precio:', errorData.message)
    }
  } catch (error) {
    console.error('Error:', error)
  }
}

// Formatear fecha
const formatDate = (dateString) => {
  if (!dateString) return 'N/A'
  return new Date(dateString).toLocaleDateString('es-ES')
}

// Manejar error de imagen
const handleImageError = (event) => {
  event.target.style.display = 'none'
}

onMounted(() => {
  loadArticles()
})
</script>