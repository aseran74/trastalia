<template>
  <AdminLayout>
    <div class="mx-auto max-w-screen-2xl p-4 md:p-6 2xl:p-10">
    <!-- Header -->
    <div class="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      <h2 class="text-title-md2 font-semibold text-black dark:text-white">
        Centros Logísticos Disponibles
      </h2>
      <nav>
        <ol class="flex items-center gap-2">
          <li><a class="font-medium" href="/">Dashboard /</a></li>
          <li class="font-medium text-primary">Centros Logísticos</li>
        </ol>
      </nav>
    </div>

    <!-- Centers Grid -->
    <div class="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
      <div
        v-for="center in logisticsCenters"
        :key="center.id"
        class="rounded-sm border border-stroke bg-white p-6 shadow-default dark:border-strokedark dark:bg-boxdark"
      >
        <div class="mb-4">
          <div class="flex items-center justify-between mb-2">
            <h3 class="text-lg font-semibold text-black dark:text-white">{{ center.name }}</h3>
            <span :class="getTypeClass(center.type)">{{ getTypeLabel(center.type) }}</span>
          </div>
          <p class="text-sm text-gray-600 dark:text-gray-400">{{ center.location.sector }}</p>
        </div>
        
        <div class="mb-4 space-y-2">
          <div class="flex justify-between text-sm">
            <span class="text-gray-600 dark:text-gray-400">Capacidad:</span>
            <span class="font-medium">{{ center.capacity.currentArticles }}/{{ center.capacity.maxArticles }}</span>
          </div>
          <div class="flex justify-between text-sm">
            <span class="text-gray-600 dark:text-gray-400">Nivel:</span>
            <span class="font-medium">{{ center.level }}</span>
          </div>
          <div class="flex justify-between text-sm">
            <span class="text-gray-600 dark:text-gray-400">Reputación:</span>
            <span class="font-medium">{{ center.reputation }}</span>
          </div>
        </div>

        <div class="mb-4">
          <h4 class="text-sm font-medium text-black dark:text-white mb-2">Servicios:</h4>
          <div class="flex flex-wrap gap-1">
            <span
              v-for="service in center.services"
              :key="service"
              class="rounded-full bg-primary/10 px-2 py-1 text-xs text-primary"
            >
              {{ getServiceLabel(service) }}
            </span>
          </div>
        </div>

        <div class="flex gap-2">
          <button
            @click="viewCenter(center)"
            class="flex-1 rounded-md bg-primary py-2 px-4 text-center text-sm font-medium text-white hover:bg-opacity-90"
          >
            Ver Detalles
          </button>
          <button
            @click="acquireCenter(center)"
            class="flex-1 rounded-md bg-success py-2 px-4 text-center text-sm font-medium text-white hover:bg-opacity-90"
          >
            Adquirir
          </button>
        </div>
      </div>
    </div>

    <!-- Empty State -->
    <div v-if="logisticsCenters.length === 0" class="text-center py-12">
      <div class="mx-auto mb-4 h-24 w-24 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
        <PlugInIcon class="h-12 w-12 text-gray-400" />
      </div>
      <h3 class="text-lg font-semibold text-black dark:text-white mb-2">
        No hay centros disponibles
      </h3>
      <p class="text-gray-600 dark:text-gray-400 mb-4">
        Intenta más tarde o contacta con el administrador.
      </p>
    </div>
    </div>
  </AdminLayout>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { PlugInIcon } from '@/icons'
import AdminLayout from '@/components/layout/AdminLayout.vue'

// Sample logistics centers data
const logisticsCenters = ref([
  {
    id: 1,
    name: 'Nave Estelar Beta',
    type: 'nave',
    level: 3,
    reputation: 650,
    location: {
      sector: 'Sector Beta-12'
    },
    capacity: {
      maxArticles: 50,
      currentArticles: 15
    },
    services: ['almacenamiento', 'transporte', 'comercio']
  },
  {
    id: 2,
    name: 'Estación Gamma',
    type: 'estación',
    level: 8,
    reputation: 850,
    location: {
      sector: 'Sector Gamma-5'
    },
    capacity: {
      maxArticles: 200,
      currentArticles: 120
    },
    services: ['almacenamiento', 'reparación', 'seguridad', 'comunicaciones']
  },
  {
    id: 3,
    name: 'Puerto Delta',
    type: 'puerto',
    level: 12,
    reputation: 950,
    location: {
      sector: 'Sector Delta-1'
    },
    capacity: {
      maxArticles: 500,
      currentArticles: 300
    },
    services: ['almacenamiento', 'transporte', 'comercio', 'intercambio', 'seguridad', 'navegación']
  }
])

// Methods
const getTypeClass = (type) => {
  const classes = {
    'nave': 'text-primary',
    'estación': 'text-success',
    'puerto': 'text-warning'
  }
  return classes[type] || 'text-gray-500'
}

const getTypeLabel = (type) => {
  const labels = {
    'nave': 'Nave',
    'estación': 'Estación',
    'puerto': 'Puerto'
  }
  return labels[type] || type
}

const getServiceLabel = (service) => {
  const labels = {
    'almacenamiento': 'Almacenamiento',
    'transporte': 'Transporte',
    'reparación': 'Reparación',
    'comercio': 'Comercio',
    'intercambio': 'Intercambio',
    'seguridad': 'Seguridad',
    'comunicaciones': 'Comunicaciones',
    'navegación': 'Navegación'
  }
  return labels[service] || service
}

const viewCenter = (center) => {
  console.log('Viewing center:', center)
  alert(`Viendo detalles de ${center.name}`)
}

const acquireCenter = (center) => {
  console.log('Acquiring center:', center)
  alert(`Adquiriendo ${center.name}`)
}

onMounted(() => {
  // Load logistics centers from API
  console.log('Loading logistics centers...')
})
</script>






