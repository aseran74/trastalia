<template>
  <div class="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
    <div class="flex items-center justify-between mb-4">
      <h3 class="text-lg font-semibold text-gray-900 dark:text-white">
        Estado de MongoDB Atlas
      </h3>
      <div class="flex items-center space-x-2">
        <div 
          :class="[
            'w-3 h-3 rounded-full',
            isConnected ? 'bg-green-500' : 'bg-red-500'
          ]"
        ></div>
        <span 
          :class="[
            'text-sm font-medium',
            isConnected ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'
          ]"
        >
          {{ isConnected ? 'Conectado a Atlas' : 'Desconectado' }}
        </span>
      </div>
    </div>

    <div v-if="isLoading" class="flex items-center space-x-2">
      <div class="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
      <span class="text-sm text-gray-600 dark:text-gray-400">Conectando...</span>
    </div>

    <div v-if="error" class="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-md p-3 mb-4">
      <p class="text-sm text-red-600 dark:text-red-400">{{ error }}</p>
    </div>

    <div v-if="isConnected && stats" class="space-y-3">
      <!-- Información de Atlas -->
      <div class="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-3 mb-4">
        <div class="flex items-center space-x-2 mb-2">
          <div class="w-2 h-2 bg-blue-500 rounded-full"></div>
          <span class="text-sm font-medium text-blue-800 dark:text-blue-200">MongoDB Atlas</span>
        </div>
        <div class="grid grid-cols-2 gap-2 text-xs">
          <div>
            <span class="text-blue-600 dark:text-blue-400">Bases de datos:</span>
            <span class="font-medium text-blue-800 dark:text-blue-200">{{ databases.length }}</span>
          </div>
          <div>
            <span class="text-blue-600 dark:text-blue-400">Colecciones:</span>
            <span class="font-medium text-blue-800 dark:text-blue-200">{{ collections.length }}</span>
          </div>
        </div>
      </div>

      <!-- Estadísticas de datos -->
      <div class="grid grid-cols-2 gap-4">
        <div class="bg-gray-50 dark:bg-gray-700 rounded-lg p-3">
          <p class="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wide">Usuarios</p>
          <p class="text-2xl font-bold text-gray-900 dark:text-white">{{ stats.users.total }}</p>
        </div>
        <div class="bg-gray-50 dark:bg-gray-700 rounded-lg p-3">
          <p class="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wide">Métricas</p>
          <p class="text-2xl font-bold text-gray-900 dark:text-white">{{ stats.metrics.total }}</p>
        </div>
      </div>
      
      <div class="flex space-x-2">
        <button 
          @click="refreshStats"
          :disabled="isLoading"
          class="px-3 py-1 text-xs bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
        >
          Actualizar
        </button>
        <button 
          @click="disconnect"
          :disabled="isLoading"
          class="px-3 py-1 text-xs bg-red-600 text-white rounded hover:bg-red-700 disabled:opacity-50"
        >
          Desconectar
        </button>
      </div>
    </div>

    <div v-if="!isConnected && !isLoading" class="text-center">
      <button 
        @click="connect"
        :disabled="isLoading"
        class="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
      >
        Conectar a MongoDB Atlas
      </button>
      <p class="text-xs text-gray-500 dark:text-gray-400 mt-2">
        Asegúrate de configurar las variables de entorno para Atlas
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useAtlasMCP } from '../composables/useAtlasMCP';

const { 
  isConnected, 
  isLoading, 
  error, 
  connect, 
  disconnect, 
  getUserStats, 
  getMetricStats,
  collections,
  databases,
  currentDatabase
} = useAtlasMCP();

const stats = ref<any>(null);

const refreshStats = async () => {
  if (!isConnected.value) return;
  
  try {
    const [userStatsResult, metricStatsResult] = await Promise.all([
      getUserStats(),
      getMetricStats()
    ]);
    
    const userStats = userStatsResult?.[0] || { total: 0, active: 0, admins: 0 };
    const metricStats = metricStatsResult?.[0] || { total: 0, categories: 0, periods: 0 };
    
    stats.value = {
      users: {
        total: userStats.total,
        active: userStats.active,
        admins: userStats.admins,
        inactive: userStats.total - userStats.active
      },
      metrics: {
        total: metricStats.total,
        categories: metricStats.categories,
        periods: metricStats.periods
      }
    };
  } catch (err) {
    console.error('Error al obtener estadísticas:', err);
  }
};

onMounted(() => {
  if (isConnected.value) {
    refreshStats();
  }
});
</script>
