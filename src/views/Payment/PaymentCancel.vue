<template>
  <div class="min-h-screen bg-gradient-to-br from-orange-50 via-white to-red-50 flex items-center justify-center p-4">
    <div class="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 text-center">
      <!-- Warning Icon -->
      <div class="w-20 h-20 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-6">
        <svg class="w-12 h-12 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-1.964-1.333-2.732 0L3.732 16c-.77 1.333.192 3 1.732 3z"></path>
        </svg>
      </div>

      <h1 class="text-3xl font-bold text-gray-900 mb-4">
        Pago Cancelado
      </h1>
      
      <p class="text-gray-600 mb-6">
        Has cancelado el proceso de pago. No se ha realizado ningún cargo a tu tarjeta.
      </p>

      <div class="bg-orange-50 border border-orange-200 rounded-lg p-4 mb-6">
        <p class="text-sm text-orange-800">
          Si cancelaste por error, puedes volver a intentar el pago en cualquier momento.
        </p>
      </div>

      <div class="space-y-3">
        <router-link 
          to="/comprar-articulos" 
          class="block w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white py-3 px-6 rounded-lg font-semibold hover:from-blue-700 hover:to-blue-800 transition-all duration-300 transform hover:scale-105"
        >
          Volver a Comprar Artículos
        </router-link>
        
        <router-link 
          to="/articulos" 
          class="block w-full border-2 border-gray-300 text-gray-700 py-3 px-6 rounded-lg font-semibold hover:border-gray-400 hover:bg-gray-50 transition-colors"
        >
          Ver Catálogo
        </router-link>

        <router-link 
          to="/dashboard" 
          class="block w-full text-gray-600 py-2 px-6 text-sm hover:text-gray-800 transition-colors"
        >
          Ir al Dashboard
        </router-link>
      </div>
    </div>
  </div>
</template>

<script setup>
// Este componente es estático, no necesita lógica
</script>


