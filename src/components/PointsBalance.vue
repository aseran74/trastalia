<template>
  <div class="rounded-lg border border-stroke bg-white p-6 shadow-default dark:border-strokedark dark:bg-boxdark">
    <div class="flex items-center justify-between mb-4">
      <h3 class="text-lg font-semibold text-black dark:text-white">
        ⭐ Mis Puntos Trastalia
      </h3>
      <button
        @click="refreshBalance"
        :disabled="loading"
        class="rounded-lg bg-primary px-3 py-2 text-sm font-medium text-white hover:bg-primary/90 disabled:opacity-50"
      >
        {{ loading ? 'Cargando...' : 'Actualizar' }}
      </button>
    </div>

    <div v-if="loading && !balance" class="flex justify-center py-8">
      <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
    </div>

    <div v-else-if="balance" class="space-y-4">
      <!-- Balance principal -->
      <div class="grid grid-cols-1 gap-4 md:grid-cols-3">
        <div class="rounded-lg bg-primary/10 p-4 text-center">
          <div class="text-2xl font-bold text-primary">{{ balance?.points?.toLocaleString() || '0' }}</div>
          <div class="text-sm text-gray-600 dark:text-gray-400">Puntos Disponibles</div>
        </div>
        
        <div class="rounded-lg bg-gray-100 p-4 text-center dark:bg-gray-800">
          <div class="text-2xl font-bold text-gray-900 dark:text-white">{{ balance?.points?.toLocaleString() || '0' }}</div>
          <div class="text-sm text-gray-600 dark:text-gray-400">Total Ganados</div>
        </div>
        
        <div class="rounded-lg bg-gray-100 p-4 text-center dark:bg-gray-800">
          <div class="text-2xl font-bold text-gray-900 dark:text-white">0</div>
          <div class="text-sm text-gray-600 dark:text-gray-400">Puntos Usados</div>
        </div>
      </div>

      <!-- Conversión a euros -->
      <div class="rounded-lg bg-gray-50 p-4 dark:bg-gray-800">
        <div class="text-center">
          <div class="text-lg font-semibold text-gray-900 dark:text-white">
            Equivalente en euros: €{{ ((balance?.points || 0) / 1).toFixed(2) }}
          </div>
          <div class="text-sm text-gray-600 dark:text-gray-400">
            (1 punto = 1€)
          </div>
        </div>
      </div>

      <!-- Acciones rápidas -->
      <div class="flex gap-2">
        <button
          @click="$router.push('/mis-transacciones-puntos')"
          class="flex-1 rounded-lg border border-stroke px-4 py-2 text-sm font-medium text-black hover:bg-gray-50 dark:border-strokedark dark:text-white dark:hover:bg-boxdark"
        >
          Ver Historial
        </button>
        <button
          @click="$router.push('/comprar-con-puntos')"
          class="flex-1 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white hover:bg-primary/90"
        >
          Comprar con Puntos
        </button>
      </div>
    </div>

    <div v-else class="text-center py-8">
      <div class="text-gray-500 dark:text-gray-400">
        No se pudo cargar el balance de puntos
      </div>
      <button
        @click="refreshBalance"
        class="mt-2 text-primary hover:underline"
      >
        Intentar de nuevo
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useAuthStore } from '@/stores/auth'
import API_BASE_URL from '@/config/api'

const authStore = useAuthStore()
const balance = ref(null)
const loading = ref(false)

const loadBalance = async () => {
  console.log('🔍 PointsBalance - Iniciando carga de balance')
  loading.value = true
  try {
    const token = authStore.token
    console.log('🔍 PointsBalance - Token obtenido:', token ? 'Sí' : 'No')
    
    const url = `${API_BASE_URL}/api/user/points-balance`
    console.log('🔍 PointsBalance - URL de la API:', url)
    
    const response = await fetch(url, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    })

    console.log('🔍 PointsBalance - Response status:', response.status)

    if (response.ok) {
      const data = await response.json()
      console.log('🔍 PointsBalance - Datos recibidos:', data)
      console.log('🔍 PointsBalance - Balance data:', data.data)
      balance.value = data.data
      console.log('🔍 PointsBalance - Balance.value asignado:', balance.value)
    } else {
      console.error('Error cargando balance de puntos:', response.statusText)
    }
  } catch (error) {
    console.error('Error cargando balance de puntos:', error)
  } finally {
    loading.value = false
  }
}

const refreshBalance = () => {
  loadBalance()
}

onMounted(() => {
  console.log('🔍 PointsBalance - Componente montado, iniciando carga de balance')
  loadBalance()
})
</script>

