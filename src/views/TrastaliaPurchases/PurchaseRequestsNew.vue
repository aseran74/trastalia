<template>
  <AdminLayout>
    <div class="p-6">
      <!-- Header -->
      <div class="mb-8">
        <h1 class="text-3xl font-bold text-gray-900 dark:text-white mb-2">
          Mis Solicitudes de Compra
        </h1>
        <p class="text-gray-600 dark:text-gray-400">
          Gestiona las ofertas de compra de Trastalia para tus artículos
        </p>
      </div>

      <!-- Estadísticas -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div class="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <div class="flex items-center">
            <div class="p-3 rounded-full bg-yellow-100 dark:bg-yellow-900/20">
              <svg class="w-6 h-6 text-yellow-600 dark:text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
            </div>
            <div class="ml-4">
              <p class="text-sm font-medium text-gray-600 dark:text-gray-400">Pendientes</p>
              <p class="text-2xl font-semibold text-gray-900 dark:text-white">{{ pendingCount }}</p>
            </div>
          </div>
        </div>

        <div class="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <div class="flex items-center">
            <div class="p-3 rounded-full bg-green-100 dark:bg-green-900/20">
              <svg class="w-6 h-6 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
              </svg>
            </div>
            <div class="ml-4">
              <p class="text-sm font-medium text-gray-600 dark:text-gray-400">Aceptadas</p>
              <p class="text-2xl font-semibold text-gray-900 dark:text-white">{{ acceptedCount }}</p>
            </div>
          </div>
        </div>

        <div class="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <div class="flex items-center">
            <div class="p-3 rounded-full bg-red-100 dark:bg-red-900/20">
              <svg class="w-6 h-6 text-red-600 dark:text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
              </svg>
            </div>
            <div class="ml-4">
              <p class="text-sm font-medium text-gray-600 dark:text-gray-400">Rechazadas</p>
              <p class="text-2xl font-semibold text-gray-900 dark:text-white">{{ rejectedCount }}</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Filtros -->
      <div class="bg-white dark:bg-gray-800 rounded-lg shadow p-6 mb-6">
        <div class="flex flex-wrap gap-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Filtrar por estado
            </label>
            <select 
              v-model="selectedFilter" 
              @change="filterRequests"
              class="block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
            >
              <option value="all">Todos</option>
              <option value="pending">Pendientes</option>
              <option value="accepted">Aceptadas</option>
              <option value="rejected">Rechazadas</option>
            </select>
          </div>
        </div>
      </div>

      <!-- Lista de solicitudes -->
      <div v-if="loading" class="flex justify-center items-center py-12">
        <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>

      <div v-else-if="filteredRequests.length === 0" class="text-center py-12">
        <svg class="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
        </svg>
        <h3 class="mt-2 text-sm font-medium text-gray-900 dark:text-white">No hay solicitudes</h3>
        <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">No tienes solicitudes de compra pendientes.</p>
      </div>

      <div v-else class="space-y-6">
        <div 
          v-for="request in filteredRequests" 
          :key="request._id"
          class="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden"
        >
          <div class="p-6">
            <!-- Layout responsive: móvil (columna) y desktop (fila) -->
            <div class="flex flex-col lg:flex-row lg:items-start lg:justify-between">
              <div class="flex-1">
                <!-- Layout móvil: imagen arriba, info abajo -->
                <div class="flex flex-col sm:flex-row sm:items-center space-y-4 sm:space-y-0 sm:space-x-4">
                  <!-- Imagen del artículo -->
                  <div class="flex-shrink-0 mx-auto sm:mx-0">
                    <img 
                      v-if="request.fotos && request.fotos.length > 0"
                      :src="request.fotos[0]" 
                      :alt="request.nombre"
                      class="h-24 w-24 sm:h-20 sm:w-20 rounded-lg object-cover mx-auto sm:mx-0"
                    >
                    <div v-else class="h-24 w-24 sm:h-20 sm:w-20 rounded-lg bg-gray-200 dark:bg-gray-700 flex items-center justify-center mx-auto sm:mx-0">
                      <svg class="h-8 w-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                      </svg>
                    </div>
                  </div>

                  <!-- Información del artículo -->
                  <div class="flex-1 min-w-0 text-center sm:text-left">
                    <h3 class="text-lg font-semibold text-gray-900 dark:text-white">
                      {{ request.nombre }}
                    </h3>
                    <p class="text-sm text-gray-600 dark:text-gray-400 mt-1">
                      {{ request.descripcion }}
                    </p>
                    <div class="mt-2 flex flex-col sm:flex-row sm:flex-wrap gap-2 sm:gap-4 text-sm text-gray-500 dark:text-gray-400">
                      <span><strong>Categoría:</strong> {{ request.categoria }}</span>
                      <span><strong>Estado:</strong> {{ request.condicion }}</span>
                      <span><strong>Precio sugerido:</strong> €{{ request.precio_propuesto_vendedor }}</span>
                    </div>
                  </div>
                </div>

                <!-- Estado y modo de venta -->
                <div class="mt-4 flex flex-wrap gap-2">
                  <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium"
                        :class="getStatusBadgeClass(request.estado_articulo)">
                    {{ getStatusText(request.estado_articulo) }}
                  </span>
                  <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                    {{ getSaleModeText(request.modo_venta) }}
                  </span>
                </div>

                <!-- Información de la oferta del administrador -->
                <div v-if="request.adminDecision && !request.adminDecision.reject" class="mt-4 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                  <h4 class="text-sm font-medium text-gray-900 dark:text-white mb-3 text-center sm:text-left">
                    Decisión del Administrador
                  </h4>
                  <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <!-- Oferta de dinero -->
                    <div v-if="request.adminDecision.money" class="flex flex-col sm:flex-row sm:items-center sm:justify-between p-3 bg-green-50 dark:bg-green-900/20 rounded-lg space-y-2 sm:space-y-0">
                      <div class="flex items-center justify-center sm:justify-start">
                        <svg class="w-5 h-5 text-green-600 dark:text-green-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1"></path>
                        </svg>
                        <span class="text-sm font-medium text-gray-900 dark:text-white">Compra con dinero</span>
                      </div>
                      <span class="text-lg font-bold text-green-600 dark:text-green-400 text-center sm:text-right">
                        €{{ request.adminDecision.moneyPrice }}
                      </span>
                    </div>

                    <!-- Oferta de puntos -->
                    <div v-if="request.adminDecision.points" class="flex flex-col sm:flex-row sm:items-center sm:justify-between p-3 bg-purple-50 dark:bg-purple-900/20 rounded-lg space-y-2 sm:space-y-0">
                      <div class="flex items-center justify-center sm:justify-start">
                        <svg class="w-5 h-5 text-purple-600 dark:text-purple-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"></path>
                        </svg>
                        <span class="text-sm font-medium text-gray-900 dark:text-white">Compra con puntos</span>
                      </div>
                      <span class="text-lg font-bold text-purple-600 dark:text-purple-400 text-center sm:text-right">
                        {{ request.adminDecision.pointsAmount }} puntos
                      </span>
                    </div>
                  </div>
                  <p class="text-xs text-gray-500 dark:text-gray-400 mt-3 text-center sm:text-left">
                    Fecha de decisión: {{ formatDate(request.adminDecision.date) }}
                  </p>
                </div>

                <!-- Mensaje de rechazo -->
                <div v-if="request.adminDecision && request.adminDecision.reject" class="mt-4 p-4 bg-red-50 dark:bg-red-900/20 rounded-lg">
                  <h4 class="text-sm font-medium text-red-900 dark:text-red-200 mb-2">
                    Oferta Rechazada
                  </h4>
                  <p class="text-sm text-red-700 dark:text-red-300">
                    {{ request.adminDecision.rejectReason || 'No se proporcionó razón específica.' }}
                  </p>
                </div>
              </div>


              <!-- Botones de acción -->
              <div v-if="canShowActions(request)" class="mt-6 lg:mt-0 lg:ml-6 flex flex-col space-y-3">
                <!-- Para venta directa (1c) y venta por puntos (1d) -->
                <div v-if="isDirectSaleOrPoints(request)" class="space-y-3">
                  <button 
                    v-if="request.adminDecision && request.adminDecision.money && request.adminDecision.points"
                    @click="openSelectionModal(request)"
                    class="w-full inline-flex items-center justify-center px-4 py-3 sm:px-6 border border-transparent text-sm font-medium rounded-lg text-white bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                  >
                    <svg class="w-4 h-4 sm:w-5 sm:h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                    </svg>
                    <span class="hidden sm:inline">Elegir Opción de Compra</span>
                    <span class="sm:hidden">Elegir Opción</span>
                  </button>
                  <button 
                    v-else-if="request.adminDecision && request.adminDecision.money"
                    @click="acceptOffer(request, 'money')"
                    class="w-full inline-flex items-center justify-center px-4 py-3 sm:px-6 border border-transparent text-sm font-medium rounded-lg text-white bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                  >
                    <svg class="w-4 h-4 sm:w-5 sm:h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1"></path>
                    </svg>
                    <span class="hidden sm:inline">Aceptar Dinero (€{{ request.adminDecision.moneyPrice }})</span>
                    <span class="sm:hidden">Dinero (€{{ request.adminDecision.moneyPrice }})</span>
                  </button>
                  <button 
                    v-else-if="request.adminDecision && request.adminDecision.points"
                    @click="acceptOffer(request, 'points')"
                    class="w-full inline-flex items-center justify-center px-4 py-3 sm:px-6 border border-transparent text-sm font-medium rounded-lg text-white bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                  >
                    <svg class="w-4 h-4 sm:w-5 sm:h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"></path>
                    </svg>
                    <span class="hidden sm:inline">Aceptar Puntos ({{ request.adminDecision.pointsAmount }})</span>
                    <span class="sm:hidden">Puntos ({{ request.adminDecision.pointsAmount }})</span>
                  </button>
                  <button 
                    @click="rejectOffer(request)"
                    class="w-full inline-flex items-center justify-center px-4 py-3 sm:px-6 border border-gray-300 dark:border-gray-600 text-sm font-medium rounded-lg text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-all duration-200 shadow-md hover:shadow-lg"
                  >
                    <svg class="w-4 h-4 sm:w-5 sm:h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
                    </svg>
                    <span class="hidden sm:inline">Rechazar Oferta</span>
                    <span class="sm:hidden">Rechazar</span>
                  </button>
                </div>

                <!-- Para venta desde casa (1a) y centro logístico (1b) -->
                <div v-else class="text-center">
                  <p class="text-sm text-gray-500 dark:text-gray-400">
                    {{ getActionMessage(request) }}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Modal de selección de opción -->
    <div v-if="showSelectionModal" class="fixed inset-0 z-50 overflow-y-auto">
      <div class="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
        <div class="fixed inset-0 transition-opacity bg-gray-900 bg-opacity-50 backdrop-blur-sm" @click="closeSelectionModal"></div>
        
        <div class="inline-block w-full max-w-lg p-8 my-8 overflow-hidden text-left align-middle transition-all transform bg-white dark:bg-gray-800 shadow-2xl rounded-3xl border border-gray-200 dark:border-gray-700">
          <div class="flex items-center justify-between mb-6">
            <div>
              <h3 class="text-2xl font-bold text-gray-900 dark:text-white">
                Selecciona tu opción de compra
              </h3>
              <p class="mt-1 text-sm text-gray-600 dark:text-gray-400">
                El administrador ha ofrecido las siguientes opciones para tu artículo
              </p>
            </div>
            <button
              type="button"
              class="text-gray-400 hover:text-gray-500 dark:text-gray-500 dark:hover:text-gray-400 transition-colors"
              @click="closeSelectionModal"
            >
              <span class="sr-only">Cerrar</span>
              <svg class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <div class="space-y-6">
            <!-- Opción de dinero -->
            <div class="border-2 border-gray-200 dark:border-gray-600 rounded-xl p-6 hover:border-green-500 dark:hover:border-green-400 transition-all duration-200 cursor-pointer transform hover:scale-105 hover:shadow-lg" 
                 :class="{ 'border-green-500 dark:border-green-400 bg-green-50 dark:bg-green-900/20 shadow-lg scale-105': selectedOption === 'money' }"
                 @click="selectOption('money')">
              <div class="flex items-center justify-between">
                <div class="flex items-center space-x-4">
                  <div class="w-6 h-6 rounded-full border-2 flex items-center justify-center"
                       :class="selectedOption === 'money' ? 'border-green-500 bg-green-500' : 'border-gray-300 dark:border-gray-600'">
                    <div v-if="selectedOption === 'money'" class="w-3 h-3 rounded-full bg-white"></div>
                  </div>
                  <div class="flex items-center space-x-3">
                    <div class="p-2 bg-green-100 dark:bg-green-900/20 rounded-lg">
                      <svg class="w-6 h-6 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1"></path>
                      </svg>
                    </div>
                    <div>
                      <h4 class="text-lg font-semibold text-gray-900 dark:text-white">Dinero</h4>
                      <p class="text-sm text-gray-600 dark:text-gray-400">Transferencia bancaria directa</p>
                    </div>
                  </div>
                </div>
                <div class="text-right">
                  <span class="text-2xl font-bold text-green-600 dark:text-green-400">
                    {{ selectedRequest?.adminDecision?.moneyPrice }}€
                  </span>
                  <p class="text-xs text-gray-500 dark:text-gray-400">Se transferirá a tu cuenta</p>
                </div>
              </div>
            </div>

            <!-- Opción de puntos -->
            <div class="border-2 border-gray-200 dark:border-gray-600 rounded-xl p-6 hover:border-purple-500 dark:hover:border-purple-400 transition-all duration-200 cursor-pointer transform hover:scale-105 hover:shadow-lg"
                 :class="{ 'border-purple-500 dark:border-purple-400 bg-purple-50 dark:bg-purple-900/20 shadow-lg scale-105': selectedOption === 'points' }"
                 @click="selectOption('points')">
              <div class="flex items-center justify-between">
                <div class="flex items-center space-x-4">
                  <div class="w-6 h-6 rounded-full border-2 flex items-center justify-center"
                       :class="selectedOption === 'points' ? 'border-purple-500 bg-purple-500' : 'border-gray-300 dark:border-gray-600'">
                    <div v-if="selectedOption === 'points'" class="w-3 h-3 rounded-full bg-white"></div>
                  </div>
                  <div class="flex items-center space-x-3">
                    <div class="p-2 bg-purple-100 dark:bg-purple-900/20 rounded-lg">
                      <svg class="w-6 h-6 text-purple-600 dark:text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"></path>
                      </svg>
                    </div>
                    <div>
                      <h4 class="text-lg font-semibold text-gray-900 dark:text-white">Puntos Trastalia</h4>
                      <p class="text-sm text-gray-600 dark:text-gray-400">Para comprar otros artículos</p>
                    </div>
                  </div>
                </div>
                <div class="text-right">
                  <span class="text-2xl font-bold text-purple-600 dark:text-purple-400">
                    {{ selectedRequest?.adminDecision?.pointsAmount }}
                  </span>
                  <p class="text-xs text-gray-500 dark:text-gray-400">puntos</p>
                </div>
              </div>
            </div>
          </div>

          <div class="mt-8 flex justify-end space-x-4">
            <button
              type="button"
              class="px-6 py-3 text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-lg transition-colors duration-200"
              @click="closeSelectionModal"
            >
              Cancelar
            </button>
            <button
              type="button"
              class="px-8 py-3 text-sm font-medium text-white bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 rounded-lg transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
              :disabled="!selectedOption"
              @click="confirmSelection"
            >
              <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
              </svg>
              Confirmar Selección
            </button>
          </div>
        </div>
      </div>
    </div>

  </AdminLayout>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { useToast } from '@/composables/useToast'
