import { ref, onMounted, onUnmounted } from 'vue';
import mcpClient, { MCPQuery, MCPAggregate } from '../mcp/mcp-client';

export function useMCP() {
  const isConnected = ref(false);
  const isLoading = ref(false);
  const error = ref<string | null>(null);
  const collections = ref<string[]>([]);
  const stats = ref<any>(null);

  const connect = async () => {
    try {
      isLoading.value = true;
      error.value = null;
      
      // Conectar al servidor MCP
      await mcpClient.connect('tsx', ['scripts/start-mcp-server.ts']);
      isConnected.value = true;
      
      // Cargar datos iniciales
      await loadCollections();
      await loadStats();
      
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Error desconocido';
      isConnected.value = false;
    } finally {
      isLoading.value = false;
    }
  };

  const disconnect = async () => {
    try {
      await mcpClient.disconnect();
      isConnected.value = false;
      collections.value = [];
      stats.value = null;
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Error al desconectar';
    }
  };

  const loadCollections = async () => {
    if (!isConnected.value) return;
    
    try {
      const result = await mcpClient.listCollections();
      collections.value = result;
    } catch (err) {
      console.error('Error al cargar colecciones:', err);
    }
  };

  const loadStats = async () => {
    if (!isConnected.value) return;
    
    try {
      const result = await mcpClient.getStats();
      stats.value = result;
    } catch (err) {
      console.error('Error al cargar estadísticas:', err);
    }
  };

  const query = async (query: MCPQuery) => {
    if (!isConnected.value) {
      throw new Error('MCP no conectado');
    }
    
    try {
      return await mcpClient.query(query);
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Error en consulta';
      throw err;
    }
  };

  const aggregate = async (aggregate: MCPAggregate) => {
    if (!isConnected.value) {
      throw new Error('MCP no conectado');
    }
    
    try {
      return await mcpClient.aggregate(aggregate);
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Error en agregación';
      throw err;
    }
  };

  // Métodos de conveniencia para operaciones comunes
  const findUsers = async (filter = {}, options = {}) => {
    return await query({
      collection: 'users',
      operation: 'find',
      query: filter,
      options
    });
  };

  const findMetrics = async (filter = {}, options = {}) => {
    return await query({
      collection: 'metrics',
      operation: 'find',
      query: filter,
      options
    });
  };

  const getUserStats = async () => {
    return await aggregate({
      collection: 'users',
      pipeline: [
        {
          $group: {
            _id: null,
            total: { $sum: 1 },
            active: { $sum: { $cond: ['$isActive', 1, 0] } },
            admins: { $sum: { $cond: [{ $eq: ['$role', 'admin'] }, 1, 0] } }
          }
        }
      ]
    });
  };

  const getMetricStats = async () => {
    return await aggregate({
      collection: 'metrics',
      pipeline: [
        {
          $group: {
            _id: null,
            total: { $sum: 1 },
            categories: { $addToSet: '$category' },
            periods: { $addToSet: '$period' }
          }
        },
        {
          $project: {
            total: 1,
            categories: { $size: '$categories' },
            periods: { $size: '$periods' }
          }
        }
      ]
    });
  };

  // Conectar automáticamente al montar
  onMounted(() => {
    connect();
  });

  // Desconectar al desmontar
  onUnmounted(() => {
    disconnect();
  });

  return {
    isConnected,
    isLoading,
    error,
    collections,
    stats,
    connect,
    disconnect,
    query,
    aggregate,
    findUsers,
    findMetrics,
    getUserStats,
    getMetricStats,
    loadCollections,
    loadStats
  };
}
