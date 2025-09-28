# Configuración de Google OAuth para Trastalia

## Pasos para configurar Google OAuth

### 1. Crear proyecto en Google Cloud Console

1. Ve a [Google Cloud Console](https://console.cloud.google.com/)
2. Crea un nuevo proyecto o selecciona uno existente
3. Habilita la API de Google+ (ahora Google Identity)

### 2. Configurar OAuth 2.0

1. Ve a "APIs & Services" > "Credentials"
2. Haz clic en "Create Credentials" > "OAuth 2.0 Client IDs"
3. Selecciona "Web application"
4. Configura las URLs autorizadas:
   - **Authorized JavaScript origins:**
     - `http://localhost:3002` (desarrollo)
     - `https://trastalia.vercel.app` (producción)
   - **Authorized redirect URIs:**
     - `http://localhost:3002/auth/google/callback` (desarrollo)
     - `https://tu-dominio-vercel.vercel.app/auth/google/callback` (producción)

### 3. Obtener las credenciales

1. Copia el **Client ID** y **Client Secret**
2. Agrega estas variables a tu archivo `.env`:

```env
# Google OAuth Configuration
GOOGLE_CLIENT_ID=tu_google_client_id_aqui
GOOGLE_CLIENT_SECRET=tu_google_client_secret_aqui
GOOGLE_CALLBACK_URL=http://localhost:3002/auth/google/callback

# Session Secret (para express-session)
SESSION_SECRET=tu_session_secret_muy_seguro_aqui
```

### 4. Configurar variables de entorno en Vercel

Para el despliegue en producción, agrega estas variables en Vercel:

1. Ve a tu proyecto en Vercel
2. Settings > Environment Variables
3. Agrega:
   - `GOOGLE_CLIENT_ID`
   - `GOOGLE_CLIENT_SECRET`
   - `GOOGLE_CALLBACK_URL` (con tu dominio de Vercel)
   - `SESSION_SECRET`

### 5. Rutas disponibles

- **Iniciar autenticación:** `GET /auth/google`
- **Callback:** `GET /auth/google/callback`
- **Usuario autenticado:** `GET /api/auth/google/user`

### 6. Uso en el frontend

```javascript
// Redirigir a Google OAuth
window.location.href = 'http://localhost:3002/auth/google';

// Manejar callback en el frontend
// El callback redirige a: /auth/callback?token=TOKEN&success=true
```

### 7. Características implementadas

- ✅ Autenticación con Google OAuth 2.0
- ✅ Creación automática de usuarios
- ✅ Vinculación con usuarios existentes por email
- ✅ Generación de tokens JWT
- ✅ Redirección automática al frontend
- ✅ Manejo de sesiones con express-session
- ✅ Soporte para desarrollo y producción

### 8. Notas importantes

- Los usuarios nuevos reciben 100 puntos de bienvenida
- Se actualiza el avatar desde Google si está disponible
- Se mantiene compatibilidad con el sistema de autenticación existente
- Las sesiones duran 24 horas por defecto
