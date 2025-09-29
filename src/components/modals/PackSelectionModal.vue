<template>
  <div v-if="isOpen" class="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
    <div class="bg-white rounded-lg shadow-xl w-full max-w-6xl mx-auto max-h-[90vh] overflow-y-auto relative">
      <!-- Close Button -->
      <button @click="$emit('close')" class="absolute top-4 right-4 text-gray-400 hover:text-gray-600 z-10">
        <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
        </svg>
      </button>

      <!-- Header -->
      <div class="p-6 border-b border-gray-200">
        <h2 class="text-2xl font-bold text-gray-900 mb-2">Seleccionar Pack Temático</h2>
        <p class="text-gray-600">Elige un pack temático para vender todos los artículos juntos con descuento</p>
      </div>

      <!-- Search and Filter -->
      <div class="p-6 border-b border-gray-200">
        <div class="flex flex-col md:flex-row gap-4">
          <!-- Search -->
          <div class="flex-1">
            <div class="relative">
              <input
                v-model="searchQuery"
                type="text"
                placeholder="Buscar packs..."
                class="w-full px-4 py-2 pl-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
              <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg class="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
            </div>
          </div>

          <!-- Category Filter -->
          <div class="md:w-48">
            <select 
              v-model="selectedCategory" 
              class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">Todas las categorías</option>
              <option value="bebe">👶 Bebé</option>
              <option value="deportes">⚽ Deportes</option>
              <option value="musica">🎵 Música</option>
              <option value="hogar">🏠 Hogar</option>
            </select>
          </div>
        </div>
      </div>

      <!-- Packages Grid -->
      <div class="p-6">
        <div v-if="loading" class="flex justify-center py-12">
          <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>

        <div v-else-if="filteredPackages.length > 0" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div 
            v-for="pkg in filteredPackages" 
            :key="pkg.id"
            class="group bg-white border border-gray-200 rounded-lg overflow-hidden hover:shadow-lg transition-all duration-300 hover:-translate-y-1 cursor-pointer"
            :class="{ 'ring-2 ring-blue-500': selectedPackage?.id === pkg.id }"
            @click="selectPackage(pkg)"
          >
            <!-- Package Header -->
            <div :class="[
              'h-24 bg-gradient-to-r p-4 flex items-center justify-between text-white',
              pkg.color
            ]">
              <div class="flex items-center space-x-3">
                <div class="text-3xl">{{ pkg.emoji }}</div>
                <div>
                  <h3 class="text-lg font-bold">{{ pkg.name }}</h3>
                  <div class="text-white/80 text-sm">{{ pkg.discountPercentage }}% OFF</div>
                </div>
              </div>
              <div class="text-right">
                <div class="text-xl font-bold">€{{ pkg.discountedPrice }}</div>
                <div class="text-sm line-through opacity-80">€{{ pkg.totalPrice }}</div>
              </div>
            </div>

            <!-- Package Content -->
            <div class="p-4">
              <p class="text-gray-600 text-sm mb-3">{{ pkg.description }}</p>
              
              <!-- Items Preview -->
              <div class="mb-3">
                <div class="text-sm font-medium text-gray-900 mb-2">Incluye:</div>
                <div class="flex flex-wrap gap-1">
                  <span 
                    v-for="item in pkg.items.slice(0, 4)" 
                    :key="item.name"
                    class="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded"
                  >
                    {{ item.emoji }} {{ item.name }}
                  </span>
                  <span v-if="pkg.items.length > 4" class="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded">
                    +{{ pkg.items.length - 4 }} más
                  </span>
                </div>
              </div>

              <!-- Benefits -->
              <div class="mb-3">
                <div class="text-sm text-green-600 font-medium">
                  ✓ Ahorras €{{ pkg.totalPrice - pkg.discountedPrice }}
                </div>
              </div>

              <!-- Stock -->
              <div class="flex items-center justify-between text-sm">
                <span class="text-gray-500">Stock: {{ pkg.stock }}</span>
                <span :class="[
                  'px-2 py-1 rounded-full text-xs font-medium',
                  pkg.availability === 'available' ? 'bg-green-100 text-green-800' : 
                  pkg.availability === 'limited' ? 'bg-yellow-100 text-yellow-800' :
                  'bg-red-100 text-red-800'
                ]">
                  {{ getAvailabilityLabel(pkg.availability) }}
                </span>
              </div>
            </div>
          </div>
        </div>

        <!-- No Results -->
        <div v-else class="text-center py-12">
          <div class="w-24 h-24 mx-auto mb-4 bg-gray-200 rounded-full flex items-center justify-center">
            <svg class="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.172 16.172a4 4 0 015.656 0M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
            </svg>
          </div>
          <h3 class="mt-2 text-sm font-medium text-gray-900">No se encontraron packs</h3>
          <p class="mt-1 text-sm text-gray-500">Intenta con otros términos de búsqueda.</p>
        </div>
      </div>

      <!-- Footer -->
      <div class="p-6 border-t border-gray-200 bg-gray-50">
        <div v-if="selectedPackage" class="mb-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <div class="flex items-center justify-between">
            <div>
              <h4 class="font-semibold text-blue-900">{{ selectedPackage.name }}</h4>
              <p class="text-blue-700 text-sm">{{ selectedPackage.items.length }} artículos • Ahorras €{{ selectedPackage.totalPrice - selectedPackage.discountedPrice }}</p>
            </div>
            <div class="text-right">
              <div class="text-xl font-bold text-blue-900">€{{ selectedPackage.discountedPrice }}</div>
              <div class="text-sm line-through text-blue-600">€{{ selectedPackage.totalPrice }}</div>
            </div>
          </div>
        </div>

        <div class="flex flex-col sm:flex-row gap-3">
          <button
            @click="$emit('close')"
            class="flex-1 border border-gray-300 text-gray-700 py-3 px-6 rounded-lg font-semibold hover:bg-gray-50 transition-colors"
          >
            Cancelar
          </button>
          
          <button
            @click="confirmSelection"
            :disabled="!selectedPackage || selectedPackage.availability === 'out_of_stock'"
            class="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 px-6 rounded-lg font-semibold hover:from-blue-700 hover:to-purple-700 transition-all duration-300 transform hover:scale-105 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
          >
            {{ selectedPackage ? `Usar este Pack - €${selectedPackage.discountedPrice}` : 'Selecciona un Pack' }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import API_BASE_URL from '@/config/api.js'

const props = defineProps({
  isOpen: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['close', 'pack-selected'])

// Estado
const packages = ref([])
const loading = ref(false)
const searchQuery = ref('')
const selectedCategory = ref('')
const selectedPackage = ref(null)

// Computed
const filteredPackages = computed(() => {
  let filtered = packages.value

  // Filtrar por categoría
  if (selectedCategory.value) {
    filtered = filtered.filter(pkg => pkg.category === selectedCategory.value)
  }

  // Filtrar por búsqueda
  if (searchQuery.value.trim()) {
    const query = searchQuery.value.toLowerCase()
    filtered = filtered.filter(pkg => 
      pkg.name.toLowerCase().includes(query) ||
      pkg.description.toLowerCase().includes(query) ||
      pkg.items.some(item => item.name.toLowerCase().includes(query))
    )
  }

  return filtered
})

// Cargar paquetes
const loadPackages = async () => {
  loading.value = true
  try {
    const response = await fetch(`${API_BASE_URL}/api/packages`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      }
    })

    if (response.ok) {
      const data = await response.json()
      packages.value = data.data || []
      console.log('📦 Paquetes cargados:', packages.value.length)
    } else {
      console.error('❌ Error cargando paquetes:', response.status)
    }
  } catch (error) {
    console.error('❌ Error cargando paquetes:', error)
  } finally {
    loading.value = false
  }
}

// Seleccionar paquete
const selectPackage = (pkg) => {
  selectedPackage.value = pkg
}

// Confirmar selección
const confirmSelection = () => {
  if (selectedPackage.value) {
    emit('pack-selected', selectedPackage.value)
    emit('close')
  }
}

// Helper para etiquetas de disponibilidad
const getAvailabilityLabel = (availability) => {
  const labels = {
    'available': 'Disponible',
    'limited': 'Stock Limitado',
    'out_of_stock': 'Agotado'
  }
  return labels[availability] || availability
}

// Lifecycle
onMounted(() => {
  if (props.isOpen) {
    loadPackages()
  }
})

// Recargar cuando se abre el modal
watch(() => props.isOpen, (newVal) => {
  if (newVal) {
    loadPackages()
    selectedPackage.value = null
    searchQuery.value = ''
    selectedCategory.value = ''
  }
})
</script>
