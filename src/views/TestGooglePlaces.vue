<template>
  <div class="p-6">
    <h1 class="text-2xl font-bold mb-4">Test Google Places</h1>
    
    <div class="mb-4">
      <GooglePlacesInput
        v-model="location"
        label="Ubicación de Prueba"
        placeholder="Escribe una ciudad..."
        @place-selected="handlePlaceSelected"
      />
    </div>
    
    <div v-if="selectedPlace" class="mt-4 p-4 bg-gray-100 rounded">
      <h3 class="font-bold">Lugar seleccionado:</h3>
      <p><strong>Descripción:</strong> {{ selectedPlace.description }}</p>
      <p><strong>ID:</strong> {{ selectedPlace.place_id }}</p>
    </div>
    
    <div class="mt-4">
      <h3 class="font-bold">Valor actual:</h3>
      <p>{{ location }}</p>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import GooglePlacesInput from '@/components/GooglePlacesInput.vue'

const location = ref('')
const selectedPlace = ref(null)

const handlePlaceSelected = (place) => {
  console.log('Lugar seleccionado:', place)
  selectedPlace.value = place
}
</script>
