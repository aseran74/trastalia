<template>
  <div class="min-h-screen xl:flex">
    <app-sidebar />
    <Backdrop />
    <div
      class="flex-1 transition-all duration-300 ease-in-out"
      :class="[isExpanded || isHovered ? 'lg:ml-[290px]' : 'lg:ml-[90px]']"
    >
      <app-header />
      <div class="p-4 mx-auto max-w-(--breakpoint-2xl) md:p-6">
        <div class="mx-auto max-w-screen-2xl p-4 md:p-6 2xl:p-10">
    <div class="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      <h2 class="text-title-md2 font-semibold text-black dark:text-white">
        Vender Artículo - Nueva Lógica
      </h2>
    </div>

    <div class="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
      <div class="border-b border-stroke py-4 px-6.5 dark:border-strokedark">
        <h3 class="font-medium text-black dark:text-white">
          Información del Artículo
        </h3>
      </div>
      
      <form @submit.prevent="submitArticle" class="p-6.5">
        <!-- Información básica -->
        <div class="mb-4.5">
          <label class="mb-2.5 block text-black dark:text-white">
            Nombre del artículo *
          </label>
          <input
            v-model="formData.nombre"
            type="text"
            placeholder="Ej: iPhone 13 Pro Max"
            class="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
            required
          />
        </div>

        <div class="mb-4.5">
          <label class="mb-2.5 block text-black dark:text-white">
            Descripción *
          </label>
          <textarea
            v-model="formData.descripcion"
            rows="4"
            placeholder="Describe el estado, características y cualquier detalle relevante..."
            class="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
            required
          ></textarea>
        </div>

              <!-- Subida de fotos -->
              <div class="mb-4.5">
                <label class="mb-2.5 block text-black dark:text-white">
                  Fotos del artículo
                </label>
                <div class="border-2 border-dashed border-stroke rounded-lg p-6 text-center hover:border-primary transition-colors">
                  <input
                    ref="fileInput"
                    type="file"
                    multiple
                    accept="image/*"
                    @change="handleFileSelect"
                    class="hidden"
                  />
                  <div v-if="selectedFiles.length === 0" @click="$refs.fileInput.click()" class="cursor-pointer">
                    <div class="text-4xl mb-2">📷</div>
                    <p class="text-gray-600 dark:text-gray-400">
                      Haz clic para seleccionar fotos o arrastra y suelta aquí
                    </p>
                    <p class="text-xs text-gray-500 dark:text-gray-400 mt-1">
                      Máximo 5 fotos, formato JPG/PNG
                    </p>
                  </div>
                  <div v-else class="space-y-3">
                    <div class="flex flex-wrap gap-2">
                      <div 
                        v-for="(file, index) in selectedFiles" 
                        :key="index"
                        class="relative group"
                      >
                        <img 
                          :src="file.preview" 
                          :alt="`Preview ${index + 1}`"
                          class="w-20 h-20 object-cover rounded-lg border border-stroke"
                        />
                        <button
                          @click="removeFile(index)"
                          class="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs hover:bg-red-600"
                        >
                          ×
                        </button>
                      </div>
                    </div>
                    <button
                      @click="$refs.fileInput.click()"
                      class="text-sm text-primary hover:text-primary/80"
                    >
                      + Agregar más fotos
                    </button>
                  </div>
                </div>
                <div v-if="uploadingPhotos" class="mt-2 text-sm text-blue-600">
                  Subiendo fotos...
                </div>
              </div>

        <div class="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div class="mb-4.5">
            <label class="mb-2.5 block text-black dark:text-white">
              Categoría *
            </label>
            <select
              v-model="formData.categoria"
              class="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
              required
            >
              <option value="">Selecciona una categoría</option>
              <option value="tecnologia">Tecnología</option>
              <option value="hogar">Hogar</option>
              <option value="deportes">Deportes</option>
              <option value="moda">Moda</option>
              <option value="juegos">Juegos</option>
              <option value="libros">Libros</option>
              <option value="mascotas">Mascotas</option>
              <option value="otros">Otros</option>
            </select>
          </div>

          <div class="mb-4.5">
            <label class="mb-2.5 block text-black dark:text-white">
              Condición *
            </label>
            <select
              v-model="formData.condicion"
              class="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
              required
            >
              <option value="">Selecciona la condición</option>
              <option value="nuevo">Nuevo</option>
              <option value="excelente">Excelente</option>
              <option value="bueno">Bueno</option>
              <option value="aceptable">Aceptable</option>
            </select>
          </div>
        </div>

        <div class="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div class="mb-4.5">
            <label class="mb-2.5 block text-black dark:text-white">
              Precio sugerido (€) *
            </label>
            <input
              v-model.number="formData.precio_sugerido"
              type="number"
              min="0"
              step="0.01"
              placeholder="0.00"
              class="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
              required
            />
          </div>

          <div class="mb-4.5">
            <label class="mb-2.5 block text-black dark:text-white">
              Ubicación *
            </label>
            <div class="relative">
              <input
                ref="locationInput"
                v-model="formData.ubicacion"
                type="text"
                placeholder="Escribe tu ubicación..."
                class="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
                required
                @focus="initGooglePlaces"
              />
              <div class="absolute right-3 top-1/2 transform -translate-y-1/2">
                <span class="text-xs text-gray-500 dark:text-gray-400">📍</span>
              </div>
              <div v-if="locationSuggestions.length > 0" class="absolute z-10 w-full mt-1 bg-white border border-stroke rounded-md shadow-lg dark:bg-boxdark dark:border-strokedark">
                <div 
                  v-for="(suggestion, index) in locationSuggestions" 
                  :key="index"
                  @click="selectLocation(suggestion)"
                  class="px-4 py-2 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700"
                >
                  {{ suggestion.description }}
                </div>
              </div>
            </div>
          </div>
        </div>

              <!-- Información sobre el centro logístico -->
              <div class="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg dark:bg-blue-900/20 dark:border-blue-800">
                <div class="flex items-center mb-2">
                  <span class="text-blue-600 dark:text-blue-400 mr-2">📦</span>
                  <h4 class="text-lg font-semibold text-blue-900 dark:text-blue-100">
                    Venta desde Centro Logístico
                  </h4>
                </div>
                <p class="text-sm text-blue-800 dark:text-blue-200">
                  Todos los artículos se venden desde nuestro centro logístico. Selecciona una de las opciones disponibles:
                </p>
              </div>

              <!-- Opciones de venta desde Centro Logístico -->
        <div class="mb-6">
          <h4 class="mb-4 text-lg font-semibold text-black dark:text-white">
                  ¿Cómo quieres vender tu artículo?
          </h4>
          
                <div class="space-y-4">
                  <!-- Opción 1: Gestión de venta -->
            <div 
              class="cursor-pointer rounded-lg border-2 p-4 transition-all"
                    :class="formData.tipo_venta === 'gestion_venta' 
                ? 'border-primary bg-primary/5' 
                : 'border-stroke hover:border-primary/50'"
                    @click="formData.tipo_venta = 'gestion_venta'"
            >
              <div class="flex items-center space-x-3">
                <input
                  type="radio"
                        v-model="formData.tipo_venta"
                        value="gestion_venta"
                        class="h-4 w-4 text-primary"
                      />
                      <div class="flex-1">
                        <h5 class="font-semibold text-black dark:text-white">🛒 Te gestionamos la venta</h5>
                        <p class="text-sm text-gray-600 dark:text-gray-400">
                          Guardamos tu artículo y gestionamos la venta , respondemos  los mensajes de los compradores por un pequeño porcentaje, tú fijas el precio, solo preocupate por cobrar.
                        </p>
                        <p class="text-xs text-gray-500 dark:text-gray-400 mt-1">
                          * Ver condiciones de comisión
                        </p>
                      </div>
                    </div>
                  </div>

                  <!-- Opción 2: Compra por Trastalia -->
                  <div class="rounded-lg border-2 border-stroke p-4">
                    <div class="flex items-center space-x-3 mb-3">
                      <input
                        type="radio"
                        v-model="formData.tipo_venta"
                        value="compra"
                  class="h-4 w-4 text-primary"
                />
                      <div class="flex-1">
                        <h5 class="font-semibold text-black dark:text-white">🏢 Te lo compramos</h5>
                  <p class="text-sm text-gray-600 dark:text-gray-400">
                          Puedes ofrecer tu articulo a Trastalia , si nos interesa te lo compramos.
                        </p>
                      </div>
                    </div>
                    
                    <!-- Sub-opciones de compra -->
                    <div class="ml-7 space-y-3">
                      <div 
                        class="cursor-pointer rounded-lg border p-3 transition-all"
                        :class="formData.solicitar_compra_dinero 
                          ? 'border-primary bg-primary/5' 
                          : 'border-stroke hover:border-primary/50'"
                        @click="formData.solicitar_compra_dinero = !formData.solicitar_compra_dinero"
                      >
                        <div class="flex items-center space-x-3">
                          <input
                            type="checkbox"
                            v-model="formData.solicitar_compra_dinero"
                            class="h-4 w-4 text-primary"
                          />
                          <div class="flex-1">
                            <h6 class="font-medium text-black dark:text-white">💰 Por dinero</h6>
                            <p class="text-xs text-gray-600 dark:text-gray-400">
                              Pago inmediato en efectivo o transferencia
                  </p>
                </div>
              </div>
            </div>

            <div 
                        class="cursor-pointer rounded-lg border p-3 transition-all"
                        :class="formData.solicitar_compra_puntos 
                ? 'border-primary bg-primary/5' 
                : 'border-stroke hover:border-primary/50'"
                        @click="formData.solicitar_compra_puntos = !formData.solicitar_compra_puntos"
            >
              <div class="flex items-center space-x-3">
                <input
                            type="checkbox"
                            v-model="formData.solicitar_compra_puntos"
                  class="h-4 w-4 text-primary"
                />
                          <div class="flex-1">
                            <h6 class="font-medium text-black dark:text-white">⭐ Por puntos</h6>
                            <p class="text-xs text-gray-600 dark:text-gray-400">
                              Puntos Trastalia para comprar otros articulos  (1 punto = 1 euro , valoraciones mas altas).
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
            </div>
          </div>
          
              <!-- Selección de centro logístico -->
          <div class="mb-4.5">
            <label class="mb-2.5 block text-black dark:text-white">
              Centro Logístico *
              <span v-if="userLocation" class="text-sm text-green-600 dark:text-green-400 ml-2">
                📍 Seleccionado automáticamente el más cercano
              </span>
            </label>
            <select
              v-model="formData.centro_logistico_id"
              class="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
              required
            >
              <option value="">Selecciona un centro logístico</option>
              <option 
                v-for="centro in centrosLogisticos" 
                :key="centro._id" 
                :value="centro._id"
              >
                    {{ centro.name }} - {{ centro.city }}
              </option>
            </select>
            <p v-if="userLocation" class="mt-1 text-xs text-gray-600 dark:text-gray-400">
              Basado en tu ubicación actual
            </p>
                <!-- Debug info -->
                <p v-if="centrosLogisticos.length === 0" class="mt-1 text-xs text-red-600">
                  No hay centros logísticos disponibles. Cargando...
                </p>
                <p v-else class="mt-1 text-xs text-green-600">
                  {{ centrosLogisticos.length }} centros logísticos disponibles
                </p>
        </div>

        <!-- Botones de acción -->
        <div class="flex justify-end space-x-4">
          <button
            type="button"
            @click="resetForm"
            class="flex justify-center rounded border border-stroke py-2 px-6 font-medium text-black hover:shadow-1 dark:border-strokedark dark:text-white"
          >
            Limpiar
          </button>
          <button
            type="submit"
            :disabled="loading"
            class="flex justify-center rounded bg-primary py-2 px-6 font-medium text-gray hover:bg-opacity-90 disabled:opacity-50"
          >
            <span v-if="loading">Publicando...</span>
            <span v-else>Publicar Artículo</span>
          </button>
        </div>
      </form>
    </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { useAuthStore } from '@/stores/auth'
