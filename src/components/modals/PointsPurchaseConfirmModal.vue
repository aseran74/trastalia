<template>
  <div
    v-if="isOpen"
    class="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50"
    @click.self="closeModal"
  >
    <div class="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-md w-full mx-4">
      <!-- Header -->
      <div class="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
        <div class="flex items-center justify-between">
          <h3 class="text-lg font-semibold text-gray-900 dark:text-white">
            Confirmar Compra con Puntos
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
      </div>

      <!-- Content -->
      <div class="px-6 py-4">
        <div v-if="article" class="space-y-4">
          <!-- Artículo Info -->
          <div class="flex items-center space-x-4">
            <img
              :src="article.images?.[0] || '/images/placeholder.jpg'"
              :alt="article.title"
              class="w-16 h-16 object-cover rounded-lg"
            />
            <div class="flex-1">
              <h4 class="font-medium text-gray-900 dark:text-white">{{ article.title }}</h4>
              <p class="text-sm text-gray-500 dark:text-gray-400">{{ article.description }}</p>
            </div>
          </div>

          <!-- Precio y Puntos -->
          <div class="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
            <div class="flex justify-between items-center">
              <span class="text-sm font-medium text-gray-700 dark:text-gray-300">Precio en dinero:</span>
              <span class="text-lg font-semibold text-gray-900 dark:text-white">{{ article.price }}€</span>
            </div>
            <div class="flex justify-between items-center mt-2">
              <span class="text-sm font-medium text-gray-700 dark:text-gray-300">Precio en puntos:</span>
              <span class="text-lg font-semibold text-blue-600 dark:text-blue-400">{{ pointsRequired }} puntos</span>
            </div>
            <div class="flex justify-between items-center mt-2 pt-2 border-t border-gray-200 dark:border-gray-600">
              <span class="text-sm font-medium text-gray-700 dark:text-gray-300">Tu saldo actual:</span>
              <span class="text-lg font-semibold text-green-600 dark:text-green-400">{{ userPoints }} puntos</span>
            </div>
          </div>

          <!-- Confirmación -->
          <div class="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4">
            <div class="flex items-start">
              <svg class="w-5 h-5 text-blue-600 dark:text-blue-400 mt-0.5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
              <div>
                <p class="text-sm text-blue-800 dark:text-blue-200">
                  ¿Estás seguro de que quieres comprar este artículo con <strong>{{ pointsRequired }} puntos</strong>?
                </p>
                <p class="text-xs text-blue-600 dark:text-blue-300 mt-1">
                  Tu saldo después de la compra será: <strong>{{ userPoints - pointsRequired }} puntos</strong>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Footer -->
      <div class="px-6 py-4 border-t border-gray-200 dark:border-gray-700 flex justify-end space-x-3">
        <button
          @click="closeModal"
          class="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600"
        >
          Cancelar
        </button>
        <button
          @click="confirmPurchase"
          :disabled="loading || userPoints < pointsRequired"
          class="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <span v-if="loading" class="flex items-center">
            <svg class="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Procesando...
          </span>
          <span v-else>Confirmar Compra</span>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { useToast } from '@/composables/useToast'
import API_BASE_URL from '@/config/api'

const props = defineProps({
  isOpen: {
    type: Boolean,
    default: false
  },
  article: {
    type: Object,
    default: null
  }
})

const emit = defineEmits(['close', 'confirmed'])

const authStore = useAuthStore()
const toast = useToast()
const loading = ref(false)

// Calcular puntos requeridos
const pointsRequired = computed(() => {
  if (!props.article) return 0
  return props.article.adminDecision?.pointsAmount || props.article.pointsPrice || 0
})

// Puntos del usuario
const userPoints = computed(() => {
  return authStore.user?.points || 0
})

const closeModal = () => {
  emit('close')
}

const confirmPurchase = async () => {
  if (!props.article) {
    console.error('❌ No hay artículo seleccionado')
    return
  }
  
  console.log('🛒 Iniciando compra con puntos:', {
    article: props.article.title,
    articleId: props.article._id,
    pointsRequired: pointsRequired.value,
    userPoints: userPoints.value,
    API_BASE_URL
  })
  
  loading.value = true
  
  try {
    // Llamar a la API para procesar la compra con puntos
    const response = await fetch(`${API_BASE_URL}/api/articles/purchase-with-points`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${authStore.token}`
      },
      body: JSON.stringify({
        articleId: props.article._id,
        pointsAmount: pointsRequired.value
      })
    })

    console.log('📡 Respuesta del servidor:', response.status, response.statusText)

    const data = await response.json()
    console.log('📦 Datos de respuesta:', data)

    if (data.success) {
      console.log('✅ Compra exitosa')
      toast.success('¡Compra realizada con éxito!', 'El artículo se ha añadido a tus canjes.')
      
      // Actualizar puntos del usuario
      await authStore.checkAuth()
      
      // Emitir evento de confirmación
      emit('confirmed', props.article)
    } else {
      console.error('❌ Error en la compra:', data.message)
      toast.error('Error en la compra', data.message || 'No se pudo procesar la compra')
    }
  } catch (error) {
    console.error('💥 Error comprando con puntos:', error)
    toast.error('Error en la compra', 'No se pudo procesar la compra. Inténtalo de nuevo.')
  } finally {
    loading.value = false
  }
}
</script>