import AdminLayout from '@/components/layout/AdminLayout.vue'
import OfferSelectionModal from '@/components/modals/OfferSelectionModal.vue'

const authStore = useAuthStore()
const toast = useToast()

// Estado reactivo
const loading = ref(false)
const requests = ref([])
const selectedFilter = ref('all')
const showSelectionModal = ref(false)
const selectedRequest = ref(null)
const selectedOption = ref('')

// Computed
const filteredRequests = computed(() => {
  if (selectedFilter.value === 'all') return requests.value
  
  return requests.value.filter(request => {
    switch (selectedFilter.value) {
      case 'pending':
        return request.estado_articulo === 'OFERTA_COMPRA_ENVIADA' && 
               !request.sellerAccepted && 
               !request.sellerRejected
      case 'accepted':
        return request.sellerAccepted
      case 'rejected':
        return request.sellerRejected || (request.adminDecision && request.adminDecision.reject)
      default:
        return true
    }
  })
})

const pendingCount = computed(() => 
  requests.value.filter(r => r.estado_articulo === 'OFERTA_COMPRA_ENVIADA' && !r.sellerAccepted && !r.sellerRejected).length
)

const acceptedCount = computed(() => 
  requests.value.filter(r => r.sellerAccepted).length
)

const rejectedCount = computed(() => 
  requests.value.filter(r => r.sellerRejected || (r.adminDecision && r.adminDecision.reject)).length
)

