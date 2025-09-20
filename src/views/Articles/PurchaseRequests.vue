<template>
  <AdminLayout>
    <div class="mx-auto max-w-screen-2xl p-4 md:p-6 2xl:p-10">
      <!-- Header -->
      <div class="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <h2 class="text-title-md2 font-semibold text-black dark:text-white">
          Mis Solicitudes de Compra
        </h2>
        <div class="flex items-center space-x-4">
          <div class="text-center">
            <div class="text-2xl font-bold text-yellow-600">{{ pendingCount }}</div>
            <div class="text-sm text-gray-500">Pendientes</div>
          </div>
          <div class="text-center">
            <div class="text-2xl font-bold text-green-600">{{ approvedCount }}</div>
            <div class="text-sm text-gray-500">Aprobadas</div>
          </div>
          <div class="text-center">
            <div class="text-2xl font-bold text-red-600">{{ rejectedCount }}</div>
            <div class="text-sm text-gray-500">Rechazadas</div>
          </div>
        </div>
      </div>

      <!-- Filtros -->
      <div class="mb-6 rounded-sm border border-stroke bg-white p-4 shadow-default dark:border-strokedark dark:bg-boxdark">
        <div class="flex flex-wrap gap-4">
          <div class="flex-1 min-w-48">
            <label class="mb-2 block text-sm font-medium text-black dark:text-white">
              Filtrar por estado
            </label>
            <select 
              v-model="selectedStatus" 
              class="w-full rounded border border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
            >
              <option value="">Todos</option>
              <option value="pending">Pendientes</option>
              <option value="approved_money">Aprobadas (Dinero)</option>
              <option value="approved_points">Aprobadas (Puntos)</option>
              <option value="approved_both">Aprobadas (Ambos)</option>
              <option value="rejected">Rechazadas</option>
            </select>
          </div>
        </div>
      </div>

      <!-- Lista de solicitudes -->
      <div class="grid gap-6">
        <div 
          v-for="article in filteredArticles" 
          :key="article._id"
          class="rounded-sm border border-stroke bg-white p-6 shadow-default dark:border-strokedark dark:bg-boxdark"
        >
          <div class="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6">
            <!-- Información del artículo -->
            <div class="flex-1">
              <div class="mb-4 flex items-center gap-4">
                <div class="h-20 w-20 overflow-hidden rounded-lg">
                  <img 
                    :src="article.images?.[0] || '/images/placeholder.jpg'" 
                    :alt="article.title"
                    class="h-full w-full object-cover"
                  />
                </div>
                <div class="flex-1">
                  <h3 class="text-lg font-semibold text-black dark:text-white mb-2">
                    {{ article.title }}
                  </h3>
                  <p class="text-sm text-gray-600 dark:text-gray-400 mb-2">
                    {{ article.description }}
                  </p>
                  <div class="flex flex-wrap gap-4 text-sm">
                    <span class="text-gray-500">
                      <strong>Categoría:</strong> {{ article.category }}
                    </span>
                    <span class="text-gray-500">
                      <strong>Estado:</strong> {{ article.condition }}
                    </span>
                    <span class="text-gray-500">
                      <strong>Precio sugerido:</strong> €{{ article.price }}
                    </span>
                  </div>
                </div>
              </div>

              <!-- Estado de la solicitud -->
              <div class="mb-4">
                <span 
                  :class="getStatusBadgeClass(article.adminStatus)"
                  class="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium"
                >
                  {{ getStatusText(article.adminStatus) }}
                </span>
                <span class="ml-4 text-sm text-gray-500">
                  {{ formatDate(article.createdAt) }}
                </span>
              </div>

              <!-- Decisión del administrador -->
              <div v-if="article.adminDecision" class="rounded-lg bg-gray-50 p-4 dark:bg-gray-800">
                <h4 class="font-medium text-black dark:text-white mb-3">Decisión del Administrador</h4>
                
                <div v-if="article.adminDecision.money" class="mb-3">
                  <div class="flex items-center justify-between">
                    <span class="text-green-600 font-medium">✓ Compra con dinero aprobada</span>
                    <span class="text-lg font-bold text-green-600">€{{ article.adminDecision.moneyPrice }}</span>
                  </div>
                </div>

                <div v-if="article.adminDecision.points" class="mb-3">
                  <div class="flex items-center justify-between">
                    <span class="text-blue-600 font-medium">✓ Compra con puntos aprobada</span>
                    <span class="text-lg font-bold text-blue-600">{{ article.adminDecision.pointsAmount }} puntos</span>
                  </div>
                </div>

                <div v-if="article.adminDecision.reject" class="mb-3">
                  <div class="text-red-600 font-medium mb-2">✗ Solicitud rechazada</div>
                  <div class="text-sm text-gray-600 dark:text-gray-400">
                    <strong>Motivo:</strong> {{ article.adminDecision.rejectReason }}
                  </div>
                </div>

                <div class="text-sm text-gray-500">
                  <strong>Fecha de decisión:</strong> {{ formatDate(article.adminDecision.date) }}
                </div>
              </div>

              <!-- Acciones disponibles -->
              <div v-if="article.adminStatus === 'approved_money' || article.adminStatus === 'approved_points' || article.adminStatus === 'approved_both'" class="mt-4">
                <div class="flex gap-2">
                  <button 
                    @click="acceptOffer(article)"
                    class="rounded bg-green-600 py-2 px-4 font-medium text-white hover:bg-green-700"
                  >
                    Aceptar Oferta
                  </button>
                  <button 
                    @click="rejectOffer(article)"
                    class="rounded border border-red-600 bg-transparent py-2 px-4 font-medium text-red-600 hover:bg-red-50"
                  >
                    Rechazar Oferta
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Mensaje cuando no hay solicitudes -->
      <div v-if="filteredArticles.length === 0" class="text-center py-12">
        <div class="mx-auto max-w-md">
          <div class="mb-4">
            <svg class="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
          <h3 class="text-lg font-medium text-gray-900 dark:text-white mb-2">
            No hay solicitudes
          </h3>
          <p class="text-gray-500 dark:text-gray-400">
            {{ selectedStatus ? 'No se encontraron solicitudes con el filtro seleccionado.' : 'No tienes solicitudes de compra pendientes.' }}
          </p>
        </div>
      </div>
    </div>
  </AdminLayout>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import AdminLayout from '@/components/layout/AdminLayout.vue'

