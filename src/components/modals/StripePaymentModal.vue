<template>
  <div v-if="isOpen" class="fixed inset-0 z-50 overflow-y-auto">
    <div class="flex min-h-screen items-center justify-center p-4">
      <!-- Overlay -->
      <div class="fixed inset-0 bg-black bg-opacity-50" @click="closeModal"></div>
      
      <!-- Modal -->
      <div class="relative w-full max-w-2xl bg-white rounded-lg shadow-xl dark:bg-boxdark">
        <!-- Header -->
        <div class="flex items-center justify-between p-6 border-b border-stroke dark:border-strokedark">
          <h3 class="text-xl font-semibold text-black dark:text-white">
            💳 Pago Seguro con Stripe
          </h3>
          <button
            @click="closeModal"
            class="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
          >
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
            </svg>
          </button>
        </div>

        <!-- Content -->
        <div class="p-6">
          <!-- Resumen de la compra -->
          <div class="mb-6 p-4 bg-gray-50 rounded-lg dark:bg-gray-800">
            <h4 class="text-lg font-medium text-black dark:text-white mb-3">
              Resumen de la Compra
            </h4>
            <div class="space-y-2">
              <div
                v-for="item in cartItems"
                :key="item.id"
                class="flex justify-between items-center"
              >
                <span class="text-sm text-gray-600 dark:text-gray-400">
                  {{ item.article.title }}
                </span>
                <span class="text-sm font-medium text-black dark:text-white">
                  €{{ item.price.toFixed(2) }}
                </span>
              </div>
              <div class="border-t border-stroke dark:border-strokedark pt-2 mt-2">
                <div class="flex justify-between items-center">
                  <span class="text-lg font-bold text-black dark:text-white">
                    Total:
                  </span>
                  <span class="text-xl font-bold text-primary">
                    €{{ totalAmount.toFixed(2) }}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <!-- Información de seguridad -->
          <div class="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg dark:bg-blue-900/20 dark:border-blue-800">
            <div class="flex items-start space-x-3">
              <svg class="w-5 h-5 text-blue-600 dark:text-blue-400 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"></path>
              </svg>
              <div class="flex-1">
                <p class="text-sm font-medium text-blue-900 dark:text-blue-300">
                  Pago 100% Seguro
                </p>
                <p class="text-xs text-blue-700 dark:text-blue-400 mt-1">
                  Procesado de forma segura por Stripe. No almacenamos datos de tu tarjeta.
                </p>
              </div>
            </div>
          </div>

          <!-- Botón de pago con Stripe -->
          <div class="space-y-4">
            <button
              @click="handleStripeCheckout"
              :disabled="isProcessing"
              class="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold py-4 px-6 rounded-lg transition-all duration-300 transform hover:scale-105 shadow-lg flex items-center justify-center space-x-3"
            >
              <span v-if="!isProcessing" class="flex items-center space-x-2">
                <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"></path>
                </svg>
                <span>Pagar €{{ totalAmount.toFixed(2) }} con Stripe</span>
              </span>
              <span v-else class="flex items-center space-x-2">
                <svg class="animate-spin h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                  <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                <span>Redirigiendo a Stripe...</span>
              </span>
            </button>

            <button
              @click="closeModal"
              :disabled="isProcessing"
              class="w-full border-2 border-gray-300 text-gray-700 py-3 px-6 rounded-lg font-semibold hover:border-gray-400 hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-800"
            >
              Cancelar
            </button>
          </div>

          <!-- Powered by Stripe -->
          <div class="mt-6 text-center">
            <p class="text-xs text-gray-500 dark:text-gray-400">
              Powered by <span class="font-semibold text-blue-600">Stripe</span>
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useToast } from '@/composables/useToast'
import { getStripe } from '@/config/stripe'
import API_BASE_URL from '@/config/api'

const props = defineProps({
  isOpen: {
    type: Boolean,
    default: false
  },
  cartItems: {
    type: Array,
    default: () => []
  }
})

const emit = defineEmits(['close', 'payment-success'])

const toast = useToast()
const isProcessing = ref(false)

const totalAmount = computed(() => {
  return props.cartItems.reduce((total, item) => total + (item.price || 0), 0)
})

const closeModal = () => {
  if (!isProcessing.value) {
    emit('close')
  }
}

const handleStripeCheckout = async () => {
  isProcessing.value = true
  
  try {
    console.log('💳 Iniciando pago con Stripe...')
    console.log('📦 Items:', props.cartItems)
    console.log('💰 Total:', totalAmount.value)
    
    // Obtener token de autenticación
    const token = localStorage.getItem('auth_token') || sessionStorage.getItem('auth_token')
    
    if (!token) {
      toast.error(
        'No autenticado',
        'Por favor, inicia sesión para continuar con el pago.',
        { duration: 5000 }
      )
      isProcessing.value = false
      return
    }
    
    // Crear sesión de checkout en el backend
    const response = await fetch(`${API_BASE_URL}/api/stripe/create-checkout-session`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({
        items: props.cartItems.map(item => ({
          id: item.id,
          title: item.article.title,
          price: item.price,
          quantity: 1
        }))
      })
    })
    
    if (!response.ok) {
      throw new Error('Error al crear la sesión de pago')
    }
    
    const { sessionId } = await response.json()
    console.log('✅ Sesión de Stripe creada:', sessionId)
    
    // Redirigir a Stripe Checkout
    const stripe = await getStripe()
    
    if (!stripe) {
      throw new Error('Error al cargar Stripe')
    }
    
    const { error } = await stripe.redirectToCheckout({ sessionId })
    
    if (error) {
      console.error('❌ Error de Stripe:', error)
      throw error
    }
    
  } catch (error) {
    console.error('❌ Error procesando pago:', error)
    toast.error(
      'Error en el pago',
      error.message || 'No se pudo procesar el pago. Por favor, intenta de nuevo.',
      { duration: 5000 }
    )
    isProcessing.value = false
  }
}
</script>


