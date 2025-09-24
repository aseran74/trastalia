<template>
  <AdminLayout>
    <div class="mx-auto max-w-screen-2xl p-4 md:p-6 2xl:p-10">
      <!-- Header -->
      <div class="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 class="text-title-md2 font-semibold text-black dark:text-white">
            Panel de Administración de Artículos
          </h2>
          <p class="mt-2 text-sm text-gray-600 dark:text-gray-400">Gestiona la aprobación y rechazo de artículos</p>
        </div>
      </div>

      <!-- Estadísticas -->
      <div class="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-6 mb-8">
        <div class="rounded-sm border border-stroke bg-white p-3 md:p-6 shadow-default dark:border-strokedark dark:bg-boxdark">
          <div class="flex items-center">
            <div class="flex-shrink-0">
              <div class="w-6 h-6 md:w-8 md:h-8 bg-blue-500 rounded-md flex items-center justify-center">
                <svg class="w-3 h-3 md:w-5 md:h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"></path>
                </svg>
              </div>
            </div>
            <div class="ml-2 md:ml-4">
              <p class="text-xs md:text-sm font-medium text-gray-500 dark:text-gray-400">Total</p>
              <p class="text-lg md:text-2xl font-semibold text-gray-900 dark:text-white">{{ stats.total }}</p>
            </div>
          </div>
        </div>

        <div class="rounded-sm border border-stroke bg-white p-3 md:p-6 shadow-default dark:border-strokedark dark:bg-boxdark">
          <div class="flex items-center">
            <div class="flex-shrink-0">
              <div class="w-6 h-6 md:w-8 md:h-8 bg-yellow-500 rounded-md flex items-center justify-center">
                <svg class="w-3 h-3 md:w-5 md:h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
              </div>
            </div>
            <div class="ml-2 md:ml-4">
              <p class="text-xs md:text-sm font-medium text-gray-500 dark:text-gray-400">Pendientes</p>
              <p class="text-lg md:text-2xl font-semibold text-gray-900 dark:text-white">{{ stats.pending }}</p>
            </div>
          </div>
        </div>

        <div class="rounded-sm border border-stroke bg-white p-3 md:p-6 shadow-default dark:border-strokedark dark:bg-boxdark">
          <div class="flex items-center">
            <div class="flex-shrink-0">
              <div class="w-6 h-6 md:w-8 md:h-8 bg-green-500 rounded-md flex items-center justify-center">
                <svg class="w-3 h-3 md:w-5 md:h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
                </svg>
              </div>
            </div>
            <div class="ml-2 md:ml-4">
              <p class="text-xs md:text-sm font-medium text-gray-500 dark:text-gray-400">Aprobados</p>
              <p class="text-lg md:text-2xl font-semibold text-gray-900 dark:text-white">{{ stats.approved }}</p>
            </div>
          </div>
        </div>

        <div class="rounded-sm border border-stroke bg-white p-3 md:p-6 shadow-default dark:border-strokedark dark:bg-boxdark">
          <div class="flex items-center">
            <div class="flex-shrink-0">
              <div class="w-6 h-6 md:w-8 md:h-8 bg-red-500 rounded-md flex items-center justify-center">
                <svg class="w-3 h-3 md:w-5 md:h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
                </svg>
              </div>
            </div>
            <div class="ml-2 md:ml-4">
              <p class="text-xs md:text-sm font-medium text-gray-500 dark:text-gray-400">Rechazados</p>
              <p class="text-lg md:text-2xl font-semibold text-gray-900 dark:text-white">{{ stats.rejected }}</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Filtros -->
      <div class="rounded-sm border border-stroke bg-white p-3 md:p-4 shadow-default dark:border-strokedark dark:bg-boxdark mb-6">
        <div class="flex flex-col sm:flex-row gap-3 md:gap-4">
          <select v-model="statusFilter" @change="loadArticles" class="w-full sm:flex-1 rounded border border-stroke bg-transparent py-2 md:py-3 px-3 md:px-5 text-sm md:text-base text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary">
            <option value="">Todos los estados</option>
            <option value="pending">Pendientes</option>
            <option value="approved_money">Aprobados (Dinero)</option>
            <option value="approved_points">Aprobados (Puntos)</option>
            <option value="approved_both">Aprobados (Ambos)</option>
            <option value="rejected">Rechazados</option>
          </select>
          
          <button @click="loadArticles" class="inline-flex items-center justify-center rounded-md bg-primary py-2 md:py-3 px-4 md:px-10 text-center text-sm md:text-base font-medium text-white hover:bg-opacity-90">
            Actualizar
          </button>
        </div>
      </div>

      <!-- Lista de artículos -->
      <div class="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
        <div class="px-3 md:px-6 py-3 md:py-4 border-b border-stroke dark:border-strokedark">
          <h3 class="text-base md:text-lg font-medium text-black dark:text-white">Artículos</h3>
        </div>
        
        <div v-if="loading" class="p-4 md:p-6 text-center">
          <div class="animate-spin rounded-full h-6 w-6 md:h-8 md:w-8 border-b-2 border-primary mx-auto"></div>
          <p class="mt-2 text-sm md:text-base text-gray-600 dark:text-gray-400">Cargando artículos...</p>
        </div>

        <div v-else-if="articles.length === 0" class="p-4 md:p-6 text-center text-sm md:text-base text-gray-500 dark:text-gray-400">
          No hay artículos para mostrar
        </div>

        <div v-else class="divide-y divide-stroke dark:divide-strokedark">
          <div v-for="article in articles" :key="article._id" class="p-3 md:p-6 hover:bg-gray-50 dark:hover:bg-boxdark">
            <div class="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
              <div class="flex-1">
                <div class="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3">
                  <h4 class="text-base md:text-lg font-medium text-black dark:text-white">{{ article.title }}</h4>
                  <span :class="getStatusBadgeClass(article.adminStatus)" class="px-2 py-1 text-xs font-medium rounded-full self-start">
                    {{ getStatusText(article.adminStatus) }}
                  </span>
                </div>
                
                <p class="mt-1 text-sm text-gray-600 dark:text-gray-400 line-clamp-2">{{ article.description }}</p>
                
                <div class="mt-2 grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs sm:text-sm text-gray-500 dark:text-gray-400">
                  <span class="truncate">Precio: {{ article.price }}€</span>
                  <span v-if="article.pointsPrice" class="truncate">Puntos: {{ article.pointsPrice }}</span>
                  <span class="truncate">Categoría: {{ article.category }}</span>
                  <span class="truncate">Estado: {{ article.condition }}</span>
                </div>

                       <!-- Información de nave logística -->
                       <div v-if="article.logisticsShip" class="mt-2 p-2 bg-purple-50 dark:bg-purple-900/20 border border-purple-200 dark:border-purple-800 rounded-md">
                         <div class="flex items-center space-x-2 text-sm">
                           <svg class="w-4 h-4 text-purple-600 dark:text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                             <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"></path>
                           </svg>
                           <span class="font-medium text-purple-900 dark:text-purple-100">Nave:</span>
                           <span class="text-purple-800 dark:text-purple-200">{{ article.logisticsShip }}</span>
                           <span class="text-purple-600 dark:text-purple-300">({{ article.logisticsShipLocation }})</span>
                         </div>
                       </div>
                
                <div class="mt-2 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2 text-xs sm:text-sm text-gray-500 dark:text-gray-400">
                  <span class="truncate">Vendedor: {{ getSellerInfo(article).name }}</span>
                  <span class="truncate">Email: {{ getSellerInfo(article).email }}</span>
                  <span class="truncate">Puntos: {{ getSellerInfo(article).points }}</span>
                  <span class="truncate">Nivel: {{ getSellerInfo(article).logisticsLevel }}</span>
                </div>

                <div v-if="article.adminDecision && article.adminDecision.reject" class="mt-2 p-3 bg-red-50 border border-red-200 rounded-md">
                  <p class="text-sm text-red-800">
                    <strong>Motivo del rechazo:</strong> {{ article.adminDecision.rejectReason }}
                  </p>
                </div>

                <div v-if="article.adminDecision && !article.adminDecision.reject" class="mt-2 p-3 bg-green-50 border border-green-200 rounded-md">
                  <p class="text-sm text-green-800">
                    <strong>Decisión del admin:</strong>
                    <span v-if="article.adminDecision.money"> Dinero ({{ article.adminDecision.moneyPrice }}€)</span>
                    <span v-if="article.adminDecision.points"> Puntos ({{ article.adminDecision.pointsAmount }})</span>
                  </p>
                </div>
              </div>
              
              <div v-if="article.adminStatus === 'pending'" class="flex flex-col sm:flex-row gap-2 lg:ml-4 mt-4 lg:mt-0">
                <button @click="openApproveModal(article)" class="inline-flex items-center justify-center rounded-md bg-green-600 py-2 px-3 md:px-4 text-center text-sm md:text-base font-medium text-white hover:bg-opacity-90">
                  Aprobar
                </button>
                <button @click="openRejectModal(article)" class="inline-flex items-center justify-center rounded-md bg-red-600 py-2 px-3 md:px-4 text-center text-sm md:text-base font-medium text-white hover:bg-opacity-90">
                  Rechazar
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Modal de Aprobación -->
    <div v-if="showApproveModal" class="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
      <div class="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
        <div class="mt-3">
          <h3 class="text-lg font-medium text-gray-900 mb-4">Aprobar Artículo</h3>
          
          <div class="space-y-4">
            <div>
              <label class="flex items-center">
                <input v-model="approveForm.money" type="checkbox" class="rounded border-gray-300 text-blue-600 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50">
                <span class="ml-2 text-sm text-gray-700">Aprobar para venta por dinero</span>
              </label>
              <input v-if="approveForm.money" v-model="approveForm.moneyPrice" type="number" placeholder="Precio en euros" class="mt-2 w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
            </div>
            
            <div>
              <label class="flex items-center">
                <input v-model="approveForm.points" type="checkbox" class="rounded border-gray-300 text-blue-600 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50">
                <span class="ml-2 text-sm text-gray-700">Aprobar para venta por puntos</span>
              </label>
              <input v-if="approveForm.points" v-model="approveForm.pointsAmount" type="number" placeholder="Cantidad de puntos" class="mt-2 w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
            </div>
          </div>
          
          <div class="flex justify-end space-x-3 mt-6">
            <button @click="closeApproveModal" class="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400">
              Cancelar
            </button>
            <button @click="approveArticle" :disabled="!approveForm.money && !approveForm.points" class="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed">
              Aprobar
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Modal de Rechazo -->
    <div v-if="showRejectModal" class="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
      <div class="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
        <div class="mt-3">
          <h3 class="text-lg font-medium text-gray-900 mb-4">Rechazar Artículo</h3>
          
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Motivo del rechazo</label>
            <textarea v-model="rejectForm.rejectReason" rows="4" class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-red-500 focus:border-red-500" placeholder="Explica por qué se rechaza este artículo..."></textarea>
          </div>
          
          <div class="flex justify-end space-x-3 mt-6">
            <button @click="closeRejectModal" class="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400">
              Cancelar
            </button>
            <button @click="rejectArticle" class="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700">
              Rechazar
            </button>
          </div>
        </div>
      </div>
    </div>
  </AdminLayout>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { useToast } from '@/composables/useToast'