// Métodos
const loadRequests = async () => {
  loading.value = true
  try {
    const response = await fetch('/api/articles/my-purchase-requests', {
      headers: {
        'Authorization': `Bearer ${authStore.token}`
      }
    })
    
    if (response.ok) {
      const data = await response.json()
      requests.value = data.data
    } else {
      console.error('Error cargando solicitudes:', response.status, response.statusText)
    }
  } catch (error) {
    console.error('Error cargando solicitudes:', error)
  } finally {
    loading.value = false
  }
}

const filterRequests = () => {
  // El computed filteredRequests se actualiza automáticamente
}

const getStatusBadgeClass = (status: string) => {
  const classes = {
    'DRAFT': 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200',
    'EN_VENTA': 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
    'EN_LOGISTICA': 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
    'PENDIENTE_APROBACION_ADMIN': 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200',
    'OFERTA_COMPRA_ENVIADA': 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200',
    'COMPRADO_POR_ADMIN': 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
    'EN_GALERIA_APTOS': 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-200',
    'VENDIDO': 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-200',
    'RECHAZADO': 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
  }
  return classes[status] || classes['DRAFT']
}

const getStatusText = (status: string) => {
  const texts = {
    'DRAFT': 'Borrador',
    'EN_VENTA': 'En Venta',
    'EN_LOGISTICA': 'En Logística',
    'PENDIENTE_APROBACION_ADMIN': 'Pendiente Admin',
    'OFERTA_COMPRA_ENVIADA': 'Oferta Enviada',
    'COMPRADO_POR_ADMIN': 'Comprado por Admin',
    'EN_GALERIA_APTOS': 'En Galería',
    'VENDIDO': 'Vendido',
    'RECHAZADO': 'Rechazado'
  }
  return texts[status] || status
}

