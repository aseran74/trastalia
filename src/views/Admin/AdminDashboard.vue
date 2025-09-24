<template>
  <AdminLayout>
    <div class="mx-auto max-w-screen-2xl p-4 md:p-6 2xl:p-10">
      <!-- Header -->
      <div class="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <h2 class="text-title-md2 font-semibold text-black dark:text-white">
          Panel de Administración
        </h2>
        <div class="flex items-center space-x-2">
          <span class="text-sm text-gray-500">Artículos Pendientes:</span>
          <span class="rounded-full bg-yellow-100 px-3 py-1 text-sm font-medium text-yellow-800">
            {{ pendingArticles.length }}
          </span>
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
              <option value="approved_money">Aprobados (Dinero)</option>
              <option value="approved_points">Aprobados (Puntos)</option>
              <option value="rejected">Rechazados</option>
            </select>
          </div>
          <div class="flex-1 min-w-48">
            <label class="mb-2 block text-sm font-medium text-black dark:text-white">
              Filtrar por categoría
            </label>
            <select 
              v-model="selectedCategory" 
              class="w-full rounded border border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
            >
              <option value="">Todas las categorías</option>
              <option value="electronica">Electrónica</option>
              <option value="hogar">Hogar</option>
              <option value="deportes">Deportes</option>
              <option value="moda">Moda</option>
              <option value="libros">Libros</option>
              <option value="otros">Otros</option>
            </select>
          </div>
        </div>
      </div>

      <!-- Lista de artículos -->
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
                    <span class="text-gray-500">
                      <strong>Centro logístico:</strong> {{ article.fromLogisticsCenter?.logisticsCenter?.name || 'N/A' }}
                    </span>
                  </div>
                  <div class="mt-2 flex flex-wrap gap-2">
                    <span v-if="article.fromLogisticsCenter?.directPurchase?.enabled" 
                          class="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                      💰 Compra Directa
                    </span>
                    <span v-if="article.fromLogisticsCenter?.pointsSale?.enabled" 
                          class="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                      ⭐ Venta por Puntos
                    </span>
                  </div>
                </div>
              </div>

              <!-- Información del vendedor -->
              <div class="mb-4 rounded-lg bg-gray-50 p-4 dark:bg-gray-800">
                <h4 class="font-medium text-black dark:text-white mb-2">Información del Vendedor</h4>
                <div class="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
                  <div>
                    <strong>Nombre:</strong> {{ article.seller?.name || 'N/A' }}
                  </div>
                  <div>
                    <strong>Email:</strong> {{ article.seller?.email || 'N/A' }}
                  </div>
                  <div>
                    <strong>Ubicación:</strong> {{ article.location }}
                  </div>
                  <div>
                    <strong>Fecha de solicitud:</strong> {{ formatDate(article.createdAt) }}
                  </div>
                </div>
              </div>

              <!-- Estado actual -->
              <div class="mb-4">
                <span 
                  :class="getStatusBadgeClass(article.adminStatus)"
                  class="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium"
                >
                  {{ getStatusText(article.adminStatus) }}
                </span>
              </div>
            </div>

            <!-- Panel de decisión del admin -->
            <div v-if="article.requestStatus === 'pending_review'" class="lg:w-80">
              <div class="rounded-lg border border-stroke bg-gray-50 p-4 dark:border-strokedark dark:bg-gray-800">
                <h4 class="font-medium text-black dark:text-white mb-4">Decisión del Administrador</h4>
                
                <!-- Opciones de decisión -->
                <div class="space-y-4">
                  <!-- Compra Directa -->
                  <div v-if="article.fromLogisticsCenter?.directPurchase?.enabled" class="border rounded-lg p-3">
                    <h5 class="font-medium text-blue-600 dark:text-blue-400 mb-2">💰 Compra Directa</h5>
                    <div class="space-y-3">
                      <label class="flex items-center">
                        <input 
                          type="radio" 
                          :name="`decision_${article._id}`"
                          :value="'approve_direct'"
                          v-model="article.decisions.directPurchaseDecision"
                          class="mr-2"
                        />
                        <span class="text-sm">Aprobar compra directa</span>
                      </label>
                      <label class="flex items-center">
                        <input 
                          type="radio" 
                          :name="`decision_${article._id}`"
                          :value="'reject_direct'"
                          v-model="article.decisions.directPurchaseDecision"
                          class="mr-2"
                        />
                        <span class="text-sm text-red-600">Rechazar compra directa</span>
                      </label>
                      <div v-if="article.decisions.directPurchaseDecision === 'approve_direct'" class="ml-6">
                        <label class="block text-sm text-gray-600 dark:text-gray-400 mb-1">
                          Precio de compra (€)
                        </label>
                        <input 
                          type="number" 
                          v-model="article.decisions.directPurchasePrice"
                          class="w-full rounded border border-stroke bg-transparent py-2 px-3 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                          placeholder="0.00"
                          step="0.01"
                          min="0"
                        />
                      </div>
                      <div v-if="article.decisions.directPurchaseDecision === 'reject_direct'" class="ml-6">
                        <label class="block text-sm text-gray-600 dark:text-gray-400 mb-1">
                          Motivo del rechazo
                        </label>
                        <textarea 
                          v-model="article.decisions.directPurchaseRejectReason"
                          class="w-full rounded border border-stroke bg-transparent py-2 px-3 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                          rows="2"
                          placeholder="Explica por qué se rechaza la compra directa..."
                        ></textarea>
                      </div>
                    </div>
                  </div>

                  <!-- Venta por Puntos -->
                  <div v-if="article.fromLogisticsCenter?.pointsSale?.enabled" class="border rounded-lg p-3">
                    <h5 class="font-medium text-green-600 dark:text-green-400 mb-2">⭐ Venta por Puntos</h5>
                    <div class="space-y-3">
                      <label class="flex items-center">
                        <input 
                          type="radio" 
                          :name="`points_decision_${article._id}`"
                          :value="'approve_points'"
                          v-model="article.decisions.pointsSaleDecision"
                          class="mr-2"
                        />
                        <span class="text-sm">Aprobar venta por puntos</span>
                      </label>
                      <label class="flex items-center">
                        <input 
                          type="radio" 
                          :name="`points_decision_${article._id}`"
                          :value="'reject_points'"
                          v-model="article.decisions.pointsSaleDecision"
                          class="mr-2"
                        />
                        <span class="text-sm text-red-600">Rechazar venta por puntos</span>
                      </label>
                      <div v-if="article.decisions.pointsSaleDecision === 'approve_points'" class="ml-6">
                        <label class="block text-sm text-gray-600 dark:text-gray-400 mb-1">
                          Cantidad de puntos
                        </label>
                        <input 
                          type="number" 
                          v-model="article.decisions.pointsAmount"
                          class="w-full rounded border border-stroke bg-transparent py-2 px-3 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                          placeholder="0"
                          step="1"
                          min="0"
                        />
                        <p class="text-xs text-gray-500 mt-1">
                          Tasa de conversión: {{ article.fromLogisticsCenter?.pointsSale?.conversionRate || 1.2 }}x
                        </p>
                      </div>
                      <div v-if="article.decisions.pointsSaleDecision === 'reject_points'" class="ml-6">
                        <label class="block text-sm text-gray-600 dark:text-gray-400 mb-1">
                          Motivo del rechazo
                        </label>
                        <textarea 
                          v-model="article.decisions.pointsSaleRejectReason"
                          class="w-full rounded border border-stroke bg-transparent py-2 px-3 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                          rows="2"
                          placeholder="Explica por qué se rechaza la venta por puntos..."
                        ></textarea>
                      </div>
                    </div>
                  </div>
                </div>

                <!-- Notas adicionales -->
                <div class="mt-4">
                  <label class="block text-sm text-gray-600 dark:text-gray-400 mb-1">
                    Notas adicionales (opcional)
                  </label>
                  <textarea 
                    v-model="article.decisions.notes"
                    class="w-full rounded border border-stroke bg-transparent py-2 px-3 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                    rows="2"
                    placeholder="Notas adicionales para el vendedor..."
                  ></textarea>
                </div>

                <!-- Botones de acción -->
                <div class="mt-6 flex gap-2">
                  <button 
                    @click="processDecision(article)"
                    :disabled="!hasAnyDecision(article) || isProcessing[article._id]"
                    class="flex-1 rounded bg-primary py-2 px-4 font-medium text-white hover:bg-opacity-90 disabled:bg-gray-400 disabled:cursor-not-allowed"
                  >
                    {{ isProcessing[article._id] ? 'Procesando...' : 'Guardar Decisión' }}
                  </button>
                  <button 
                    @click="resetDecisions(article)"
                    class="rounded border border-stroke bg-transparent py-2 px-4 font-medium text-black hover:bg-gray-50 dark:border-form-strokedark dark:text-white dark:hover:bg-gray-800"
                  >
                    Limpiar
                  </button>
                </div>
              </div>
            </div>

            <!-- Información de decisión ya tomada -->
            <div v-else class="lg:w-80">
              <div class="rounded-lg border border-stroke bg-gray-50 p-4 dark:border-strokedark dark:bg-gray-800">
                <h4 class="font-medium text-black dark:text-white mb-4">Decisión Tomada</h4>
                <div class="space-y-2 text-sm">
                  <div v-if="article.adminDecision?.money">
                    <strong>Compra con dinero:</strong> €{{ article.adminDecision.moneyPrice }}
                  </div>
                  <div v-if="article.adminDecision?.points">
                    <strong>Compra con puntos:</strong> {{ article.adminDecision.pointsAmount }} puntos
                  </div>
                  <div v-if="article.adminDecision?.reject">
                    <strong>Rechazado:</strong> {{ article.adminDecision.rejectReason }}
                  </div>
                  <div class="text-gray-500">
                    <strong>Fecha:</strong> {{ formatDate(article.adminDecision?.date) }}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Mensaje cuando no hay artículos -->
      <div v-if="filteredArticles.length === 0" class="text-center py-12">
        <div class="mx-auto max-w-md">
          <div class="mb-4">
            <svg class="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
          <h3 class="text-lg font-medium text-gray-900 dark:text-white mb-2">
            No hay artículos
          </h3>
          <p class="text-gray-500 dark:text-gray-400">
            {{ selectedStatus || selectedCategory ? 'No se encontraron artículos con los filtros seleccionados.' : 'No hay artículos pendientes de revisión.' }}
          </p>
        </div>
      </div>
    </div>
  </AdminLayout>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import AdminLayout from '@/components/layout/AdminLayout.vue'