import AdminLayout from '@/components/layout/AdminLayout.vue'

// Interfaces
interface Seller {
  _id: string
  name: string
  email: string
  points: number
  logisticsLevel: string
}

interface AdminDecision {
  money: boolean
  points: boolean
  moneyPrice: number
  pointsAmount: number
  reject: boolean
  rejectReason?: string
  date: string
}

interface Article {
  _id: string
  title: string
  description: string
  price: number
  pointsPrice?: number
  category: string
  condition: string
  adminStatus: string
  logisticsShip?: string
  logisticsShipLocation?: string
  seller: Seller
  adminDecision?: AdminDecision
}

const authStore = useAuthStore()
const toast = useToast()

// Estado reactivo
const articles = ref<Article[]>([])
const stats = ref({
  total: 0,
  pending: 0,
  approved: 0,
  rejected: 0
})
const loading = ref(false)
const statusFilter = ref('')

// Modales
const showApproveModal = ref(false)
const showRejectModal = ref(false)
const selectedArticle = ref(null)

// Formularios
const approveForm = ref({
  money: false,
  points: false,
  moneyPrice: 0,
  pointsAmount: 0
})

const rejectForm = ref({
  rejectReason: ''
})

// Métodos
const loadStats = async () => {
  try {
    const token = localStorage.getItem('auth_token') || sessionStorage.getItem('auth_token')
    const response = await fetch('/api/articles', {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })
    
    if (response.ok) {
      const data = await response.json()
      const articles = data.data || []
      
      // Calcular estadísticas
      stats.value = {
        total: articles.length,
        pending: articles.filter(a => a.adminStatus === 'pending').length,
        approved: articles.filter(a => ['approved_money', 'approved_points', 'approved_both'].includes(a.adminStatus)).length,
        rejected: articles.filter(a => a.adminStatus === 'rejected').length
      }
    }
  } catch (error) {
    console.error('Error cargando estadísticas:', error)
  }
}

