<template>
  <div class="min-h-screen bg-gradient-to-br from-green-50 via-white to-blue-50 flex items-center justify-center p-4">
    <div class="max-w-md w-full">
      <!-- Loading State -->
      <div v-if="loading" class="text-center">
        <div class="animate-spin rounded-full h-32 w-32 border-b-2 border-green-500 mx-auto"></div>
        <p class="mt-4 text-gray-600">Verificando tu pago...</p>
      </div>

      <!-- Success State -->
      <div v-else-if="paymentVerified" class="bg-white rounded-2xl shadow-xl p-8 text-center">
        <!-- Success Icon -->
        <div class="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <svg class="w-12 h-12 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
          </svg>
        </div>

        <h1 class="text-3xl font-bold text-gray-900 mb-4">
          ¡Pago Exitoso!
        </h1>
        
        <p class="text-gray-600 mb-6">
          Tu compra ha sido procesada correctamente. Recibirás un correo electrónico con los detalles de tu pedido.
        </p>

        <div v-if="paymentDetails" class="bg-gray-50 rounded-lg p-4 mb-6 text-left">
          <h3 class="font-semibold text-gray-900 mb-2">Detalles del Pago</h3>
          <div class="space-y-2 text-sm">
            <div class="flex justify-between">
              <span class="text-gray-600">ID de Sesión:</span>
              <span class="font-mono text-gray-900">{{ paymentDetails.id }}</span>
            </div>
            <div class="flex justify-between">
              <span class="text-gray-600">Monto Total:</span>
              <span class="font-bold text-gray-900">€{{ paymentDetails.amount }}</span>
            </div>
            <div class="flex justify-between">
              <span class="text-gray-600">Email:</span>
              <span class="text-gray-900">{{ paymentDetails.customerEmail }}</span>
            </div>
          </div>
        </div>

        <div class="space-y-3">
          <router-link 
            to="/mis-compras-dinero" 
            class="block w-full bg-gradient-to-r from-green-600 to-green-700 text-white py-3 px-6 rounded-lg font-semibold hover:from-green-700 hover:to-green-800 transition-all duration-300 transform hover:scale-105"
          >
            Ver Mis Compras
          </router-link>
          
          <router-link 
            to="/articulos" 
            class="block w-full border-2 border-gray-300 text-gray-700 py-3 px-6 rounded-lg font-semibold hover:border-gray-400 hover:bg-gray-50 transition-colors"
          >
            Seguir Comprando
          </router-link>
        </div>
      </div>

      <!-- Error State -->
      <div v-else class="bg-white rounded-2xl shadow-xl p-8 text-center">
        <div class="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <svg class="w-12 h-12 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
          </svg>
        </div>

        <h1 class="text-3xl font-bold text-gray-900 mb-4">
          Error al Verificar el Pago
        </h1>
        
        <p class="text-gray-600 mb-6">
          {{ errorMessage }}
        </p>

        <router-link 
          to="/comprar-articulos" 
          class="inline-block bg-gradient-to-r from-blue-600 to-blue-700 text-white py-3 px-6 rounded-lg font-semibold hover:from-blue-700 hover:to-blue-800 transition-all duration-300"
        >
          Volver a Intentar
        </router-link>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import API_BASE_URL from '@/config/api'

const route = useRoute()
const loading = ref(true)
const paymentVerified = ref(false)
const paymentDetails = ref(null)
const errorMessage = ref('')

const verifyPayment = async () => {
  const sessionId = route.query.session_id
  
  if (!sessionId) {
    errorMessage.value = 'No se proporcionó un ID de sesión válido.'
    loading.value = false
    return
  }

  try {
    const token = localStorage.getItem('auth_token') || sessionStorage.getItem('auth_token')
    
    const response = await fetch(`${API_BASE_URL}/api/stripe/payment-success?session_id=${sessionId}`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })

    const data = await response.json()

    if (data.success) {
      paymentVerified.value = true
      paymentDetails.value = data.session
    } else {
      errorMessage.value = data.message || 'No se pudo verificar el pago.'
    }
  } catch (error) {
    console.error('Error verificando pago:', error)
    errorMessage.value = 'Ocurrió un error al verificar el pago. Por favor, contacta con soporte.'
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  verifyPayment()
})
</script>


