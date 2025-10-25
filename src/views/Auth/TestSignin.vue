<template>
  <div class="min-h-screen bg-gray-100 flex items-center justify-center">
    <div class="max-w-md w-full bg-white p-8 rounded-lg shadow-md">
      <div class="text-center mb-8">
        <img 
          src="/images/Trastalia3.png" 
          alt="Trastalia" 
          class="h-20 w-auto mx-auto mb-4"
        />
        <h1 class="text-2xl font-bold text-gray-900">Iniciar Sesión</h1>
        <p class="text-gray-600 mt-2">Accede a tu cuenta de Trastalia</p>
      </div>

      <!-- Botón de Google Auth -->
      <div class="mb-6">
        <GoogleAuthButton />
      </div>

      <!-- Separador -->
      <div class="relative mb-6">
        <div class="absolute inset-0 flex items-center">
          <div class="w-full border-t border-gray-300"></div>
        </div>
        <div class="relative flex justify-center text-sm">
          <span class="px-2 bg-white text-gray-500">o continúa con email</span>
        </div>
      </div>

      <!-- Formulario de login tradicional -->
      <form @submit.prevent="handleLogin" class="space-y-4">
        <div>
          <label for="email" class="block text-sm font-medium text-gray-700 mb-1">
            Email
          </label>
          <input
            id="email"
            v-model="form.email"
            type="email"
            required
            class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="tu@email.com"
          />
        </div>
        
        <div>
          <label for="password" class="block text-sm font-medium text-gray-700 mb-1">
            Contraseña
          </label>
          <input
            id="password"
            v-model="form.password"
            type="password"
            required
            class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Tu contraseña"
          />
        </div>

        <button
          type="submit"
          :disabled="loading"
          class="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {{ loading ? 'Iniciando sesión...' : 'Iniciar Sesión' }}
        </button>
      </form>

      <!-- Enlaces adicionales -->
      <div class="mt-6 text-center space-y-2">
        <p class="text-sm text-gray-600">
          ¿No tienes cuenta? 
          <a href="#" class="text-blue-600 hover:text-blue-500 font-medium">
            Regístrate aquí
          </a>
        </p>
        <a href="#" class="text-sm text-blue-600 hover:text-blue-500">
          ¿Olvidaste tu contraseña?
        </a>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import GoogleAuthButton from '@/components/auth/GoogleAuthButton.vue'

const router = useRouter()
const authStore = useAuthStore()
const loading = ref(false)

const form = ref({
  email: '',
  password: ''
})

const handleLogin = async () => {
  loading.value = true
  
  try {
    const apiBaseUrl = import.meta.env.VITE_API_URL || 
      (import.meta.env.PROD 
        ? 'https://trastalia.onrender.com' 
        : 'http://localhost:3001')
    
    const response = await fetch(`${apiBaseUrl}/api/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(form.value)
    })
    
    const data = await response.json()
    
    if (data.success) {
      // Guardar token
      localStorage.setItem('auth_token', data.data.token)
      sessionStorage.setItem('auth_token', data.data.token)
      
      // Actualizar store
      await authStore.checkAuth()
      
      // Redirigir al dashboard
      router.push('/dashboard')
    } else {
      alert('Error: ' + data.message)
    }
  } catch (error) {
    console.error('Error en login:', error)
    alert('Error al iniciar sesión')
  } finally {
    loading.value = false
  }
}
</script>