// import { useToast } from '@/composables/useToast'
import AppSidebar from '@/components/layout/AppSidebar.vue'
import AppHeader from '@/components/layout/AppHeader.vue'
import Backdrop from '@/components/layout/Backdrop.vue'
import { useSidebar } from '@/composables/useSidebar'

const authStore = useAuthStore()
// const { showToast } = useToast()
const { isExpanded, isHovered } = useSidebar()

// Función de toast simple
const showToast = (type, message) => {
  if (type === 'success') {
    alert('✅ ' + message)
  } else if (type === 'error') {
    alert('❌ ' + message)
  } else if (type === 'warning') {
    alert('⚠️ ' + message)
  } else if (type === 'info') {
    alert('ℹ️ ' + message)
  } else {
    alert(message)
  }
}

// Datos del formulario
const formData = ref({
  nombre: '',
  descripcion: '',
  categoria: '',
  precio_sugerido: 0,
  condicion: '',
  ubicacion: '',
  tipo_venta: '', // 'gestion_venta' o 'compra'
  solicitar_compra_dinero: false,
  solicitar_compra_puntos: false,
  centro_logistico_id: '',
  fotos: []
})

const centrosLogisticos = ref([])
const loading = ref(false)
const userLocation = ref(null)
const locationInput = ref(null)
const locationSuggestions = ref([])
const autocompleteService = ref(null)
const placesService = ref(null)
const selectedFiles = ref([])
const uploadingPhotos = ref(false)