const loadArticles = async () => {
  loading.value = true
  try {
    const token = localStorage.getItem('auth_token') || sessionStorage.getItem('auth_token')
    let url = '/api/articles'
    
    // Si hay filtro, agregar parámetro
    if (statusFilter.value) {
      url += `?adminStatus=${statusFilter.value}`
    }
    
    const response = await fetch(url, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })
    
    if (response.ok) {
      const data = await response.json()
      articles.value = data.data || []
      console.log('📊 Artículos cargados:', articles.value.length)
    } else {
      console.error('Error en respuesta:', response.status, response.statusText)
    }
  } catch (error) {
    console.error('Error cargando artículos:', error)
  } finally {
    loading.value = false
  }
}

const openApproveModal = (article: any) => {
  selectedArticle.value = article
  approveForm.value = {
    money: false,
    points: false,
    moneyPrice: article.price || 0,
    pointsAmount: article.pointsPrice || 0
  }
  showApproveModal.value = true
}

const closeApproveModal = () => {
  showApproveModal.value = false
  selectedArticle.value = null
  approveForm.value = {
    money: false,
    points: false,
    moneyPrice: 0,
    pointsAmount: 0
  }
}

const openRejectModal = (article: any) => {
  selectedArticle.value = article
  rejectForm.value = {
    rejectReason: ''
  }
  showRejectModal.value = true
}

