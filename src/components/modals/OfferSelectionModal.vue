<template>
  <div v-if="isOpen" class="fixed inset-0 z-50 overflow-y-auto">
    <div class="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
      <!-- Overlay -->
      <div class="fixed inset-0 transition-opacity bg-gray-500 bg-opacity-75" @click="closeModal"></div>

      <!-- Modal -->
      <div class="inline-block w-full max-w-md p-6 my-8 overflow-hidden text-left align-middle transition-all transform bg-white dark:bg-gray-800 shadow-xl rounded-2xl">
        <!-- Debug info -->
        <div class="mb-4 p-3 bg-red-100 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded">
          <p class="text-xs text-red-800 dark:text-red-200">
            <strong>🔴 MODAL ABIERTO:</strong> isOpen={{ isOpen }}
          </p>
          <p class="text-xs text-red-800 dark:text-red-200">
            <strong>🔴 OFFER:</strong> {{ JSON.stringify(offer) }}
          </p>
        </div>
        <div class="flex items-center justify-between mb-4">
          <h3 class="text-lg font-semibold text-gray-900 dark:text-white">
            Selecciona tu opción de compra
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

        <div class="mb-6">
          <p class="text-sm text-gray-600 dark:text-gray-400">
            El administrador ha ofrecido las siguientes opciones para tu artículo:
          </p>
        </div>

        <div class="space-y-4">
          <!-- Debug info -->
          <div v-if="!offer.money && !offer.points" class="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
            <p class="text-sm text-red-800 dark:text-red-200">
              <strong>Error:</strong> No hay opciones de compra disponibles para este artículo.
            </p>
            <p class="text-xs text-red-600 dark:text-red-300 mt-1">
              Debug: money={{ offer.money }}, points={{ offer.points }}
            </p>
          </div>

          <!-- Opción de dinero -->
          <div v-if="offer.money" class="border-2 border-gray-200 dark:border-gray-600 rounded-lg p-4 hover:border-blue-500 dark:hover:border-blue-400 transition-colors cursor-pointer" 
               :class="{ 'border-blue-500 dark:border-blue-400 bg-blue-50 dark:bg-blue-900/20': selectedOption === 'money' }"
               @click="selectMoney">
            <div class="flex items-center justify-between">
              <div class="flex items-center space-x-3">
                <div class="w-5 h-5 rounded-full border-2 flex items-center justify-center"
                     :class="selectedOption === 'money' ? 'border-blue-500 bg-blue-500' : 'border-gray-300 dark:border-gray-600'">
                  <div v-if="selectedOption === 'money'" class="w-2 h-2 rounded-full bg-white"></div>
                </div>
                <div>
                  <h4 class="font-medium text-gray-900 dark:text-white">Dinero</h4>
                  <p class="text-sm text-gray-600 dark:text-gray-400">{{ offer.moneyPrice }}€</p>
                </div>
              </div>
              <div class="text-right">
                <span class="text-lg font-semibold text-green-600 dark:text-green-400">
                  {{ offer.moneyPrice }}€
                </span>
              </div>
            </div>
          </div>

          <!-- Opción de puntos -->
          <div v-if="offer.points" class="border-2 border-gray-200 dark:border-gray-600 rounded-lg p-4 hover:border-purple-500 dark:hover:border-purple-400 transition-colors cursor-pointer"
               :class="{ 'border-purple-500 dark:border-purple-400 bg-purple-50 dark:bg-purple-900/20': selectedOption === 'points' }"
               @click="selectPoints">
            <div class="flex items-center justify-between">
              <div class="flex items-center space-x-3">
                <div class="w-5 h-5 rounded-full border-2 flex items-center justify-center"
                     :class="selectedOption === 'points' ? 'border-purple-500 bg-purple-500' : 'border-gray-300 dark:border-gray-600'">
                  <div v-if="selectedOption === 'points'" class="w-2 h-2 rounded-full bg-white"></div>
                </div>
                <div>
                  <h4 class="font-medium text-gray-900 dark:text-white">Puntos</h4>
                  <p class="text-sm text-gray-600 dark:text-gray-400">{{ offer.pointsAmount }} puntos</p>
                </div>
              </div>
              <div class="text-right">
                <span class="text-lg font-semibold text-purple-600 dark:text-purple-400">
                  {{ offer.pointsAmount }} pts
                </span>
              </div>
            </div>
          </div>
        </div>

        <!-- Información adicional -->
        <div class="mt-6 p-4 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg">
          <div class="flex items-start space-x-2">
            <svg class="w-5 h-5 text-yellow-600 dark:text-yellow-400 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.5 0L4.268 19.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
            <div>
              <p class="text-sm text-yellow-800 dark:text-yellow-200">
                <strong>Importante:</strong> Solo puedes elegir una opción. Una vez seleccionada, el artículo pasará a ser propiedad de Trastalia.
              </p>
            </div>
          </div>
        </div>

        <!-- Botones de acción -->
        <div class="flex justify-end space-x-3 mt-6">
          <button
            @click="closeModal"
            class="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-lg transition-colors"
          >
            Cancelar
          </button>
          <button
            @click="acceptOffer"
            :disabled="!selectedOption"
            class="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed rounded-lg transition-colors"
          >
            Aceptar Oferta
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'

interface Offer {
  money: boolean
  points: boolean
  moneyPrice: number
  pointsAmount: number
}

interface Props {
  isOpen: boolean
  offer: Offer
  articleId: string
}

interface Emits {
  (e: 'close'): void
  (e: 'accept', data: { articleId: string, selectedOption: string }): void
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

const selectedOption = ref<string>('')

// Reset selected option when modal opens
watch(() => props.isOpen, (isOpen) => {
  console.log('Modal isOpen changed:', isOpen)
  console.log('Offer data:', props.offer)
  if (isOpen) {
    selectedOption.value = ''
    console.log('Reset selectedOption to empty string')
  }
})

// Watch for changes in selectedOption
watch(selectedOption, (newValue) => {
  console.log('selectedOption changed to:', newValue)
})

const closeModal = () => {
  console.log('Closing modal')
  emit('close')
}

const selectMoney = () => {
  console.log('Selecting money option')
  selectedOption.value = 'money'
}

const selectPoints = () => {
  console.log('Selecting points option')
  selectedOption.value = 'points'
}

const acceptOffer = () => {
  console.log('Accepting offer with selectedOption:', selectedOption.value)
  if (selectedOption.value) {
    emit('accept', {
      articleId: props.articleId,
      selectedOption: selectedOption.value
    })
  } else {
    console.log('No option selected, cannot accept offer')
  }
}
</script>
