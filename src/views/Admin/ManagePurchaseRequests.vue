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
                  <option value="juegos">Juegos</option>
                  <option value="moda">Moda</option>
                  <option value="libros">Libros</option>
                </select>
              </div>
              
              <div>
                <label class="mb-2.5 block text-black dark:text-white">Ordenar por</label>
                <select v-model="filters.ordenar" class="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary">
                  <option value="fecha_desc">Más recientes</option>
                  <option value="fecha_asc">Más antiguos</option>
                  <option value="precio_desc">Mayor precio</option>
                  <option value="precio_asc">Menor precio</option>
                </select>
              </div>
            </div>
          </div>

          <!-- Loading state -->
          <div v-if="loading" class="rounded-sm border border-stroke bg-white p-4 shadow-default dark:border-strokedark dark:bg-boxdark">
            <div class="flex justify-center items-center py-12">
              <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            </div>
          </div>

          <!-- Empty state -->
          <div v-else-if="filteredRequests.length === 0" class="rounded-sm border border-stroke bg-white p-4 shadow-default dark:border-strokedark dark:bg-boxdark">
            <div class="text-center py-12">
              <div class="text-gray-400 dark:text-gray-500 mb-4">
                <svg class="mx-auto h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <h3 class="text-lg font-medium text-black dark:text-white mb-2">No hay solicitudes</h3>
              <p class="text-gray-500 dark:text-gray-400">No se encontraron solicitudes de compra con los filtros seleccionados.</p>
            </div>
          </div>

          <!-- Requests list -->
          <div v-else class="space-y-6">
            <div 
              v-for="request in filteredRequests" 
              :key="request._id"
              class="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark overflow-hidden hover:shadow-lg transition-shadow duration-200"
            >
              <div class="p-6">
                <div class="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
                  <!-- Article Info -->
                  <div class="flex-1">
                    <div class="flex items-start gap-4">
                      <!-- Article Image -->
                      <div class="w-20 h-20 bg-gray-200 dark:bg-gray-700 rounded-lg flex-shrink-0">
                        <img 
                          v-if="request.images && request.images.length > 0"
                          :src="request.images[0]" 
                          :alt="request.title || request.nombre"
                          class="w-full h-full object-cover rounded-lg"
                          @error="handleImageError"
                        />
                        <div v-else class="w-full h-full bg-gray-200 dark:bg-gray-700 rounded-lg flex items-center justify-center">
                          <svg class="h-8 w-8 text-gray-400 dark:text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                          </svg>
                        </div>
                      </div>
                      
                      <!-- Article Details -->
                      <div class="flex-1">
                        <h3 class="text-lg font-semibold text-black dark:text-white mb-2">
                          {{ request.title || request.nombre }}
                        </h3>
                        <p class="text-gray-600 dark:text-gray-300 text-sm mb-2 line-clamp-2">
                          {{ request.description || request.descripcion }}
                        </p>
                        <div class="flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400">
                          <span><strong>Vendedor:</strong> {{ request.id_vendedor?.name || request.seller?.name || 'Usuario' }}</span>
                          <span><strong>Fecha:</strong> {{ formatDate(request.createdAt) }}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <!-- Status and Actions -->
                  <div class="flex flex-col gap-3 lg:items-end">
                    <!-- Status Badge -->
                    <div class="flex items-center gap-2">
                      <span class="text-sm font-medium text-gray-700 dark:text-gray-300">Estado:</span>
                      <span 
                        :class="getStatusClass(request.adminStatus)"
                        class="px-3 py-1 rounded-full text-xs font-semibold"
                      >
                        {{ getStatusText(request.adminStatus) }}
                      </span>
                    </div>

                    <!-- Actions -->
                    <div class="flex gap-2">
                      <button
                        v-if="request.adminStatus === 'pending'"
                        @click="openOfferModal(request)"
                        class="bg-primary hover:bg-primary/90 text-white px-4 py-2 rounded-md text-sm font-semibold transition-colors"
                      >
                        Hacer Oferta
                      </button>
                      
                      <button
                        v-if="request.adminStatus === 'pending'"
                        @click="rejectRequest(request)"
                        class="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md text-sm font-semibold transition-colors"
                      >
                        Rechazar
                      </button>
                      
                      <button
                        @click="viewRequest(request)"
                        class="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-semibold transition-colors"
                      >
                        Ver Detalles
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Offer Modal -->
    <div v-if="showOfferModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div class="bg-white dark:bg-boxdark rounded-lg p-6 w-full max-w-md mx-4">
        <h3 class="text-lg font-semibold text-black dark:text-white mb-4">
          Hacer Oferta
        </h3>
        
        <div class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-black dark:text-white mb-2">
              Tipo de Oferta
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
              Comentarios (opcional)
            </label>
            <textarea
              v-model="offerData.comentarios"
              rows="3"
              class="w-full rounded border-[1.5px] border-stroke bg-transparent py-2 px-3 font-medium outline-none transition focus:border-primary dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
              placeholder="Añade comentarios sobre tu oferta..."
            ></textarea>
          </div>
        </div>
        
        <div class="flex space-x-3 mt-6">
          <button
            @click="closeOfferModal"
            class="flex-1 bg-gray-300 hover:bg-gray-400 text-gray-700 py-2 px-4 rounded-md text-sm font-semibold transition-colors"
          >
            Cancelar
          </button>
          <button
            @click="submitOffer"
            :disabled="!isOfferValid"
            class="flex-1 bg-primary hover:bg-primary/90 disabled:bg-gray-300 disabled:cursor-not-allowed text-white py-2 px-4 rounded-md text-sm font-semibold transition-colors"
          >
            Enviar Oferta
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { useToast } from '@/composables/useToast'
import ToastContainer from '@/components/ui/ToastContainer.vue'
import AppSidebar from '@/components/layout/AppSidebar.vue'
import AppHeader from '@/components/layout/AppHeader.vue'
import Backdrop from '@/components/layout/Backdrop.vue'
import { useSidebar } from '@/composables/useSidebar'
import API_BASE_URL from '@/config/api'