// Estado reactivo
const articles = ref([])
const loading = ref(false)
const selectedStatus = ref('')

// Cargar artículos del usuario
const loadArticles = async () => {
  loading.value = true
  try {
    const token = localStorage.getItem('auth_token') || sessionStorage.getItem('auth_token')
    const response = await fetch('http://localhost:3002/api/articles/my-purchase-requests', {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })

    if (response.ok) {
      const data = await response.json()
      articles.value = data.data
    } else {
      console.error('Error cargando solicitudes:', response.statusText)
    }
  } catch (error) {
    console.error('Error cargando solicitudes:', error)
  } finally {
    loading.value = false
  }
}

// Filtrar artículos
const filteredArticles = computed(() => {
  let filtered = articles.value

  if (selectedStatus.value) {
    filtered = filtered.filter(article => article.adminStatus === selectedStatus.value)
  }

  return filtered
})

// Contadores
const pendingCount = computed(() => {
  return articles.value.filter(article => article.adminStatus === 'pending').length
})

const approvedCount = computed(() => {
  return articles.value.filter(article => 
    ['approved_money', 'approved_points', 'approved_both'].includes(article.adminStatus)
  ).length
})

const rejectedCount = computed(() => {
  return articles.value.filter(article => article.adminStatus === 'rejected').length
})

// Aceptar oferta
const acceptOffer = async (article) => {
  try {
    const token = localStorage.getItem('auth_token') || sessionStorage.getItem('auth_token')
    
    const response = await fetch('http://localhost:3002/api/articles/accept-offer', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ articleId: article._id })
    })

    if (response.ok) {
      alert('Oferta aceptada exitosamente')
      loadArticles() // Recargar la lista
    } else {
      const error = await response.json()
      alert(`Error: ${error.message}`)
    }
  } catch (error) {
    console.error('Error aceptando oferta:', error)
    alert('Error al aceptar la oferta')
  }
}

// Rechazar oferta
const rejectOffer = async (article) => {
  if (!confirm('¿Estás seguro de que quieres rechazar esta oferta?')) {
    return
  }

  try {
    const token = localStorage.getItem('auth_token') || sessionStorage.getItem('auth_token')
    
    const response = await fetch('http://localhost:3002/api/articles/reject-offer', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ articleId: article._id })
    })

    if (response.ok) {
      alert('Oferta rechazada')
      loadArticles() // Recargar la lista
    } else {
      const error = await response.json()
      alert(`Error: ${error.message}`)
    }
  } catch (error) {
    console.error('Error rechazando oferta:', error)
    alert('Error al rechazar la oferta')
  }
}

// Obtener clase del badge de estado
const getStatusBadgeClass = (status) => {
  const classes = {
    pending: 'bg-yellow-100 text-yellow-800',
    approved_money: 'bg-green-100 text-green-800',
    approved_points: 'bg-blue-100 text-blue-800',
    approved_both: 'bg-purple-100 text-purple-800',
    rejected: 'bg-red-100 text-red-800'
  }
  return classes[status] || 'bg-gray-100 text-gray-800'
}

// Obtener texto del estado
const getStatusText = (status) => {
  const texts = {
    pending: 'Pendiente de revisión',
    approved_money: 'Aprobada (Dinero)',
    approved_points: 'Aprobada (Puntos)',
    approved_both: 'Aprobada (Ambas opciones)',
    rejected: 'Rechazada'
  }
  return texts[status] || 'Desconocido'
}

// Formatear fecha
const formatDate = (dateString) => {
  if (!dateString) return 'N/A'
  return new Date(dateString).toLocaleDateString('es-ES', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

// Cargar artículos al montar el componente
onMounted(() => {
  loadArticles()
})
</script>
