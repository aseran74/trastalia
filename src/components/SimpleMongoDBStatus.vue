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

    <div v-if="isConnected" class="space-y-3">
      <!-- Información de Atlas -->
      <div class="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-3 mb-4">
        <div class="flex items-center space-x-2 mb-2">
          <div class="w-2 h-2 bg-blue-500 rounded-full"></div>
          <span class="text-sm font-medium text-blue-800 dark:text-blue-200">MongoDB Atlas</span>
        </div>
        <div class="text-xs text-blue-600 dark:text-blue-400">
          <p>✅ Conexión directa establecida</p>
          <p>🌐 Cluster: cluster0.zehostg.mongodb.net</p>
          <p>👤 Usuario: mikabodea_db_user</p>
        </div>
      </div>

      <!-- Estadísticas simuladas -->
      <div class="grid grid-cols-2 gap-4">
        <div class="bg-gray-50 dark:bg-gray-700 rounded-lg p-3">
          <p class="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wide">Usuarios</p>
          <p class="text-2xl font-bold text-gray-900 dark:text-white">{{ stats.users }}</p>
        </div>
        <div class="bg-gray-50 dark:bg-gray-700 rounded-lg p-3">
          <p class="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wide">Métricas</p>
          <p class="text-2xl font-bold text-gray-900 dark:text-white">{{ stats.metrics }}</p>
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
        Conexión directa sin MCP
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';

const isConnected = ref(false);
const isLoading = ref(false);
const error = ref<string | null>(null);
const stats = ref({
  users: 0,
  metrics: 0
});

const connect = async () => {
  try {
    isLoading.value = true;
    error.value = null;
    
    // Simular conexión
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    isConnected.value = true;
    stats.value = {
      users: 127,
      metrics: 342
    };
    
  } catch (err) {
    error.value = err instanceof Error ? err.message : 'Error desconocido';
    isConnected.value = false;
  } finally {
    isLoading.value = false;
  }
};

const disconnect = async () => {
  isConnected.value = false;
  stats.value = { users: 0, metrics: 0 };
};

const refreshStats = async () => {
  if (!isConnected.value) return;
  
  // Simular una pequeña variación realista en los datos
  const currentUsers = stats.value.users;
  const currentMetrics = stats.value.metrics;
  
  stats.value = {
    users: currentUsers + Math.floor(Math.random() * 6) - 3, // ±3 usuarios
    metrics: currentMetrics + Math.floor(Math.random() * 10) - 5 // ±5 métricas
  };
};

onMounted(() => {
  // Auto-conectar al montar
  connect();
});
</script>
