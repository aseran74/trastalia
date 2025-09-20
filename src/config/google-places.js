// Configuración de Google Places
export const GOOGLE_PLACES_CONFIG = {
  apiKey: import.meta.env.VITE_GOOGLE_PLACES_API_KEY || 'development-mode',
  libraries: ['places'],
  version: 'weekly'
}

// Verificar si estamos en modo de desarrollo
export const isDevelopmentMode = () => {
  const apiKey = GOOGLE_PLACES_CONFIG.apiKey
  return !apiKey || 
         apiKey === 'development-mode' || 
         apiKey === 'your-google-places-api-key-here' ||
         apiKey === 'REPLACE_WITH_YOUR_GOOGLE_PLACES_API_KEY'
}
