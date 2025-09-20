<template>
  <AdminLayout>
    <div class="mx-auto max-w-screen-2xl p-4 md:p-6 2xl:p-10">
      <!-- Header -->
      <div class="mb-6">
        <h1 class="text-3xl font-bold text-gray-900 dark:text-white mb-2">
          Demostración de Toasts
        </h1>
        <p class="text-gray-600 dark:text-gray-400">
          Prueba los diferentes tipos de notificaciones toast
        </p>
      </div>

      <!-- Demo Cards -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <!-- Success Toast -->
        <div class="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
          <div class="flex items-center mb-4">
            <div class="w-8 h-8 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center mr-3">
              <svg class="w-5 h-5 text-green-600 dark:text-green-400" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
              </svg>
            </div>
            <h3 class="text-lg font-semibold text-gray-900 dark:text-white">Éxito</h3>
          </div>
          <p class="text-gray-600 dark:text-gray-400 mb-4">
            Muestra notificaciones de éxito con icono verde
          </p>
          <button
            @click="showSuccessToast"
            class="w-full bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition-colors"
          >
            Mostrar Toast de Éxito
          </button>
        </div>

        <!-- Error Toast -->
        <div class="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
          <div class="flex items-center mb-4">
            <div class="w-8 h-8 bg-red-100 dark:bg-red-900 rounded-full flex items-center justify-center mr-3">
              <svg class="w-5 h-5 text-red-600 dark:text-red-400" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd" />
              </svg>
            </div>
            <h3 class="text-lg font-semibold text-gray-900 dark:text-white">Error</h3>
          </div>
          <p class="text-gray-600 dark:text-gray-400 mb-4">
            Muestra notificaciones de error con icono rojo
          </p>
          <button
            @click="showErrorToast"
            class="w-full bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition-colors"
          >
            Mostrar Toast de Error
          </button>
        </div>

        <!-- Warning Toast -->
        <div class="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
          <div class="flex items-center mb-4">
            <div class="w-8 h-8 bg-yellow-100 dark:bg-yellow-900 rounded-full flex items-center justify-center mr-3">
              <svg class="w-5 h-5 text-yellow-600 dark:text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clip-rule="evenodd" />
              </svg>
            </div>
            <h3 class="text-lg font-semibold text-gray-900 dark:text-white">Advertencia</h3>
          </div>
          <p class="text-gray-600 dark:text-gray-400 mb-4">
            Muestra notificaciones de advertencia con icono amarillo
          </p>
          <button
            @click="showWarningToast"
            class="w-full bg-yellow-600 hover:bg-yellow-700 text-white px-4 py-2 rounded-lg transition-colors"
          >
            Mostrar Toast de Advertencia
          </button>
        </div>

        <!-- Info Toast -->
        <div class="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
          <div class="flex items-center mb-4">
            <div class="w-8 h-8 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center mr-3">
              <svg class="w-5 h-5 text-blue-600 dark:text-blue-400" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clip-rule="evenodd" />
              </svg>
            </div>
            <h3 class="text-lg font-semibold text-gray-900 dark:text-white">Información</h3>
          </div>
          <p class="text-gray-600 dark:text-gray-400 mb-4">
            Muestra notificaciones informativas con icono azul
          </p>
          <button
            @click="showInfoToast"
            class="w-full bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
          >
            Mostrar Toast de Info
          </button>
        </div>
      </div>

      <!-- Position Demo -->
      <div class="mt-8 bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
        <h3 class="text-xl font-semibold text-gray-900 dark:text-white mb-4">Posiciones de Toast</h3>
        <div class="grid grid-cols-2 md:grid-cols-3 gap-4">
          <button
            @click="showToastAtPosition('top-right')"
            class="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg transition-colors"
          >
            Top Right
          </button>
          <button
            @click="showToastAtPosition('top-left')"
            class="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg transition-colors"
          >
            Top Left
          </button>
          <button
            @click="showToastAtPosition('top-center')"
            class="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg transition-colors"
          >
            Top Center
          </button>
          <button
            @click="showToastAtPosition('bottom-right')"
            class="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg transition-colors"
          >
            Bottom Right
          </button>
          <button
            @click="showToastAtPosition('bottom-left')"
            class="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg transition-colors"
          >
            Bottom Left
          </button>
          <button
            @click="showToastAtPosition('bottom-center')"
            class="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg transition-colors"
          >
            Bottom Center
          </button>
        </div>
      </div>

      <!-- Duration Demo -->
      <div class="mt-8 bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
        <h3 class="text-xl font-semibold text-gray-900 dark:text-white mb-4">Duración Personalizada</h3>
        <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
          <button
            @click="showToastWithDuration(2000)"
            class="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg transition-colors"
          >
            2 segundos
          </button>
          <button
            @click="showToastWithDuration(5000)"
            class="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg transition-colors"
          >
            5 segundos
          </button>
          <button
            @click="showToastWithDuration(10000)"
            class="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg transition-colors"
          >
            10 segundos
          </button>
          <button
            @click="showToastWithDuration(0)"
            class="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg transition-colors"
          >
            Permanente
          </button>
        </div>
      </div>

      <!-- Clear All -->
      <div class="mt-8 bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
        <h3 class="text-xl font-semibold text-gray-900 dark:text-white mb-4">Gestión de Toasts</h3>
        <button
          @click="clearAllToasts"
          class="bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-lg transition-colors"
        >
          Limpiar Todos los Toasts
        </button>
      </div>
    </div>
  </AdminLayout>
</template>

<script setup>
import { useToast } from '@/composables/useToast'
import AdminLayout from '@/components/layout/AdminLayout.vue'

const toast = useToast()

const showSuccessToast = () => {
  toast.success(
    '¡Operación exitosa!',
    'El artículo se ha publicado correctamente en la plataforma.',
    { duration: 4000 }
  )
}

const showErrorToast = () => {
  toast.error(
    'Error al procesar',
    'No se pudo completar la operación. Verifica los datos e inténtalo de nuevo.',
    { duration: 6000 }
  )
}

const showWarningToast = () => {
  toast.warning(
    'Atención requerida',
    'El precio propuesto está por debajo del valor de mercado recomendado.',
    { duration: 5000 }
  )
}

const showInfoToast = () => {
  toast.info(
    'Información importante',
    'Tu artículo será revisado por nuestro equipo antes de ser publicado.',
    { duration: 5000 }
  )
}

const showToastAtPosition = (position) => {
  toast.info(
    `Toast en ${position}`,
    `Este toast aparece en la posición ${position}`,
    { position, duration: 3000 }
  )
}

const showToastWithDuration = (duration) => {
  toast.info(
    `Duración: ${duration === 0 ? 'Permanente' : duration + 'ms'}`,
    `Este toast durará ${duration === 0 ? 'hasta que lo cierres manualmente' : duration + ' milisegundos'}`,
    { duration }
  )
}

const clearAllToasts = () => {
  toast.clear()
  toast.info(
    'Toasts limpiados',
    'Se han eliminado todos los toasts activos.',
    { duration: 2000 }
  )
}
</script>
