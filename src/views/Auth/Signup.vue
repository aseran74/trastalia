<template>
  <div class="min-h-screen bg-gray-100 flex items-center justify-center">
    <div class="bg-white p-8 rounded-lg shadow-md max-w-md w-full">
      <!-- Logo de Trastalia -->
      <div class="flex justify-center mb-6">
        <img 
          src="/images/Trastalia3.png" 
          alt="Trastalia" 
          class="h-20 w-auto transform hover:scale-105 transition-all duration-300 drop-shadow-lg"
          @load="handleImageLoad"
          @error="handleImageError"
        />
          </div>
      
      <h1 class="text-3xl font-bold text-center mb-2 text-gray-800">Registrarse</h1>
      
      <p class="text-center text-gray-600 mb-4">¡Crea tu cuenta en Trastalia!</p>
      
      <!-- Formulario simple -->
      <form @submit.prevent="handleSubmit" class="space-y-4">
            <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Nombre</label>
                      <input
            type="text" 
                        v-model="firstName"
            class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Tu nombre"
                      />
                    </div>
        
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Apellido</label>
                      <input
            type="text" 
                        v-model="lastName"
            class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Tu apellido"
                      />
                    </div>
        
                  <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Email</label>
                    <input
            type="email" 
                      v-model="email"
            class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="tu@email.com"
                    />
                  </div>
        
                  <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Contraseña</label>
                      <input
            type="password" 
                        v-model="password"
            class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Tu contraseña"
          />
                    </div>
        
        <!-- Checkbox de términos y condiciones -->
        <div class="flex items-start space-x-2">
                          <input
                            type="checkbox"
            id="terms"
            v-model="acceptTerms"
            class="mt-1 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
          />
          <label for="terms" class="text-sm text-gray-600">
            Acepto los 
            <a href="#" class="text-blue-600 hover:text-blue-800 underline">Términos y Condiciones</a>
            y la 
            <a href="#" class="text-blue-600 hover:text-blue-800 underline">Política de Privacidad</a>
                      </label>
                    </div>
        
                    <button
                      type="submit"
          :disabled="!acceptTerms"
          class="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-400 disabled:cursor-not-allowed"
        >
          Crear Cuenta
        </button>
      </form>
      
      <!-- Enlaces adicionales -->
      <div class="mt-6 text-center">
        <div class="text-sm text-gray-600">
          ¿Ya tienes cuenta? 
          <router-link to="/signin" class="text-blue-600 hover:text-blue-800 underline font-medium">
            Inicia sesión aquí
              </router-link>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { RouterLink } from 'vue-router'

const firstName = ref('')
const lastName = ref('')
const email = ref('')
const password = ref('')
const acceptTerms = ref(false)

const handleSubmit = () => {
  console.log('Form submitted', {
    firstName: firstName.value,
    lastName: lastName.value,
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