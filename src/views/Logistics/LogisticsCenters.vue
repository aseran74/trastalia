<template>
  <AdminLayout>
    <div class="mx-auto max-w-screen-2xl p-4 md:p-6 2xl:p-10">
    <!-- Header -->
    <div class="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      <h2 class="text-title-md2 font-semibold text-black dark:text-white">
        Centros Logísticos Disponibles
      </h2>
      <div class="flex gap-2">
        <button
          @click="loadCenters"
          class="rounded-md bg-primary py-2 px-4 text-sm font-medium text-white hover:bg-opacity-90"
        >
          🔄 Actualizar
        </button>
        <button
          @click="initializeData"
          class="rounded-md bg-success py-2 px-4 text-sm font-medium text-white hover:bg-opacity-90"
          :disabled="loading"
        >
          🌱 Inicializar Datos
        </button>
      </div>
      <nav>
        <ol class="flex items-center gap-2">
          <li><a class="font-medium" href="/">Dashboard /</a></li>
          <li class="font-medium text-primary">Centros Logísticos</li>
        </ol>
      </nav>
    </div>

    <!-- Loading State -->
    <div v-if="loading" class="text-center py-12">
      <div class="mx-auto mb-4 h-24 w-24 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center animate-spin">
        <span class="text-2xl">📦</span>
      </div>
      <h3 class="text-lg font-semibold text-black dark:text-white mb-2">
        Cargando centros logísticos...
      </h3>
    </div>

    <!-- Centers Grid -->
    <div v-else-if="logisticsCenters.length > 0" class="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
      <div
        v-for="center in logisticsCenters"
        :key="center._id"
        class="rounded-sm border border-stroke bg-white p-6 shadow-default dark:border-strokedark dark:bg-boxdark hover:shadow-lg transition-shadow"
      >
        <!-- Header -->
        <div class="mb-4">
          <div class="flex items-center justify-between mb-2">
            <h3 class="text-lg font-semibold text-black dark:text-white">{{ center.name }}</h3>
            <span :class="getTypeClass(center.type)" class="text-xs font-medium px-2 py-1 rounded-full">
              {{ getTypeLabel(center.type) }}
            </span>
          </div>
          <p class="text-sm text-gray-600 dark:text-gray-400">{{ center.location?.city || 'Ciudad no especificada' }} - {{ center.location?.sector || 'Sector no especificado' }}</p>
          <p class="text-xs text-gray-500 dark:text-gray-500">{{ center.location?.address || 'Dirección no especificada' }}</p>
        </div>
        
        <!-- Stats -->
        <div class="mb-4 space-y-2">
          <div class="flex justify-between text-sm">
            <span class="text-gray-600 dark:text-gray-400">Nivel:</span>
            <span class="font-medium">{{ center.level }}</span>
          </div>
          <div class="flex justify-between text-sm">
            <span class="text-gray-600 dark:text-gray-400">Reputación:</span>
            <span class="font-medium">{{ center.reputation }}/1000</span>
          </div>
          <div class="flex justify-between text-sm">
            <span class="text-gray-600 dark:text-gray-400">Estado:</span>
            <span :class="getStatusClass(center.status)" class="font-medium">{{ getStatusLabel(center.status) }}</span>
          </div>
        </div>

        <!-- Capacity Overview -->
        <div class="mb-4">
          <h4 class="text-sm font-medium text-black dark:text-white mb-2">Capacidad Total:</h4>
          <div class="flex justify-between text-sm mb-2">
            <span class="text-gray-600 dark:text-gray-400">Disponible:</span>
            <span class="font-medium text-green-600 dark:text-green-400">{{ center.capacity?.available || 0 }}/{{ center.capacity?.totalCapacity || 0 }}</span>
          </div>
          <div class="w-full bg-gray-200 rounded-full h-2 dark:bg-gray-700">
            <div 
              class="bg-primary h-2 rounded-full transition-all duration-300"
              :style="{ width: `${((center.capacity?.available || 0) / (center.capacity?.totalCapacity || 1)) * 100}%` }"
            ></div>
          </div>
        </div>

        <!-- Box Types Capacity -->
        <div class="mb-4">
          <h4 class="text-sm font-medium text-black dark:text-white mb-2">Capacidad por Tipo de Caja:</h4>
          <div class="space-y-1">
            <div 
              v-for="(boxType, key) in center.capacity?.byBoxType || {}" 
              :key="key"
              class="flex justify-between text-xs"
            >
              <span class="text-gray-600 dark:text-gray-400">{{ getBoxTypeLabel(key) }}:</span>
              <span class="font-medium">
                <span class="text-green-600 dark:text-green-400">{{ (boxType?.total || 0) - (boxType?.ocupados || 0) }}</span>
                <span class="text-gray-500">/{{ boxType?.total || 0 }}</span>
              </span>
            </div>
          </div>
        </div>

        <!-- Services -->
        <div class="mb-4">
          <h4 class="text-sm font-medium text-black dark:text-white mb-2">Servicios:</h4>
          <div class="flex flex-wrap gap-1">
            <span
              v-for="service in center.services || []"
              :key="service"
              class="rounded-full bg-primary/10 px-2 py-1 text-xs text-primary"
            >
              {{ getServiceLabel(service) }}
            </span>
          </div>
        </div>

        <!-- Contact Info -->
        <div class="mb-4 text-xs text-gray-500 dark:text-gray-400">
          <p><strong>Manager:</strong> {{ center.contact?.manager }}</p>
          <p><strong>Teléfono:</strong> {{ center.contact?.phone }}</p>
        </div>

        <!-- Actions -->
        <div class="flex gap-2">
          <button
            @click="viewCenter(center)"
            class="flex-1 rounded-md bg-primary py-2 px-4 text-center text-sm font-medium text-white hover:bg-opacity-90"
          >
            Ver Detalles
          </button>
          <button
            @click="viewCapacity(center)"
            class="flex-1 rounded-md bg-success py-2 px-4 text-center text-sm font-medium text-white hover:bg-opacity-90"
          >
            Capacidad
          </button>
        </div>
      </div>
    </div>

    <!-- Empty State -->
    <div v-else class="text-center py-12">
      <div class="mx-auto mb-4 h-24 w-24 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
        <PlugInIcon class="h-12 w-12 text-gray-400" />
      </div>
      <h3 class="text-lg font-semibold text-black dark:text-white mb-2">
        No hay centros disponibles
      </h3>
      <p class="text-gray-600 dark:text-gray-400 mb-4">
        Haz clic en "Inicializar Datos" para crear centros logísticos de ejemplo.
      </p>
      <button
        @click="initializeData"
        class="rounded-md bg-primary py-2 px-4 text-sm font-medium text-white hover:bg-opacity-90"
      >
        🌱 Inicializar Datos
      </button>
    </div>
    </div>
  </AdminLayout>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { PlugInIcon } from '@/icons'