const closeRejectModal = () => {
  showRejectModal.value = false
  selectedArticle.value = null
  rejectForm.value = {
    rejectReason: ''
  }
}

const approveArticle = async () => {
  if (!selectedArticle.value) return
  
  try {
    const token = localStorage.getItem('auth_token') || sessionStorage.getItem('auth_token')
    const response = await fetch(`/api/articles/admin/${selectedArticle.value._id}/approve`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(approveForm.value)
    })
    
    if (response.ok) {
      toast.success(
        '¡Artículo aprobado!',
        `"${selectedArticle.value.title}" ha sido aprobado exitosamente. El vendedor recibirá una notificación.`,
        { duration: 5000 }
      )
      await loadArticles()
      await loadStats()
      closeApproveModal()
    } else {
      const error = await response.json()
      toast.error(
        'Error al aprobar',
        error.message || 'No se pudo aprobar el artículo. Inténtalo de nuevo.',
        { duration: 5000 }
      )
    }
  } catch (error) {
    console.error('Error aprobando artículo:', error)
    toast.error(
      'Error de conexión',
      'No se pudo conectar con el servidor. Verifica tu conexión e inténtalo de nuevo.',
      { duration: 5000 }
    )
  }
}

const rejectArticle = async () => {
  if (!selectedArticle.value) return
  
  try {
    const token = localStorage.getItem('auth_token') || sessionStorage.getItem('auth_token')
    const response = await fetch(`/api/articles/admin/${selectedArticle.value._id}/reject`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(rejectForm.value)
    })
    
    if (response.ok) {
      toast.success(
        'Artículo rechazado',
        `"${selectedArticle.value.title}" ha sido rechazado. El vendedor recibirá una notificación con el motivo.`,
        { duration: 5000 }
      )
      await loadArticles()
      await loadStats()
      closeRejectModal()
    } else {
      const error = await response.json()
      toast.error(
        'Error al rechazar',
        error.message || 'No se pudo rechazar el artículo. Inténtalo de nuevo.',
        { duration: 5000 }
      )
    }
  } catch (error) {
    console.error('Error rechazando artículo:', error)
    toast.error(
      'Error de conexión',
      'No se pudo conectar con el servidor. Verifica tu conexión e inténtalo de nuevo.',
      { duration: 5000 }
    )
  }
}

const getStatusBadgeClass = (status: string) => {
  const classes: Record<string, string> = {
    pending: 'bg-yellow-100 text-yellow-800',
    approved_money: 'bg-green-100 text-green-800',
    approved_points: 'bg-blue-100 text-blue-800',
    approved_both: 'bg-purple-100 text-purple-800',
    rejected: 'bg-red-100 text-red-800'
  }
  return classes[status] || 'bg-gray-100 text-gray-800'
}

const getStatusText = (status: string) => {
  const texts: Record<string, string> = {
    pending: 'Pendiente',
    approved_money: 'Aprobado (Dinero)',
    approved_points: 'Aprobado (Puntos)',
    approved_both: 'Aprobado (Ambos)',
    rejected: 'Rechazado'
  }
  return texts[status] || status
}

const getSellerInfo = (article: any) => {
  // Manejar seller, vendedor_id e id_vendedor
  const seller = article.seller || article.vendedor_id || article.id_vendedor
  return {
    name: seller?.name || 'No disponible',
    email: seller?.email || 'No disponible',
    points: seller?.points || 0,
    logisticsLevel: seller?.logisticsLevel || 'civil'
  }
}

// Lifecycle
onMounted(() => {
  loadStats()
  loadArticles()
})
</script>

