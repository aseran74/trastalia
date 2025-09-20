<template>
  <div class="relative">
    <label 
      v-if="label" 
      :for="inputId"
      class="block text-sm font-medium text-gray-700 mb-2"
    >
      {{ label }}
      <span v-if="required" class="text-red-500">*</span>
    </label>
    
    <div class="relative">
      <input
        :id="inputId"
        ref="inputRef"
        v-model="inputValue"
        :type="type"
        :placeholder="placeholder"
        :disabled="disabled"
        :class="inputClasses"
        @input="handleInput"
        @focus="handleFocus"
        @blur="handleBlur"
        @keydown="handleKeydown"
      />
      
      <!-- Icono de búsqueda -->
      <div class="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
        <svg 
          v-if="isLoading" 
          class="animate-spin h-5 w-5 text-gray-400" 
          xmlns="http://www.w3.org/2000/svg" 
          fill="none" 
          viewBox="0 0 24 24"
        >
          <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
          <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
        <svg 
          v-else 
          class="h-5 w-5 text-gray-400" 
          fill="none" 
          stroke="currentColor" 
          viewBox="0 0 24 24"
        >
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path>
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path>
        </svg>
      </div>
    </div>

    <!-- Dropdown de sugerencias -->
    <div 
      v-if="showSuggestions && suggestions.length > 0"
      class="absolute z-50 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-auto"
    >
      <ul class="py-1">
        <li
          v-for="(suggestion, index) in suggestions"
          :key="suggestion.place_id"
          :class="[
            'px-4 py-2 cursor-pointer text-sm hover:bg-gray-100',
            selectedIndex === index ? 'bg-blue-50 text-blue-700' : 'text-gray-900'
          ]"
          @click="selectSuggestion(suggestion)"
          @mouseenter="selectedIndex = index"
        >
          <div class="font-medium">{{ suggestion.structured_formatting.main_text }}</div>
          <div class="text-gray-500 text-xs">{{ suggestion.structured_formatting.secondary_text }}</div>
        </li>
      </ul>
    </div>

    <!-- Error message -->
    <p v-if="error" class="mt-1 text-sm text-red-600">
      {{ error }}
    </p>

    <!-- API Key Error -->
    <div v-if="googlePlacesError" class="mt-2 p-3 bg-yellow-50 border border-yellow-200 rounded-md dark:bg-yellow-900/20 dark:border-yellow-800">
      <div class="flex items-center gap-2">
        <svg class="w-4 h-4 text-yellow-600 dark:text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"></path>
        </svg>
        <span class="text-sm text-yellow-800 dark:text-yellow-200">
          Modo de desarrollo: API key no configurada
        </span>
      </div>
      <p class="text-xs text-yellow-600 dark:text-yellow-400 mt-1">
        Se mostrarán sugerencias simuladas. Configura tu API key de Google Places para funcionalidad completa.
      </p>
    </div>

    <!-- Help text -->
    <p v-if="helpText" class="mt-1 text-sm text-gray-500">
      {{ helpText }}
    </p>
  </div>
</template>

<script setup>
import { ref, computed, watch, nextTick, onMounted, onUnmounted } from 'vue'
import { useGooglePlaces } from '@/composables/useGooglePlaces'

const props = defineProps({
  modelValue: {
    type: String,
    default: ''
  },
  label: {
    type: String,
    default: ''
  },
  placeholder: {
    type: String,
    default: 'Buscar ubicación...'
  },
  type: {
    type: String,
    default: 'text'
  },
  required: {
    type: Boolean,
    default: false
  },
  disabled: {
    type: Boolean,
    default: false
  },
  error: {
    type: String,
    default: ''
  },
  helpText: {
    type: String,
    default: ''
  },
  inputId: {
    type: String,
    default: () => `google-places-input-${Math.random().toString(36).substr(2, 9)}`
  },
  searchOptions: {
    type: Object,
    default: () => ({})
  }
})

