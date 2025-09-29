<template>
  <div v-if="isOpen" class="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
    <div class="bg-white rounded-lg shadow-xl w-full max-w-4xl mx-auto max-h-[90vh] overflow-y-auto relative">
      <!-- Close Button -->
      <button @click="$emit('close')" class="absolute top-4 right-4 text-gray-400 hover:text-gray-600 z-10">
        <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
        </svg>
      </button>

      <!-- Package Header -->
      <div :class="[
        'h-32 bg-gradient-to-r p-6 flex items-center justify-between text-white rounded-t-lg',
        packageData.color
      ]">
        <div>
          <div class="text-4xl mb-2">{{ packageData.emoji }}</div>
          <h2 class="text-2xl font-bold">{{ packageData.name }}</h2>
          <p class="text-white/80">{{ packageData.description }}</p>
        </div>
        <div class="text-right">
          <div class="text-3xl font-bold">{{ packageData.discountPercentage }}% OFF</div>
          <div class="text-sm opacity-80">Descuento</div>
        </div>
      </div>

      <div class="p-6">
        <!-- Price Information -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div class="bg-gray-50 rounded-lg p-4">
            <h3 class="text-lg font-semibold text-gray-900 mb-3">Información de Precio</h3>
            <div class="space-y-2">
              <div class="flex justify-between">
                <span class="text-gray-600">Precio total individual:</span>
                <span class="font-semibold line-through text-gray-500">€{{ packageData.totalPrice }}</span>
              </div>
              <div class="flex justify-between">
                <span class="text-gray-600">Precio del pack:</span>
                <span class="font-bold text-2xl text-green-600">€{{ packageData.discountedPrice }}</span>
              </div>
              <div class="flex justify-between">
                <span class="text-gray-600">Ahorras:</span>
                <span class="font-semibold text-red-600">€{{ packageData.totalPrice - packageData.discountedPrice }}</span>
              </div>
            </div>
          </div>

          <div class="bg-gray-50 rounded-lg p-4">
            <h3 class="text-lg font-semibold text-gray-900 mb-3">Disponibilidad</h3>
            <div class="space-y-2">
              <div class="flex justify-between">
                <span class="text-gray-600">Stock disponible:</span>
                <span class="font-semibold text-blue-600">{{ packageData.stock }} unidades</span>
              </div>
              <div class="flex justify-between">
                <span class="text-gray-600">Estado:</span>
                <span :class="[
                  'px-2 py-1 rounded-full text-xs font-semibold',
                  packageData.availability === 'available' ? 'bg-green-100 text-green-800' : 
                  packageData.availability === 'limited' ? 'bg-yellow-100 text-yellow-800' :
                  'bg-red-100 text-red-800'
                ]">
                  {{ getAvailabilityLabel(packageData.availability) }}
                </span>
              </div>
            </div>
          </div>
        </div>

        <!-- Items List -->
        <div class="mb-8">
          <h3 class="text-xl font-semibold text-gray-900 mb-4">Contenido del Pack</h3>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div 
              v-for="item in packageData.items" 
              :key="item.name"
              class="flex items-center space-x-3 p-3 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <span class="text-2xl">{{ item.emoji }}</span>
              <div class="flex-1">
                <div class="flex items-center space-x-2">
                  <span class="font-medium text-gray-900">{{ item.name }}</span>
                  <span v-if="item.essential" class="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full font-semibold">★ Esencial</span>
                </div>
                <div class="text-sm text-gray-500">€{{ item.price }}</div>
              </div>
            </div>
          </div>
        </div>

        <!-- Benefits -->
        <div class="mb-8">
          <h3 class="text-xl font-semibold text-gray-900 mb-4">Beneficios del Pack</h3>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div 
              v-for="benefit in packageData.benefits" 
              :key="benefit"
              class="flex items-start space-x-3 p-3 bg-green-50 rounded-lg"
            >
              <svg class="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"/>
              </svg>
              <span class="text-gray-700">{{ benefit }}</span>
            </div>
          </div>
        </div>

        <!-- Tags -->
        <div v-if="packageData.tags && packageData.tags.length > 0" class="mb-8">
          <h3 class="text-xl font-semibold text-gray-900 mb-4">Etiquetas</h3>
          <div class="flex flex-wrap gap-2">
            <span 
              v-for="tag in packageData.tags" 
              :key="tag"
              class="bg-blue-100 text-blue-800 text-sm px-3 py-1 rounded-full font-medium"
            >
              {{ tag }}
            </span>
          </div>
        </div>

        <!-- Action Buttons -->
        <div class="flex flex-col sm:flex-row gap-4">
          <button
            @click="handleAddToCart"
            :disabled="packageData.availability === 'out_of_stock'"
            class="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 px-6 rounded-lg font-semibold hover:from-blue-700 hover:to-purple-700 transition-all duration-300 transform hover:scale-105 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
          >
            🛒 Agregar al Carrito - €{{ packageData.discountedPrice }}
          </button>
          
          <button
            @click="handleAddToWishlist"
            class="flex-1 border-2 border-gray-300 text-gray-700 py-3 px-6 rounded-lg font-semibold hover:border-blue-600 hover:text-blue-600 transition-all duration-300"
          >
            💝 Agregar a Favoritos
          </button>
        </div>

        <!-- Out of Stock Message -->
        <div v-if="packageData.availability === 'out_of_stock'" class="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">
          <div class="flex items-center space-x-2">
            <svg class="w-5 h-5 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"></path>
            </svg>
            <span class="text-red-800 font-medium">Este pack está temporalmente agotado</span>
          </div>
          <p class="text-red-600 text-sm mt-1">Te notificaremos cuando vuelva a estar disponible.</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useAuthStore } from '@/stores/auth'
import { useRouter } from 'vue-router'

const props = defineProps({
  isOpen: {
    type: Boolean,
    default: false
  },
  package: {
    type: Object,
    required: true
  }
})

const emit = defineEmits(['close', 'add-to-cart'])

const authStore = useAuthStore()
const router = useRouter()

const packageData = computed(() => props.package)

const getAvailabilityLabel = (availability) => {
  const labels = {
    'available': 'Disponible',
    'limited': 'Stock Limitado',
    'out_of_stock': 'Agotado'
  }
  return labels[availability] || availability
}

const handleAddToCart = () => {
  if (!authStore.isAuthenticated) {
    router.push('/login')
    return
  }
  
  emit('add-to-cart', packageData.value)
  emit('close')
}

const handleAddToWishlist = () => {
  if (!authStore.isAuthenticated) {
    router.push('/login')
    return
  }
  
  // TODO: Implementar lógica de favoritos
  console.log('💝 Agregando a favoritos:', packageData.value.name)
  alert(`"${packageData.value.name}" agregado a favoritos`)
}
</script>
