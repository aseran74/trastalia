<template>
  <AdminLayout>
    <div class="mx-auto max-w-screen-2xl p-4 md:p-6 2xl:p-10">
      <!-- Header -->
      <div class="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <h2 class="text-title-md2 font-semibold text-black dark:text-white">
          Historial de Puntos
        </h2>
        <nav>
          <ol class="flex items-center gap-2">
            <li><a class="font-medium" href="/dashboard">Dashboard /</a></li>
            <li class="font-medium text-primary">Historial de Puntos</li>
          </ol>
        </nav>
      </div>

      <!-- Balance actual -->
      <div class="mb-6">
        <PointsBalance />
      </div>

      <!-- Filtros -->
      <div class="mb-6 rounded-sm border border-stroke bg-white p-4 shadow-default dark:border-strokedark dark:bg-boxdark">
        <div class="flex flex-wrap gap-4">
          <div>
            <label class="mb-2 block text-sm font-medium text-black dark:text-white">
              Tipo de transacción
            </label>
            <select
              v-model="filters.type"
              @change="loadTransactions"
              class="rounded border-[1.5px] border-stroke bg-transparent py-2 px-4 font-medium outline-none transition focus:border-primary dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
            >
              <option value="">Todos</option>
              <option value="earn">Ganados</option>
              <option value="spend">Gastados</option>
              <option value="refund">Reembolsados</option>
              <option value="admin_adjustment">Ajuste Admin</option>
            </select>
          </div>
          
          <div>
            <label class="mb-2 block text-sm font-medium text-black dark:text-white">
              Estado
            </label>
            <select
              v-model="filters.status"
              @change="loadTransactions"
              class="rounded border-[1.5px] border-stroke bg-transparent py-2 px-4 font-medium outline-none transition focus:border-primary dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
            >
              <option value="">Todos</option>
              <option value="pending">Pendiente</option>
              <option value="completed">Completado</option>
              <option value="cancelled">Cancelado</option>
            </select>
          </div>
        </div>
      </div>

      <!-- Lista de transacciones -->
      <div class="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
        <div class="px-6 py-4">
          <h3 class="text-lg font-semibold text-black dark:text-white">
            Transacciones
          </h3>
        </div>

        <div v-if="loading" class="flex justify-center py-8">
          <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>

        <div v-else-if="transactions && transactions.length === 0" class="px-6 py-8 text-center">
          <div class="text-gray-500 dark:text-gray-400">
            No hay transacciones disponibles
          </div>
        </div>

        <div v-else-if="transactions && transactions.length > 0" class="divide-y divide-stroke dark:divide-strokedark">
          <div
            v-for="transaction in transactions"
            :key="transaction.id"
            class="px-6 py-4 hover:bg-gray-50 dark:hover:bg-boxdark"
          >
            <div class="flex items-center justify-between">
              <div class="flex-1">
                <div class="flex items-center gap-3">
                  <div
                    :class="[
                      'w-3 h-3 rounded-full',
                      getTransactionColor(transaction.type)
                    ]"
                  ></div>
                  <div>
                    <div class="font-medium text-black dark:text-white">
                      {{ transaction.description }}
                    </div>
                    <div class="text-sm text-gray-600 dark:text-gray-400">
                      {{ formatDate(transaction.createdAt) }}
                    </div>
                    <div v-if="transaction.article" class="text-sm text-gray-600 dark:text-gray-400">
                      Artículo: {{ transaction.article.title }}
                    </div>
                  </div>
                </div>
              </div>
              
              <div class="text-right">
                <div
                  :class="[
                    'text-lg font-semibold',
                    transaction.type === 'earn' || transaction.type === 'refund' || transaction.type === 'admin_adjustment'
                      ? 'text-green-600 dark:text-green-400'
                      : 'text-red-600 dark:text-red-400'
                  ]"
                >
                  {{ transaction.type === 'earn' || transaction.type === 'refund' || transaction.type === 'admin_adjustment' ? '+' : '-' }}{{ transaction.amount.toLocaleString() }} pts
                </div>
                <div class="text-sm text-gray-600 dark:text-gray-400">
                  {{ getTransactionStatus(transaction.status) }}
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Paginación -->
        <div v-if="pagination && pagination.total > 1" class="px-6 py-4 border-t border-stroke dark:border-strokedark">
          <div class="flex items-center justify-between">
            <div class="text-sm text-gray-600 dark:text-gray-400">
              Página {{ pagination.current || 1 }} de {{ pagination.total || 1 }}
            </div>
            <div class="flex gap-2">
              <button
                @click="changePage(pagination.current - 1)"
                :disabled="pagination.current <= 1"
                class="rounded-lg border border-stroke px-3 py-2 text-sm font-medium text-black hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed dark:border-strokedark dark:text-white dark:hover:bg-boxdark"
              >
                Anterior
              </button>
              <button
                @click="changePage(pagination.current + 1)"
                :disabled="pagination.current >= (pagination.total || 1)"
                class="rounded-lg border border-stroke px-3 py-2 text-sm font-medium text-black hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed dark:border-strokedark dark:text-white dark:hover:bg-boxdark"
              >
                Siguiente
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </AdminLayout>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import AdminLayout from '@/components/layout/AdminLayout.vue'
import PointsBalance from '@/components/PointsBalance.vue'
import { useAuthStore } from '@/stores/auth'

