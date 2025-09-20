import { ref, onMounted, onUnmounted } from 'vue'
import { Loader } from '@googlemaps/js-api-loader'
import { GOOGLE_PLACES_CONFIG, isDevelopmentMode } from '@/config/google-places'

const GOOGLE_PLACES_API_KEY = GOOGLE_PLACES_CONFIG.apiKey

export function useGooglePlaces() {
  const isLoaded = ref(false)
  const isLoading = ref(false)
  const error = ref(null)
  let loader = null
  let autocompleteService = null
  let placesService = null

  const initializeGooglePlaces = async () => {
    if (isLoaded.value) return

    // Verificar si estamos en modo de desarrollo
    if (isDevelopmentMode()) {
      console.warn('⚠️ API key de Google Places no configurada - Usando modo de desarrollo')
      // En modo de desarrollo, no cargar la API real
      isLoaded.value = true
      isLoading.value = false
      return
    }

    isLoading.value = true
    error.value = null

    try {
      loader = new Loader({
        apiKey: GOOGLE_PLACES_API_KEY,
        version: 'weekly',
        libraries: ['places']
      })

      await loader.load()
      
      // Inicializar servicios de Google Places
      autocompleteService = new google.maps.places.AutocompleteService()
      placesService = new google.maps.places.PlacesService(document.createElement('div'))
      
      isLoaded.value = true
      console.log('✅ Google Places API cargada correctamente')
    } catch (err) {
      error.value = err.message
      console.error('❌ Error cargando Google Places API:', err)
      
      // Si es un error de API key, mostrar mensaje específico
      if (err.message.includes('InvalidKeyMapError') || err.message.includes('InvalidKey')) {
        error.value = 'API key inválida. Por favor, verifica que la API key sea correcta y tenga los permisos necesarios.'
      }
    } finally {
      isLoading.value = false
    }
  }

  const searchPlaces = async (query, options = {}) => {
    // Si estamos en modo de desarrollo o no hay API key, usar sugerencias de fallback
    if (isDevelopmentMode() || !autocompleteService) {
      console.log('🔧 Usando sugerencias de desarrollo para:', query)
      return getFallbackSuggestions(query)
    }

    if (!isLoaded.value || !autocompleteService) {
      // Modo fallback: devolver sugerencias simuladas
      if (error.value && error.value.includes('API key')) {
        return getFallbackSuggestions(query)
      }
      throw new Error('Google Places API no está cargada')
    }

    return new Promise((resolve, reject) => {
      const request = {
        input: query,
        ...options
      }

      autocompleteService.getPlacePredictions(request, (predictions, status) => {
        if (status === google.maps.places.PlacesServiceStatus.OK && predictions) {
          resolve(predictions)
        } else {
          reject(new Error(`Error en búsqueda: ${status}`))
        }
      })
    })
  }

  // Sugerencias de fallback para modo de desarrollo
  const getFallbackSuggestions = (query) => {
    const suggestions = [
      {
        place_id: 'fallback_1',
        description: 'Madrid, España',
        structured_formatting: {
          main_text: 'Madrid',
          secondary_text: 'España'
        }
      },
      {
        place_id: 'fallback_2',
        description: 'Barcelona, España',
        structured_formatting: {
          main_text: 'Barcelona',
          secondary_text: 'España'
        }
      },
      {
        place_id: 'fallback_3',
        description: 'Valencia, España',
        structured_formatting: {
          main_text: 'Valencia',
          secondary_text: 'España'
        }
      },
      {
        place_id: 'fallback_4',
        description: 'Sevilla, España',
        structured_formatting: {
          main_text: 'Sevilla',
          secondary_text: 'España'
        }
      },
      {
        place_id: 'fallback_5',
        description: 'Bilbao, España',
        structured_formatting: {
          main_text: 'Bilbao',
          secondary_text: 'España'
        }
      },
      {
        place_id: 'fallback_6',
        description: 'Málaga, España',
        structured_formatting: {
          main_text: 'Málaga',
          secondary_text: 'España'
        }
      },
      {
        place_id: 'fallback_7',
        description: 'Zaragoza, España',
        structured_formatting: {
          main_text: 'Zaragoza',
          secondary_text: 'España'
        }
      },
      {
        place_id: 'fallback_8',
        description: 'Murcia, España',
        structured_formatting: {
          main_text: 'Murcia',
          secondary_text: 'España'
        }
      },
      {
        place_id: 'fallback_9',
        description: 'Palma de Mallorca, España',
        structured_formatting: {
          main_text: 'Palma de Mallorca',
          secondary_text: 'España'
        }
      },
      {
        place_id: 'fallback_10',
        description: 'Las Palmas de Gran Canaria, España',
        structured_formatting: {
          main_text: 'Las Palmas de Gran Canaria',
          secondary_text: 'España'
        }
      },
      {
        place_id: 'fallback_11',
        description: 'Alicante, España',
        structured_formatting: {
          main_text: 'Alicante',
          secondary_text: 'España'
        }
      },
      {
        place_id: 'fallback_12',
        description: 'Córdoba, España',
        structured_formatting: {
          main_text: 'Córdoba',
          secondary_text: 'España'
        }
      },
      {
        place_id: 'fallback_13',
        description: 'Valladolid, España',
        structured_formatting: {
          main_text: 'Valladolid',
          secondary_text: 'España'
        }
      },
      {
        place_id: 'fallback_14',
        description: 'Vigo, España',
        structured_formatting: {
          main_text: 'Vigo',
          secondary_text: 'España'
        }
      },
      {
        place_id: 'fallback_15',
        description: 'Gijón, España',
        structured_formatting: {
          main_text: 'Gijón',
          secondary_text: 'España'
        }
      },
      {
        place_id: 'fallback_16',
        description: 'Cerro Muriano, Córdoba, España',
        structured_formatting: {
          main_text: 'Cerro Muriano',
          secondary_text: 'Córdoba, España'
        }
      },
      {
        place_id: 'fallback_17',
        description: 'Cerro del Águila, Sevilla, España',
        structured_formatting: {
          main_text: 'Cerro del Águila',
          secondary_text: 'Sevilla, España'
        }
      },
      {
        place_id: 'fallback_18',
        description: 'Cerro de San Cristóbal, Madrid, España',
        structured_formatting: {
          main_text: 'Cerro de San Cristóbal',
          secondary_text: 'Madrid, España'
        }
      },
      {
        place_id: 'fallback_19',
        description: 'Cerro de los Ángeles, Getafe, España',
        structured_formatting: {
          main_text: 'Cerro de los Ángeles',
          secondary_text: 'Getafe, España'
        }
      },
      {
        place_id: 'fallback_20',
        description: 'Cerro del Hierro, Sevilla, España',
        structured_formatting: {
          main_text: 'Cerro del Hierro',
          secondary_text: 'Sevilla, España'
        }
      }
    ]

    // Si no hay consulta, devolver las primeras 5 sugerencias
    if (!query || query.length < 2) {
      return suggestions.slice(0, 5)
    }

    // Filtrar sugerencias basadas en la consulta
    const queryLower = query.toLowerCase()
    const filtered = suggestions.filter(suggestion => {
      const description = suggestion.description.toLowerCase()
      const mainText = suggestion.structured_formatting.main_text.toLowerCase()
      
      // Buscar coincidencias exactas o que empiecen con la consulta
      return description.includes(queryLower) || 
             mainText.includes(queryLower) ||
             description.startsWith(queryLower) ||
             mainText.startsWith(queryLower)
    })

    // Si no hay coincidencias, devolver un array vacío para que no aparezcan sugerencias irrelevantes
    return filtered.length > 0 ? filtered.slice(0, 8) : []
  }

  const getPlaceDetails = async (placeId, fields = ['name', 'formatted_address', 'geometry', 'place_id']) => {
    if (!isLoaded.value || !placesService) {
      throw new Error('Google Places API no está cargada')
    }

    return new Promise((resolve, reject) => {
      const request = {
        placeId,
        fields
      }

      placesService.getDetails(request, (place, status) => {
        if (status === google.maps.places.PlacesServiceStatus.OK && place) {
          resolve(place)
        } else {
          reject(new Error(`Error obteniendo detalles: ${status}`))
        }
      })
    })
  }

  const createAutocomplete = (inputElement, options = {}) => {
    if (!isLoaded.value) {
      throw new Error('Google Places API no está cargada')
    }

    const autocomplete = new google.maps.places.Autocomplete(inputElement, {
      types: ['geocode'], // Solo direcciones
      componentRestrictions: { country: 'es' }, // Restringir a España
      ...options
    })

    return autocomplete
  }

  onMounted(() => {
    initializeGooglePlaces()
  })

  onUnmounted(() => {
    // Limpiar recursos si es necesario
  })

  return {
    isLoaded,
    isLoading,
    error,
    searchPlaces,
    getPlaceDetails,
    createAutocomplete,
    initializeGooglePlaces
  }
}
