// Configuración de la API
const API_BASE_URL = import.meta.env.VITE_API_URL || 
  (import.meta.env.PROD 
    ? 'https://trastalia-backend-production.up.railway.app' 
    : 'http://localhost:3002');

export default API_BASE_URL;
