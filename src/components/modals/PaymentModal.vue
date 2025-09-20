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
            💳 Pasarela de Pago
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
                  €{{ item.price }}
                </span>
              </div>
              <div class="border-t border-stroke dark:border-strokedark pt-2 mt-2">
                <div class="flex justify-between items-center">
                  <span class="text-lg font-bold text-black dark:text-white">
                    Total:
                  </span>
                  <span class="text-xl font-bold text-primary">
                    €{{ totalAmount }}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <!-- Formulario de pago -->
          <form @submit.prevent="processPayment" class="space-y-6">
            <!-- Información de la tarjeta -->
            <div>
              <label class="block text-sm font-medium text-black dark:text-white mb-2">
                Información de la Tarjeta
              </label>
              <div class="space-y-4">
                <!-- Número de tarjeta -->
                <div>
                  <input
                    v-model="paymentForm.cardNumber"
                    type="text"
                    placeholder="1234 5678 9012 3456"
                    class="w-full px-3 py-2 border border-stroke rounded-lg focus:outline-none focus:ring-2 focus:ring-primary dark:border-strokedark dark:bg-boxdark dark:text-white"
                    maxlength="19"
                    @input="formatCardNumber"
                  />
                </div>

                <!-- Fecha de vencimiento y CVV -->
                <div class="grid grid-cols-2 gap-4">
                  <div>
                    <input
                      v-model="paymentForm.expiryDate"
                      type="text"
                      placeholder="MM/AA"
                      class="w-full px-3 py-2 border border-stroke rounded-lg focus:outline-none focus:ring-2 focus:ring-primary dark:border-strokedark dark:bg-boxdark dark:text-white"
                      maxlength="5"
                      @input="formatExpiryDate"
                    />
                  </div>
                  <div>
                    <input
                      v-model="paymentForm.cvv"
                      type="text"
                      placeholder="CVV"
                      class="w-full px-3 py-2 border border-stroke rounded-lg focus:outline-none focus:ring-2 focus:ring-primary dark:border-strokedark dark:bg-boxdark dark:text-white"
                      maxlength="4"
                    />
                  </div>
                </div>

                <!-- Nombre del titular -->
                <div>
                  <input
                    v-model="paymentForm.cardholderName"
                    type="text"
                    placeholder="Nombre del titular"
                    class="w-full px-3 py-2 border border-stroke rounded-lg focus:outline-none focus:ring-2 focus:ring-primary dark:border-strokedark dark:bg-boxdark dark:text-white"
                  />
                </div>
              </div>
            </div>

            <!-- Información de facturación -->
            <div>
              <label class="block text-sm font-medium text-black dark:text-white mb-2">
                Dirección de Facturación
              </label>
              <div class="space-y-4">
                <div>
                  <input
                    v-model="paymentForm.billingAddress"
                    type="text"
                    placeholder="Dirección completa"
                    class="w-full px-3 py-2 border border-stroke rounded-lg focus:outline-none focus:ring-2 focus:ring-primary dark:border-strokedark dark:bg-boxdark dark:text-white"
                  />
                </div>
                <div class="grid grid-cols-2 gap-4">
                  <div>
                    <input
                      v-model="paymentForm.city"
                      type="text"
                      placeholder="Ciudad"
                      class="w-full px-3 py-2 border border-stroke rounded-lg focus:outline-none focus:ring-2 focus:ring-primary dark:border-strokedark dark:bg-boxdark dark:text-white"
                    />
                  </div>
                  <div>
                    <input
                      v-model="paymentForm.postalCode"
                      type="text"
                      placeholder="Código postal"
                      class="w-full px-3 py-2 border border-stroke rounded-lg focus:outline-none focus:ring-2 focus:ring-primary dark:border-strokedark dark:bg-boxdark dark:text-white"
                    />
                  </div>
                </div>
              </div>
            </div>

            <!-- Métodos de pago simulados -->
            <div>
              <label class="block text-sm font-medium text-black dark:text-white mb-2">
                Método de Pago
              </label>
              <div class="grid grid-cols-3 gap-4">
                <button
                  type="button"
                  @click="paymentForm.method = 'visa'"
                  :class="[
                    'p-3 border rounded-lg text-center transition-colors',
                    paymentForm.method === 'visa'
                      ? 'border-primary bg-primary/10 text-primary'
                      : 'border-stroke text-gray-600 hover:border-primary dark:border-strokedark dark:text-gray-400'
                  ]"
                >
                  <div class="text-2xl">💳</div>
                  <div class="text-xs mt-1">Visa</div>
                </button>
                <button
                  type="button"
                  @click="paymentForm.method = 'mastercard'"
                  :class="[
                    'p-3 border rounded-lg text-center transition-colors',
                    paymentForm.method === 'mastercard'
                      ? 'border-primary bg-primary/10 text-primary'
                      : 'border-stroke text-gray-600 hover:border-primary dark:border-strokedark dark:text-gray-400'
                  ]"
                >
                  <div class="text-2xl">💳</div>
                  <div class="text-xs mt-1">Mastercard</div>
                </button>
                <button
                  type="button"
                  @click="paymentForm.method = 'paypal'"
                  :class="[
                    'p-3 border rounded-lg text-center transition-colors',
                    paymentForm.method === 'paypal'
                      ? 'border-primary bg-primary/10 text-primary'
                      : 'border-stroke text-gray-600 hover:border-primary dark:border-strokedark dark:text-gray-400'
                  ]"
                >
                  <div class="text-2xl">🅿️</div>
                  <div class="text-xs mt-1">PayPal</div>
                </button>
              </div>
            </div>

            <!-- Botones de acción -->
            <div class="flex space-x-4 pt-4">
              <button
                type="button"
                @click="closeModal"
                class="flex-1 px-4 py-2 border border-stroke text-gray-700 rounded-lg hover:bg-gray-50 dark:border-strokedark dark:text-gray-300 dark:hover:bg-gray-800"
              >
                Cancelar
              </button>
              <button
                type="submit"
                :disabled="isProcessing || !isFormValid"
                class="flex-1 bg-primary hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed text-white font-medium py-2 px-4 rounded-lg transition-colors"
              >
                <span v-if="!isProcessing">💳 Pagar €{{ totalAmount }}</span>
                <span v-else class="flex items-center justify-center">
                  <svg class="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                    <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                    <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Procesando...
                </span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, reactive } from 'vue'
