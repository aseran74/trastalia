// Configuración de entorno para Trastalia
const environment = {
  development: {
    API_URL: 'http://localhost:3002',
    APP_NAME: 'Trastalia',
    VERSION: '1.0.0'
  },
  production: {
    API_URL: 'https://web-production-08299.up.railway.app',
    APP_NAME: 'Trastalia',
    VERSION: '1.0.0'
  }
};

// Detectar el entorno
const getEnvironment = () => {
  // En Vite, import.meta.env.PROD indica si estamos en producción
  return import.meta.env.PROD ? environment.production : environment.development;
};

// Exportar la configuración actual
const config = getEnvironment();

console.log('🔧 Environment Config:', {
  mode: import.meta.env.PROD ? 'production' : 'development',
  apiUrl: config.API_URL,
  appName: config.APP_NAME,
  version: config.VERSION,
  viteEnv: import.meta.env
});

export default config;