const authStore = useAuthStore()
const toast = useToast()

// Sidebar logic
const { isExpanded, isHovered } = useSidebar()

// Estado reactivo
const requests = ref([])
const loading = ref(false)
const showOfferModal = ref(false)
const selectedRequest = ref(null)

const filters = ref({
  estado: '',
  categoria: '',
  ordenar: 'fecha_desc'
})

const offerData = ref({
  tipo_oferta: 'dinero',
  precio_ofertado: 0,
  puntos_ofertados: 0,
  comentarios: ''
})

// Cargar solicitudes
const loadRequests = async () => {
  loading.value = true
  try {
    const token = localStorage.getItem('auth_token') || sessionStorage.getItem('auth_token')
    const response = await fetch(`${API_BASE_URL}/api/articles/admin/pending`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    })
    
    if (response.ok) {
      const data = await response.json()
      requests.value = data.data || []
      console.log('📋 Solicitudes cargadas:', requests.value.length)
    } else {
      console.error('Error cargando solicitudes:', response.statusText)
    }
  } catch (error) {
    console.error('Error:', error)
  } finally {
    loading.value = false
  }
}

// Filtrar solicitudes
const filteredRequests = computed(() => {
  let filtered = requests.value.filter(request => {
    if (filters.value.estado && request.adminStatus !== filters.value.estado) return false
    if (filters.value.categoria && request.category !== filters.value.categoria) return false
    return true
  })
  
  // Ordenar
  switch (filters.value.ordenar) {
    case 'fecha_asc':
      return filtered.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt))
    case 'fecha_desc':
      return filtered.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    case 'precio_asc':
      return filtered.sort((a, b) => (a.price || 0) - (b.price || 0))
    case 'precio_desc':
      return filtered.sort((a, b) => (b.price || 0) - (a.price || 0))
    default:
      return filtered
  }
})

// Abrir modal de oferta
const openOfferModal = (request) => {
  selectedRequest.value = request
  offerData.value = {
    tipo_oferta: 'dinero',
    precio_ofertado: 0,
    puntos_ofertados: 0,
    comentarios: ''
  }
  showOfferModal.value = true
}

// Cerrar modal de oferta
const closeOfferModal = () => {
  showOfferModal.value = false
  selectedRequest.value = null
  offerData.value = {
    tipo_oferta: 'dinero',
    precio_ofertado: 0,
    puntos_ofertados: 0,
    comentarios: ''
  }
}

// Validar oferta
const isOfferValid = computed(() => {
  if (!offerData.value.tipo_oferta) return false
  if (offerData.value.tipo_oferta === 'dinero' && offerData.value.precio_ofertado <= 0) return false
  if (offerData.value.tipo_oferta === 'puntos' && offerData.value.puntos_ofertados <= 0) return false
  if (offerData.value.tipo_oferta === 'ambos' && (offerData.value.precio_ofertado <= 0 || offerData.value.puntos_ofertados <= 0)) return false
  return true
})

// Enviar oferta
const submitOffer = async () => {
  if (!selectedRequest.value) return
  
  try {
    const token = localStorage.getItem('auth_token') || sessionStorage.getItem('auth_token')
    const response = await fetch(`${API_BASE_URL}/api/ofertas-admin`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        articleId: selectedRequest.value._id,
        ...offerData.value
      })
    })
    
    if (response.ok) {
      const data = await response.json()
      toast.success('Oferta enviada', data.message)
      closeOfferModal()
      loadRequests() // Recargar la lista
    } else {
      const errorData = await response.json()
      toast.error('Error', errorData.message)
    }
  } catch (error) {
    console.error('Error enviando oferta:', error)
    toast.error('Error', 'No se pudo enviar la oferta.')
  }
}

// Rechazar solicitud
const rejectRequest = async (request) => {
  if (!confirm(`¿Estás seguro de que quieres rechazar esta solicitud?`)) return
  
  try {
    const token = localStorage.getItem('auth_token') || sessionStorage.getItem('auth_token')
    const response = await fetch(`${API_BASE_URL}/api/articles/${request._id}`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        adminStatus: 'rejected'
      })
    })
    
    if (response.ok) {
      toast.success('Solicitud rechazada', 'La solicitud ha sido rechazada.')
      loadRequests() // Recargar la lista
    } else {
      toast.error('Error', 'No se pudo rechazar la solicitud.')
    }
  } catch (error) {
    console.error('Error rechazando solicitud:', error)
    toast.error('Error', 'No se pudo rechazar la solicitud.')
  }
}

// Ver solicitud
const viewRequest = (request) => {
  window.open(`/articulos/${request._id}`, '_blank')
}

// Obtener clase de estado
const getStatusClass = (status) => {
  switch (status) {
    case 'pending':
      return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
    case 'approved_money':
    case 'approved_points':
    case 'approved_both':
      return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
    case 'rejected':
      return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
    default:
      return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200'
  }
}

// Obtener texto de estado
const getStatusText = (status) => {
  switch (status) {
    case 'pending':
      return 'Pendiente'
    case 'approved_money':
      return 'Aprobado (Dinero)'
    case 'approved_points':
      return 'Aprobado (Puntos)'
    case 'approved_both':
      return 'Aprobado (Ambas)'
    case 'rejected':
      return 'Rechazado'
    default:
      return 'Desconocido'
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
  loadRequests()
})
</script>