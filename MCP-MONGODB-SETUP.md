# Configuración del Servidor MCP de MongoDB

Este documento explica cómo configurar el servidor MCP (Model Context Protocol) de MongoDB para usar con Cursor.

## 📋 Requisitos Previos

- Node.js 22.x instalado
- Acceso a MongoDB Atlas con las credenciales correctas
- Cursor IDE instalado

## 🔧 Configuración

### Opción 1: Servidor MCP Personalizado (Recomendado)

El proyecto incluye un servidor MCP personalizado en `src/mcp/mcp-server.ts` que está más integrado con el proyecto.

#### Pasos:

1. **Ubicar el archivo de configuración MCP de Cursor:**
   - En Windows: `%APPDATA%\Cursor\User\globalStorage\saoudrizwan.claude-dev\settings\cline_mcp_settings.json`
   - O en: `~/.cursor/mcp.json` (si existe)

2. **Agregar la configuración:**
   
   Copia el contenido de `.cursor-mcp-config.json` o `mcp-config.json` al archivo de configuración de Cursor.

   ```json
   {
     "mcpServers": {
       "mongodb-custom": {
         "command": "npx",
         "args": [
           "-y",
           "tsx",
           "scripts/start-mcp-server.ts"
         ],
         "env": {
           "MONGODB_URI": "mongodb+srv://mikabodea:Mika1974%26@trastalia.ycg2lvb.mongodb.net/trastalia?retryWrites=true&w=majority&appName=Trastalia"
         }
         "cwd": "C:\\Proyectos\\trastalia\\vue-tailwind-admin-dashboard-main"
       }
     }
   }
   ```

   **Importante:** Ajusta la ruta `cwd` a la ruta absoluta de tu proyecto.

3. **Reiniciar Cursor:**
   - Cierra completamente Cursor
   - Vuelve a abrirlo
   - El servidor MCP debería iniciarse automáticamente

### Opción 2: Servidor MCP Oficial de MongoDB

Si prefieres usar el servidor oficial de MongoDB:

```json
{
  "mcpServers": {
    "MongoDB-Atlas": {
      "command": "npx",
      "args": [
        "-y", 
        "@mongodb-js/mongodb-mcp-server"
      ],
      "env": {
        "MDB_MCP_API_CLIENT_ID": "tu-client-id",
        "MDB_MCP_API_CLIENT_SECRET": "tu-client-secret",
        "MDB_MCP_CONNECTION_STRING": "mongodb+srv://usuario:password@cluster.mongodb.net/database?retryWrites=true&w=majority"
      }
    }
  }
}
```

## 🛠️ Herramientas Disponibles

Una vez configurado, tendrás acceso a las siguientes herramientas:

### 1. `mongodb_query`
Ejecutar consultas básicas en MongoDB:
- `find`: Buscar múltiples documentos
- `findOne`: Buscar un documento
- `insertOne`: Insertar un documento
- `insertMany`: Insertar múltiples documentos
- `updateOne`: Actualizar un documento
- `updateMany`: Actualizar múltiples documentos
- `deleteOne`: Eliminar un documento
- `deleteMany`: Eliminar múltiples documentos
- `count`: Contar documentos

### 2. `mongodb_aggregate`
Ejecutar agregaciones complejas con pipelines de MongoDB.

### 3. `mongodb_list_collections`
Listar todas las colecciones en la base de datos.

### 4. `mongodb_get_stats`
Obtener estadísticas de la base de datos (tamaño, número de colecciones, etc.).

## 🧪 Probar la Configuración

1. **Verificar que el servidor se inicia:**
   ```bash
   npm run mcp-server
   ```
   
   Deberías ver: `🚀 Servidor MCP MongoDB iniciado`

2. **En Cursor, prueba preguntando:**
   - "Lista las colecciones de MongoDB"
   - "Muéstrame las estadísticas de la base de datos"
   - "Busca usuarios en la colección users"

## 🔍 Solución de Problemas

### El servidor MCP no se inicia

1. Verifica que `tsx` esté instalado:
   ```bash
   npm install -g tsx
   ```

2. Verifica que la URI de MongoDB sea correcta y accesible.

3. Revisa los logs de Cursor para ver errores específicos.

### Error de conexión a MongoDB

1. Verifica que la URI de conexión sea correcta.
2. Asegúrate de que tu IP esté en la whitelist de MongoDB Atlas.
3. Verifica que las credenciales sean correctas.

### El servidor MCP no aparece en Cursor

1. Asegúrate de que el archivo de configuración esté en la ubicación correcta.
2. Reinicia Cursor completamente.
3. Verifica que la ruta `cwd` en la configuración sea absoluta y correcta.

## 📝 Notas

- El servidor MCP personalizado usa la misma URI de MongoDB que el servidor principal (`server/working-server.cjs`).
- La base de datos se detecta automáticamente desde la URI.
- El servidor se conecta automáticamente cuando se hace la primera consulta.

## 🔐 Seguridad

⚠️ **Importante:** No compartas el archivo de configuración MCP con las credenciales de MongoDB. Mantén las credenciales seguras y usa variables de entorno cuando sea posible.