const getSaleModeText = (mode: string) => {
  const texts = {
    'directa_casa': 'Venta desde Casa',
    'centro_logistico': 'Centro Logístico',
    'venta_directa': 'Venta Directa',
    'intercambio_puntos': 'Intercambio por Puntos'
  }
  return texts[mode] || mode
}

const isDirectSaleOrPoints = (request: any) => {
  // Verificar si tiene opciones de compra directa o intercambio por puntos
  const hasLogisticsOptions = request.opciones_logisticas && 
    (request.opciones_logisticas.includes('compra_directa') || 
     request.opciones_logisticas.includes('intercambio_puntos'))
  
  const isDirectMode = request.modo_venta === 'venta_directa' || 
    request.modo_venta === 'intercambio_puntos'
  
  return hasLogisticsOptions || isDirectMode
}


const canShowActions = (request: any) => {
  // Mostrar acciones si tiene opciones de compra directa o intercambio por puntos
  // y hay una decisión del administrador
  return isDirectSaleOrPoints(request) && 
         request.adminDecision && 
         !request.adminDecision.reject &&
         !request.sellerAccepted && 
         !request.sellerRejected
}

const getActionMessage = (request: any) => {
  if (request.modo_venta === 'directa_casa') {
    return 'El artículo será enviado por correo al comprador'
  } else if (request.modo_venta === 'centro_logistico') {
    return 'El artículo está disponible en el centro logístico'
  }
  return 'Esperando decisión del administrador'
}

