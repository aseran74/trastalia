<template>
  <div class="mx-auto max-w-screen-2xl p-4 md:p-6 2xl:p-10">
    <!-- Header -->
    <div class="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      <h2 class="text-title-md2 font-semibold text-black dark:text-white">
        Ejemplo de Google Places
      </h2>
      <nav>
        <ol class="flex items-center gap-2">
          <li><a class="font-medium" href="/">Dashboard /</a></li>
          <li class="font-medium text-primary">Google Places</li>
        </ol>
      </nav>
    </div>

    <!-- Contenido -->
    <div class="grid grid-cols-1 gap-6 lg:grid-cols-2">
      <!-- Ejemplo de uso -->
      <div class="rounded-sm border border-stroke bg-white p-6 shadow-default dark:border-strokedark dark:bg-boxdark">
        <h3 class="mb-4 text-lg font-semibold text-black dark:text-white">Ejemplos de Uso</h3>
        
        <div class="space-y-6">
          <!-- Input básico -->
          <div>
            <GooglePlacesInput
              v-model="location1"
              label="Ubicación Básica"
              placeholder="Buscar ubicación..."
              @place-selected="handlePlaceSelected1"
            />
            <p class="mt-1 text-sm text-gray-600 dark:text-gray-400">
              Seleccionado: {{ location1 || 'Ninguno' }}
            </p>
          </div>

          <!-- Input con opciones personalizadas -->
          <div>
            <GooglePlacesInput
              v-model="location2"
              label="Ubicación Personalizada"
              placeholder="Buscar en España..."
              help-text="Solo direcciones de España"
              :search-options="{ types: ['geocode'], componentRestrictions: { country: 'es' } }"
              @place-selected="handlePlaceSelected2"
            />
            <p class="mt-1 text-sm text-gray-600 dark:text-gray-400">
              Seleccionado: {{ location2 || 'Ninguno' }}
            </p>
          </div>

          <!-- Input con error -->
          <div>
            <GooglePlacesInput
              v-model="location3"
              label="Ubicación con Error"
              placeholder="Buscar ubicación..."
              error="Este campo es requerido"
              @place-selected="handlePlaceSelected3"
            />
          </div>
        </div>
      </div>

      <!-- Información del lugar seleccionado -->
      <div class="rounded-sm border border-stroke bg-white p-6 shadow-default dark:border-strokedark dark:bg-boxdark">
        <h3 class="mb-4 text-lg font-semibold text-black dark:text-white">Información del Lugar</h3>
        
        <div v-if="selectedPlace" class="space-y-4">
          <div>
            <h4 class="font-medium text-gray-800 dark:text-white">Datos del Lugar:</h4>
            <ul class="mt-2 space-y-1 text-sm text-gray-600 dark:text-gray-400">
              <li><strong>ID:</strong> {{ selectedPlace.place_id }}</li>
              <li><strong>Descripción:</strong> {{ selectedPlace.description }}</li>
              <li><strong>Texto Principal:</strong> {{ selectedPlace.structured_formatting?.main_text }}</li>
              <li><strong>Texto Secundario:</strong> {{ selectedPlace.structured_formatting?.secondary_text }}</li>
            </ul>
          </div>

          <div>
            <h4 class="font-medium text-gray-800 dark:text-white">JSON Completo:</h4>
            <pre class="mt-2 text-xs bg-gray-100 dark:bg-gray-800 p-3 rounded overflow-auto">{{ JSON.stringify(selectedPlace, null, 2) }}</pre>
          </div>
        </div>

        <div v-else class="text-center text-gray-500 dark:text-gray-400">
          <p>Selecciona un lugar para ver su información</p>
        </div>
      </div>
    </div>

    <!-- Instrucciones -->
    <div class="mt-6 rounded-sm border border-stroke bg-white p-6 shadow-default dark:border-strokedark dark:bg-boxdark">
      <h3 class="mb-4 text-lg font-semibold text-black dark:text-white">Instrucciones de Configuración</h3>
      
      <div class="space-y-4 text-sm text-gray-600 dark:text-gray-400">
        <div>
          <h4 class="font-medium text-gray-800 dark:text-white">1. Obtener API Key de Google Places:</h4>
          <ul class="mt-2 ml-4 list-disc space-y-1">
            <li>Ve a <a href="https://console.cloud.google.com/" target="_blank" class="text-blue-600 hover:underline">Google Cloud Console</a></li>
            <li>Crea un nuevo proyecto o selecciona uno existente</li>
            <li>Habilita la <strong>Places API</strong> y <strong>Maps JavaScript API</strong></li>
            <li>Ve a "Credenciales" y crea una nueva API Key</li>
            <li>Restringe la API Key a tu dominio (recomendado)</li>
          </ul>
        </div>

        <div>
          <h4 class="font-medium text-gray-800 dark:text-white">2. Configurar en el proyecto:</h4>
          <ul class="mt-2 ml-4 list-disc space-y-1">
            <li>Abre el archivo <code class="bg-gray-100 dark:bg-gray-800 px-1 rounded">.env</code> en la raíz del proyecto</li>
            <li>Reemplaza <code class="bg-gray-100 dark:bg-gray-800 px-1 rounded">REPLACE_WITH_YOUR_GOOGLE_PLACES_API_KEY</code> con tu API Key real</li>
            <li>Reinicia el servidor de desarrollo</li>
          </ul>
        </div>

        <div>
          <h4 class="font-medium text-gray-800 dark:text-white">3. Uso en componentes:</h4>
          <pre class="mt-2 text-xs bg-gray-100 dark:bg-gray-800 p-3 rounded overflow-auto"><code>&lt;GooglePlacesInput
  v-model="location"
  label="Ubicación"
  placeholder="Buscar ubicación..."
  @place-selected="handlePlaceSelected"
/&gt;</code></pre>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import GooglePlacesInput from '@/components/GooglePlacesInput.vue'

const location1 = ref('')
const location2 = ref('')
const location3 = ref('')
const selectedPlace = ref(null)

const handlePlaceSelected1 = (place) => {
  console.log('Lugar 1 seleccionado:', place)
  selectedPlace.value = place
}

const handlePlaceSelected2 = (place) => {
  console.log('Lugar 2 seleccionado:', place)
  selectedPlace.value = place
}

const handlePlaceSelected3 = (place) => {
  console.log('Lugar 3 seleccionado:', place)
  selectedPlace.value = place
}
</script>





