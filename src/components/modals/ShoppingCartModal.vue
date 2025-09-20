<template>
  <div v-if="isOpen" class="fixed inset-0 z-50 overflow-y-auto">
    <div class="flex min-h-screen items-center justify-center p-4">
      <!-- Overlay -->
      <div class="fixed inset-0 bg-black bg-opacity-50" @click="closeModal"></div>
      
      <!-- Modal -->
      <div class="relative w-full max-w-4xl bg-white rounded-lg shadow-xl dark:bg-boxdark">
        <!-- Header -->
        <div class="flex items-center justify-between p-6 border-b border-stroke dark:border-strokedark">
          <h3 class="text-xl font-semibold text-black dark:text-white">
            🛒 Carrito de Compra
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
          <!-- Items en el carrito -->
          <div v-if="cartItems.length > 0" class="space-y-4">
            <div
              v-for="item in cartItems"
              :key="item.id"
              class="flex items-center space-x-4 p-4 border border-stroke rounded-lg dark:border-strokedark"
            >
              <!-- Imagen del artículo -->
              <div class="w-16 h-16 bg-gray-200 rounded-lg flex items-center justify-center dark:bg-gray-700">
                <img
                  v-if="item.article.images && item.article.images.length > 0"
                  :src="item.article.images[0]"
                  :alt="item.article.title"
                  class="w-full h-full object-cover rounded-lg"
                />
                <svg v-else class="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                </svg>
              </div>

              <!-- Información del artículo -->
              <div class="flex-1">
                <h4 class="text-lg font-medium text-black dark:text-white">
                  {{ item.article.title }}
                </h4>
                <p class="text-sm text-gray-600 dark:text-gray-400">
                  {{ item.article.description }}
                </p>
                <div class="flex items-center space-x-2 mt-2">
                  <span class="text-sm text-gray-500 dark:text-gray-400">Precio sugerido:</span>
                  <span class="text-sm font-medium text-gray-900 dark:text-white">
                    €{{ item.suggestedPrice }}
                  </span>
                </div>
              </div>

              <!-- Precio de compra -->
              <div class="text-right">
                <div class="text-2xl font-bold text-primary">
                  €{{ item.price }}
                </div>
                <div class="text-sm text-gray-500 dark:text-gray-400">
                  Oferta de Trastalia
                </div>
              </div>

              <!-- Botón eliminar -->
              <button
                @click="removeFromCart(item.id)"
                class="text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300"
              >
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
                </svg>
              </button>
            </div>

            <!-- Resumen del carrito -->
            <div class="mt-6 p-4 bg-gray-50 rounded-lg dark:bg-gray-800">
              <div class="flex justify-between items-center mb-2">
                <span class="text-lg font-medium text-black dark:text-white">
                  Total de artículos:
                </span>
                <span class="text-lg font-medium text-black dark:text-white">
                  {{ cartItems.length }}
                </span>
              </div>
              <div class="flex justify-between items-center mb-4">
                <span class="text-xl font-bold text-black dark:text-white">
                  Total a pagar:
                </span>
                <span class="text-2xl font-bold text-primary">
                  €{{ totalAmount }}
                </span>
              </div>
              
              <!-- Botón de pago -->
              <button
                @click="proceedToPayment"
                class="w-full bg-primary hover:bg-primary/90 text-white font-medium py-3 px-4 rounded-lg transition-colors"
              >
                💳 Proceder al Pago
              </button>
            </div>
          </div>

          <!-- Carrito vacío -->
          <div v-else class="text-center py-12">
            <svg class="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-2.5 5M7 13l2.5 5m6-5v6a2 2 0 11-4 0v-6m4 0V9a2 2 0 00-2-2H9a2 2 0 00-2 2v4.01"></path>
            </svg>
            <h3 class="text-lg font-medium text-gray-900 dark:text-white mb-2">
              Tu carrito está vacío
            </h3>
            <p class="text-gray-500 dark:text-gray-400">
              Agrega artículos desde las solicitudes de compra
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
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

const emit = defineEmits(['close', 'proceed-to-payment', 'remove-item'])

const toast = useToast()

const totalAmount = computed(() => {
  return props.cartItems.reduce((total, item) => total + item.price, 0)
})

const closeModal = () => {
  emit('close')
}

const removeFromCart = (itemId) => {
  const item = props.cartItems.find(item => item.id === itemId)
  if (item) {
    toast.success(
      'Artículo eliminado',
      `"${item.article.title}" se ha eliminado del carrito.`,
      { duration: 3000 }
    )
  }
  emit('remove-item', itemId)
}

const proceedToPayment = () => {
  emit('proceed-to-payment')
}
</script>
