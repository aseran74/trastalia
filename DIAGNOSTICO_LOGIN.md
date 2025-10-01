# 🔍 Diagnóstico de Problema de Login

## 📋 Pasos para Diagnosticar

### 1. Abrir Herramientas de Desarrollador
1. Abre tu navegador (Chrome/Edge/Firefox)
2. Presiona **F12** para abrir DevTools
3. Ve a la pestaña **Console**
4. Ve a la pestaña **Network**

### 2. Intentar Login
1. Ve a: `http://localhost:5173/login`
2. En la pestaña **Network**, asegúrate de que esté grabando (botón rojo activo)
3. Usa estas credenciales:
   - **Email**: `juan@correo.com`
   - **Password**: `contrasena`
4. Haz click en **Iniciar Sesión**

### 3. Verificar la Consola (Console)
**¿Qué errores ves?**

Posibles errores:
- ❌ `Failed to fetch` → El backend no está ejecutándose
- ❌ `TypeError: Cannot read property...` → Error en el código
- ❌ Error de Stripe → Ya corregido, limpia caché
- ❌ `CORS error` → Problema de configuración del servidor

### 4. Verificar Network (Red)
1. Busca la petición `login` en la lista
2. Haz click en ella
3. Verifica:
   - **Status**: ¿Qué código devuelve? (200, 400, 401, 500?)
   - **Response**: ¿Qué mensaje devuelve el servidor?
   - **Preview**: ¿Ves el objeto de respuesta?

## 🔧 Soluciones Rápidas

### Si el error es "Failed to fetch"
```bash
# Reinicia el servidor backend
node server/working-server.cjs
```

### Si el error es de CORS
El servidor ya debería tener CORS habilitado. Verifica que esté en puerto 3002.

### Si dice "Invalid credentials" o "Usuario no encontrado"
Prueba con estas credenciales de admin:
- **Email**: `admin@trastalia.com`
- **Password**: `admin123456`

### Si el error es de Stripe
```bash
# Ya corregimos el archivo, pero asegúrate de limpiar caché:
# En el navegador: Ctrl + Shift + Delete
# Selecciona "Cached images and files"
# Luego: Ctrl + Shift + R (recarga forzada)
```

## 📱 Test Manual Rápido

### Prueba 1: ¿Está el backend funcionando?
1. Abre: `http://localhost:3002/api/health`
2. **Debe mostrar**: `{"status":"OK",...}`

### Prueba 2: ¿Está el frontend funcionando?
1. Abre: `http://localhost:5173`
2. **Debe mostrar**: La landing page de Trastalia

### Prueba 3: ¿Funciona el login con Postman/Thunder Client?
Si tienes estas herramientas, prueba:

```
POST http://localhost:3002/api/auth/login
Content-Type: application/json

{
  "email": "juan@correo.com",
  "password": "contrasena"
}
```

**Respuesta esperada**:
```json
{
  "success": true,
  "data": {
    "user": { ... },
    "token": "..."
  }
}
```

## 🚨 Errores Comunes y Soluciones

### Error 1: "El backend no responde"
- **Causa**: Servidor no ejecutándose
- **Solución**: `node server/working-server.cjs`

### Error 2: "CORS policy"
- **Causa**: Frontend y backend en diferentes orígenes
- **Solución**: Ya está configurado en el servidor

### Error 3: "Invalid credentials"
- **Causa**: Usuario o contraseña incorrectos
- **Solución**: Usa `juan@correo.com` / `contrasena`

### Error 4: "User not found"
- **Causa**: El usuario no existe en la base de datos
- **Solución**: Verifica que MongoDB esté conectado (debe decir "✅ Conectado a MongoDB Atlas")

### Error 5: Error de Stripe
- **Causa**: Importación incorrecta (YA CORREGIDO)
- **Solución**: Limpia caché del navegador y recarga

## 📸 Lo que deberías ver

### En la Consola (sin errores):
```
🔐 isAuthenticated computed: true
✅ Usuario cargado desde storage: juan@correo.com
```

### En Network (respuesta exitosa):
```
Status: 200 OK
{
  "success": true,
  "data": {
    "user": {
      "name": "Juan Pérez",
      "email": "juan@correo.com",
      "role": "user",
      "points": 8621
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

## ❓ Siguiente Paso

**Copia y pega aquí**:
1. El error exacto que ves en la Consola
2. El Status Code de la petición login en Network
3. El mensaje de error que aparece en pantalla

Con esa información podré ayudarte mejor.

