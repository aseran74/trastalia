<template>
  <div class="min-h-screen bg-gray-100 flex items-center justify-center">
    <div class="bg-white p-8 rounded-lg shadow-md max-w-md w-full">
      <!-- Logo de Trastalia -->
      <div class="flex justify-center mb-6">
        <img 
          src="/images/Trastalia.png" 
          alt="Trastalia" 
          class="h-48 w-auto transform hover:scale-105 transition-all duration-300 drop-shadow-lg"
          @load="handleImageLoad"
          @error="handleImageError"
        />
      </div>
      
      <h1 class="text-3xl font-bold text-center mb-2 text-gray-800">Iniciar Sesión</h1>
      
      <p class="text-center text-gray-600 mb-4">¡Bienvenido de vuelta a Trastalia!</p>
      
      <!-- Formulario simple -->
      <form @submit.prevent="handleSubmit" class="space-y-4">
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Email</label>
          <input 
            type="email" 
            v-model="email"
            class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="admin@trastalia.com"
          />
        </div>
        
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Contraseña</label>
          <input 
            type="password" 
            v-model="password"
            class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="admin123456"
          />
        </div>
        
        <button 
          type="submit"
          class="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          Iniciar Sesión
        </button>
      </form>
      
      <!-- Enlaces adicionales -->
      <div class="mt-6 text-center space-y-3">
        <div class="text-sm text-gray-600">
          <a href="#" class="text-blue-600 hover:text-blue-800 underline">¿Olvidaste tu contraseña?</a>
        </div>
        
        <div class="text-sm text-gray-600">
          ¿No tienes cuenta? 
          <router-link to="/signup" class="text-blue-600 hover:text-blue-800 underline font-medium">
            Regístrate aquí
          </router-link>
        </div>
        
        <div class="text-xs text-gray-500 mt-4 space-y-1">
          <p>
            Al iniciar sesión, aceptas nuestros 
            <a href="#" class="text-blue-600 hover:text-blue-800 underline">Términos y Condiciones</a>
          </p>
          <p>
            y nuestra 
            <a href="#" class="text-blue-600 hover:text-blue-800 underline">Política de Privacidad</a>
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { RouterLink } from 'vue-router'

const email = ref('admin@trastalia.com')
const password = ref('admin123456')

const handleSubmit = () => {
  console.log('Form submitted', {
    email: email.value,
    password: password.value
  })
}

const handleImageLoad = (event) => {
  console.log('✅ Logo cargado exitosamente:', event.target.src)
}

const handleImageError = (event) => {
  console.log('❌ Error cargando logo:', event.target.src)
  console.log('Intentando fallback...')
  event.target.src = '/images/Logodefi.png'
}
</script>
