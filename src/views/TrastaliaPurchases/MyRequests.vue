<template>
  <AdminLayout>
    <div class="mx-auto max-w-screen-2xl p-4 md:p-6 2xl:p-10">
      <!-- Header -->
      <div class="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
        <h2 class="text-title-md2 font-semibold text-black dark:text-white">
          Mis Solicitudes de Compra
        </h2>
          <p class="mt-2 text-sm text-gray-600 dark:text-gray-400">Gestiona las ofertas de compra de Trastalia</p>
        </div>
      </div>

      <!-- Lista de solicitudes -->
      <div class="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
        <div class="px-6 py-4 border-b border-stroke dark:border-strokedark">
          <h3 class="text-lg font-medium text-black dark:text-white">Solicitudes de Compra</h3>
        </div>

        <div v-if="loading" class="p-6 text-center">
          <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
          <p class="mt-2 text-gray-600 dark:text-gray-400">Cargando solicitudes...</p>
        </div>

        <div v-else-if="requests.length === 0" class="px-6 py-8 text-center">
          <div class="text-gray-500 dark:text-gray-400">
            No tienes solicitudes de compra
          </div>
        </div>

        <div v-else class="divide-y divide-stroke dark:divide-strokedark">
          <div
            v-for="request in requests"
            :key="request._id"
            class="p-6 hover:bg-gray-50 dark:hover:bg-boxdark"
          >
            <div class="flex items-start justify-between">
              <div class="flex-1">
                <div class="flex items-center space-x-3">
                  <h4 class="text-lg font-medium text-black dark:text-white">{{ request.title }}</h4>
                  <span :class="getStatusBadgeClass(request.adminStatus)" class="px-2 py-1 text-xs font-medium rounded-full">
                    {{ getStatusText(request.adminStatus) }}
                      </span>
                </div>

                <p class="mt-1 text-sm text-gray-600 dark:text-gray-400">{{ request.description }}</p>
                
                <div class="mt-2 flex items-center space-x-4 text-sm text-gray-500 dark:text-gray-400">
                  <span>Precio original: {{ request.price }}€</span>
                  <span>Categoría: {{ request.category }}</span>
                  <span>Condición: {{ request.condition }}</span>
                </div>

                <!-- Información de nave logística -->
                <div v-if="request.logisticsShip" class="mt-2 p-3 bg-purple-50 dark:bg-purple-900/20 border border-purple-200 dark:border-purple-800 rounded-lg">
                  <div class="flex items-center space-x-2">
                    <svg class="w-4 h-4 text-purple-600 dark:text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"></path>
                    </svg>
                    <span class="text-sm font-medium text-purple-900 dark:text-purple-100">Nave Logística:</span>
                    <span class="text-sm text-purple-800 dark:text-purple-200">{{ request.logisticsShip }}</span>
                  </div>
                  <div class="mt-1 text-xs text-purple-600 dark:text-purple-300">
                    Ubicación: {{ request.logisticsShipLocation }}
                  </div>
                </div>

                <!-- Oferta de Trastalia -->
                <div v-if="request.adminDecision" class="mt-3 p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
                  <h5 class="font-medium text-blue-900 dark:text-blue-100">Oferta de Trastalia:</h5>
                  <div class="mt-2 space-y-1">
                    <div v-if="request.adminDecision.money" class="text-sm text-blue-800 dark:text-blue-200">
                      <strong>Dinero:</strong> {{ request.adminDecision.moneyPrice }}€
                    </div>
                    <div v-if="request.adminDecision.points" class="text-sm text-blue-800 dark:text-blue-200">
                      <strong>Puntos:</strong> {{ request.adminDecision.pointsAmount }} puntos
                    </div>
                    <div class="text-xs text-blue-600 dark:text-blue-300">
                      Fecha de oferta: {{ formatDate(request.adminDecision.date) }}
                  </div>
                  </div>
                </div>
              </div>
              
              <!-- Indicador de visibilidad de botones -->
              <div class="ml-4 p-2 bg-blue-100 dark:bg-blue-900/20 border border-blue-300 dark:border-blue-700 rounded text-xs">
                <p><strong>🔵 Condición botones:</strong></p>
                <p>!sellerAccepted: {{ !request.sellerAccepted }}</p>
                <p>!sellerRejected: {{ !request.sellerRejected }}</p>
                <p>Mostrar botones: {{ !request.sellerAccepted && !request.sellerRejected }}</p>
              </div>

              <!-- Botones de acción -->
              <div v-if="!request.sellerAccepted && !request.sellerRejected" class="flex space-x-2 ml-4">
                <button 
                  @click="() => { console.log('🟢 Botón clicado para:', request.nombre); openAcceptModal(request); }"
                  class="inline-flex items-center justify-center rounded-md bg-green-600 py-2 px-4 text-center font-medium text-white hover:bg-opacity-90"
                >
                  Aceptar Oferta
                </button>
                <button 
                  @click="openRejectModal(request)"
                  class="inline-flex items-center justify-center rounded-md bg-red-600 py-2 px-4 text-center font-medium text-white hover:bg-opacity-90"
                >
                  Rechazar Oferta
                </button>
              </div>

              <!-- Debug info para cada artículo -->
              <div class="mt-2 p-2 bg-yellow-100 dark:bg-yellow-900/20 border border-yellow-300 dark:border-yellow-700 rounded text-xs">
                <p><strong>🔍 Debug Artículo:</strong> {{ request.nombre }}</p>
                <p>sellerAccepted: {{ request.sellerAccepted }} (tipo: {{ typeof request.sellerAccepted }})</p>
                <p>sellerRejected: {{ request.sellerRejected }} (tipo: {{ typeof request.sellerRejected }})</p>
                <p>adminDecision: {{ request.adminDecision ? 'Sí' : 'No' }}</p>
                <p v-if="request.adminDecision">
                  Money: {{ request.adminDecision.money }}, Points: {{ request.adminDecision.points }}
                </p>
                <p>Estado completo: {{ JSON.stringify(request, null, 2) }}</p>
              </div>

              <!-- Estado de respuesta -->
              <div v-else class="ml-4">
                <span v-if="request.sellerAccepted" class="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                  Oferta Aceptada
                </span>
                <span v-else-if="request.sellerRejected" class="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200">
                  Oferta Rechazada
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Modal de Rechazo -->
    <div v-if="showRejectModal" class="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
      <div class="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white dark:bg-boxdark">
        <div class="mt-3">
          <h3 class="text-lg font-medium text-black dark:text-white mb-4">Rechazar Oferta</h3>
          
          <div>
            <label class="block text-sm font-medium text-black dark:text-white mb-2">Motivo del rechazo</label>
            <textarea 
              v-model="rejectReason" 
              rows="4" 
              class="w-full rounded border border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary" 
              placeholder="Explica por qué rechazas esta oferta..."
            ></textarea>
          </div>
          
          <div class="flex justify-end space-x-3 mt-6">
            <button 
              @click="closeRejectModal" 
              class="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400 dark:bg-gray-600 dark:text-gray-200 dark:hover:bg-gray-500"
            >
              Cancelar
            </button>
            <button 
              @click="rejectOffer" 
              class="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
            >
              Rechazar
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Modal de selección de oferta -->
    <OfferSelectionModal
      :is-open="showAcceptModal"
      :offer="currentOffer"
      :article-id="selectedRequest?._id"
      @close="closeAcceptModal"
      @accept="handleAcceptOffer"
    />

    <!-- Debug info -->
    <div v-if="showAcceptModal" class="fixed top-4 right-4 z-50 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
      <p><strong>🔴 MODAL ABIERTO:</strong> {{ showAcceptModal }}</p>
      <p><strong>🔴 ARTÍCULO:</strong> {{ selectedRequest?.nombre }}</p>
      <p><strong>🔴 OFERTA:</strong> {{ JSON.stringify(currentOffer) }}</p>
    </div>

    <!-- Indicador de modal visible -->
    <div v-if="showAcceptModal" class="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50 bg-green-500 text-white px-8 py-4 rounded-lg text-xl font-bold">
      🔴 MODAL DEBERÍA ESTAR AQUÍ
    </div>

    <!-- Indicador de carga de artículos -->
    <div class="fixed top-4 left-4 z-50 bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded">
      <p><strong>✅ Artículos cargados:</strong> {{ requests.length }}</p>
      <p><strong>✅ Loading:</strong> {{ loading }}</p>
    </div>

    <!-- Modal de rechazo -->
    <div v-if="showRejectModal" class="fixed inset-0 z-50 overflow-y-auto">
      <div class="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
        <div class="fixed inset-0 transition-opacity bg-gray-500 bg-opacity-75" @click="closeRejectModal"></div>
        <div class="inline-block w-full max-w-md p-6 my-8 overflow-hidden text-left align-middle transition-all transform bg-white dark:bg-gray-800 shadow-xl rounded-2xl">
          <h3 class="text-lg font-medium text-gray-900 dark:text-white mb-4">Rechazar Oferta</h3>
          <div class="mb-4">
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Motivo del rechazo (opcional)
            </label>
            <textarea
              v-model="rejectReason"
              class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
              rows="3"
              placeholder="Explica por qué rechazas esta oferta..."
            ></textarea>
          </div>
          <div class="flex justify-end space-x-3">
            <button
              @click="closeRejectModal"
              class="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-lg"
            >
              Cancelar
            </button>
            <button
              @click="rejectOffer"
              class="px-4 py-2 text-sm font-medium text-white bg-red-600 hover:bg-red-700 rounded-lg"
            >
              Rechazar Oferta
            </button>
          </div>
        </div>
      </div>
    </div>
  </AdminLayout>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useAuthStore } from '@/stores/auth'
