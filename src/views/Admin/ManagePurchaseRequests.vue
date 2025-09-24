<template>
  <div class="mx-auto max-w-screen-2xl p-4 md:p-6 2xl:p-10">
    <ToastContainer />
    <div class="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      <h2 class="text-title-md2 font-semibold text-black dark:text-white">
        Gestionar Solicitudes de Compra
      </h2>
    </div>

    <!-- Filtros -->
    <div class="mb-6 rounded-sm border border-stroke bg-white p-4 shadow-default dark:border-strokedark dark:bg-boxdark">
      <div class="grid grid-cols-1 gap-4 md:grid-cols-3">
        <div>
          <label class="mb-2.5 block text-black dark:text-white">Estado</label>
          <select v-model="filters.estado" class="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary">
            <option value="">Todos los estados</option>
            <option value="pending">Pendiente de Revisión</option>
            <option value="approved_money">Aprobado (Dinero)</option>
            <option value="approved_points">Aprobado (Puntos)</option>
            <option value="approved_both">Aprobado (Ambas opciones)</option>
            <option value="rejected">Rechazado</option>
          </select>
        </div>
        <div>
          <label class="mb-2.5 block text-black dark:text-white">Categoría</label>
          <select v-model="filters.categoria" class="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary">
            <option value="">Todas las categorías</option>
            <option value="tecnologia">Tecnología</option>
            <option value="hogar">Hogar</option>
            <option value="deportes">Deportes</option>
            <option value="moda">Moda</option>
            <option value="juegos">Juegos</option>
            <option value="libros">Libros</option>
            <option value="mascotas">Mascotas</option>
            <option value="otros">Otros</option>
          </select>
        </div>
        <div class="flex items-end">
          <button @click="loadArticles" class="w-full rounded bg-primary py-3 px-6 font-medium text-gray hover:bg-opacity-90">
            Filtrar
          </button>
        </div>
      </div>
    </div>

    <!-- Lista de artículos -->
    <div v-if="loading" class="text-center py-8">
      <div class="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-r-transparent motion-reduce:animate-[spin_1.5s_linear_infinite]"></div>
      <p class="mt-2 text-gray-600 dark:text-gray-400">Cargando artículos...</p>
    </div>

    <div v-else-if="filteredArticles.length === 0" class="text-center py-8">
      <p class="text-gray-600 dark:text-gray-400">No hay artículos que coincidan con los filtros.</p>
    </div>

    <div v-else class="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
      <div 
        v-for="article in filteredArticles" 
        :key="article._id"
        class="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark"
      >
        <!-- Imagen del artículo -->
        <div class="aspect-w-16 aspect-h-9 bg-gray-200 dark:bg-gray-700 rounded-t-sm">
          <img 
            v-if="article.images && article.images.length > 0"
            :src="article.images[0]" 
            :alt="article.title"
            class="w-full h-48 object-cover rounded-t-sm"
          />
          <div v-else class="w-full h-48 flex items-center justify-center text-gray-500">
            <span>Sin imagen</span>
          </div>
        </div>

        <!-- Información del artículo -->
        <div class="p-4">
          <h3 class="text-lg font-semibold text-black dark:text-white mb-2">
            {{ article.title }}
          </h3>
          
          <p class="text-sm text-gray-600 dark:text-gray-400 mb-3 line-clamp-2">
            {{ article.description }}
          </p>

          <div class="space-y-2 mb-4">
            <div class="flex justify-between text-sm">
              <span class="text-gray-600 dark:text-gray-400">Precio sugerido:</span>
              <span class="font-semibold text-black dark:text-white">€{{ article.price }}</span>
            </div>
            
            <div class="flex justify-between text-sm">
              <span class="text-gray-600 dark:text-gray-400">Categoría:</span>
              <span class="capitalize">{{ article.category }}</span>
            </div>
            
            <div class="flex justify-between text-sm">
              <span class="text-gray-600 dark:text-gray-400">Condición:</span>
              <span class="capitalize">{{ article.condition }}</span>
            </div>
            
            <div class="flex justify-between text-sm">
              <span class="text-gray-600 dark:text-gray-400">Ubicación:</span>
              <span class="capitalize">{{ article.location || 'No especificada' }}</span>
            </div>
            
            <div class="flex justify-between text-sm">
              <span class="text-gray-600 dark:text-gray-400">Estado:</span>
              <span 
                class="px-2 py-1 rounded text-xs font-medium"
                :class="getEstadoClass(article.adminStatus)"
              >
                {{ getEstadoText(article.adminStatus) }}
              </span>
            </div>
          </div>

          <!-- Información del vendedor -->
          <div class="border-t border-stroke dark:border-strokedark pt-3 mb-4">
            <div class="flex items-center space-x-3">
              <div class="w-8 h-8 bg-primary rounded-full flex items-center justify-center text-white text-sm font-semibold">
                {{ article.seller.name.charAt(0).toUpperCase() }}
              </div>
              <div>
                <p class="text-sm font-medium text-black dark:text-white">{{ article.seller.name }}</p>
                <p class="text-xs text-gray-600 dark:text-gray-400">{{ article.seller.email }}</p>
              </div>
            </div>
          </div>

          <!-- Oferta del administrador (si existe) -->
          <div v-if="article.oferta_admin && article.oferta_admin.precio_ofertado" class="border-t border-stroke dark:border-strokedark pt-3 mb-4">
            <h4 class="text-sm font-semibold text-black dark:text-white mb-2">Oferta del Administrador</h4>
            <div class="space-y-1 text-sm">
              <div v-if="article.oferta_admin.precio_ofertado" class="flex justify-between">
                <span class="text-gray-600 dark:text-gray-400">Precio ofertado:</span>
                <span class="font-semibold text-green-600">€{{ article.oferta_admin.precio_ofertado }}</span>
              </div>
              <div v-if="article.oferta_admin.puntos_ofertados" class="flex justify-between">
                <span class="text-gray-600 dark:text-gray-400">Puntos ofertados:</span>
                <span class="font-semibold text-blue-600">{{ article.oferta_admin.puntos_ofertados.toLocaleString() }}</span>
              </div>
              <div class="flex justify-between">
                <span class="text-gray-600 dark:text-gray-400">Estado:</span>
                <span 
                  class="px-2 py-1 rounded text-xs font-medium"
                  :class="getOfertaEstadoClass(article.oferta_admin.estado_oferta)"
                >
                  {{ getOfertaEstadoText(article.oferta_admin.estado_oferta) }}
                </span>
              </div>
            </div>
          </div>

          <!-- Acciones -->
          <div class="flex space-x-2">
            <button
              v-if="article.adminStatus === 'pending'"
              @click="createOffer(article)"
              class="flex-1 rounded bg-primary py-2 px-3 text-sm font-medium text-gray hover:bg-opacity-90"
            >
              Crear Oferta
            </button>
            
            <button
              v-if="article.adminStatus === 'approved_money' || article.adminStatus === 'approved_points' || article.adminStatus === 'approved_both'"
              @click="viewDetails(article)"
              class="flex-1 rounded border border-stroke py-2 px-3 text-sm font-medium text-black hover:bg-gray-50 dark:border-strokedark dark:text-white dark:hover:bg-boxdark"
            >
              Ver Detalles
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Modal para crear oferta -->
    <div v-if="showOfferModal" class="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div class="bg-white dark:bg-boxdark rounded-lg p-6 w-full max-w-md mx-4">
        <h3 class="text-lg font-semibold text-black dark:text-white mb-4">
          Crear Oferta para {{ selectedArticle?.title }}
        </h3>
        
        <form @submit.prevent="submitOffer">
          <div class="mb-4">
            <label class="mb-2 block text-sm font-medium text-black dark:text-white">
              Tipo de oferta
            </label>
            <div class="space-y-2">
              <label class="flex items-center space-x-2">
                <input
                  type="radio"
                  v-model="offerData.tipo_oferta"
                  value="dinero"
                  class="h-4 w-4 text-primary"
                />
                <span class="text-sm text-black dark:text-white">Solo dinero</span>
              </label>
              <label class="flex items-center space-x-2">
                <input
                  type="radio"
                  v-model="offerData.tipo_oferta"
                  value="puntos"
                  class="h-4 w-4 text-primary"
                />
                <span class="text-sm text-black dark:text-white">Solo puntos</span>
              </label>
              <label class="flex items-center space-x-2">
                <input
                  type="radio"
                  v-model="offerData.tipo_oferta"
                  value="ambos"
                  class="h-4 w-4 text-primary"
                />
                <span class="text-sm text-black dark:text-white">Ambas opciones</span>
              </label>
            </div>
          </div>

          <div v-if="offerData.tipo_oferta === 'dinero' || offerData.tipo_oferta === 'ambos'" class="mb-4">
            <label class="mb-2 block text-sm font-medium text-black dark:text-white">
              Precio ofertado (€)
            </label>
            <input
              v-model.number="offerData.precio_ofertado"
              type="number"
              min="0"
              step="0.01"
              class="w-full rounded border-[1.5px] border-stroke bg-transparent py-2 px-3 font-medium outline-none transition focus:border-primary dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
            />
          </div>

          <div v-if="offerData.tipo_oferta === 'puntos' || offerData.tipo_oferta === 'ambos'" class="mb-4">
            <label class="mb-2 block text-sm font-medium text-black dark:text-white">
              Puntos ofertados
            </label>
            <input
              v-model.number="offerData.puntos_ofertados"
              type="number"
              min="0"
              class="w-full rounded border-[1.5px] border-stroke bg-transparent py-2 px-3 font-medium outline-none transition focus:border-primary dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
            />
          </div>

          <div class="mb-4">
            <label class="mb-2 block text-sm font-medium text-black dark:text-white">
              Comentarios
            </label>
            <textarea
              v-model="offerData.comentarios"
              rows="3"
              class="w-full rounded border-[1.5px] border-stroke bg-transparent py-2 px-3 font-medium outline-none transition focus:border-primary dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
              placeholder="Comentarios sobre la oferta..."
            ></textarea>
          </div>

          <div class="flex justify-end space-x-3">
            <button
              type="button"
              @click="closeOfferModal"
              class="rounded border border-stroke py-2 px-4 text-sm font-medium text-black hover:bg-gray-50 dark:border-strokedark dark:text-white dark:hover:bg-boxdark"
            >
              Cancelar
            </button>
            <button
              type="submit"
              :disabled="loading"
              class="rounded bg-primary py-2 px-4 text-sm font-medium text-gray hover:bg-opacity-90 disabled:opacity-50"
            >
              Crear Oferta
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { useToast } from '@/composables/useToast'
import ToastContainer from '@/components/ui/ToastContainer.vue'

