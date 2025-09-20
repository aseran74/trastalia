# 🔑 Configuración de Google Places API

## ❌ Error Actual: `InvalidKeyMapError`

El error indica que la API key no es válida o no tiene los permisos necesarios.

## ✅ Solución Paso a Paso

### **1. Ir a Google Cloud Console**
- Ve a [Google Cloud Console](https://console.cloud.google.com/)
- Inicia sesión con tu cuenta de Google

### **2. Crear o Seleccionar Proyecto**
- Si no tienes proyecto: "Crear proyecto"
- Si tienes proyecto: Selecciona el existente

### **3. Habilitar APIs Necesarias**
Ve a "APIs y servicios" → "Biblioteca" y habilita:

- ✅ **Places API**
- ✅ **Maps JavaScript API**
- ✅ **Geocoding API** (opcional pero recomendado)

### **4. Crear API Key**
- Ve a "APIs y servicios" → "Credenciales"
- Clic en "Crear credenciales" → "Clave de API"
- Copia la API key generada

### **5. Configurar Restricciones (Recomendado)**
- Clic en la API key creada
- En "Restricciones de aplicación":
  - **Restricciones de API**: Selecciona las APIs habilitadas
  - **Restricciones de sitio web**: Agrega `localhost:5173` y `localhost:3001`

### **6. Actualizar Archivo .env**
```env
VITE_GOOGLE_PLACES_API_KEY=tu-nueva-api-key-aqui
```

### **7. Reiniciar Servidor**
```bash
# Detener servidor (Ctrl+C)
# Reiniciar
npm run dev
```

## 🔧 Modo de Desarrollo (Sin API Key)

Si no quieres configurar la API key ahora, el sistema funcionará en modo de desarrollo con sugerencias simuladas:

- ✅ **Sugerencias básicas** de ciudades españolas
- ✅ **Funcionalidad limitada** pero funcional
- ⚠️ **Sin autocompletado real** de Google

## 🚨 Solución Rápida

### **Opción 1: Usar API Key Temporal**
```env
VITE_GOOGLE_PLACES_API_KEY=AIzaSyBy4MuV_fOnPJF-WoxQbBlnKj8dMF6KuxM
```

### **Opción 2: Modo de Desarrollo**
```env
VITE_GOOGLE_PLACES_API_KEY=development-mode
```

## 📊 Verificar Configuración

### **1. Verificar en Consola del Navegador:**
- Abre DevTools (F12)
- Ve a la pestaña "Console"
- Busca mensajes de Google Places

### **2. Mensajes Esperados:**
- ✅ `✅ Google Places API cargada correctamente`
- ⚠️ `⚠️ API key de Google Places no configurada`
- ❌ `❌ Error cargando Google Places API`

## 💰 Costos de la API

### **Límites Gratuitos (Mensual):**
- **Places API**: 1,000 solicitudes
- **Maps JavaScript API**: 28,000 cargas de mapa
- **Geocoding API**: 40,000 solicitudes

### **Después del Límite:**
- **Places API**: $0.017 por solicitud
- **Maps JavaScript API**: $0.007 por carga
- **Geocoding API**: $0.005 por solicitud

## 🔒 Seguridad

### **Restricciones Recomendadas:**
1. **Restricciones de API**: Solo las APIs necesarias
2. **Restricciones de sitio web**: Solo dominios permitidos
3. **Restricciones de IP**: Si es posible
4. **Cuotas**: Establecer límites diarios

## 🆘 Solución de Problemas

### **Error: "InvalidKeyMapError"**
- ✅ Verificar que la API key sea correcta
- ✅ Verificar que las APIs estén habilitadas
- ✅ Verificar restricciones de dominio

### **Error: "QuotaExceededError"**
- ✅ Verificar cuotas en Google Cloud Console
- ✅ Considerar aumentar límites
- ✅ Implementar caché de solicitudes

### **Error: "RequestDeniedError"**
- ✅ Verificar restricciones de API
- ✅ Verificar restricciones de sitio web
- ✅ Verificar que el dominio esté permitido

## 📞 Soporte

Si necesitas ayuda adicional:
- 📚 [Documentación de Google Places](https://developers.google.com/maps/documentation/places/web-service)
- 🆘 [Soporte de Google Cloud](https://cloud.google.com/support)
- 💬 [Stack Overflow](https://stackoverflow.com/questions/tagged/google-places-api)