// Obtener ubicación del usuario
const getUserLocation = () => {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error('Geolocalización no soportada'))
      return
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        resolve({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude
        })
      },
      (error) => {
        console.warn('Error obteniendo ubicación:', error)
        // Ubicación por defecto (Madrid)
        resolve({
          latitude: 40.4168,
          longitude: -3.7038
        })
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 300000
      }
    )
  })
}

// Calcular distancia entre dos puntos (fórmula de Haversine)
const calculateDistance = (lat1, lon1, lat2, lon2) => {
  const R = 6371 // Radio de la Tierra en kilómetros
  const dLat = (lat2 - lat1) * Math.PI / 180
  const dLon = (lon2 - lon1) * Math.PI / 180
  const a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
    Math.sin(dLon/2) * Math.sin(dLon/2)
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a))
  return R * c
}

// Encontrar el centro logístico más cercano
const findNearestLogisticsCenter = (userLat, userLon) => {
  if (centrosLogisticos.value.length === 0) return null

  let nearestCenter = null
  let minDistance = Infinity

  centrosLogisticos.value.forEach(center => {
    if (center.coordinates && center.coordinates.latitude && center.coordinates.longitude) {
      const distance = calculateDistance(
        userLat, 
        userLon, 
        center.coordinates.latitude, 
        center.coordinates.longitude
      )
      if (distance < minDistance) {
        minDistance = distance
        nearestCenter = center
      }
    }
  })

  return nearestCenter
}

