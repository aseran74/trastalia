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
          
          <!-- Header -->
          <div class="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <h2 class="text-title-md2 font-semibold text-black dark:text-white">
              📊 Estadísticas de Ventas Gestionadas
            </h2>
            <button 
              @click="loadStats"
              class="flex items-center gap-2 rounded-md bg-primary px-4 py-2 text-white hover:bg-opacity-90"
            >
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path>
              </svg>
              Actualizar
            </button>
          </div>

          <!-- Loading State -->
          <div v-if="loading" class="flex justify-center items-center py-12">
            <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          </div>

          <!-- Stats Cards -->
          <div v-else-if="stats" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            
            <!-- Total Ventas Completadas -->
            <div class="rounded-lg border border-stroke bg-white p-6 shadow-default dark:border-strokedark dark:bg-boxdark">
              <div class="flex items-center justify-between">
                <div>
                  <p class="text-sm font-medium text-gray-600 dark:text-gray-400">Ventas Completadas</p>
                  <p class="text-2xl font-bold text-black dark:text-white">{{ stats.ventasCompletadas.total }}</p>
                </div>
                <div class="flex h-12 w-12 items-center justify-center rounded-full bg-green-100 dark:bg-green-900">
                  <svg class="h-6 w-6 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                  </svg>
                </div>
              </div>
            </div>

            <!-- Total Ingresos -->
            <div class="rounded-lg border border-stroke bg-white p-6 shadow-default dark:border-strokedark dark:bg-boxdark">
              <div class="flex items-center justify-between">
                <div>
                  <p class="text-sm font-medium text-gray-600 dark:text-gray-400">Total Ingresos</p>
                  <p class="text-2xl font-bold text-black dark:text-white">€{{ stats.ventasCompletadas.totalIngresos.toFixed(2) }}</p>
                </div>
                <div class="flex h-12 w-12 items-center justify-center rounded-full bg-blue-100 dark:bg-blue-900">
                  <svg class="h-6 w-6 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1"></path>
                  </svg>
                </div>
              </div>
            </div>

            <!-- Comisiones Trastalia -->
            <div class="rounded-lg border border-stroke bg-white p-6 shadow-default dark:border-strokedark dark:bg-boxdark">
              <div class="flex items-center justify-between">
                <div>
                  <p class="text-sm font-medium text-gray-600 dark:text-gray-400">Comisiones Trastalia</p>
                  <p class="text-2xl font-bold text-black dark:text-white">€{{ stats.ventasCompletadas.totalComisiones.toFixed(2) }}</p>
                  <p class="text-xs text-gray-500 dark:text-gray-400">5% sobre ventas</p>
                </div>
                <div class="flex h-12 w-12 items-center justify-center rounded-full bg-purple-100 dark:bg-purple-900">
                  <svg class="h-6 w-6 text-purple-600 dark:text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"></path>
                  </svg>
                </div>
              </div>
            </div>

            <!-- Ventas Pendientes -->
            <div class="rounded-lg border border-stroke bg-white p-6 shadow-default dark:border-strokedark dark:bg-boxdark">
              <div class="flex items-center justify-between">
                <div>
                  <p class="text-sm font-medium text-gray-600 dark:text-gray-400">Ventas Pendientes</p>
                  <p class="text-2xl font-bold text-black dark:text-white">{{ stats.ventasPendientes.total }}</p>
                  <p class="text-xs text-gray-500 dark:text-gray-400">En gestión</p>
                </div>
                <div class="flex h-12 w-12 items-center justify-center rounded-full bg-orange-100 dark:bg-orange-900">
                  <svg class="h-6 w-6 text-orange-600 dark:text-orange-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                  </svg>
                </div>
              </div>
            </div>
          </div>

          <!-- Ventas Pendientes -->
          <div v-if="stats && stats.ventasPendientes.total > 0" class="mb-8">
            <div class="rounded-lg border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
              <div class="border-b border-stroke py-4 px-6.5 dark:border-strokedark">
                <h3 class="font-medium text-black dark:text-white">
                  🕐 Artículos en Venta Gestionada (Pendientes)
                </h3>
              </div>
              <div class="p-6.5">
                <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  <div 
                    v-for="articulo in stats.ventasPendientes.articulos" 
                    :key="articulo._id"
                    class="border border-stroke rounded-lg p-4 dark:border-strokedark"
                  >
                    <h4 class="font-semibold text-black dark:text-white mb-2">{{ articulo.nombre }}</h4>
                    <p class="text-sm text-gray-600 dark:text-gray-400 mb-2">{{ articulo.descripcion.substring(0, 100) }}...</p>
                    <div class="flex justify-between items-center">
                      <span class="text-lg font-bold text-primary">€{{ articulo.precio_propuesto_vendedor }}</span>
                      <span class="text-xs text-gray-500 dark:text-gray-400">
                        {{ formatDate(articulo.venta_gestionada.fecha_activacion) }}
                      </span>
                    </div>
                    <p class="text-xs text-gray-500 dark:text-gray-400 mt-2">
                      Vendedor: {{ articulo.seller?.name || 'N/A' }}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Ventas Completadas -->
          <div v-if="stats && stats.ventasCompletadas.total > 0">
            <div class="rounded-lg border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
              <div class="border-b border-stroke py-4 px-6.5 dark:border-strokedark">
                <h3 class="font-medium text-black dark:text-white">
                  ✅ Ventas Gestionadas Completadas
                </h3>
              </div>
              <div class="p-6.5">
                <div class="overflow-x-auto">
                  <table class="w-full table-auto">
                    <thead>
                      <tr class="bg-gray-50 dark:bg-gray-800">
                        <th class="min-w-[200px] py-3 px-4 text-left text-sm font-medium text-gray-700 dark:text-gray-300">Artículo</th>
                        <th class="min-w-[120px] py-3 px-4 text-left text-sm font-medium text-gray-700 dark:text-gray-300">Vendedor</th>
                        <th class="min-w-[120px] py-3 px-4 text-left text-sm font-medium text-gray-700 dark:text-gray-300">Comprador</th>
                        <th class="min-w-[100px] py-3 px-4 text-left text-sm font-medium text-gray-700 dark:text-gray-300">Precio Final</th>
                        <th class="min-w-[100px] py-3 px-4 text-left text-sm font-medium text-gray-700 dark:text-gray-300">Comisión</th>
                        <th class="min-w-[100px] py-3 px-4 text-left text-sm font-medium text-gray-700 dark:text-gray-300">Ganancia</th>
                        <th class="min-w-[120px] py-3 px-4 text-left text-sm font-medium text-gray-700 dark:text-gray-300">Fecha Venta</th>
                      </tr>
                    </thead>
                    <tbody class="divide-y divide-gray-200 dark:divide-gray-700">
                      <tr v-for="venta in stats.ventasDetalladas" :key="venta._id" class="hover:bg-gray-50 dark:hover:bg-gray-800">
                        <td class="py-3 px-4">
                          <div>
                            <p class="font-medium text-black dark:text-white">{{ venta.nombre }}</p>
                            <p class="text-sm text-gray-500 dark:text-gray-400">{{ venta.categoria }}</p>
                          </div>
                        </td>
                        <td class="py-3 px-4 text-sm text-gray-900 dark:text-gray-100">{{ venta.seller?.name || 'N/A' }}</td>
                        <td class="py-3 px-4 text-sm text-gray-900 dark:text-gray-100">{{ venta.comprador_final?.name || 'N/A' }}</td>
                        <td class="py-3 px-4 text-sm font-medium text-green-600 dark:text-green-400">€{{ venta.venta_gestionada.precio_venta_final.toFixed(2) }}</td>
                        <td class="py-3 px-4 text-sm font-medium text-purple-600 dark:text-purple-400">€{{ (venta.venta_gestionada.precio_venta_final * venta.venta_gestionada.comision_trastalia).toFixed(2) }}</td>
                        <td class="py-3 px-4 text-sm font-medium text-blue-600 dark:text-blue-400">€{{ venta.venta_gestionada.ganancia_vendedor.toFixed(2) }}</td>
                        <td class="py-3 px-4 text-sm text-gray-500 dark:text-gray-400">{{ formatDate(venta.venta_gestionada.fecha_venta) }}</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>

          <!-- Empty State -->
          <div v-else-if="stats && stats.ventasCompletadas.total === 0" class="text-center py-12">
            <div class="mx-auto h-24 w-24 text-gray-400 dark:text-gray-600">
              <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path>
              </svg>
            </div>
            <h3 class="mt-4 text-lg font-medium text-gray-900 dark:text-gray-100">No hay ventas gestionadas aún</h3>
            <p class="mt-2 text-sm text-gray-500 dark:text-gray-400">Las ventas gestionadas aparecerán aquí cuando los usuarios seleccionen "Te gestionamos la venta"</p>
          </div>

        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useSidebar } from '@/composables/useSidebar'
import AppSidebar from '@/components/layout/AppSidebar.vue'
import AppHeader from '@/components/layout/AppHeader.vue'
import Backdrop from '@/components/layout/Backdrop.vue'

const { isExpanded, isHovered } = useSidebar()

const loading = ref(false)
const stats = ref(null)

const loadStats = async () => {
  loading.value = true
  try {
    const response = await fetch('/api/admin/managed-sales-stats', {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      }
    })
    
    if (response.ok) {
      const result = await response.json()
      stats.value = result.data
    } else {
      console.error('Error cargando estadísticas:', response.statusText)
    }
  } catch (error) {
    console.error('Error cargando estadísticas:', error)
  } finally {
    loading.value = false
  }
}

const formatDate = (dateString) => {
  if (!dateString) return 'N/A'
  return new Date(dateString).toLocaleDateString('es-ES', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  })
}

onMounted(() => {
  loadStats()
})
</script>
