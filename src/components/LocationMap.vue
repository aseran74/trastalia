<template>
  <div v-if="showMap && coordinates" class="mt-3">
    <div class="bg-gray-100 dark:bg-gray-800 rounded-lg p-3">
      <h4 class="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
        📍 Ubicación en el mapa
      </h4>
      <div 
        ref="mapContainer" 
        class="w-full h-32 bg-gray-200 dark:bg-gray-700 rounded border"
        :style="{ backgroundImage: `url(${mapImageUrl})`, backgroundSize: 'cover', backgroundPosition: 'center' }"
      >
        <div class="flex items-center justify-center h-full text-gray-500 dark:text-gray-400">
          <div class="text-center">
            <svg class="w-6 h-6 mx-auto mb-1" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clip-rule="evenodd"></path>
            </svg>
            <p class="text-xs">{{ locationName }}</p>
          </div>
        </div>
      </div>
      <p class="text-xs text-gray-500 dark:text-gray-400 mt-1">
        {{ coordinates.lat.toFixed(4) }}, {{ coordinates.lng.toFixed(4) }}
      </p>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue'

const props = defineProps({
  locationName: {
    type: String,
    default: ''
  },
  coordinates: {
    type: Object,
    default: null
  },
  showMap: {
    type: Boolean,
    default: true
  }
})

const mapContainer = ref(null)

// Generar URL de imagen de mapa estático (opcional)
const mapImageUrl = computed(() => {
  if (!props.coordinates) return ''
  
  const { lat, lng } = props.coordinates
  const apiKey = import.meta.env.VITE_GOOGLE_PLACES_API_KEY
  
  // Usar Google Maps Static API si está disponible
  if (apiKey) {
    return `https://maps.googleapis.com/maps/api/staticmap?center=${lat},${lng}&zoom=13&size=400x128&markers=color:red%7C${lat},${lng}&key=${apiKey}`
  }
  
  return ''
})
</script>