import API_BASE_URL from '@/config/api'

// Estado reactivo
const articles = ref([])
const loading = ref(false)
const selectedStatus = ref('')
const selectedCategory = ref('')

    // Cargar artículos
    const loadArticles = async () => {
      loading.value = true
      try {
        const token = localStorage.getItem('auth_token') || sessionStorage.getItem('auth_token')
        const response = await fetch(`/api/articles`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        })

        if (response.ok) {
          const data = await response.json()
          articles.value = data.data.map(article => {
            // Detectar si es estructura nueva o antigua
            const isNewStructure = article.saleType === 'from_logistics_center'
            
            return {
              ...article,
              isNewStructure,
              decisions: {
                // Decisiones de compra directa
                directPurchaseDecision: '',
                directPurchasePrice: article.price,
                directPurchaseRejectReason: '',
                // Decisiones de venta por puntos
                pointsSaleDecision: '',
                pointsAmount: Math.round(article.price * (article.fromLogisticsCenter?.pointsSale?.conversionRate || 1.2)),
                pointsSaleRejectReason: '',
                // Notas generales
                notes: ''
              }
            }
          })
        } else {
          console.error('Error cargando artículos:', response.statusText)
        }
      } catch (error) {
        console.error('Error cargando artículos:', error)
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

  if (selectedCategory.value) {
    filtered = filtered.filter(article => article.category === selectedCategory.value)
  }

  return filtered
})

