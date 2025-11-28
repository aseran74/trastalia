# 🚀 Configuración Rápida del Servidor MCP de MongoDB para Cursor

## 📍 Ubicación del Archivo de Configuración

En Windows, el archivo de configuración MCP de Cursor se encuentra en:

```
%APPDATA%\Cursor\User\globalStorage\saoudrizwan.claude-dev\settings\cline_mcp_settings.json
```

O alternativamente en:
```
~/.cursor/mcp.json
```

## ⚡ Configuración Rápida

### Paso 1: Abrir el archivo de configuración

1. Presiona `Win + R`
2. Escribe: `%APPDATA%\Cursor\User\globalStorage\saoudrizwan.claude-dev\settings\`
3. Abre o crea el archivo `cline_mcp_settings.json`

### Paso 2: Copiar la configuración

Copia el siguiente contenido al archivo (ajusta la ruta `cwd` si es necesario):

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
      "cwd": "C:\\Proyectos\\trastalia\\vue-tailwind-admin-dashboard-main",
      "env": {
        "MONGODB_URI": "mongodb+srv://mikabodea:Mika1974%26@trastalia.ycg2lvb.mongodb.net/trastalia?retryWrites=true&w=majority&appName=Trastalia"
      }
    }
  }
}
```

### Paso 3: Reiniciar Cursor

1. Cierra completamente Cursor (asegúrate de que no quede ningún proceso en segundo plano)
2. Vuelve a abrir Cursor
3. El servidor MCP debería iniciarse automáticamente

### Paso 4: Verificar la conexión

En Cursor, prueba preguntando:
- "Lista las colecciones de MongoDB"
- "Muéstrame las estadísticas de la base de datos"
- "¿Cuántos usuarios hay en la base de datos?"

## 🔧 Si ya tienes otros servidores MCP configurados

Si ya tienes otros servidores MCP (como Supabase), simplemente agrega `mongodb-custom` al objeto `mcpServers`:

```json
{
  "mcpServers": {
    "supabase": {
      // ... tu configuración existente de Supabase
    },
    "mongodb-custom": {
      "command": "npx",
      "args": [
        "-y",
        "tsx",
        "scripts/start-mcp-server.ts"
      ],
      "cwd": "C:\\Proyectos\\trastalia\\vue-tailwind-admin-dashboard-main",
      "env": {
        "MONGODB_URI": "mongodb+srv://mikabodea:Mika1974%26@trastalia.ycg2lvb.mongodb.net/trastalia?retryWrites=true&w=majority&appName=Trastalia"
      }
    }
  }
}
```

## 🐛 Solución de Problemas

### El servidor no aparece

1. Verifica que `tsx` esté instalado globalmente o en el proyecto:
   ```bash
   npm install -g tsx
   ```

2. Verifica que la ruta `cwd` sea correcta y use barras invertidas dobles (`\\`) en Windows.

3. Revisa la consola de Cursor para ver errores.

### Error de conexión

1. Verifica que la URI de MongoDB sea correcta.
2. Asegúrate de que tu IP esté en la whitelist de MongoDB Atlas.
3. Prueba la conexión manualmente:
   ```bash
   npm run mcp-server
   ```

## ✅ Listo

Una vez configurado, podrás usar comandos como:
- "Busca todos los usuarios en MongoDB"
- "Inserta un nuevo artículo en la colección articles"
- "Actualiza el usuario con ID X"
- "Elimina documentos que cumplan cierta condición"


