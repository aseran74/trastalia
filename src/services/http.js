// Servicio HTTP para Trastalia con Capacitor
import { Capacitor } from '@capacitor/core';

const API_BASE_URL = import.meta.env.VITE_API_URL || 
  (import.meta.env.PROD 
    ? 'https://web-production-08299.up.railway.app' 
    : 'http://localhost:3002');

console.log('🌐 HTTP Service Config:', {
  isNative: Capacitor.isNativePlatform(),
  platform: Capacitor.getPlatform(),
  apiUrl: API_BASE_URL,
  prod: import.meta.env.PROD
});

// Función para hacer peticiones HTTP
export const httpRequest = async (url, options = {}) => {
  const fullUrl = url.startsWith('http') ? url : `${API_BASE_URL}${url}`;
  
  const defaultOptions = {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    },
    ...options
  };

  console.log('🌐 HTTP Request:', {
    url: fullUrl,
    method: defaultOptions.method,
    headers: defaultOptions.headers,
    isNative: Capacitor.isNativePlatform()
  });

  try {
    const response = await fetch(fullUrl, defaultOptions);
    
    console.log('🌐 HTTP Response:', {
      url: fullUrl,
      status: response.status,
      statusText: response.statusText,
      ok: response.ok
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('🌐 HTTP Error:', {
      url: fullUrl,
      error: error.message,
      isNative: Capacitor.isNativePlatform()
    });
    throw error;
  }
};

// Métodos específicos
export const httpGet = (url, options = {}) => httpRequest(url, { ...options, method: 'GET' });
export const httpPost = (url, data, options = {}) => httpRequest(url, { 
  ...options, 
  method: 'POST', 
  body: JSON.stringify(data) 
});
export const httpPut = (url, data, options = {}) => httpRequest(url, { 
  ...options, 
  method: 'PUT', 
  body: JSON.stringify(data) 
});
export const httpDelete = (url, options = {}) => httpRequest(url, { ...options, method: 'DELETE' });

export default {
  get: httpGet,
  post: httpPost,
  put: httpPut,
  delete: httpDelete,
  request: httpRequest
};

