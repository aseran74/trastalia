<template>
  <div class="min-h-screen bg-gray-50 dark:bg-boxdark-2 py-12 px-4 sm:px-6 lg:px-8">
    <div class="max-w-md mx-auto">
      <!-- Header -->
      <div class="text-center mb-8">
        <h2 class="text-3xl font-bold text-gray-900 dark:text-white">
          💳 Prueba de Pago con Stripe
        </h2>
        <p class="mt-2 text-sm text-gray-600 dark:text-gray-400">
          Payment Intent embebido (flujo moderno)
        </p>
      </div>

      <!-- Card -->
      <div class="bg-white dark:bg-boxdark rounded-xl shadow-lg p-8">
        <!-- Formulario de pago -->
        <form v-if="clientSecret" @submit.prevent="handleSubmit" class="space-y-6">
          <!-- Monto -->
          <div class="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
            <div class="flex justify-between items-center">
              <span class="text-lg font-semibold text-gray-900 dark:text-white">
                Monto a pagar:
              </span>
              <span class="text-2xl font-bold text-blue-600">
                €{{ amount.toFixed(2) }}
              </span>
            </div>
          </div>

          <!-- Payment Element Container -->
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Información de pago
            </label>
            <div 
              id="payment-element" 
              class="p-4 border-2 border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-boxdark"
            ></div>
          </div>

          <!-- Mensaje de error -->
          <div 
            v-if="errorMessage" 
            class="p-4 bg-red-50 dark:bg-red-900/20 border-l-4 border-red-500 rounded"
          >
            <div class="flex">
              <div class="flex-shrink-0">
                <svg class="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd" />
                </svg>
              </div>
              <div class="ml-3">
                <p class="text-sm text-red-700 dark:text-red-400">
                  {{ errorMessage }}
                </p>
              </div>
            </div>
          </div>

          <!-- Botón de pago -->
          <button
            type="submit"
            :disabled="isProcessing || !stripeElements"
            class="w-full flex justify-center items-center space-x-2 py-4 px-6 border border-transparent rounded-lg shadow-sm text-lg font-semibold text-white bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 transform hover:scale-105"
          >
            <svg 
              v-if="isProcessing"
              class="animate-spin h-5 w-5 text-white" 
              fill="none" 
              viewBox="0 0 24 24"
            >
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            <span>{{ isProcessing ? 'Procesando...' : `Pagar €${amount.toFixed(2)}` }}</span>
          </button>

          <!-- Información de prueba -->
          <div class="mt-6 p-4 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg">
            <h4 class="text-sm font-semibold text-yellow-800 dark:text-yellow-300 mb-2">
              🧪 Tarjetas de prueba:
            </h4>
            <ul class="text-xs text-yellow-700 dark:text-yellow-400 space-y-1">
              <li>• <strong>Éxito:</strong> 4242 4242 4242 4242</li>
              <li>• <strong>Requiere autenticación:</strong> 4000 0027 6000 3184</li>
              <li>• <strong>Falla:</strong> 4000 0000 0000 0002</li>
              <li>• <strong>Fecha:</strong> Cualquier fecha futura</li>
              <li>• <strong>CVC:</strong> Cualquier 3 dígitos</li>
            </ul>
          </div>
        </form>

        <!-- Loading state -->
        <div v-else class="flex flex-col items-center justify-center py-12 space-y-4">
          <svg 
            class="animate-spin h-12 w-12 text-blue-600" 
            fill="none" 
            viewBox="0 0 24 24"
          >
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          <p class="text-gray-600 dark:text-gray-400">
            Inicializando sistema de pago...
          </p>
        </div>

        <!-- Info de seguridad -->
        <div class="mt-6 flex items-center justify-center space-x-2 text-sm text-gray-500 dark:text-gray-400">
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
          </svg>
          <span>Pago seguro procesado por</span>
          <span class="font-semibold text-blue-600">Stripe</span>
        </div>
      </div>

      <!-- Botones de navegación -->
      <div class="mt-6 text-center space-y-2">
        <button
          @click="$router.push('/')"
          class="text-sm text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
        >
          ← Volver al inicio
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { loadStripe } from '@stripe/stripe-js'
import API_BASE_URL from '@/config/api'

// Estado
const amount = ref(10.00) // 10 euros por defecto
const currency = ref('eur')
const clientSecret = ref(null)
const errorMessage = ref('')
const isProcessing = ref(false)
const stripeElements = ref(null)
const stripeInstance = ref(null)

// Inicializar cuando se monta el componente
onMounted(async () => {
  await initializePayment()
})

const initializePayment = async () => {
  try {
    console.log('💳 Inicializando Payment Intent de PRUEBA (sin autenticación)...')
    
    // Crear Payment Intent en el backend (sin autenticación para pruebas)
    const response = await fetch(`${API_BASE_URL}/api/stripe/create-payment-intent-test`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        amount: amount.value,
        currency: currency.value
      })
    })
    
    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.message || 'Error al crear Payment Intent')
    }
    
    const data = await response.json()
    clientSecret.value = data.clientSecret
    
    console.log('✅ Payment Intent creado')
    
    // Inicializar Stripe Elements
    const stripePublicKey = import.meta.env.VITE_STRIPE_PUBLIC_KEY || import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY
    
    if (!stripePublicKey) {
      throw new Error('Clave pública de Stripe no configurada. Agrega VITE_STRIPE_PUBLIC_KEY a tu archivo .env')
    }
    
    stripeInstance.value = await loadStripe(stripePublicKey)
    
    if (!stripeInstance.value) {
      throw new Error('Error al cargar Stripe')
    }
    
    // Configurar el tema y apariencia
    stripeElements.value = stripeInstance.value.elements({ 
      clientSecret: clientSecret.value,
      appearance: {
        theme: 'stripe',
        variables: {
          colorPrimary: '#0066ff',
          colorBackground: '#ffffff',
          colorText: '#1f2937',
          fontFamily: 'system-ui, sans-serif',
          borderRadius: '8px',
        }
      }
    })
    
    const paymentElement = stripeElements.value.create('payment')
    paymentElement.mount('#payment-element')
    
    console.log('✅ Payment Elements montado')
    
  } catch (error) {
    console.error('❌ Error inicializando Stripe:', error)
    errorMessage.value = error.message
  }
}

const handleSubmit = async () => {
  if (!stripeInstance.value || !stripeElements.value) {
    errorMessage.value = 'Sistema de pago no inicializado'
    return
  }
  
  isProcessing.value = true
  errorMessage.value = ''
  
  try {
    console.log('💳 Procesando pago...')
    
    const { error } = await stripeInstance.value.confirmPayment({
      elements: stripeElements.value,
      confirmParams: {
        return_url: `${window.location.origin}/payment/success`,
      }
    })
    
    if (error) {
      console.error('❌ Error de Stripe:', error)
      errorMessage.value = error.message
    } else {
      // El pago fue exitoso y Stripe redirigirá automáticamente
      console.log('✅ Pago exitoso, redirigiendo...')
    }
    
  } catch (error) {
    console.error('❌ Error procesando pago:', error)
    errorMessage.value = error.message || 'Error al procesar el pago'
  } finally {
    isProcessing.value = false
  }
}
</script>

