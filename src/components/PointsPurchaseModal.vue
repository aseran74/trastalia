<template>
  <div
    v-if="isOpen"
    class="fixed inset-0 z-50 overflow-y-auto"
    aria-labelledby="modal-title"
    role="dialog"
    aria-modal="true"
  >
    <div class="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
      <!-- Fondo oscuro -->
      <div
        class="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"
        aria-hidden="true"
        @click="closeModal"
      ></div>

      <!-- Modal -->
      <div class="inline-block align-bottom bg-white dark:bg-gray-800 rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
        <div class="bg-white dark:bg-gray-800 px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
          <!-- Header -->
          <div class="flex items-center justify-between mb-4">
            <h3 class="text-lg font-medium text-gray-900 dark:text-white">
              Comprar Puntos
            </h3>
            <button
              @click="closeModal"
              class="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
            >
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <!-- Información de equivalencia -->
          <div class="mb-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
            <div class="flex items-center">
              <svg class="w-5 h-5 text-blue-600 dark:text-blue-400 mr-2" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clip-rule="evenodd" />
              </svg>
              <p class="text-sm text-blue-800 dark:text-blue-200">
                <strong>1€ = 1 punto</strong> • Los puntos no expiran y se pueden usar en cualquier momento
              </p>
            </div>
          </div>

          <!-- Opciones de compra -->
          <div class="space-y-3">
            <!-- Opción 1: 10€ = 10 puntos -->
            <div
              @click="selectAmount(10)"
              :class="[
                'relative p-4 border-2 rounded-lg cursor-pointer transition-all',
                selectedAmount === 10
                  ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                  : 'border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500'
              ]"
            >
              <div class="flex items-center justify-between">
                <div>
                  <h4 class="text-lg font-semibold text-gray-900 dark:text-white">10€</h4>
                  <p class="text-sm text-gray-600 dark:text-gray-400">10 puntos</p>
                </div>
                <div class="text-right">
                  <span class="text-2xl font-bold text-gray-900 dark:text-white">10</span>
                  <p class="text-xs text-gray-500 dark:text-gray-400">puntos</p>
                </div>
              </div>
            </div>

            <!-- Opción 2: 25€ = 25 puntos -->
            <div
              @click="selectAmount(25)"
              :class="[
                'relative p-4 border-2 rounded-lg cursor-pointer transition-all',
                selectedAmount === 25
                  ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                  : 'border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500'
              ]"
            >
              <div class="flex items-center justify-between">
                <div>
                  <h4 class="text-lg font-semibold text-gray-900 dark:text-white">25€</h4>
                  <p class="text-sm text-gray-600 dark:text-gray-400">25 puntos</p>
                </div>
                <div class="text-right">
                  <span class="text-2xl font-bold text-gray-900 dark:text-white">25</span>
                  <p class="text-xs text-gray-500 dark:text-gray-400">puntos</p>
                </div>
              </div>
            </div>

            <!-- Opción 3: 50€ = 55 puntos (BONO) -->
            <div
              @click="selectAmount(50)"
              :class="[
                'relative p-4 border-2 rounded-lg cursor-pointer transition-all',
                selectedAmount === 50
                  ? 'border-green-500 bg-green-50 dark:bg-green-900/20'
                  : 'border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500'
              ]"
            >
              <div class="absolute -top-2 -right-2 bg-green-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                +5 BONO
              </div>
              <div class="flex items-center justify-between">
                <div>
                  <h4 class="text-lg font-semibold text-gray-900 dark:text-white">50€</h4>
                  <p class="text-sm text-gray-600 dark:text-gray-400">55 puntos</p>
                  <p class="text-xs text-green-600 dark:text-green-400 font-medium">¡5 puntos de regalo!</p>
                </div>
                <div class="text-right">
                  <span class="text-2xl font-bold text-gray-900 dark:text-white">55</span>
                  <p class="text-xs text-gray-500 dark:text-gray-400">puntos</p>
                </div>
              </div>
            </div>

            <!-- Opción 4: 100€ = 110 puntos (BONO) -->
            <div
              @click="selectAmount(100)"
              :class="[
                'relative p-4 border-2 rounded-lg cursor-pointer transition-all',
                selectedAmount === 100
                  ? 'border-purple-500 bg-purple-50 dark:bg-purple-900/20'
                  : 'border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500'
              ]"
            >
              <div class="absolute -top-2 -right-2 bg-purple-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                +10 BONO
              </div>
              <div class="flex items-center justify-between">
                <div>
                  <h4 class="text-lg font-semibold text-gray-900 dark:text-white">100€</h4>
                  <p class="text-sm text-gray-600 dark:text-gray-400">110 puntos</p>
                  <p class="text-xs text-purple-600 dark:text-purple-400 font-medium">¡10 puntos de regalo!</p>
                </div>
                <div class="text-right">
                  <span class="text-2xl font-bold text-gray-900 dark:text-white">110</span>
                  <p class="text-xs text-gray-500 dark:text-gray-400">puntos</p>
                </div>
              </div>
            </div>
          </div>

          <!-- Resumen de la compra -->
          <div v-if="selectedAmount" class="mt-6 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
            <div class="flex justify-between items-center">
              <div>
                <p class="text-sm text-gray-600 dark:text-gray-400">Total a pagar:</p>
                <p class="text-lg font-semibold text-gray-900 dark:text-white">{{ selectedAmount }}€</p>
              </div>
              <div class="text-right">
                <p class="text-sm text-gray-600 dark:text-gray-400">Puntos a recibir:</p>
                <p class="text-lg font-semibold text-blue-600 dark:text-blue-400">{{ getPointsForAmount(selectedAmount) }} puntos</p>
              </div>
            </div>
            <div v-if="getBonusPoints(selectedAmount) > 0" class="mt-2 text-center">
              <span class="text-sm text-green-600 dark:text-green-400 font-medium">
                ¡Incluye {{ getBonusPoints(selectedAmount) }} puntos de regalo!
              </span>
            </div>
          </div>
        </div>

        <!-- Footer con botones -->
        <div class="bg-gray-50 dark:bg-gray-700 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
          <button
            @click="proceedToPayment"
            :disabled="!selectedAmount || loading"
            class="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-600 text-base font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:ml-3 sm:w-auto sm:text-sm disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <span v-if="loading">Procesando...</span>
            <span v-else>Continuar al Pago</span>
          </button>
          <button
            @click="closeModal"
            class="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 dark:border-gray-600 shadow-sm px-4 py-2 bg-white dark:bg-gray-800 text-base font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
          >
            Cancelar
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useToast } from '@/composables/useToast'

