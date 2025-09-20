<template>
  <div class="relative">
    <!-- Botón de compra de puntos -->
    <button
      @click="openModal"
      class="flex items-center space-x-2 px-3 py-2 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white rounded-lg transition-all duration-200 shadow-md hover:shadow-lg"
    >
      <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
      </svg>
      <span class="hidden sm:inline text-sm font-medium">Comprar Puntos</span>
    </button>

    <!-- Modal de compra de puntos -->
    <PointsPurchaseModal
      :is-open="isModalOpen"
      @close="closeModal"
      @purchase-success="handlePurchaseSuccess"
    />
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useToast } from '@/composables/useToast'
import PointsPurchaseModal from './PointsPurchaseModal.vue'

const emit = defineEmits(['purchase-success'])
const toast = useToast()

const isModalOpen = ref(false)

const openModal = () => {
  isModalOpen.value = true
}

const closeModal = () => {
  isModalOpen.value = false
}

const handlePurchaseSuccess = (purchaseData) => {
  toast.success(
    '¡Puntos añadidos!',
    `Se han añadido ${purchaseData.points} puntos a tu cuenta${purchaseData.bonus > 0 ? ` (incluyendo ${purchaseData.bonus} de regalo)` : ''}.`,
    { duration: 5000 }
  )
  
  emit('purchase-success', purchaseData)
  closeModal()
}
</script>
