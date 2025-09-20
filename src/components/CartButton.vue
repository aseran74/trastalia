<template>
  <div class="relative">
    <!-- Botón del carrito -->
    <button
      @click="toggleCart"
      class="relative p-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
    >
      <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-2.5 5M7 13l2.5 5m6-5v6a2 2 0 11-4 0v-6m4 0V9a2 2 0 00-2-2H9a2 2 0 00-2 2v4.01" />
      </svg>
      
      <!-- Contador de items -->
      <span
        v-if="cartItems.length > 0"
        class="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-medium"
      >
        {{ cartItems.length }}
      </span>
    </button>

    <!-- Dropdown del carrito -->
    <div
      v-if="isCartOpen"
      class="absolute right-0 mt-2 w-80 bg-white dark:bg-gray-800 rounded-lg shadow-xl border border-gray-200 dark:border-gray-700 z-50"
    >
      <!-- Header del carrito -->
      <div class="px-4 py-3 border-b border-gray-200 dark:border-gray-700">
        <div class="flex items-center justify-between">
          <h3 class="text-lg font-semibold text-gray-900 dark:text-white">
            Carrito de Compra
          </h3>
          <button
            @click="closeCart"
            class="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
          >
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      </div>

      <!-- Items del carrito -->
      <div class="max-h-64 overflow-y-auto">
        <div v-if="cartItems.length === 0" class="p-4 text-center">
          <svg class="w-12 h-12 text-gray-400 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-2.5 5M7 13l2.5 5m6-5v6a2 2 0 11-4 0v-6m4 0V9a2 2 0 00-2-2H9a2 2 0 00-2 2v4.01" />
          </svg>
          <p class="text-gray-500 dark:text-gray-400">Tu carrito está vacío</p>
        </div>

        <div v-else class="divide-y divide-gray-200 dark:divide-gray-700">
          <div
            v-for="item in cartItems"
            :key="item.id"
            class="p-4 flex items-center space-x-3"
          >
            <!-- Imagen del artículo -->
            <div class="flex-shrink-0 w-12 h-12 bg-gray-200 dark:bg-gray-700 rounded-lg flex items-center justify-center">
              <svg class="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>

            <!-- Información del artículo -->
            <div class="flex-1 min-w-0">
              <h4 class="text-sm font-medium text-gray-900 dark:text-white truncate">
                {{ item.article.title }}
              </h4>
              <p class="text-sm text-gray-500 dark:text-gray-400">
                {{ item.price }}€
              </p>
            </div>

            <!-- Botón de eliminar -->
            <button
              @click="removeFromCart(item.id)"
              class="text-red-400 hover:text-red-600 transition-colors"
            >
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      <!-- Footer del carrito -->
      <div v-if="cartItems.length > 0" class="px-4 py-3 border-t border-gray-200 dark:border-gray-700">
        <div class="flex items-center justify-between mb-3">
          <span class="text-sm font-medium text-gray-900 dark:text-white">Total:</span>
          <span class="text-lg font-bold text-gray-900 dark:text-white">{{ totalPrice }}€</span>
        </div>
        
        <div class="flex space-x-2">
          <button
            @click="goToCart"
            class="flex-1 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
          >
            Ver Carrito
          </button>
          <button
            @click="proceedToCheckout"
            class="flex-1 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
          >
            Comprar
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

const props = defineProps({
  cartItems: {
    type: Array,
    default: () => []
  }
})

const emit = defineEmits(['remove-item', 'proceed-to-checkout'])

const isCartOpen = ref(false)

const totalPrice = computed(() => {
  return props.cartItems.reduce((total, item) => total + item.price, 0)
})

const toggleCart = () => {
  isCartOpen.value = !isCartOpen.value
}

const closeCart = () => {
  isCartOpen.value = false
}

const removeFromCart = (itemId) => {
  emit('remove-item', itemId)
}

const goToCart = () => {
  closeCart()
  router.push('/comprar-articulos')
}

const proceedToCheckout = () => {
  closeCart()
  emit('proceed-to-checkout')
}
</script>
