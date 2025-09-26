<template>
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
            <h4 class="text-sm font-medium text-primary mb-2">Información de Transferencia</h4>
            <div class="space-y-1 text-sm">
              <div class="flex justify-between">
                <span class="text-primary/80">Tipo:</span>
                <span class="font-medium text-primary">
                  {{ article.transferencia_original?.tipo === 'money' ? 'Dinero' : 'Puntos' }}
                </span>
              </div>
              <div class="flex justify-between">
                <span class="text-primary/80">Valor:</span>
                <span class="font-medium text-primary">
                  {{ article.transferencia_original?.tipo === 'money' 
                    ? `${article.transferencia_original?.precio}€` 
                    : `${article.transferencia_original?.puntos} puntos` }}
                </span>
              </div>
              <div class="flex justify-between">
                <span class="text-primary/80">Fecha:</span>
                <span class="text-primary">
                  {{ formatDate(article.transferencia_original?.fecha) }}
                </span>
              </div>
            </div>
          </div>

          <!-- Price Valuation Form -->
          <div class="space-y-3">
            <div>
              <label class="block text-sm font-medium text-black dark:text-white mb-1">
                Precio de Venta (€)
              </label>
              <input
                v-model="priceForms[article._id].storePrice"
                type="number"
                step="0.01"
                min="0"
                class="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
                placeholder="0.00"
              />
            </div>
            
            <div>
              <label class="block text-sm font-medium text-black dark:text-white mb-1">
                Precio en Puntos
              </label>
              <input
                v-model="priceForms[article._id].storePoints"
                type="number"
                min="0"
                class="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
                placeholder="0"
              />
            </div>

            <button
              @click="setStorePrice(article._id)"
              :disabled="!priceForms[article._id].storePrice && !priceForms[article._id].storePoints"
              class="w-full bg-primary text-white py-3 px-4 rounded-md hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors duration-200"
            >
              Establecer Precio de Tienda
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, reactive } from 'vue'
import { useAuthStore } from '@/stores/auth'
import ToastContainer from '@/components/ui/ToastContainer.vue'

const authStore = useAuthStore()
const articles = ref([])
const loading = ref(false)
const priceForms = reactive({})

// Cargar artículos pendientes de valoración
const loadPendingArticles = async () => {
  loading.value = true
  try {
    const response = await fetch('/api/articles/pending-price-valuation', {
      headers: {
        'Authorization': `Bearer ${authStore.token}`
      }
    })
    
    if (response.ok) {
      const data = await response.json()
      articles.value = data.data || []
      
      // Inicializar formularios de precio para cada artículo
      articles.value.forEach(article => {
        priceForms[article._id] = {
          storePrice: '',
          storePoints: ''
        }
      })
    } else {
      console.error('Error cargando artículos pendientes')
    }
  } catch (error) {
    console.error('Error:', error)
  } finally {
    loading.value = false
  }
}

// Establecer precio de tienda
const setStorePrice = async (articleId) => {
  const form = priceForms[articleId]
  
  if (!form.storePrice && !form.storePoints) {
    alert('Debe especificar al menos un precio (dinero o puntos)')
    return
  }
  
  try {
    const response = await fetch('/api/articles/set-store-price', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${authStore.token}`
      },
      body: JSON.stringify({
        articleId,
        storePrice: parseFloat(form.storePrice) || 0,
        storePoints: parseInt(form.storePoints) || 0
      })
    })
    
    if (response.ok) {
      const data = await response.json()
      alert(data.message)
      
      // Recargar la lista
      await loadPendingArticles()
    } else {
      const error = await response.json()
      alert(error.message || 'Error al establecer el precio')
    }
  } catch (error) {
    console.error('Error:', error)
    alert('Error al establecer el precio')
  }
}

// Formatear fecha
const formatDate = (dateString) => {
  if (!dateString) return 'N/A'
  return new Date(dateString).toLocaleDateString('es-ES', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

// Manejar error de imagen
const handleImageError = (event) => {
  event.target.style.display = 'none'
}

onMounted(() => {
  loadPendingArticles()
})
</script>

<style scoped>
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>