import { useToast } from '@/composables/useToast'

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

const paymentForm = reactive({
  cardNumber: '',
  expiryDate: '',
  cvv: '',
  cardholderName: '',
  billingAddress: '',
  city: '',
  postalCode: '',
  method: 'visa'
})

const totalAmount = computed(() => {
  return props.cartItems.reduce((total, item) => total + item.price, 0)
})

const isFormValid = computed(() => {
  return paymentForm.cardNumber.length >= 16 &&
         paymentForm.expiryDate.length === 5 &&
         paymentForm.cvv.length >= 3 &&
         paymentForm.cardholderName.trim() !== '' &&
         paymentForm.billingAddress.trim() !== '' &&
         paymentForm.city.trim() !== '' &&
         paymentForm.postalCode.trim() !== ''
})

const closeModal = () => {
  emit('close')
}

const formatCardNumber = (event) => {
  let value = event.target.value.replace(/\s/g, '').replace(/[^0-9]/gi, '')
  let formattedValue = value.match(/.{1,4}/g)?.join(' ') || value
  if (formattedValue.length <= 19) {
    paymentForm.cardNumber = formattedValue
  }
}

const formatExpiryDate = (event) => {
  let value = event.target.value.replace(/\D/g, '')
  if (value.length >= 2) {
    value = value.substring(0, 2) + '/' + value.substring(2, 4)
  }
  paymentForm.expiryDate = value
}

const processPayment = async () => {
  isProcessing.value = true
  
  try {
    // Simular procesamiento de pago
    await new Promise(resolve => setTimeout(resolve, 3000))
    
    // Mostrar toast de éxito
    toast.success(
      '¡Pago procesado!',
      `Se ha procesado el pago de €${totalAmount.value} exitosamente. Recibirás una confirmación por email.`,
      { duration: 5000 }
    )
    
    // Emitir evento de éxito
    emit('payment-success', {
      amount: totalAmount.value,
      method: paymentForm.method,
      items: props.cartItems
    })
    
    closeModal()
  } catch (error) {
    toast.error(
      'Error en el pago',
      'No se pudo procesar el pago. Verifica los datos e inténtalo de nuevo.',
      { duration: 5000 }
    )
  } finally {
    isProcessing.value = false
  }
}
</script>
