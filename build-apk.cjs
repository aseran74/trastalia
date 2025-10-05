#!/usr/bin/env node

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🚀 Iniciando proceso de construcción de APK para Trastalia...\n');

try {
  // Paso 1: Limpiar build anterior
  console.log('🧹 Limpiando builds anteriores...');
  if (fs.existsSync('dist')) {
    fs.rmSync('dist', { recursive: true });
  }
  if (fs.existsSync('android/app/build')) {
    fs.rmSync('android/app/build', { recursive: true });
  }

  // Paso 2: Construir la aplicación Vue
  console.log('🏗️  Construyendo aplicación Vue...');
  execSync('npm run build', { stdio: 'inherit' });

  // Paso 3: Sincronizar con Capacitor
  console.log('🔄 Sincronizando con Capacitor...');
  execSync('npx cap sync', { stdio: 'inherit' });

  // Paso 4: Abrir Android Studio
  console.log('📱 Abriendo Android Studio...');
  console.log('\n📋 INSTRUCCIONES PARA GENERAR LA APK:');
  console.log('1. En Android Studio, espera a que termine la sincronización de Gradle');
  console.log('2. Ve a Build > Generate Signed Bundle / APK...');
  console.log('3. Selecciona "APK" y haz clic en "Next"');
  console.log('4. Si no tienes una keystore, crea una nueva');
  console.log('5. Selecciona "release" y haz clic en "Finish"');
  console.log('6. La APK se generará en: android/app/release/app-release.apk');
  console.log('\n⚠️  IMPORTANTE: Guarda bien tu keystore y contraseñas para futuras actualizaciones!');
  
  execSync('npx cap open android', { stdio: 'inherit' });

} catch (error) {
  console.error('❌ Error durante la construcción:', error.message);
  process.exit(1);
}

