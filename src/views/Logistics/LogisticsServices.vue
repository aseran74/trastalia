<template>
  <AdminLayout>
    <div class="mx-auto max-w-screen-2xl p-4 md:p-6 2xl:p-10">
    <!-- Header -->
    <div class="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      <h2 class="text-title-md2 font-semibold text-black dark:text-white">
        Servicios Logísticos
      </h2>
      <nav>
        <ol class="flex items-center gap-2">
          <li><a class="font-medium" href="/">Dashboard /</a></li>
          <li class="font-medium text-primary">Servicios Logísticos</li>
        </ol>
      </nav>
    </div>

    <!-- Services Grid -->
    <div class="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
      <div
        v-for="service in services"
        :key="service.id"
        class="rounded-sm border border-stroke bg-white p-6 shadow-default dark:border-strokedark dark:bg-boxdark"
      >
        <div class="mb-4">
          <div class="flex items-center gap-3 mb-2">
            <div :class="service.iconClass">
              <component :is="service.icon" class="h-6 w-6" />
            </div>
            <h3 class="text-lg font-semibold text-black dark:text-white">{{ service.name }}</h3>
          </div>
          <p class="text-sm text-gray-600 dark:text-gray-400">{{ service.description }}</p>
        </div>
        
        <div class="mb-4 space-y-2">
          <div class="flex justify-between text-sm">
            <span class="text-gray-600 dark:text-gray-400">Costo:</span>
            <span class="font-medium">{{ service.cost }}€ / {{ service.pointsCost }} puntos</span>
          </div>
          <div class="flex justify-between text-sm">
            <span class="text-gray-600 dark:text-gray-400">Duración:</span>
            <span class="font-medium">{{ service.duration }}</span>
          </div>
          <div class="flex justify-between text-sm">
            <span class="text-gray-600 dark:text-gray-400">Nivel Requerido:</span>
            <span class="font-medium">{{ service.requiredLevel }}</span>
          </div>
        </div>

        <div class="flex gap-2">
          <button
            @click="viewService(service)"
            class="flex-1 rounded-md bg-primary py-2 px-4 text-center text-sm font-medium text-white hover:bg-opacity-90"
          >
            Ver Detalles
          </button>
          <button
            @click="requestService(service)"
            class="flex-1 rounded-md bg-success py-2 px-4 text-center text-sm font-medium text-white hover:bg-opacity-90"
          >
            Solicitar
          </button>
        </div>
      </div>
    </div>

    <!-- My Services -->
    <div class="mt-8 rounded-sm border border-stroke bg-white p-6 shadow-default dark:border-strokedark dark:bg-boxdark">
      <h3 class="text-title-md font-semibold text-black dark:text-white mb-4">
        Mis Servicios Activos
      </h3>
      <div class="space-y-4">
        <div
          v-for="activeService in activeServices"
          :key="activeService.id"
          class="flex items-center justify-between rounded-lg border border-stroke p-4 dark:border-strokedark"
        >
          <div class="flex items-center gap-3">
            <div :class="activeService.iconClass">
              <component :is="activeService.icon" class="h-5 w-5" />
            </div>
            <div>
              <h4 class="font-medium text-black dark:text-white">{{ activeService.name }}</h4>
              <p class="text-sm text-gray-600 dark:text-gray-400">{{ activeService.description }}</p>
            </div>
          </div>
          <div class="flex items-center gap-2">
            <span :class="getStatusClass(activeService.status)">{{ getStatusLabel(activeService.status) }}</span>
            <button
              @click="cancelService(activeService)"
              class="rounded-md bg-danger py-1 px-3 text-sm font-medium text-white hover:bg-opacity-90"
            >
              Cancelar
            </button>
          </div>
        </div>
      </div>
    </div>
    </div>
  </AdminLayout>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { PlugInIcon, BoxCubeIcon, ListIcon } from '@/icons'
import AdminLayout from '@/components/layout/AdminLayout.vue'

// Sample services data
const services = ref([
  {
    id: 1,
    name: 'Almacenamiento',
    description: 'Almacena tus artículos de forma segura en nuestra nave',
    cost: 50,
    pointsCost: 250,
    duration: '30 días',
    requiredLevel: 1,
    icon: BoxCubeIcon,
    iconClass: 'flex h-10 w-10 items-center justify-center rounded-full bg-primary/10'
  },
  {
    id: 2,
    name: 'Transporte',
    description: 'Transporta mercancías entre sectores espaciales',
    cost: 100,
    pointsCost: 500,
    duration: '7 días',
    requiredLevel: 3,
    icon: PlugInIcon,
    iconClass: 'flex h-10 w-10 items-center justify-center rounded-full bg-success/10'
  },
  {
    id: 3,
    name: 'Reparación',
    description: 'Repara y mantén tus equipos y naves',
    cost: 200,
    pointsCost: 1000,
    duration: '3 días',
    requiredLevel: 5,
    icon: PlugInIcon,
    iconClass: 'flex h-10 w-10 items-center justify-center rounded-full bg-warning/10'
  },
  {
    id: 4,
    name: 'Comercio',
    description: 'Facilita el comercio entre diferentes sectores',
    cost: 150,
    pointsCost: 750,
    duration: '14 días',
    requiredLevel: 4,
    icon: ListIcon,
    iconClass: 'flex h-10 w-10 items-center justify-center rounded-full bg-info/10'
  },
  {
    id: 5,
    name: 'Seguridad',
    description: 'Protege tus mercancías durante el transporte',
    cost: 300,
    pointsCost: 1500,
    duration: '30 días',
    requiredLevel: 7,
    icon: PlugInIcon,
    iconClass: 'flex h-10 w-10 items-center justify-center rounded-full bg-danger/10'
  },
  {
    id: 6,
    name: 'Comunicaciones',
    description: 'Mantén comunicación con otros centros logísticos',
    cost: 75,
    pointsCost: 375,
    duration: '21 días',
    requiredLevel: 2,
    icon: PlugInIcon,
    iconClass: 'flex h-10 w-10 items-center justify-center rounded-full bg-primary/10'
  }
])

// Sample active services
const activeServices = ref([
  {
    id: 1,
    name: 'Almacenamiento',
    description: 'Almacenando 15 artículos',
    status: 'activo',
    icon: BoxCubeIcon,
    iconClass: 'flex h-8 w-8 items-center justify-center rounded-full bg-primary/10'
  },
  {
    id: 2,
    name: 'Transporte',
    description: 'Transportando a Sector Beta-12',
    status: 'en_proceso',
    icon: PlugInIcon,
    iconClass: 'flex h-8 w-8 items-center justify-center rounded-full bg-success/10'
  }
])

// Methods
const getStatusClass = (status) => {
  const classes = {
    'activo': 'text-success',
    'en_proceso': 'text-warning',
    'completado': 'text-primary',
    'cancelado': 'text-danger'
  }
  return classes[status] || 'text-gray-500'
}

const getStatusLabel = (status) => {
  const labels = {
    'activo': 'Activo',
    'en_proceso': 'En Proceso',
    'completado': 'Completado',
    'cancelado': 'Cancelado'
  }
  return labels[status] || status
}

const viewService = (service) => {
  console.log('Viewing service:', service)
  alert(`Viendo detalles de ${service.name}`)
}

const requestService = (service) => {
  console.log('Requesting service:', service)
  alert(`Solicitando ${service.name}`)
}

const cancelService = (service) => {
  console.log('Canceling service:', service)
  alert(`Cancelando ${service.name}`)
}

onMounted(() => {
  // Load services from API
  console.log('Loading logistics services...')
})
</script>






