<template>
  <AdminLayout>
    <div class="mx-auto max-w-screen-2xl p-4 md:p-6 2xl:p-10">
    <!-- Header -->
    <div class="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      <h2 class="text-title-md2 font-semibold text-black dark:text-white">
        Mi Nave - {{ ship.name || 'Nave No Asignada' }}
      </h2>
      <nav>
        <ol class="flex items-center gap-2">
          <li><a class="font-medium" href="/">Dashboard /</a></li>
          <li class="font-medium text-primary">Mi Nave</li>
        </ol>
      </nav>
    </div>

    <!-- Ship Status -->
    <div v-if="ship.name" class="mb-6 grid grid-cols-1 gap-4 md:grid-cols-4">
      <div class="rounded-sm border border-stroke bg-white p-6 shadow-default dark:border-strokedark dark:bg-boxdark">
        <div class="flex items-center justify-between">
          <div>
            <h4 class="text-title-md font-bold text-black dark:text-white">{{ ship.level }}</h4>
            <p class="text-sm font-medium">Nivel de Nave</p>
          </div>
          <div class="flex h-11.5 w-11.5 items-center justify-center rounded-full bg-primary/10">
            <PlugInIcon class="h-6 w-6 text-primary" />
          </div>
        </div>
      </div>
      
      <div class="rounded-sm border border-stroke bg-white p-6 shadow-default dark:border-strokedark dark:bg-boxdark">
        <div class="flex items-center justify-between">
          <div>
            <h4 class="text-title-md font-bold text-black dark:text-white">{{ ship.capacity.currentArticles }}/{{ ship.capacity.maxArticles }}</h4>
            <p class="text-sm font-medium">Artículos Almacenados</p>
          </div>
          <div class="flex h-11.5 w-11.5 items-center justify-center rounded-full bg-success/10">
            <BoxCubeIcon class="h-6 w-6 text-success" />
          </div>
        </div>
      </div>
      
      <div class="rounded-sm border border-stroke bg-white p-6 shadow-default dark:border-strokedark dark:bg-boxdark">
        <div class="flex items-center justify-between">
          <div>
            <h4 class="text-title-md font-bold text-black dark:text-white">{{ ship.capacity.currentWeight }}/{{ ship.capacity.maxWeight }}kg</h4>
            <p class="text-sm font-medium">Peso Actual</p>
          </div>
          <div class="flex h-11.5 w-11.5 items-center justify-center rounded-full bg-warning/10">
            <BoxCubeIcon class="h-6 w-6 text-warning" />
          </div>
        </div>
      </div>
      
      <div class="rounded-sm border border-stroke bg-white p-6 shadow-default dark:border-strokedark dark:bg-boxdark">
        <div class="flex items-center justify-between">
          <div>
            <h4 class="text-title-md font-bold text-black dark:text-white">{{ ship.reputation }}</h4>
            <p class="text-sm font-medium">Reputación</p>
          </div>
          <div class="flex h-11.5 w-11.5 items-center justify-center rounded-full bg-info/10">
            <PlugInIcon class="h-6 w-6 text-info" />
          </div>
        </div>
      </div>
    </div>

    <!-- No Ship State -->
    <div v-else class="mb-6 rounded-sm border border-stroke bg-white p-12 shadow-default dark:border-strokedark dark:bg-boxdark text-center">
      <div class="mx-auto mb-4 h-24 w-24 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
        <PlugInIcon class="h-12 w-12 text-gray-400" />
      </div>
      <h3 class="text-lg font-semibold text-black dark:text-white mb-2">
        No tienes una nave asignada
      </h3>
      <p class="text-gray-600 dark:text-gray-400 mb-4">
        Adquiere una nave para comenzar tu aventura logística.
      </p>
      <router-link
        to="/centros-logisticos"
        class="inline-flex items-center justify-center rounded-md bg-primary py-3 px-6 text-center font-medium text-white hover:bg-opacity-90"
      >
        Ver Naves Disponibles
      </router-link>
    </div>

    <!-- Ship Details -->
    <div v-if="ship.name" class="grid grid-cols-1 gap-6 lg:grid-cols-2">
      <!-- Ship Information -->
      <div class="rounded-sm border border-stroke bg-white p-6 shadow-default dark:border-strokedark dark:bg-boxdark">
        <h3 class="text-title-md font-semibold text-black dark:text-white mb-4">
          Información de la Nave
        </h3>
        <div class="space-y-4">
          <div class="flex justify-between">
            <span class="text-gray-600 dark:text-gray-400">Nombre:</span>
            <span class="font-medium text-black dark:text-white">{{ ship.name }}</span>
          </div>
          <div class="flex justify-between">
            <span class="text-gray-600 dark:text-gray-400">Tipo:</span>
            <span class="font-medium text-black dark:text-white capitalize">{{ ship.type }}</span>
          </div>
          <div class="flex justify-between">
            <span class="text-gray-600 dark:text-gray-400">Sector:</span>
            <span class="font-medium text-black dark:text-white">{{ ship.location.sector }}</span>
          </div>
          <div class="flex justify-between">
            <span class="text-gray-600 dark:text-gray-400">Estado:</span>
            <span :class="getStatusClass(ship.status)">{{ getStatusLabel(ship.status) }}</span>
          </div>
          <div class="flex justify-between">
            <span class="text-gray-600 dark:text-gray-400">Experiencia:</span>
            <span class="font-medium text-black dark:text-white">{{ ship.experience }} XP</span>
          </div>
        </div>
      </div>

      <!-- Services -->
      <div class="rounded-sm border border-stroke bg-white p-6 shadow-default dark:border-strokedark dark:bg-boxdark">
        <h3 class="text-title-md font-semibold text-black dark:text-white mb-4">
          Servicios Disponibles
        </h3>
        <div class="grid grid-cols-2 gap-2">
          <div
            v-for="service in ship.services"
            :key="service"
            class="rounded-md bg-primary/10 px-3 py-2 text-center text-sm font-medium text-primary"
          >
            {{ getServiceLabel(service) }}
          </div>
        </div>
      </div>
    </div>

    <!-- Ship Actions -->
    <div v-if="ship.name" class="mt-6 rounded-sm border border-stroke bg-white p-6 shadow-default dark:border-strokedark dark:bg-boxdark">
      <h3 class="text-title-md font-semibold text-black dark:text-white mb-4">
        Acciones de la Nave
      </h3>
      <div class="grid grid-cols-1 gap-4 md:grid-cols-3">
        <button
          @click="upgradeShip"
          class="rounded-md bg-primary py-3 px-6 text-center font-medium text-white hover:bg-opacity-90"
        >
          Mejorar Nave
        </button>
        <button
          @click="manageCargo"
          class="rounded-md bg-success py-3 px-6 text-center font-medium text-white hover:bg-opacity-90"
        >
          Gestionar Carga
        </button>
        <button
          @click="travelToSector"
          class="rounded-md bg-warning py-3 px-6 text-center font-medium text-white hover:bg-opacity-90"
        >
          Viajar a Otro Sector
        </button>
      </div>
    </div>
    </div>
  </AdminLayout>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { PlugInIcon, BoxCubeIcon } from '@/icons'