const authStore = useAuthStore()
const toast = useToast()

const articles = ref([])
const loading = ref(false)
const filters = ref({
  estado: '',
  categoria: ''
})

const showOfferModal = ref(false)
const selectedArticle = ref(null)
const offerData = ref({
  tipo_oferta: 'dinero',
  precio_ofertado: 0,
  puntos_ofertados: 0,
  comentarios: ''
})

const filteredArticles = computed(() => {
  let filtered = articles.value

  if (filters.value.estado) {
    filtered = filtered.filter(article => article.adminStatus === filters.value.estado)
  }

  if (filters.value.categoria) {
    filtered = filtered.filter(article => article.category === filters.value.categoria)
  }

  return filtered
})

const loadArticles = async () => {
  loading.value = true
  try {
    const token = localStorage.getItem('auth_token') || sessionStorage.getItem('auth_token')
    const response = await fetch('/api/articles/admin/pending', {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })

    if (response.ok) {
      const result = await response.json()
      articles.value = result.data
    } else {
      toast.error('Error al cargar las solicitudes de compra')
    }
  } catch (error) {
    console.error('Error cargando solicitudes:', error)
    toast.error('Error de conexión al servidor')
  } finally {
    loading.value = false
  }
}

const createOffer = (article) => {
  selectedArticle.value = article
  offerData.value = {
    tipo_oferta: 'dinero',
    precio_ofertado: Math.round(article.price * 0.8), // 20% menos
    puntos_ofertados: Math.round(article.price * 100), // 1€ = 100 puntos
    comentarios: ''
  }
  showOfferModal.value = true
}

