// Configuración de la API
const getApiBaseUrl = () => {
  // Si hay una variable de entorno específica, usarla
  if (import.meta.env.VITE_API_URL) {
    return import.meta.env.VITE_API_URL;
  }
  
  // En producción (Vercel), usar Render
  if (import.meta.env.PROD) {
    return 'https://trastalia.onrender.com';
  }
  
  // En desarrollo local, usar el backend local
  return 'http://localhost:3001';
};

const API_BASE_URL = getApiBaseUrl();

console.log('🔧 API Configuration:', {
  VITE_API_URL: import.meta.env.VITE_API_URL,
  PROD: import.meta.env.PROD,
  DEV: import.meta.env.DEV,
  MODE: import.meta.env.MODE,
  API_BASE_URL: API_BASE_URL,
  getApiBaseUrl: getApiBaseUrl()
});

export default getApiBaseUrl();