// Artículos pendientes
const pendingArticles = computed(() => {
  return articles.value.filter(article => article.adminStatus === 'pending')
})

// Verificar si se puede procesar la decisión
const hasAnyDecision = (article) => {
  const hasDirectPurchaseDecision = article.fromLogisticsCenter?.directPurchase?.enabled && 
    (article.decisions.directPurchaseDecision === 'approve_direct' || article.decisions.directPurchaseDecision === 'reject_direct')
  
  const hasPointsSaleDecision = article.fromLogisticsCenter?.pointsSale?.enabled && 
    (article.decisions.pointsSaleDecision === 'approve_points' || article.decisions.pointsSaleDecision === 'reject_points')
  
  return hasDirectPurchaseDecision || hasPointsSaleDecision
}

// Procesar decisión del admin
const processDecision = async (article) => {
  try {
    const token = localStorage.getItem('auth_token') || sessionStorage.getItem('auth_token')
    
    // Procesar compra directa si está habilitada
    if (article.fromLogisticsCenter?.directPurchase?.enabled && article.decisions.directPurchaseDecision) {
      const directPurchaseData = {
        articleId: article._id,
        requestType: 'direct_purchase',
        decision: article.decisions.directPurchaseDecision === 'approve_direct' ? 'approve' : 'reject',
        price: article.decisions.directPurchasePrice,
        notes: article.decisions.notes
      }

      const response = await fetch(`/api/admin/process-article`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(directPurchaseData)
      })

      if (!response.ok) {
        const error = await response.json()
        alert(`Error procesando compra directa: ${error.message}`)
        return
      }
    }

    // Procesar venta por puntos si está habilitada
    if (article.fromLogisticsCenter?.pointsSale?.enabled && article.decisions.pointsSaleDecision) {
      const pointsSaleData = {
        articleId: article._id,
        requestType: 'points_sale',
        decision: article.decisions.pointsSaleDecision === 'approve_points' ? 'approve' : 'reject',
        points: article.decisions.pointsAmount,
        notes: article.decisions.notes
      }

      const response = await fetch(`/api/admin/process-article`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(pointsSaleData)
      })

      if (!response.ok) {
        const error = await response.json()
        alert(`Error procesando venta por puntos: ${error.message}`)
        return
      }
    }

    alert('Decisión procesada exitosamente')
    // Recargar artículos para ver los cambios
    await loadArticles()
  } catch (error) {
    console.error('Error procesando decisión:', error)
    alert('Error al procesar la decisión')
  }
}

// Limpiar decisiones
const resetDecisions = (article) => {
  article.decisions = {
    // Decisiones de compra directa
    directPurchaseDecision: '',
    directPurchasePrice: article.price,
    directPurchaseRejectReason: '',
    // Decisiones de venta por puntos
    pointsSaleDecision: '',
    pointsAmount: Math.round(article.price * (article.fromLogisticsCenter?.pointsSale?.conversionRate || 1.2)),
    pointsSaleRejectReason: '',
    // Notas generales
    notes: ''
  }
}

// Obtener clase del badge de estado
const getStatusBadgeClass = (status) => {
  const classes = {
    pending: 'bg-yellow-100 text-yellow-800',
    approved_money: 'bg-green-100 text-green-800',
    approved_points: 'bg-blue-100 text-blue-800',
    rejected: 'bg-red-100 text-red-800'
  }
  return classes[status] || 'bg-gray-100 text-gray-800'
}

// Obtener texto del estado
const getStatusText = (status) => {
  const texts = {
    pending: 'Pendiente',
    approved_money: 'Aprobado (Dinero)',
    approved_points: 'Aprobado (Puntos)',
    rejected: 'Rechazado'
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
