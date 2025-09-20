# 🚀 Guía Completa para Configurar MongoDB Atlas

## 📋 Paso a Paso para Obtener Credenciales

### 1️⃣ **Crear Service Account (API Key)**

1. **Accede a MongoDB Atlas**
   - Ve a [cloud.mongodb.com](https://cloud.mongodb.com)
   - Inicia sesión con tu cuenta

2. **Navegar a Access Manager**
   - En el menú lateral izquierdo, busca **"Organization"**
   - Haz clic en **"Access Manager"**

3. **Crear API Key**
   - Haz clic en **"API Keys"** o **"Service Accounts"**
   - Haz clic en **"Create API Key"** o **"Add Service Account"**

4. **Configurar el Service Account**
   ```
   Description: MCP Server for TailAdmin
   API Key Name: tailadmin-mcp-key
   Permissions: Read and write to any database
   ```

5. **Guardar Credenciales** ⚠️ **IMPORTANTE**
   - **Public Key** (Client ID) - Guárdalo en un lugar seguro
   - **Private Key** (Client Secret) - Guárdalo en un lugar seguro
   - ⚠️ **Estas credenciales solo se muestran UNA VEZ**

### 2️⃣ **Obtener Connection String**

1. **Ir a tu Cluster**
   - En el dashboard de Atlas, selecciona tu cluster
   - Haz clic en **"Connect"**

2. **Seleccionar Método de Conexión**
   - Selecciona **"Connect your application"**

3. **Configurar Conexión**
   ```
   Driver: Node.js
   Version: 4.1 or later
   ```

4. **Copiar Connection String**
   - Copia el string que se ve así:
   ```
   mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority
   ```

### 3️⃣ **Configurar Variables de Entorno**

#### Opción A: Usar el Script Automático
```bash
npm run setup-atlas
```

#### Opción B: Configuración Manual
1. **Editar archivo .env**
   ```bash
   # Abrir archivo .env
   notepad .env
   ```

2. **Agregar tus credenciales**
   ```env
   MDB_MCP_API_CLIENT_ID=tu-api-key-aqui
   MDB_MCP_API_CLIENT_SECRET=tu-api-secret-aqui
   MDB_MCP_CONNECTION_STRING=tu-connection-string-aqui
   ```

### 4️⃣ **Probar la Conexión**

```bash
# Ejecutar aplicación con Atlas
npm run dev:with-atlas
```

## 🔍 **Verificar Configuración**

### ✅ **Checklist de Verificación**

- [ ] Service Account creado en Atlas
- [ ] API Key y Secret guardados
- [ ] Connection String obtenido
- [ ] Variables de entorno configuradas
- [ ] Aplicación ejecutándose sin errores

### 🐛 **Solución de Problemas**

#### Error: "Invalid credentials"
- Verifica que las credenciales estén correctas
- Asegúrate de que el Service Account tenga permisos

#### Error: "Connection refused"
- Verifica el Connection String
- Asegúrate de que el cluster esté activo

#### Error: "Authentication failed"
- Verifica que el username y password en el Connection String sean correctos
- Asegúrate de que el usuario tenga permisos en la base de datos

## 📱 **En la Aplicación**

Una vez configurado correctamente, verás en el dashboard:

- ✅ **Estado**: "Conectado a Atlas"
- 📊 **Bases de datos**: Número de bases de datos disponibles
- 📁 **Colecciones**: Número de colecciones disponibles
- 📈 **Estadísticas**: Datos de usuarios y métricas

## 🔒 **Seguridad**

- ⚠️ **Nunca** compartas tus credenciales
- ⚠️ **Nunca** subas el archivo .env a Git
- ✅ Usa variables de entorno en producción
- ✅ Rota las credenciales regularmente

## 📞 **Soporte**

Si tienes problemas:
1. Revisa la [documentación oficial de Atlas](https://docs.atlas.mongodb.com/)
2. Verifica los logs de la aplicación
3. Consulta la consola del navegador para errores
