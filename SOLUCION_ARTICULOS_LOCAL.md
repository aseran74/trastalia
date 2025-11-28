# 🔧 Solución: Artículos no se ven en local

## Problema
Los artículos se ven en Vercel (producción) pero no en local.

## Causa
El frontend está configurado para usar `localhost:3001` pero el servidor corre en el puerto `3002`.

## Solución

### 1. Iniciar el servidor backend

Abre una terminal y ejecuta:

```bash
npm start
```

O si prefieres usar el script específico:

```bash
node server/working-server.cjs
```

El servidor debería iniciarse en el puerto **3002** y mostrar algo como:
```
✅ Conectado a MongoDB Atlas
🚀 Servidor corriendo en puerto 3002
```

### 2. Verificar que el servidor está corriendo

Abre otra terminal y prueba:

```bash
curl http://localhost:3002/api/articles/public
```

O en el navegador:
```
http://localhost:3002/api/articles/public
```

Deberías ver una respuesta JSON con los artículos.

### 3. Iniciar el frontend

En otra terminal, ejecuta:

```bash
npm run dev
```

El frontend debería iniciarse (normalmente en `http://localhost:5173`).

### 4. Verificar la configuración

El archivo `src/config/api.js` ya está actualizado para usar `localhost:3002` en desarrollo.

## Configuración actualizada

- ✅ `src/config/api.js` → `http://localhost:3002`
- ✅ `src/components/ArticlePhotoManager.vue` → `http://localhost:3002`

## Endpoints disponibles

- **Artículos públicos**: `GET http://localhost:3002/api/articles/public`
- **Todos los artículos**: `GET http://localhost:3002/api/articles`
- **Artículos del usuario**: `GET http://localhost:3002/api/articles/my-articles` (requiere auth)

## Verificación

1. Abre la consola del navegador (F12)
2. Deberías ver: `🌐 Using API URL: http://localhost:3002`
3. Si ves errores de CORS, verifica que el servidor tenga configurado CORS para `http://localhost:5173`

## Si sigue sin funcionar

1. **Verifica que MongoDB esté conectado**: El servidor debe mostrar `✅ Conectado a MongoDB Atlas`
2. **Verifica el puerto**: Asegúrate de que no haya otro proceso usando el puerto 3002
3. **Revisa la consola del navegador**: Busca errores de red o CORS
4. **Revisa los logs del servidor**: Busca errores al hacer las peticiones

## Comandos útiles

```bash
# Ver qué está usando el puerto 3002
netstat -ano | findstr :3002

# Ver qué está usando el puerto 3001
netstat -ano | findstr :3001

# Matar un proceso por PID (reemplaza PID con el número)
taskkill /PID <PID> /F
```