import AdminLayout from '@/components/layout/AdminLayout.vue'
import OfferSelectionModal from '@/components/modals/OfferSelectionModal.vue'

const authStore = useAuthStore()

// Estado reactivo
const loading = ref(false)
const requests = ref([])
const showRejectModal = ref(false)
const showAcceptModal = ref(false)
const rejectReason = ref('')
const selectedRequest = ref<any>(null)

// Computed para la oferta actual
const currentOffer = computed(() => {
  console.log('Calculando oferta para:', selectedRequest.value)
  if (!selectedRequest.value?.adminDecision) {
    console.log('No hay adminDecision, devolviendo oferta vacía')
    return { money: false, points: false, moneyPrice: 0, pointsAmount: 0 }
  }
  
  const offer = {
    money: selectedRequest.value.adminDecision.money || false,
    points: selectedRequest.value.adminDecision.points || false,
    moneyPrice: selectedRequest.value.adminDecision.moneyPrice || 0,
    pointsAmount: selectedRequest.value.adminDecision.pointsAmount || 0
  }
  console.log('Oferta calculada:', offer)
  return offer
})

// Cargar solicitudes
const loadRequests = async () => {
  loading.value = true
  try {
    const response = await fetch('/api/articles/my-purchase-requests', {
      headers: {
        'Authorization': `Bearer ${authStore.token}`
      }
    })

    if (response.ok) {
      const data = await response.json()
      requests.value = data.data
    } else {
      console.error('Error cargando solicitudes:', response.status, response.statusText)
    }
  } catch (error) {
    console.error('Error cargando solicitudes:', error)
  } finally {
    loading.value = false
  }
}

