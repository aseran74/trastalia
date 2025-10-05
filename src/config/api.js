// Configuración de la API - Versión simplificada
const getApiBaseUrl = () => {
  // Detectar si estamos en una app móvil de Capacitor
  const isNativeApp = window.Capacitor && window.Capacitor.isNativePlatform();
  const isProduction = import.meta.env.PROD;
  
  // Detectar si estamos en un dispositivo móvil por User Agent
  const isMobileDevice = /Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
  
  console.log('🔧 API Config Debug:', {
    isNativeApp,
    isProduction,
    isMobileDevice,
    VITE_API_URL: import.meta.env.VITE_API_URL,
    userAgent: navigator.userAgent,
    platform: navigator.platform
  });
  
  // Para apps móviles (APK), SIEMPRE usar Railway
  if (isNativeApp || isMobileDevice) {
    console.log('🔧 Using Railway for mobile app (native/mobile detected)');
    return 'https://web-production-08299.up.railway.app';
  }
  
  // Para producción web, usar Railway
  if (isProduction) {
    console.log('🔧 Using Railway for web production');
    return 'https://web-production-08299.up.railway.app';
  }
  
  // Para desarrollo web, usar localhost
  console.log('🔧 Using localhost for web development');
  return 'http://localhost:3002';
};

const API_BASE_URL = getApiBaseUrl();

console.log('🔧 API Configuration:', {
  VITE_API_URL: import.meta.env.VITE_API_URL,
  PROD: import.meta.env.PROD,
  DEV: import.meta.env.DEV,
  MODE: import.meta.env.MODE,
  NODE_ENV: import.meta.env.NODE_ENV,
  API_BASE_URL: API_BASE_URL,
  getApiBaseUrl: getApiBaseUrl()
});

// Debug adicional para verificar modo producción
console.log('🔧 Production Debug:', {
  'import.meta.env.PROD': import.meta.env.PROD,
  'import.meta.env.MODE': import.meta.env.MODE,
  'import.meta.env.NODE_ENV': import.meta.env.NODE_ENV,
  'window.location.hostname': typeof window !== 'undefined' ? window.location.hostname : 'undefined',
  'navigator.userAgent': typeof navigator !== 'undefined' ? navigator.userAgent : 'undefined'
});

export default getApiBaseUrl();