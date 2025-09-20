import { ref, onMounted, onUnmounted } from 'vue';
import atlasMCPClient, { AtlasMCPQuery, AtlasMCPAggregate } from '../mcp/atlas-mcp-client';

export function useAtlasMCP() {
  const isConnected = ref(false);
  const isLoading = ref(false);
  const error = ref<string | null>(null);
  const databases = ref<string[]>([]);
  const collections = ref<string[]>([]);
  const currentDatabase = ref<string>('');

  const connect = async () => {
    try {
      isLoading.value = true;
      error.value = null;
      
      await atlasMCPClient.connect();
      isConnected.value = true;
      
      // Cargar datos iniciales
      await loadDatabases();
      
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Error desconocido';
      isConnected.value = false;
    } finally {
      isLoading.value = false;
    }
  };

  const disconnect = async () => {
    try {
      await atlasMCPClient.disconnect();
      isConnected.value = false;
      databases.value = [];
      collections.value = [];
      currentDatabase.value = '';
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Error al desconectar';
    }
  };

  const loadDatabases = async () => {
    if (!isConnected.value) return;
    
    try {
      const result = await atlasMCPClient.listDatabases();
      databases.value = result.map((db: any) => db.name);
    } catch (err) {
      console.error('Error al cargar bases de datos:', err);
    }
  };

  const loadCollections = async (database?: string) => {
    if (!isConnected.value) return;
    
    try {
      const result = await atlasMCPClient.listCollections(database);
      collections.value = result.map((col: any) => col.name);
      if (database) {
        currentDatabase.value = database;
      }
    } catch (err) {
      console.error('Error al cargar colecciones:', err);
    }
  };

  const find = async (query: AtlasMCPQuery) => {
    if (!isConnected.value) {
      throw new Error('Atlas MCP no conectado');
    }
    
    try {
      return await atlasMCPClient.find(query);
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Error en consulta';
      throw err;
    }
  };

  const findOne = async (query: AtlasMCPQuery) => {
    if (!isConnected.value) {
      throw new Error('Atlas MCP no conectado');
    }
    
    try {
      return await atlasMCPClient.findOne(query);
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Error en consulta';
      throw err;
    }
  };

  const aggregate = async (aggregate: AtlasMCPAggregate) => {
    if (!isConnected.value) {
      throw new Error('Atlas MCP no conectado');
    }
    
    try {
      return await atlasMCPClient.aggregate(aggregate);
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Error en agregación';
      throw err;
    }
  };

  const insertOne = async (collection: string, document: any, database?: string) => {
    if (!isConnected.value) {
      throw new Error('Atlas MCP no conectado');
    }
    
    try {
      return await atlasMCPClient.insertOne(collection, document, database);
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Error en inserción';
      throw err;
    }
  };

  const updateOne = async (collection: string, filter: any, update: any, database?: string) => {
    if (!isConnected.value) {
      throw new Error('Atlas MCP no conectado');
    }
    
    try {
      return await atlasMCPClient.updateOne(collection, filter, update, database);
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Error en actualización';
      throw err;
    }
  };

  const deleteOne = async (collection: string, filter: any, database?: string) => {
    if (!isConnected.value) {
      throw new Error('Atlas MCP no conectado');
    }
    
    try {
      return await atlasMCPClient.deleteOne(collection, filter, database);
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Error en eliminación';
      throw err;
    }
  };

  // Métodos de conveniencia para operaciones comunes
  const findUsers = async (filter = {}, options = {}) => {
    return await find({
      collection: 'users',
      database: currentDatabase.value,
      filter,
      ...options
    });
  };

  const findMetrics = async (filter = {}, options = {}) => {
    return await find({
      collection: 'metrics',
      database: currentDatabase.value,
      filter,
      ...options
    });
  };

  const getUserStats = async () => {
    return await aggregate({
      collection: 'users',
      database: currentDatabase.value,
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
      database: currentDatabase.value,
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
    databases,
    collections,
    currentDatabase,
    connect,
    disconnect,
    find,
    findOne,
    aggregate,
    insertOne,
    updateOne,
    deleteOne,
    findUsers,
    findMetrics,
    getUserStats,
    getMetricStats,
    loadDatabases,
    loadCollections
  };
}