// Inicializar Google Places
const initGooglePlaces = () => {
  if (window.google && window.google.maps && window.google.maps.places) {
    console.log('Google Maps cargado correctamente')
    
    // Configurar el autocompletado
    if (locationInput.value) {
      const autocomplete = new window.google.maps.places.Autocomplete(locationInput.value, {
        types: ['geocode'],
        componentRestrictions: { country: 'es' }, // Solo España
        fields: ['formatted_address', 'geometry', 'name']
      })
      
      autocomplete.addListener('place_changed', () => {
        const place = autocomplete.getPlace()
        console.log('Lugar seleccionado:', place)
        if (place.formatted_address) {
          formData.value.ubicacion = place.formatted_address
          console.log('Ubicación actualizada:', place.formatted_address)
        }
      })
    }
  } else {
    console.warn('Google Maps no está cargado, reintentando...')
    // Reintentar después de un breve delay
    setTimeout(() => {
      initGooglePlaces()
    }, 1000)
  }
}

// Cargar Google Maps
const loadGoogleMaps = () => {
  return new Promise((resolve, reject) => {
    if (window.google && window.google.maps) {
      console.log('Google Maps ya está cargado')
      resolve()
      return
    }
    
    console.log('Cargando Google Maps...')
    const script = document.createElement('script')
    script.src = `https://maps.googleapis.com/maps/api/js?key=AIzaSyBy4MuV_fOnPJF-WoxQbBlnKj8dMF6KuxM&libraries=places&callback=initMap`
    script.async = true
    script.defer = true
    
    window.initMap = () => {
      console.log('Google Maps cargado exitosamente')
      resolve()
    }
    
    script.onerror = (error) => {
      console.error('Error cargando Google Maps:', error)
      reject(new Error('Error cargando Google Maps'))
    }
    
    document.head.appendChild(script)
  })
}