const emit = defineEmits(['update:modelValue', 'place-selected', 'input'])

// Google Places composable
const { isLoaded, isLoading, error: googlePlacesError, searchPlaces } = useGooglePlaces()

// Debug logs
console.log('🔍 GooglePlacesInput - isLoaded:', isLoaded.value)
console.log('🔍 GooglePlacesInput - isLoading:', isLoading.value)
console.log('🔍 GooglePlacesInput - error:', googlePlacesError.value)
console.log('🔍 GooglePlacesInput - API Key:', import.meta.env.VITE_GOOGLE_PLACES_API_KEY)

// Refs
const inputRef = ref(null)
const inputValue = ref(props.modelValue)
const suggestions = ref([])
const showSuggestions = ref(false)
const selectedIndex = ref(-1)
const searchTimeout = ref(null)

// Computed
const inputClasses = computed(() => [
  'block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400',
  'focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500',
  'disabled:bg-gray-50 disabled:text-gray-500 disabled:cursor-not-allowed',
  props.error ? 'border-red-300 focus:ring-red-500 focus:border-red-500' : 'border-gray-300'
])

// Methods
const handleInput = (event) => {
  const value = event.target.value
  inputValue.value = value
  emit('update:modelValue', value)
  emit('input', value)
  
  if (value.length > 2) {
    searchPlacesDebounced(value)
  } else {
    suggestions.value = []
    showSuggestions.value = false
  }
}

const searchPlacesDebounced = (query) => {
  if (searchTimeout.value) {
    clearTimeout(searchTimeout.value)
  }
  
  searchTimeout.value = setTimeout(async () => {
    console.log('🔍 searchPlacesDebounced - query:', query)
    console.log('🔍 searchPlacesDebounced - isLoaded:', isLoaded.value)
    
    try {
      const results = await searchPlaces(query, {
        types: ['geocode'],
        componentRestrictions: { country: 'es' },
        ...props.searchOptions
      })
      
      console.log('🔍 searchPlacesDebounced - results:', results)
      suggestions.value = results || []
      showSuggestions.value = true
      selectedIndex.value = -1
    } catch (err) {
      console.error('Error buscando lugares:', err)
      // En caso de error, limpiar sugerencias
      suggestions.value = []
      showSuggestions.value = false
    }
  }, 300)
}

const selectSuggestion = async (suggestion) => {
  inputValue.value = suggestion.description
  emit('update:modelValue', suggestion.description)
  emit('place-selected', suggestion)
  
  suggestions.value = []
  showSuggestions.value = false
  selectedIndex.value = -1
}

const handleFocus = () => {
  if (suggestions.value.length > 0) {
    showSuggestions.value = true
  }
}

const handleBlur = () => {
  // Delay para permitir que se ejecute el click en las sugerencias
  setTimeout(() => {
    showSuggestions.value = false
    selectedIndex.value = -1
  }, 200)
}

const handleKeydown = (event) => {
  if (!showSuggestions.value || suggestions.value.length === 0) return
  
  switch (event.key) {
    case 'ArrowDown':
      event.preventDefault()
      selectedIndex.value = Math.min(selectedIndex.value + 1, suggestions.value.length - 1)
      break
    case 'ArrowUp':
      event.preventDefault()
      selectedIndex.value = Math.max(selectedIndex.value - 1, -1)
      break
    case 'Enter':
      event.preventDefault()
      if (selectedIndex.value >= 0 && selectedIndex.value < suggestions.value.length) {
        selectSuggestion(suggestions.value[selectedIndex.value])
      }
      break
    case 'Escape':
      showSuggestions.value = false
      selectedIndex.value = -1
      break
  }
}

// Watch for external changes
watch(() => props.modelValue, (newValue) => {
  inputValue.value = newValue
})

// Cleanup
onUnmounted(() => {
  if (searchTimeout.value) {
    clearTimeout(searchTimeout.value)
  }
})
</script>