const authStore = useAuthStore()

const transactions = ref([])
const loading = ref(false)
const pagination = ref({
  current: 1,
  total: 1,
  count: 0
})

const filters = ref({
  type: '',
  status: ''
})

const loadTransactions = async (page = 1) => {
  console.log('🔍 Iniciando carga de transacciones, página:', page)
  console.log('🔍 Estado inicial de transactions:', transactions.value)
  loading.value = true
  try {
    const token = authStore.token
    console.log('🔍 Token obtenido:', token ? 'Sí' : 'No')
    
    const queryParams = new URLSearchParams({
      page: page.toString(),
      limit: '20'
    })
    
    if (filters.value.type) queryParams.append('type', filters.value.type)
    if (filters.value.status) queryParams.append('status', filters.value.status)

    const response = await fetch(`/api/user/points-transactions?${queryParams}`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })

    if (response.ok) {
      const data = await response.json()
      console.log('🔍 Datos recibidos de API:', data)
      console.log('🔍 Transacciones:', data.data.transactions)
      console.log('🔍 Paginación:', data.data.pagination)
      transactions.value = data.data.transactions || []
      pagination.value = data.data.pagination || {
        current: 1,
        total: 1,
        count: 0
      }
      console.log('🔍 Transactions.value después de asignar:', transactions.value)
      console.log('🔍 Pagination.value después de asignar:', pagination.value)
    } else {
      console.error('Error cargando transacciones:', response.statusText)
    }
  } catch (error) {
    console.error('Error cargando transacciones:', error)
  } finally {
    loading.value = false
  }
}

const changePage = (page) => {
  if (pagination.value && page >= 1 && page <= (pagination.value.total || 1)) {
    loadTransactions(page)
  }
}

const getTransactionColor = (type) => {
  const colors = {
    earn: 'bg-green-500',
    spend: 'bg-red-500',
    refund: 'bg-blue-500',
    admin_adjustment: 'bg-purple-500'
  }
  return colors[type] || 'bg-gray-500'
}

const getTransactionStatus = (status) => {
  const statuses = {
    pending: 'Pendiente',
    completed: 'Completado',
    cancelled: 'Cancelado'
  }
  return statuses[status] || status
}

const formatDate = (dateString) => {
  const date = new Date(dateString)
  return date.toLocaleDateString('es-ES', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

onMounted(() => {
  console.log('🔍 Componente PointsHistory montado, iniciando carga de transacciones')
  console.log('🔍 AuthStore estado:', {
    isAuthenticated: authStore.isAuthenticated,
    user: authStore.user,
    token: authStore.token ? 'Presente' : 'Ausente'
  })
  loadTransactions()
})
</script>