// Manejar selección de archivos
const handleFileSelect = (event) => {
  const files = Array.from(event.target.files)
  
  // Validar número máximo de archivos
  if (selectedFiles.value.length + files.length > 5) {
    showToast('warning', 'Máximo 5 fotos permitidas')
    return
  }
  
  files.forEach(file => {
    // Validar tipo de archivo
    if (!file.type.startsWith('image/')) {
      showToast('warning', 'Solo se permiten archivos de imagen')
      return
    }
    
    // Validar tamaño (máximo 5MB)
    if (file.size > 5 * 1024 * 1024) {
      showToast('warning', 'El archivo es demasiado grande. Máximo 5MB')
      return
    }
    
    // Crear preview
    const reader = new FileReader()
    reader.onload = (e) => {
      selectedFiles.value.push({
        file: file,
        preview: e.target.result
      })
    }
    reader.readAsDataURL(file)
  })
  
  // Limpiar el input
  event.target.value = ''
}

// Remover archivo
const removeFile = (index) => {
  selectedFiles.value.splice(index, 1)
}

// Subir fotos a MongoDB
const uploadPhotos = async () => {
  if (selectedFiles.value.length === 0) return []
  
  uploadingPhotos.value = true
  const uploadedUrls = []
  
  try {
    for (const fileData of selectedFiles.value) {
      const formData = new FormData()
      formData.append('photo', fileData.file)
      
      const response = await fetch('/api/upload-photo', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('auth_token') || sessionStorage.getItem('auth_token')}`
        },
        body: formData
      })
      
      if (response.ok) {
        const result = await response.json()
        uploadedUrls.push(result.url)
      } else {
        console.error('Error subiendo foto:', response.statusText)
      }
    }
  } catch (error) {
    console.error('Error subiendo fotos:', error)
  } finally {
    uploadingPhotos.value = false
  }
  
  return uploadedUrls
}

// Cargar centros logísticos
const loadCentrosLogisticos = async () => {
  try {
    console.log('🚀 Cargando centros logísticos desde /api/logistics-centers...')
    const response = await fetch('/api/logistics-centers')
    console.log('📡 Respuesta del servidor:', response.status, response.statusText)
    
    if (response.ok) {
      const result = await response.json()
      console.log('📦 Datos recibidos:', result)
      centrosLogisticos.value = result.data
      console.log('✅ Centros logísticos cargados:', centrosLogisticos.value.length, 'centros')
      
      // Obtener ubicación del usuario y seleccionar centro más cercano
      try {
        const location = await getUserLocation()
        userLocation.value = location
        
        const nearestCenter = findNearestLogisticsCenter(location.latitude, location.longitude)
        if (nearestCenter) {
          formData.value.centro_logistico_id = nearestCenter._id
          showToast('info', `Centro logístico más cercano seleccionado: ${nearestCenter.name}`)
        }
      } catch (error) {
        console.warn('No se pudo obtener la ubicación del usuario:', error)
        // Seleccionar el primer centro por defecto
        if (centrosLogisticos.value.length > 0) {
          formData.value.centro_logistico_id = centrosLogisticos.value[0]._id
          console.log('🎯 Centro por defecto seleccionado:', centrosLogisticos.value[0].name)
        }
      }
    } else {
      console.error('❌ Error en la respuesta del servidor:', response.status, response.statusText)
    }
  } catch (error) {
    console.error('❌ Error cargando centros logísticos:', error)
  }
}

// Enviar formulario
const submitArticle = async () => {
  loading.value = true
  
  try {
    // Validar que se haya seleccionado un tipo de venta
    if (!formData.value.tipo_venta) {
      showToast('warning', 'Por favor, selecciona cómo quieres vender tu artículo.')
      loading.value = false
      return
    }

    // Si se selecciona compra, validar que al menos una opción esté marcada
    if (formData.value.tipo_venta === 'compra') {
      if (!formData.value.solicitar_compra_dinero && !formData.value.solicitar_compra_puntos) {
        showToast('warning', 'Por favor, selecciona al menos una opción de compra (dinero o puntos).')
        loading.value = false
        return
      }
    }

    // Validar que se haya seleccionado un centro logístico
    if (!formData.value.centro_logistico_id) {
      showToast('warning', 'Por favor, selecciona un centro logístico.')
      loading.value = false
      return
    }

    const token = localStorage.getItem('auth_token') || sessionStorage.getItem('auth_token')
    
    // Subir fotos primero
    const uploadedPhotos = await uploadPhotos()
    
    // Preparar payload según el tipo de venta
    let payload = {
      title: formData.value.nombre,
      description: formData.value.descripcion,
      category: formData.value.categoria,
      price: formData.value.precio_sugerido,
      condition: formData.value.condicion,
      location: formData.value.ubicacion,
      images: uploadedPhotos,
      useLogisticsCenter: true,
      logisticsCenterId: formData.value.centro_logistico_id,
      // Campos adicionales para compatibilidad con el servidor
      nombre: formData.value.nombre,
      descripcion: formData.value.descripcion,
      categoria: formData.value.categoria,
      precio_propuesto_vendedor: formData.value.precio_sugerido,
      condicion: formData.value.condicion,
      ubicacion: formData.value.ubicacion,
      fotos: uploadedPhotos
    }
    
    console.log('📤 Enviando artículo:', payload)
    
    // Determinar el endpoint según el tipo de venta
    let endpoint = '/api/articles'
    
    // Establecer estado inicial como pendiente para revisión del admin
    payload.adminStatus = 'pending'
    
    if (formData.value.tipo_venta === 'gestion_venta') {
      // Venta gestionada por Trastalia
      payload.modo_venta = 'venta_desde_centro_logistico'
      payload.saleMode = 'logistics_center'
      payload.directFromHome = false
      payload.logisticsCenterSale = true
      payload.trastaliaPurchase = { enabled: false }
      payload.pointsExchange = { enabled: false }
    } else if (formData.value.tipo_venta === 'compra') {
      // Compra por Trastalia
      payload.modo_venta = 'venta_desde_centro_logistico'
      payload.saleMode = 'logistics_center'
      payload.directFromHome = false
      payload.logisticsCenterSale = false
      payload.trastaliaPurchase = { 
        enabled: formData.value.solicitar_compra_dinero 
      }
      payload.pointsExchange = { 
        enabled: formData.value.solicitar_compra_puntos 
      }
    }
    
    console.log('🔑 Token:', token)
    console.log('🌐 Endpoint:', endpoint)
    console.log('📦 Payload:', payload)
    
    const response = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(payload)
    })
    
    console.log('📡 Response status:', response.status)
    console.log('📡 Response headers:', response.headers)
    
    if (!response.ok) {
      const errorText = await response.text()
      console.error('Error response:', errorText)
      throw new Error(`HTTP ${response.status}: ${response.statusText}`)
    }
    
    const result = await response.json()
    
    if (result.success) {
      let message = 'Artículo enviado exitosamente'
      switch (formData.value.tipo_venta) {
        case 'gestion_venta':
          message = 'Artículo enviado al centro logístico para gestión de venta'
          break
        case 'compra':
          const opciones = []
          if (formData.value.solicitar_compra_dinero) opciones.push('dinero')
          if (formData.value.solicitar_compra_puntos) opciones.push('puntos')
          message = `Solicitud de compra por ${opciones.join(' y ')} enviada al administrador`
          break
      }
      showToast('success', message)
      resetForm()
    } else {
      showToast('error', result.message || 'Error al enviar el artículo')
    }
  } catch (error) {
    console.error('Error enviando artículo:', error)
    showToast('error', 'Error de conexión al servidor: ' + error.message)
  } finally {
    loading.value = false
  }
}

// Limpiar formulario
const resetForm = () => {
  formData.value = {
    nombre: '',
    descripcion: '',
    categoria: '',
    precio_sugerido: 0,
    condicion: '',
    ubicacion: '',
    tipo_venta: '',
    solicitar_compra_dinero: false,
    solicitar_compra_puntos: false,
    centro_logistico_id: '',
    fotos: []
  }
  selectedFiles.value = []
}

onMounted(async () => {
  await loadCentrosLogisticos()
  
  // Cargar Google Maps
  try {
    await loadGoogleMaps()
    // Inicializar Google Places después de cargar
    setTimeout(() => {
      initGooglePlaces()
    }, 500)
  } catch (error) {
    console.warn('No se pudo cargar Google Maps:', error)
  }
})
</script>
