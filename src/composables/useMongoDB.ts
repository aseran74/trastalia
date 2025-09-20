import { ref, onMounted, onUnmounted } from 'vue';
import mongodbService from '../services/mongodb.service';

export function useMongoDB() {
  const isConnected = ref(false);
  const isLoading = ref(false);
  const error = ref<string | null>(null);

  const connect = async () => {
    try {
      isLoading.value = true;
      error.value = null;
      await mongodbService.connect();
      isConnected.value = true;
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Error desconocido';
      isConnected.value = false;
    } finally {
      isLoading.value = false;
    }
  };

  const disconnect = async () => {
    try {
      await mongodbService.disconnect();
      isConnected.value = false;
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Error al desconectar';
    }
  };

  // Conectar automáticamente al montar el componente
  onMounted(() => {
    connect();
  });

  // Desconectar al desmontar el componente
  onUnmounted(() => {
    disconnect();
  });

  return {
    isConnected,
    isLoading,
    error,
    connect,
    disconnect,
    mongodbService
  };
}