import AdminLayout from '@/components/layout/AdminLayout.vue'

// Ship data
const ship = ref({
  name: 'Nave Estelar Alpha',
  type: 'nave',
  level: 5,
  experience: 1250,
  reputation: 750,
  status: 'activo',
  location: {
    sector: 'Sector Alpha-7',
    coordinates: { x: 100, y: 200, z: 50 }
  },
  capacity: {
    maxArticles: 100,
    currentArticles: 25,
    maxWeight: 5000,
    currentWeight: 1200
  },
  services: ['almacenamiento', 'transporte', 'comercio', 'comunicaciones']
})

// Methods
const getStatusClass = (status) => {
  const classes = {
    'activo': 'text-success',
    'mantenimiento': 'text-warning',
    'inactivo': 'text-danger'
  }
  return classes[status] || 'text-gray-500'
}

const getStatusLabel = (status) => {
  const labels = {
    'activo': 'Activo',
    'mantenimiento': 'Mantenimiento',
    'inactivo': 'Inactivo'
  }
  return labels[status] || status
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

const upgradeShip = () => {
  console.log('Upgrading ship...')
  alert('Mejorando nave...')
}

const manageCargo = () => {
  console.log('Managing cargo...')
  alert('Gestionando carga...')
}

const travelToSector = () => {
  console.log('Traveling to sector...')
  alert('Viajando a otro sector...')
}

onMounted(() => {
  // Load ship data from API
  console.log('Loading ship data...')
})
</script>






