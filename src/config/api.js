// Configuración de la API
const API_BASE_URL = import.meta.env.VITE_API_URL || 
  (import.meta.env.PROD 
    ? 'https://web-production-08299.up.railway.app' 
    : ''); // En desarrollo local, usar rutas relativas para el proxy de Vite

// Función para obtener la URL base de la API
const getApiBaseUrl = () => {
  if (import.meta.env.VITE_API_URL) {
    return import.meta.env.VITE_API_URL;
  }
  // En desarrollo, usar rutas relativas para aprovechar el proxy de Vite
  return '';
};

console.log('🔧 API Configuration:', {
  VITE_API_URL: import.meta.env.VITE_API_URL,
  PROD: import.meta.env.PROD,
  DEV: import.meta.env.DEV,
  MODE: import.meta.env.MODE,
  API_BASE_URL: API_BASE_URL,
  getApiBaseUrl: getApiBaseUrl()
});

export default getApiBaseUrl();