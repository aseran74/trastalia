<template>
  <div class="min-h-screen bg-gray-100 flex items-center justify-center">
    <div class="max-w-md w-full bg-white rounded-lg shadow-lg p-8 text-center">
      <div v-if="loading" class="space-y-4">
        <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
        <h2 class="text-xl font-semibold text-gray-900">Procesando autenticación...</h2>
        <p class="text-gray-600">Por favor espera mientras completamos tu inicio de sesión.</p>
      </div>
      
      <div v-else-if="success" class="space-y-4">
        <div class="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto">
          <svg class="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
          </svg>
        </div>
        <h2 class="text-xl font-semibold text-gray-900">¡Autenticación exitosa!</h2>
        <p class="text-gray-600">Has iniciado sesión correctamente. Redirigiendo al dashboard...</p>
      </div>
      
      <div v-else class="space-y-4">
        <div class="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto">
          <svg class="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
          </svg>
        </div>
        <h2 class="text-xl font-semibold text-gray-900">Error de autenticación</h2>
        <p class="text-gray-600">Hubo un problema al iniciar sesión. Por favor intenta de nuevo.</p>
        <div class="space-y-2">
          <button 
            @click="retryAuth"
            class="w-full bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Intentar de nuevo
          </button>
          <button 
            @click="goToLogin"
            class="w-full bg-gray-200 text-gray-800 px-4 py-2 rounded-lg hover:bg-gray-300 transition-colors"
          >
            Ir al login
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const router = useRouter()
const authStore = useAuthStore()
const loading = ref(true)
const success = ref(false)

onMounted(async () => {
  try {
    const urlParams = new URLSearchParams(window.location.search)
    const token = urlParams.get('token')
    const successParam = urlParams.get('success')
    
    console.log('🔍 AuthCallback - Parámetros recibidos:', { token, successParam })
    
    if (successParam === 'true' && token) {
      // Guardar el token
      localStorage.setItem('auth_token', token)
      sessionStorage.setItem('auth_token', token)
      
      // Obtener información del usuario desde el backend
      try {
        const apiBaseUrl = import.meta.env.VITE_API_URL || 
          (import.meta.env.PROD 
            ? 'https://web-production-08299.up.railway.app' 
            : 'http://localhost:3002')
        
        const response = await fetch(`${apiBaseUrl}/api/auth/me`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        })
        
        if (response.ok) {
          const data = await response.json()
          if (data.success) {
            // Guardar datos del usuario
            const userData = {
              id: data.data.id,
              name: data.data.name,
              email: data.data.email,
              role: data.data.role,
              avatar: data.data.avatar || '',
              points: data.data.points || 0
            }
            
            localStorage.setItem('user_data', JSON.stringify(userData))
            sessionStorage.setItem('user_data', JSON.stringify(userData))
            
            // Actualizar el store
            authStore.user = userData
            authStore.token = token
            
            console.log('✅ Usuario autenticado con Google:', userData)
            success.value = true
            
            // Redirigir al dashboard después de 2 segundos
            setTimeout(() => {
              router.push('/dashboard')
            }, 2000)
            return
          }
        }
      } catch (apiError) {
        console.error('Error obteniendo datos del usuario:', apiError)
      }
      
      // Si no se pudo obtener datos del usuario, usar datos básicos
      const basicUserData = {
        id: 'google-user',
        name: 'Usuario Google',
        email: 'usuario@google.com',
        role: 'user',
        avatar: '',
        points: 100
      }
      
      localStorage.setItem('user_data', JSON.stringify(basicUserData))
      sessionStorage.setItem('user_data', JSON.stringify(basicUserData))
      
      authStore.user = basicUserData
      authStore.token = token
      
      success.value = true
      
      setTimeout(() => {
        router.push('/dashboard')
      }, 2000)
    } else {
      success.value = false
    }
  } catch (error) {
    console.error('Error en callback de autenticación:', error)
    success.value = false
  } finally {
    loading.value = false
  }
})

const retryAuth = () => {
  // Redirigir a Google OAuth de nuevo
  const apiBaseUrl = import.meta.env.VITE_API_URL || 
    (import.meta.env.PROD 
      ? 'https://web-production-08299.up.railway.app' 
      : 'http://localhost:3002')
  
  window.location.href = `${apiBaseUrl}/auth/google`
}

const goToLogin = () => {
  router.push('/test-signin')
}
</script>