const openSelectionModal = (request: any) => {
  selectedRequest.value = request
  selectedOption.value = ''
  showSelectionModal.value = true
}

const closeSelectionModal = () => {
  showSelectionModal.value = false
  selectedRequest.value = null
  selectedOption.value = ''
}

const selectOption = (option: string) => {
  selectedOption.value = option
}

const confirmSelection = () => {
  if (!selectedOption.value) {
    toast.warning(
      'Selección requerida',
      'Debes seleccionar una opción de compra (dinero o puntos) antes de continuar.',
      { duration: 4000 }
    )
    return
  }
  
  if (selectedOption.value && selectedRequest.value) {
    acceptOffer(selectedRequest.value, selectedOption.value)
    closeSelectionModal()
  }
}

const acceptOffer = async (request: any, option: string) => {
  try {
    // Mostrar toast de confirmación
    const optionText = option === 'money' ? 
      `€${request.adminDecision.moneyPrice}` : 
      `${request.adminDecision.pointsAmount} puntos`
    
    toast.info(
      'Procesando oferta...',
      `Aceptando la oferta de ${optionText} para "${request.nombre}".`,
      { duration: 3000 }
    )

    const response = await fetch('/api/articles/accept-offer', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${authStore.token}`
      },
      body: JSON.stringify({
        articleId: request._id,
        selectedOption: option
      })
    })

    if (response.ok) {
      const result = await response.json()
      
      // Mostrar toast de éxito
      if (option === 'money') {
        toast.success(
          '¡Oferta aceptada!',
          `Se transferirán €${request.adminDecision.moneyPrice} a tu cuenta bancaria. El artículo "${request.nombre}" ahora es propiedad de Trastalia.`,
          { duration: 6000 }
        )
      } else {
        toast.success(
          '¡Oferta aceptada!',
          `Se han acreditado ${request.adminDecision.pointsAmount} puntos a tu billetera. El artículo "${request.nombre}" ahora es propiedad de Trastalia.`,
          { duration: 6000 }
        )
      }
      
      await loadRequests()
    } else {
      const error = await response.json()
      toast.error(
        'Error al aceptar oferta',
        error.message || 'No se pudo procesar la solicitud. Inténtalo de nuevo.',
        { duration: 5000 }
      )
    }
  } catch (error) {
    console.error('Error aceptando oferta:', error)
    toast.error(
      'Error de conexión',
      'No se pudo conectar con el servidor. Verifica tu conexión e inténtalo de nuevo.',
      { duration: 5000 }
    )
  }
}

const rejectOffer = async (request: any) => {
  // Mostrar toast de información sobre el rechazo
  toast.info(
    'Rechazando oferta...',
    `Se está rechazando la oferta para "${request.nombre}".`,
    { duration: 3000 }
  )

  try {
    const response = await fetch('/api/articles/reject-offer', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${authStore.token}`
      },
      body: JSON.stringify({
        articleId: request._id,
        reason: 'Rechazado por el vendedor'
      })
    })

    if (response.ok) {
      toast.success(
        'Oferta rechazada',
        `Has rechazado la oferta para "${request.nombre}". El artículo volverá a estar disponible para nuevas ofertas.`,
        { duration: 5000 }
      )
      await loadRequests()
    } else {
      const error = await response.json()
      toast.error(
        'Error al rechazar oferta',
        error.message || 'No se pudo procesar el rechazo. Inténtalo de nuevo.',
        { duration: 5000 }
      )
    }
  } catch (error) {
    console.error('Error rechazando oferta:', error)
    toast.error(
      'Error de conexión',
      'No se pudo conectar con el servidor. Verifica tu conexión e inténtalo de nuevo.',
      { duration: 5000 }
    )
  }
}

const formatDate = (dateString: string) => {
  const options = { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' }
  return new Date(dateString).toLocaleDateString('es-ES', options)
}

onMounted(() => {
  loadRequests()
})
</script>
