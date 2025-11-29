// Configuración de la API
const getApiBaseUrl = () => {
  // Solo ejecutar en el cliente (navegador), no en el servidor
  if (typeof window === 'undefined') {
    // En el servidor (SSR/build), retornar URL de producción
    return 'https://trastalia.onrender.com';
  }
  
  // Detectar si estamos en Vercel (producción)
  const hostname = window.location.hostname;
  const isVercel = hostname.includes('vercel.app') || 
                   hostname.includes('trastalia.vercel.app') ||
                   hostname.includes('trastalia');
  
  // En producción (Vercel), SIEMPRE usar Render (forzar)
  if (import.meta.env.PROD || isVercel) {
    console.log('🌐 Producción detectada - Usando Render:', hostname);
    return 'https://trastalia.onrender.com';
  }
  
  // En desarrollo local, usar el backend local
  console.log('🌐 Desarrollo local - Usando localhost:3002');
  return 'http://localhost:3002';
};

// Función de fallback para asegurar que siempre usemos la URL correcta
const getApiUrl = () => {
  const url = getApiBaseUrl();
  console.log('🌐 Using API URL:', url);
  return url;
};

const API_BASE_URL = getApiBaseUrl();

if (typeof window !== 'undefined') {
  console.log('🔧 API Configuration:', {
    VITE_API_URL: import.meta.env.VITE_API_URL,
    PROD: import.meta.env.PROD,
    DEV: import.meta.env.DEV,
    MODE: import.meta.env.MODE,
    hostname: window.location.hostname,
    API_BASE_URL: API_BASE_URL,
    getApiBaseUrl: getApiBaseUrl()
  });
}

// Exportar tanto la función como la constante para compatibilidad
export default getApiUrl;
export { API_BASE_URL, getApiUrl };