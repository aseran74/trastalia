// Configuración de la API
const getApiBaseUrl = () => {
  // Detectar si estamos en Vercel (producción)
  const isVercel = window.location.hostname.includes('vercel.app') || 
                   window.location.hostname.includes('trastalia.vercel.app');
  
  // En producción (Vercel), SIEMPRE usar Render (forzar)
  if (import.meta.env.PROD || isVercel) {
    return 'https://trastalia.onrender.com';
  }
  
  // En desarrollo local, usar el backend local
  return 'http://localhost:3002';
};

// Función de fallback para asegurar que siempre usemos la URL correcta
const getApiUrl = () => {
  const url = getApiBaseUrl();
  console.log('🌐 Using API URL:', url);
  return url;
};

const API_BASE_URL = getApiBaseUrl();

console.log('🔧 API Configuration:', {
  VITE_API_URL: import.meta.env.VITE_API_URL,
  PROD: import.meta.env.PROD,
  DEV: import.meta.env.DEV,
  MODE: import.meta.env.MODE,
  hostname: window.location.hostname,
  API_BASE_URL: API_BASE_URL,
  getApiBaseUrl: getApiBaseUrl()
});

export default getApiUrl();