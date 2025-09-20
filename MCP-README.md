# Configuración MCP (Model Context Protocol) con MongoDB Atlas

Este proyecto está configurado para usar MCP (Model Context Protocol) para conectar con MongoDB Atlas de manera profesional.

## 🚀 Inicio Rápido

### 1. Configurar MongoDB Atlas
1. Crear una cuenta en [MongoDB Atlas](https://www.mongodb.com/atlas)
2. Crear un cluster
3. Crear un Service Account con permisos de lectura/escritura
4. Obtener las credenciales y string de conexión

### 2. Configurar Variables de Entorno
```bash
# Copiar archivo de ejemplo
cp atlas-config.example.env .env

# Editar .env con tus credenciales de Atlas
MDB_MCP_API_CLIENT_ID=tu-client-id
MDB_MCP_API_CLIENT_SECRET=tu-client-secret
MDB_MCP_CONNECTION_STRING=tu-connection-string
```

### 3. Poblar la base de datos
```bash
npm run seed
```

### 4. Ejecutar con MCP Atlas
```bash
# Opción 1: Solo servidor MCP Atlas
npm run mcp-atlas

# Opción 2: Aplicación completa con MCP Atlas
npm run dev:with-atlas
```

## 📁 Estructura MCP

```
src/mcp/
├── mcp-server.ts      # Servidor MCP para MongoDB
├── mcp-client.ts      # Cliente MCP para Vue
└── useMCP.ts          # Composable de Vue para MCP

scripts/
├── start-mcp-server.ts # Script para iniciar servidor MCP
└── seed-database.ts    # Script para poblar datos
```

## 🔧 Herramientas MCP Disponibles

### 1. `mongodb_query`
Ejecutar consultas básicas en MongoDB
```typescript
await mcpClient.query({
  collection: 'users',
  operation: 'find',
  query: { isActive: true },
  options: { limit: 10 }
});
```

### 2. `mongodb_aggregate`
Ejecutar agregaciones complejas
```typescript
await mcpClient.aggregate({
  collection: 'users',
  pipeline: [
    { $group: { _id: '$role', count: { $sum: 1 } } }
  ]
});
```

### 3. `mongodb_list_collections`
Listar todas las colecciones
```typescript
const collections = await mcpClient.listCollections();
```

### 4. `mongodb_get_stats`
Obtener estadísticas de la base de datos
```typescript
const stats = await mcpClient.getStats();
```

## 🎯 Uso en Vue Components

```vue
<script setup>
import { useMCP } from '@/composables/useMCP';

const { 
  isConnected, 
  isLoading, 
  error, 
  findUsers, 
  findMetrics,
  getUserStats 
} = useMCP();

// Obtener usuarios
const users = await findUsers({ isActive: true });

// Obtener estadísticas
const stats = await getUserStats();
</script>
```

## ⚙️ Configuración

### Variables de Entorno
```env
MONGODB_URI=mongodb://localhost:27017/tailadmin
```

### Configuración MCP
El archivo `mcp-config.json` contiene la configuración del servidor MCP.

## 🔍 Ventajas de MCP

1. **Protocolo Estándar**: Usa un protocolo estándar para comunicación con bases de datos
2. **Herramientas Especializadas**: Cada herramienta tiene un propósito específico
3. **Type Safety**: Completamente tipado con TypeScript
4. **Escalabilidad**: Fácil de extender con nuevas herramientas
5. **Debugging**: Mejor visibilidad de las operaciones de base de datos

## 🐛 Troubleshooting

### Error de Conexión
```bash
# Verificar que MongoDB esté ejecutándose
docker ps | grep mongo
# o
netstat -an | grep 27017
```

### Error de MCP
```bash
# Verificar logs del servidor MCP
npm run mcp-server
```

### Limpiar Base de Datos
```bash
# Eliminar y recrear datos
npm run seed
```

## 📚 Recursos Adicionales

- [Documentación MCP](https://modelcontextprotocol.io/)
- [MongoDB Documentation](https://docs.mongodb.com/)
- [Vue 3 Composition API](https://vuejs.org/guide/composition-api/)
