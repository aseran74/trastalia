# Guía de Despliegue en Render

## Pasos para migrar de Railway a Render

### 1. Preparar el repositorio
- ✅ Archivos de configuración creados:
  - `render.yaml` - Configuración del servicio
  - `Dockerfile` - Imagen de Docker
  - `.dockerignore` - Archivos a ignorar en Docker

### 2. Crear cuenta en Render
1. Ve a [render.com](https://render.com)
2. Crea una cuenta o inicia sesión
3. Conecta tu repositorio de GitHub

### 3. Crear nuevo servicio Web
1. En el dashboard de Render, haz clic en "New +"
2. Selecciona "Web Service"
3. Conecta tu repositorio
4. Configura el servicio:
   - **Name**: `trastalia-backend`
   - **Environment**: `Node`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
   - **Plan**: Free (o el plan que prefieras)

### 4. Configurar variables de entorno
En el dashboard de Render, ve a "Environment" y agrega estas variables:

```
NODE_ENV=production
PORT=10000
MONGODB_URI=tu_mongodb_uri_aqui
GOOGLE_CLIENT_ID=tu_google_client_id
GOOGLE_CLIENT_SECRET=tu_google_client_secret
GOOGLE_CALLBACK_URL=https://trastalia-backend.onrender.com/auth/google/callback
JWT_SECRET=tu_jwt_secret_aqui
SESSION_SECRET=tu_session_secret_aqui
STRIPE_SECRET_KEY=tu_stripe_secret_key
STRIPE_PUBLISHABLE_KEY=tu_stripe_publishable_key
CORS_ORIGIN=https://trastalia.vercel.app
```

### 5. Desplegar
1. Haz clic en "Create Web Service"
2. Render comenzará a construir y desplegar tu aplicación
3. Una vez completado, obtendrás una URL como: `https://trastalia-backend.onrender.com`

### 6. Actualizar frontend
- ✅ Las URLs ya han sido actualizadas en el código
- La nueva URL del backend será: `https://trastalia-backend.onrender.com`

### 7. Verificar funcionamiento
1. Visita `https://trastalia-backend.onrender.com/api/health`
2. Prueba la autenticación con Google
3. Verifica que todas las rutas funcionen correctamente

### Diferencias importantes entre Railway y Render:

1. **Puerto**: Render usa el puerto 10000 por defecto
2. **URLs**: Las URLs de Render siguen el patrón `https://nombre-del-servicio.onrender.com`
3. **Variables de entorno**: Se configuran en el dashboard de Render
4. **Logs**: Se pueden ver en el dashboard de Render
5. **Plan gratuito**: Render tiene limitaciones de tiempo de inactividad (se "duerme" después de 15 minutos de inactividad)

### Notas importantes:
- El plan gratuito de Render "duerme" el servicio después de 15 minutos de inactividad
- El primer request después del "sueño" puede tardar unos segundos en responder
- Para evitar esto, considera usar un plan de pago o un servicio de "ping" para mantener el servicio activo
