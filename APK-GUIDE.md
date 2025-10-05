# 📱 Guía para Generar APK de Trastalia

## 🚀 Proceso Rápido

### Opción 1: Script Automatizado
```bash
node build-apk.js
```

### Opción 2: Manual
```bash
# 1. Construir la aplicación
npm run build:android

# 2. Abrir Android Studio
npm run android:open
```

## 📋 Pasos en Android Studio

1. **Esperar sincronización**: Espera a que Android Studio termine de sincronizar los archivos de Gradle
2. **Generar APK firmada**: 
   - Ve a `Build > Generate Signed Bundle / APK...`
   - Selecciona `APK` y haz clic en `Next`
3. **Configurar keystore**:
   - Si no tienes una, crea una nueva keystore
   - **¡IMPORTANTE!** Guarda bien el archivo `.jks` y las contraseñas
4. **Seleccionar build**:
   - Selecciona `release` 
   - Haz clic en `Finish`
5. **Ubicación de la APK**: `android/app/release/app-release.apk`

## 🔧 Configuración Actual

- **App ID**: `com.trastalia.app`
- **Nombre**: `Trastalia`
- **API URL**: `https://web-production-08299.up.rail.app`
- **CORS**: Configurado para aplicaciones móviles

## 🛠️ Comandos Útiles

```bash
# Construir y sincronizar
npm run build:android

# Solo abrir Android Studio
npm run android:open

# Ejecutar en dispositivo conectado
npm run android:run
```

## ⚠️ Notas Importantes

1. **Keystore**: Guarda tu archivo `.jks` y contraseñas en un lugar seguro
2. **Actualizaciones**: Necesitarás la misma keystore para futuras versiones
3. **API**: La app se conecta automáticamente a la API en producción
4. **CORS**: El servidor ya está configurado para aplicaciones móviles

## 🐛 Solución de Problemas

### Error de Gradle Sync
- Espera a que termine la descarga de dependencias
- Verifica conexión a internet

### Error de Build
- Limpia el proyecto: `Build > Clean Project`
- Rebuild: `Build > Rebuild Project`

### API no conecta
- Verifica que `https://web-production-08299.up.rail.app` esté funcionando
- Revisa los logs en Android Studio