// Abrir modal de aceptación
const openAcceptModal = (request) => {
  console.log('🔴 Abriendo modal para:', request)
  console.log('🔴 Oferta disponible:', request.adminDecision)
  console.log('🔴 showAcceptModal antes:', showAcceptModal.value)
  
  selectedRequest.value = request
  showAcceptModal.value = true
  
  console.log('🔴 showAcceptModal después:', showAcceptModal.value)
  console.log('🔴 selectedRequest:', selectedRequest.value)
}

// Cerrar modal de aceptación
const closeAcceptModal = () => {
  showAcceptModal.value = false
  selectedRequest.value = null
}

// Manejar aceptación de oferta con selección
const handleAcceptOffer = async (data) => {
  try {
    const response = await fetch('/api/articles/accept-offer', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${authStore.token}`
      },
      body: JSON.stringify({
        articleId: data.articleId,
        selectedOption: data.selectedOption
      })
    })

    if (response.ok) {
      const result = await response.json()
      console.log('Oferta aceptada:', result.message)
      await loadRequests()
      closeAcceptModal()
      alert(result.message)
    } else {
      const error = await response.json()
      console.error('Error aceptando oferta:', error.message)
      alert('Error: ' + error.message)
    }
  } catch (error) {
    console.error('Error aceptando oferta:', error)
    alert('Error al aceptar la oferta')
  }
}

// Abrir modal de rechazo
const openRejectModal = (request) => {
  selectedRequest.value = request
  showRejectModal.value = true
  rejectReason.value = ''
}

// Cerrar modal de rechazo
const closeRejectModal = () => {
  showRejectModal.value = false
  selectedRequest.value = null
  rejectReason.value = ''
}

// Rechazar oferta
const rejectOffer = async () => {
  if (!rejectReason.value.trim()) {
    alert('Por favor, proporciona un motivo para el rechazo')
    return
  }

  try {
    const response = await fetch('/api/articles/reject-trastalia-offer', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${authStore.token}`
      },
      body: JSON.stringify({ 
        articleId: selectedRequest.value._id, 
        reason: rejectReason.value 
      })
    })

    if (response.ok) {
      alert('Oferta rechazada exitosamente')
      closeRejectModal()
      loadRequests()
    } else {
      const error = await response.json()
      alert(`Error: ${error.message}`)
    }
  } catch (error) {
    console.error('Error rechazando oferta:', error)
    alert('Error al rechazar la oferta')
  }
}

// Utilidades
const getStatusBadgeClass = (status) => {
  const classes = {
    approved_money: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
    approved_points: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
    approved_both: 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200'
  }
  return classes[status] || 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200'
}

const getStatusText = (status) => {
  const texts = {
    approved_money: 'Aprobado (Dinero)',
    approved_points: 'Aprobado (Puntos)',
    approved_both: 'Aprobado (Ambos)'
  }
  return texts[status] || status
}

const formatDate = (date) => {
  return new Date(date).toLocaleDateString('es-ES', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

// Lifecycle
onMounted(() => {
  loadRequests()
})
</script>