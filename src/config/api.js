// Configuración de la API
const API_BASE_URL = import.meta.env.VITE_API_URL || 
  (import.meta.env.PROD 
    ? 'https://web-production-08299.up.railway.app' 
    : 'http://localhost:3002');

console.log('🔧 API Configuration:', {
  VITE_API_URL: import.meta.env.VITE_API_URL,
  PROD: import.meta.env.PROD,
  API_BASE_URL: API_BASE_URL
});

export default API_BASE_URL;