const closeOfferModal = () => {
  showOfferModal.value = false
  selectedArticle.value = null
  offerData.value = {
    tipo_oferta: 'dinero',
    precio_ofertado: 0,
    puntos_ofertados: 0,
    comentarios: ''
  }
}

const submitOffer = async () => {
  loading.value = true
  try {
    const token = localStorage.getItem('auth_token') || sessionStorage.getItem('auth_token')
    const response = await fetch('/api/ofertas-admin', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({
        articulo_id: selectedArticle.value._id,
        ...offerData.value
      })
    })

    const result = await response.json()

    if (result.success) {
      toast.success('Oferta creada exitosamente')
      closeOfferModal()
      loadArticles()
    } else {
      toast.error(result.message || 'Error al crear la oferta')
    }
  } catch (error) {
    console.error('Error creando oferta:', error)
    toast.error('Error de conexión al servidor')
  } finally {
    loading.value = false
  }
}

const viewDetails = (article) => {
  // Implementar vista de detalles
  console.log('Ver detalles:', article)
}

const getEstadoClass = (adminStatus) => {
  const classes = {
    'pending': 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300',
    'approved_money': 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300',
    'approved_points': 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300',
    'approved_both': 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300',
    'rejected': 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300'
  }
  return classes[adminStatus] || 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300'
}

const getEstadoText = (adminStatus) => {
  const texts = {
    'pending': 'Pendiente de Revisión',
    'approved_money': 'Aprobado (Dinero)',
    'approved_points': 'Aprobado (Puntos)',
    'approved_both': 'Aprobado (Ambas opciones)',
    'rejected': 'Rechazado'
  }
  return texts[adminStatus] || adminStatus
}

const getOfertaEstadoClass = (estado) => {
  const classes = {
    'pendiente': 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300',
    'aceptada': 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300',
    'rechazada': 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300'
  }
  return classes[estado] || 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300'
}

const getOfertaEstadoText = (estado) => {
  const texts = {
    'pendiente': 'Pendiente',
    'aceptada': 'Aceptada',
    'rechazada': 'Rechazada'
  }
  return texts[estado] || estado
}

onMounted(() => {
  loadArticles()
})
</script>
