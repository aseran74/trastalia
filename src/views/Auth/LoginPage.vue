<template>
  <div class="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
    <div class="max-w-md w-full space-y-8">
      <!-- Header -->
      <div class="text-center">
        <img 
          src="/images/Trastalia3.png" 
          alt="Trastalia" 
          class="h-20 w-auto mx-auto mb-6"
        />
        <h2 class="text-3xl font-bold text-gray-900">Iniciar Sesión</h2>
        <p class="mt-2 text-sm text-gray-600">
          Accede a tu cuenta de Trastalia
        </p>
      </div>

      <!-- Formulario de Login -->
      <div class="bg-white py-8 px-6 shadow-xl rounded-2xl">
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
        <form @submit.prevent="handleLogin" class="space-y-6">
          <div>
            <label for="email" class="block text-sm font-medium text-gray-700 mb-2">
              Email
            </label>
            <input
              id="email"
              v-model="form.email"
              type="email"
              required
              class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
              placeholder="tu@email.com"
            />
          </div>
          
          <div>
            <label for="password" class="block text-sm font-medium text-gray-700 mb-2">
              Contraseña
            </label>
            <input
              id="password"
              v-model="form.password"
              type="password"
              required
              class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
              placeholder="Tu contraseña"
            />
          </div>

          <div class="flex items-center justify-between">
            <div class="flex items-center">
              <input
                id="remember-me"
                v-model="form.rememberMe"
                type="checkbox"
                class="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <label for="remember-me" class="ml-2 block text-sm text-gray-700">
                Recordarme
              </label>
            </div>

            <div class="text-sm">
              <a href="#" class="font-medium text-blue-600 hover:text-blue-500 transition-colors">
                ¿Olvidaste tu contraseña?
              </a>
            </div>
          </div>

          <button
            type="submit"
            :disabled="loading"
            class="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 px-4 rounded-lg hover:from-blue-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 transform hover:scale-105"
          >
            {{ loading ? 'Iniciando sesión...' : 'Iniciar Sesión' }}
          </button>
        </form>

        <!-- Enlaces adicionales -->
        <div class="mt-6 text-center">
          <p class="text-sm text-gray-600">
            ¿No tienes cuenta? 
            <router-link to="/signup" class="font-medium text-blue-600 hover:text-blue-500 transition-colors">
              Regístrate aquí
            </router-link>
          </p>
        </div>
      </div>

      <!-- Footer -->
      <div class="text-center text-sm text-gray-500">
        <p>Al iniciar sesión, aceptas nuestros</p>
        <a href="#" class="text-blue-600 hover:text-blue-500">Términos de Servicio</a>
        <span> y </span>
        <a href="#" class="text-blue-600 hover:text-blue-500">Política de Privacidad</a>
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
  password: '',
  rememberMe: false
})

const handleLogin = async () => {
  loading.value = true
  
  try {
    const apiBaseUrl = import.meta.env.VITE_API_URL || 
      (import.meta.env.PROD 
        ? 'https://trastalia.onrender.com' 
        : 'http://localhost:3002')
    
    const response = await fetch(`${apiBaseUrl}/api/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        email: form.value.email,
        password: form.value.password
      })
    })
    
    const data = await response.json()
    
    if (data.success) {
      // Guardar token
      if (form.value.rememberMe) {
        localStorage.setItem('auth_token', data.data.token)
        localStorage.setItem('user_data', JSON.stringify(data.data.user))
      } else {
        sessionStorage.setItem('auth_token', data.data.token)
        sessionStorage.setItem('user_data', JSON.stringify(data.data.user))
      }
      
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