const props = defineProps({
  isOpen: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['close', 'purchase-success'])

const toast = useToast()
const selectedAmount = ref(null)
const loading = ref(false)

// Calcular puntos según la cantidad
const getPointsForAmount = (amount) => {
  if (amount === 50) return 55
  if (amount === 100) return 110
  return amount
}

// Calcular puntos de bonificación
const getBonusPoints = (amount) => {
  if (amount === 50) return 5
  if (amount === 100) return 10
  return 0
}

const selectAmount = (amount) => {
  selectedAmount.value = amount
}

const closeModal = () => {
  selectedAmount.value = null
  emit('close')
}

const proceedToPayment = async () => {
  if (!selectedAmount.value) return

  loading.value = true

  try {
    // Simular procesamiento de pago
    await new Promise(resolve => setTimeout(resolve, 2000))

    // Mostrar toast de éxito
    toast.success(
      '¡Puntos comprados!',
      `Se han añadido ${getPointsForAmount(selectedAmount.value)} puntos a tu cuenta.`,
      { duration: 5000 }
    )

    // Emitir evento de éxito
    emit('purchase-success', {
      amount: selectedAmount.value,
      points: getPointsForAmount(selectedAmount.value),
      bonus: getBonusPoints(selectedAmount.value)
    })

    closeModal()
  } catch (error) {
    toast.error(
      'Error en la compra',
      'No se pudieron procesar los puntos. Inténtalo de nuevo.',
      { duration: 5000 }
    )
  } finally {
    loading.value = false
  }
}
</script>