import AdminLayout from '@/components/layout/AdminLayout.vue'

// Estado reactivo
const logisticsCenters = ref([])
const loading = ref(false)

// Cargar centros logísticos desde la API
const loadCenters = async () => {
  loading.value = true
  try {
    console.log('🚀 Cargando centros logísticos...')
    const response = await fetch('/api/logistics-centers')
    
    if (response.ok) {
      const result = await response.json()
      console.log('📦 Datos recibidos del servidor:', result)
      logisticsCenters.value = result.data || []
      console.log(`✅ ${result.data?.length || 0} centros logísticos cargados`)
      
      // Debug: mostrar estructura del primer centro si existe
      if (result.data && result.data.length > 0) {
        console.log('🔍 Estructura del primer centro:', result.data[0])
      }
    } else {
      console.error('❌ Error cargando centros logísticos:', response.status)
      const errorText = await response.text()
      console.error('❌ Error response:', errorText)
    }
  } catch (error) {
    console.error('❌ Error cargando centros logísticos:', error)
  } finally {
    loading.value = false
  }
}

// Inicializar datos de centros logísticos
const initializeData = async () => {
  loading.value = true
  try {
    console.log('🌱 Inicializando datos de centros logísticos...')
    const response = await fetch('/api/logistics-centers/seed', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      }
    })
    
    if (response.ok) {
      const result = await response.json()
      console.log('✅ Datos inicializados:', result.message)
      alert(result.message)
      // Recargar los centros después de inicializar
      await loadCenters()
    } else {
      const error = await response.json()
      console.error('❌ Error inicializando datos:', error.message)
      alert(`Error: ${error.message}`)
    }
  } catch (error) {
    console.error('❌ Error inicializando datos:', error)
    alert('Error inicializando los datos')
  } finally {
    loading.value = false
  }
}

// Métodos de utilidad
const getTypeClass = (type) => {
  const classes = {
    'nave': 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
    'estacion': 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
    'puerto': 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
    'almacen': 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200'
  }
  return classes[type] || 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200'
}

const getTypeLabel = (type) => {
  const labels = {
    'nave': 'Nave',
    'estacion': 'Estación',
    'puerto': 'Puerto',
    'almacen': 'Almacén'
  }
  return labels[type] || type
}

const getStatusClass = (status) => {
  const classes = {
    'activo': 'text-green-600 dark:text-green-400',
    'mantenimiento': 'text-yellow-600 dark:text-yellow-400',
    'cerrado': 'text-red-600 dark:text-red-400'
  }
  return classes[status] || 'text-gray-600 dark:text-gray-400'
}

const getStatusLabel = (status) => {
  const labels = {
    'activo': 'Activo',
    'mantenimiento': 'Mantenimiento',
    'cerrado': 'Cerrado'
  }
  return labels[status] || status
}

const getBoxTypeLabel = (boxType) => {
  const labels = {
    'caja_pequena': 'Caja Pequeña',
    'caja_mediana': 'Caja Mediana',
    'caja_grande': 'Caja Grande',
    'caja_extra_grande': 'Caja Extra Grande',
    'caja_estrecha': 'Caja Estrecha',
    'caja_cubica': 'Caja Cúbica'
  }
  return labels[boxType] || boxType
}

const getServiceLabel = (service) => {
  const labels = {
    'almacenamiento': 'Almacenamiento',
    'transporte': 'Transporte',
    'reparacion': 'Reparación',
    'comercio': 'Comercio',
    'intercambio': 'Intercambio',
    'seguridad': 'Seguridad',
    'comunicaciones': 'Comunicaciones',
    'navegacion': 'Navegación',
    'valijas': 'Valijas',
    'envios_urgentes': 'Envíos Urgentes'
  }
  return labels[service] || service
}

const viewCenter = (center) => {
  console.log('Viewing center:', center)
  alert(`Detalles de ${center.name}\n\nUbicación: ${center.location.address}\nManager: ${center.contact?.manager}\nTeléfono: ${center.contact?.phone}\nEmail: ${center.contact?.email}`)
}

const viewCapacity = (center) => {
  console.log('Viewing capacity for center:', center)
  const capacityDetails = Object.entries(center.capacity.byBoxType)
    .map(([boxType, capacity]) => `${getBoxTypeLabel(boxType)}: ${capacity.total - capacity.ocupados}/${capacity.total} disponibles`)
    .join('\n')
  
  alert(`Capacidad de ${center.name}\n\n${capacityDetails}\n\nTotal disponible: ${center.capacity.available}/${center.capacity.totalCapacity}`)
}

onMounted(() => {
  loadCenters()
})
</script>






