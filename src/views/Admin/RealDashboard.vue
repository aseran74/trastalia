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
              {{ isAdmin ? 'Dashboard de Administración' : 'Mi Panel de Usuario' }}
            </h2>
            <div v-if="isAdmin" class="flex items-center space-x-2">
              <button 
                @click="loadStats"
                class="flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-white hover:bg-opacity-90"
              >
                <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                Actualizar
              </button>
            </div>
          </div>

          <!-- Loading State -->
          <div v-if="loading" class="flex items-center justify-center py-12">
            <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          </div>

          <!-- Error State -->
          <div v-else-if="error" class="rounded-lg bg-red-50 p-6 text-center dark:bg-red-900/20">
            <p class="text-red-600 dark:text-red-400">{{ error }}</p>
            <button 
              @click="loadStats"
              class="mt-4 rounded-lg bg-red-600 px-4 py-2 text-white hover:bg-red-700"
            >
              Reintentar
            </button>
          </div>

          <!-- Dashboard Content para Admin -->
          <div v-else-if="stats && isAdmin" class="space-y-6">
            <!-- Estadísticas principales -->
            <div class="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
              <!-- Total de Artículos -->
              <div class="rounded-lg border border-stroke bg-white p-6 shadow-default dark:border-strokedark dark:bg-boxdark">
                <div class="flex items-center justify-between">
                  <div>
                    <p class="text-sm font-medium text-gray-600 dark:text-gray-400">Total Artículos</p>
                    <p class="text-2xl font-bold text-black dark:text-white">{{ stats.articles.total }}</p>
                  </div>
                  <div class="rounded-full bg-blue-100 p-3 dark:bg-blue-900/20">
                    <svg class="h-6 w-6 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                    </svg>
                  </div>
                </div>
              </div>

              <!-- Artículos en Venta -->
              <div class="rounded-lg border border-stroke bg-white p-6 shadow-default dark:border-strokedark dark:bg-boxdark">
                <div class="flex items-center justify-between">
                  <div>
                    <p class="text-sm font-medium text-gray-600 dark:text-gray-400">En Venta</p>
                    <p class="text-2xl font-bold text-black dark:text-white">{{ stats.articles.enVenta }}</p>
                  </div>
                  <div class="rounded-full bg-green-100 p-3 dark:bg-green-900/20">
                    <svg class="h-6 w-6 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                    </svg>
                  </div>
                </div>
              </div>

              <!-- Artículos Canjeados -->
              <div class="rounded-lg border border-stroke bg-white p-6 shadow-default dark:border-strokedark dark:bg-boxdark">
                <div class="flex items-center justify-between">
                  <div>
                    <p class="text-sm font-medium text-gray-600 dark:text-gray-400">Canjeados</p>
                    <p class="text-2xl font-bold text-black dark:text-white">{{ stats.articles.canjeados }}</p>
                  </div>
                  <div class="rounded-full bg-purple-100 p-3 dark:bg-purple-900/20">
                    <svg class="h-6 w-6 text-purple-600 dark:text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                  </div>
                </div>
              </div>

              <!-- Artículos Pendientes -->
              <div class="rounded-lg border border-stroke bg-white p-6 shadow-default dark:border-strokedark dark:bg-boxdark">
                <div class="flex items-center justify-between">
                  <div>
                    <p class="text-sm font-medium text-gray-600 dark:text-gray-400">Pendientes</p>
                    <p class="text-2xl font-bold text-black dark:text-white">{{ stats.articles.pendientes }}</p>
                  </div>
                  <div class="rounded-full bg-yellow-100 p-3 dark:bg-yellow-900/20">
                    <svg class="h-6 w-6 text-yellow-600 dark:text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                </div>
              </div>
            </div>

            <!-- Segunda fila de estadísticas -->
            <div class="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
              <!-- Total de Usuarios -->
              <div class="rounded-lg border border-stroke bg-white p-6 shadow-default dark:border-strokedark dark:bg-boxdark">
                <div class="flex items-center justify-between">
                  <div>
                    <p class="text-sm font-medium text-gray-600 dark:text-gray-400">Total Usuarios</p>
                    <p class="text-2xl font-bold text-black dark:text-white">{{ stats.users.total }}</p>
                  </div>
                  <div class="rounded-full bg-indigo-100 p-3 dark:bg-indigo-900/20">
                    <svg class="h-6 w-6 text-indigo-600 dark:text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
                    </svg>
                  </div>
                </div>
              </div>

              <!-- Usuarios Activos -->
              <div class="rounded-lg border border-stroke bg-white p-6 shadow-default dark:border-strokedark dark:bg-boxdark">
                <div class="flex items-center justify-between">
                  <div>
                    <p class="text-sm font-medium text-gray-600 dark:text-gray-400">Usuarios Activos</p>
                    <p class="text-2xl font-bold text-black dark:text-white">{{ stats.users.active }}</p>
                  </div>
                  <div class="rounded-full bg-emerald-100 p-3 dark:bg-emerald-900/20">
                    <svg class="h-6 w-6 text-emerald-600 dark:text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                </div>
              </div>

              <!-- Administradores -->
              <div class="rounded-lg border border-stroke bg-white p-6 shadow-default dark:border-strokedark dark:bg-boxdark">
                <div class="flex items-center justify-between">
                  <div>
                    <p class="text-sm font-medium text-gray-600 dark:text-gray-400">Administradores</p>
                    <p class="text-2xl font-bold text-black dark:text-white">{{ stats.users.admins }}</p>
                  </div>
                  <div class="rounded-full bg-red-100 p-3 dark:bg-red-900/20">
                    <svg class="h-6 w-6 text-red-600 dark:text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                    </svg>
                  </div>
                </div>
              </div>

              <!-- Total Puntos -->
              <div class="rounded-lg border border-stroke bg-white p-6 shadow-default dark:border-strokedark dark:bg-boxdark">
                <div class="flex items-center justify-between">
                  <div>
                    <p class="text-sm font-medium text-gray-600 dark:text-gray-400">Total Puntos</p>
                    <p class="text-2xl font-bold text-black dark:text-white">{{ formatNumber(stats.points.total) }}</p>
                  </div>
                  <div class="rounded-full bg-orange-100 p-3 dark:bg-orange-900/20">
                    <svg class="h-6 w-6 text-orange-600 dark:text-orange-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                    </svg>
                  </div>
                </div>
              </div>
            </div>

            <!-- Transacciones del mes -->
            <div v-if="stats.transactions.monthly.length > 0" class="rounded-lg border border-stroke bg-white p-6 shadow-default dark:border-strokedark dark:bg-boxdark">
              <h3 class="mb-4 text-lg font-semibold text-black dark:text-white">Transacciones del Mes</h3>
              <div class="space-y-3">
                <div v-for="transaction in stats.transactions.monthly" :key="`${transaction._id.year}-${transaction._id.month}`" 
                     class="flex items-center justify-between rounded-lg bg-gray-50 p-4 dark:bg-gray-800">
                  <div>
                    <p class="font-medium text-black dark:text-white">
                      {{ getMonthName(transaction._id.month) }} {{ transaction._id.year }}
                    </p>
                    <p class="text-sm text-gray-600 dark:text-gray-400">{{ transaction.count }} transacciones</p>
                  </div>
                  <div class="text-right">
                    <p class="text-lg font-bold text-green-600 dark:text-green-400">
                      {{ formatNumber(transaction.totalValue) }}€
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <!-- Categorías populares -->
            <div v-if="stats.categories.popular.length > 0" class="rounded-lg border border-stroke bg-white p-6 shadow-default dark:border-strokedark dark:bg-boxdark">
              <h3 class="mb-4 text-lg font-semibold text-black dark:text-white">Categorías Populares</h3>
              <div class="space-y-3">
                <div v-for="category in stats.categories.popular" :key="category._id" 
                     class="flex items-center justify-between rounded-lg bg-gray-50 p-4 dark:bg-gray-800">
                  <div>
                    <p class="font-medium text-black dark:text-white capitalize">{{ category._id }}</p>
                  </div>
                  <div class="text-right">
                    <p class="text-lg font-bold text-blue-600 dark:text-blue-400">{{ category.count }} artículos</p>
                  </div>
                </div>
              </div>
            </div>

            <!-- Top usuarios con puntos -->
            <div v-if="stats.points.topUsers.length > 0" class="rounded-lg border border-stroke bg-white p-6 shadow-default dark:border-strokedark dark:bg-boxdark">
              <h3 class="mb-4 text-lg font-semibold text-black dark:text-white">Top Usuarios por Puntos</h3>
              <div class="overflow-x-auto">
                <table class="w-full">
                  <thead>
                    <tr class="border-b border-stroke dark:border-strokedark">
                      <th class="text-left py-3 px-4 font-medium text-black dark:text-white">Usuario</th>
                      <th class="text-left py-3 px-4 font-medium text-black dark:text-white">Email</th>
                      <th class="text-right py-3 px-4 font-medium text-black dark:text-white">Puntos</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-for="user in stats.points.topUsers" :key="user._id" class="border-b border-stroke dark:border-strokedark">
                      <td class="py-3 px-4 text-black dark:text-white">{{ user.name }}</td>
                      <td class="py-3 px-4 text-gray-600 dark:text-gray-400">{{ user.email }}</td>
                      <td class="py-3 px-4 text-right font-bold text-orange-600 dark:text-orange-400">{{ formatNumber(user.points) }}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          <!-- Dashboard Content para Usuarios Normales -->
          <div v-else-if="!isAdmin" class="space-y-8">
            <!-- Mensaje de bienvenida mejorado -->
            <div class="relative overflow-hidden rounded-3xl bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 p-8 shadow-2xl">
              <!-- Elementos decorativos de fondo -->
              <div class="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -translate-y-32 translate-x-32"></div>
              <div class="absolute bottom-0 left-0 w-48 h-48 bg-white/10 rounded-full translate-y-24 -translate-x-24"></div>
              <div class="absolute top-1/2 left-1/2 w-32 h-32 bg-white/5 rounded-full -translate-x-1/2 -translate-y-1/2"></div>
              
              <!-- Contenido principal -->
              <div class="relative z-10 text-center">
                <div class="mx-auto mb-6 h-20 w-20 rounded-full bg-gradient-to-r from-white/20 to-white/30 backdrop-blur-sm flex items-center justify-center shadow-xl">
                  <svg class="h-10 w-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
                  </svg>
                </div>
                <h3 class="text-4xl font-black text-white mb-3">¡Bienvenido a Trastalia!</h3>
                <p class="text-xl text-white/90 mb-6 max-w-2xl mx-auto">Tu plataforma para vender y comprar artículos de segunda mano</p>
                
                <!-- Indicadores de estado -->
                <div class="flex items-center justify-center space-x-6 text-white/80">
                  <div class="flex items-center space-x-2">
                    <div class="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                    <span class="text-sm font-medium">Plataforma activa</span>
                  </div>
                  <div class="flex items-center space-x-2">
                    <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z"></path>
                      <path fill-rule="evenodd" d="M4 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v11a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm3 4a1 1 0 000 2h.01a1 1 0 100-2H7zm3 0a1 1 0 000 2h3a1 1 0 100-2h-3zm-3 4a1 1 0 100 2h.01a1 1 0 100-2H7zm3 0a1 1 0 100 2h3a1 1 0 100-2h-3z" clip-rule="evenodd"></path>
                    </svg>
                    <span class="text-sm font-medium">+1000 artículos</span>
                  </div>
                </div>
              </div>
            </div>

            <!-- Acciones rápidas mejoradas -->
            <div class="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
              <!-- Vender Artículo -->
              <div class="group relative overflow-hidden rounded-2xl border border-green-200/50 bg-white p-8 shadow-lg hover:shadow-2xl dark:border-green-800/30 dark:bg-boxdark transition-all duration-300 hover:scale-[1.02]">
                <!-- Fondo con gradiente al hover -->
                <div class="absolute inset-0 bg-gradient-to-br from-green-500/0 to-emerald-500/0 group-hover:from-green-500/5 group-hover:to-emerald-500/5 transition-all duration-300"></div>
                
                <div class="relative z-10">
                  <div class="flex items-center mb-6">
                    <div class="h-14 w-14 rounded-xl bg-gradient-to-r from-green-500 to-emerald-500 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                      <svg class="h-7 w-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
                      </svg>
                    </div>
                    <div class="ml-4">
                      <h3 class="text-xl font-bold text-black dark:text-white">Vender</h3>
                      <p class="text-sm text-gray-500 dark:text-gray-400">Sube tu artículo</p>
                    </div>
                  </div>
                  <p class="text-gray-600 dark:text-gray-400 mb-6 leading-relaxed">Sube tu artículo y recibe una oferta de Trastalia al instante</p>
                  <router-link 
                    to="/vender-articulo" 
                    class="inline-flex items-center justify-center w-full px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-500 text-white font-semibold rounded-xl hover:from-green-600 hover:to-emerald-600 transition-all duration-300 shadow-md hover:shadow-lg"
                  >
                    Crear artículo
                    <svg class="ml-2 h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7l5 5m0 0l-5 5m5-5H6"></path>
                    </svg>
                  </router-link>
                </div>
              </div>

              <!-- Comprar Artículos -->
              <div class="group relative overflow-hidden rounded-2xl border border-blue-200/50 bg-white p-8 shadow-lg hover:shadow-2xl dark:border-blue-800/30 dark:bg-boxdark transition-all duration-300 hover:scale-[1.02]">
                <!-- Fondo con gradiente al hover -->
                <div class="absolute inset-0 bg-gradient-to-br from-blue-500/0 to-cyan-500/0 group-hover:from-blue-500/5 group-hover:to-cyan-500/5 transition-all duration-300"></div>
                
                <div class="relative z-10">
                  <div class="flex items-center mb-6">
                    <div class="h-14 w-14 rounded-xl bg-gradient-to-r from-blue-500 to-cyan-500 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                      <svg class="h-7 w-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"></path>
                      </svg>
                    </div>
                    <div class="ml-4">
                      <h3 class="text-xl font-bold text-black dark:text-white">Comprar</h3>
                      <p class="text-sm text-gray-500 dark:text-gray-400">Artículos disponibles</p>
                    </div>
                  </div>
                  <p class="text-gray-600 dark:text-gray-400 mb-6 leading-relaxed">Explora artículos disponibles para compra con dinero o puntos</p>
                  <router-link 
                    to="/comprar-articulos" 
                    class="inline-flex items-center justify-center w-full px-6 py-3 bg-gradient-to-r from-blue-500 to-cyan-500 text-white font-semibold rounded-xl hover:from-blue-600 hover:to-cyan-600 transition-all duration-300 shadow-md hover:shadow-lg"
                  >
                    Ver artículos
                    <svg class="ml-2 h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7l5 5m0 0l-5 5m5-5H6"></path>
                    </svg>
                  </router-link>
                </div>
              </div>

              <!-- Mis Solicitudes -->
              <div class="group relative overflow-hidden rounded-2xl border border-purple-200/50 bg-white p-8 shadow-lg hover:shadow-2xl dark:border-purple-800/30 dark:bg-boxdark transition-all duration-300 hover:scale-[1.02]">
                <!-- Fondo con gradiente al hover -->
                <div class="absolute inset-0 bg-gradient-to-br from-purple-500/0 to-pink-500/0 group-hover:from-purple-500/5 group-hover:to-pink-500/5 transition-all duration-300"></div>
                
                <div class="relative z-10">
                  <div class="flex items-center mb-6">
                    <div class="h-14 w-14 rounded-xl bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                      <svg class="h-7 w-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"></path>
                      </svg>
                    </div>
                    <div class="ml-4">
                      <h3 class="text-xl font-bold text-black dark:text-white">Mis Solicitudes</h3>
                      <p class="text-sm text-gray-500 dark:text-gray-400">Gestiona compras</p>
                    </div>
                  </div>
                  <p class="text-gray-600 dark:text-gray-400 mb-6 leading-relaxed">Gestiona y revisa el estado de tus solicitudes de compra</p>
                  <router-link 
                    to="/mis-solicitudes-compra" 
                    class="inline-flex items-center justify-center w-full px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white font-semibold rounded-xl hover:from-purple-600 hover:to-pink-600 transition-all duration-300 shadow-md hover:shadow-lg"
                  >
                    Ver solicitudes
                    <svg class="ml-2 h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7l5 5m0 0l-5 5m5-5H6"></path>
                    </svg>
                  </router-link>
                </div>
              </div>
            </div>

            <!-- Información adicional mejorada -->
            <div class="relative overflow-hidden rounded-2xl border border-gray-200/50 bg-white p-8 shadow-lg dark:border-gray-700/30 dark:bg-boxdark">
              <!-- Elemento decorativo de fondo -->
              <div class="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-blue-500/5 to-purple-500/5 rounded-full -translate-y-32 translate-x-32"></div>
              
              <div class="relative z-10">
                <h3 class="text-2xl font-bold text-black dark:text-white mb-8 text-center">¿Cómo funciona Trastalia?</h3>
                <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
                  <div class="group text-center hover:scale-105 transition-transform duration-300">
                    <div class="mx-auto mb-4 h-16 w-16 rounded-full bg-gradient-to-r from-orange-400 to-orange-500 flex items-center justify-center shadow-lg group-hover:shadow-xl transition-shadow">
                      <span class="text-2xl font-black text-white">1</span>
                    </div>
                    <h4 class="font-bold text-lg text-black dark:text-white mb-3">Sube tu artículo</h4>
                    <p class="text-base text-gray-600 dark:text-gray-400 leading-relaxed">Describe y fotografía tu artículo en minutos</p>
                  </div>
                  <div class="group text-center hover:scale-105 transition-transform duration-300">
                    <div class="mx-auto mb-4 h-16 w-16 rounded-full bg-gradient-to-r from-blue-400 to-blue-500 flex items-center justify-center shadow-lg group-hover:shadow-xl transition-shadow">
                      <span class="text-2xl font-black text-white">2</span>
                    </div>
                    <h4 class="font-bold text-lg text-black dark:text-white mb-3">Recibe una oferta</h4>
                    <p class="text-base text-gray-600 dark:text-gray-400 leading-relaxed">Trastalia te hace una oferta justa al instante</p>
                  </div>
                  <div class="group text-center hover:scale-105 transition-transform duration-300">
                    <div class="mx-auto mb-4 h-16 w-16 rounded-full bg-gradient-to-r from-green-400 to-green-500 flex items-center justify-center shadow-lg group-hover:shadow-xl transition-shadow">
                      <span class="text-2xl font-black text-white">3</span>
                    </div>
                    <h4 class="font-bold text-lg text-black dark:text-white mb-3">Acepta y vende</h4>
                    <p class="text-base text-gray-600 dark:text-gray-400 leading-relaxed">Recibe tu pago en efectivo o puntos para canjear</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { useAuthStore } from '@/stores/auth'
import AppSidebar from '@/components/layout/AppSidebar.vue'
import AppHeader from '@/components/layout/AppHeader.vue'
import Backdrop from '@/components/layout/Backdrop.vue'
import { useSidebar } from '@/composables/useSidebar'
import API_BASE_URL from '@/config/api.js'

const authStore = useAuthStore()
const { isExpanded, isHovered } = useSidebar()
const loading = ref(false)
const error = ref(null)
const stats = ref(null)

// Detectar si el usuario es admin
const isAdmin = computed(() => {
  return authStore.user?.role === 'admin'
})

const loadStats = async () => {
  // Solo cargar estadísticas si el usuario es admin
  if (!isAdmin.value) {
    loading.value = false
    return
  }
  
  loading.value = true
  error.value = null
  
  try {
    const url = `${API_BASE_URL}/api/admin/dashboard-stats`
    console.log('🔍 Cargando estadísticas desde:', url)
    console.log('🔑 Token:', authStore.token ? 'Presente' : 'Ausente')
    
    const response = await fetch(url, {
      headers: {
        'Authorization': `Bearer ${authStore.token}`,
        'Content-Type': 'application/json'
      }
    })
    
    console.log('📊 Respuesta del servidor:', response.status, response.statusText)
    
    if (!response.ok) {
      const errorText = await response.text()
      console.error('❌ Error del servidor:', errorText)
      throw new Error(`Error ${response.status}: ${response.statusText}`)
    }
    
    const data = await response.json()
    console.log('✅ Datos recibidos:', data)
    stats.value = data.data
  } catch (err) {
    error.value = err.message
    console.error('❌ Error cargando estadísticas:', err)
  } finally {
    loading.value = false
  }
}

const formatNumber = (num) => {
  return new Intl.NumberFormat('es-ES').format(num)
}

const getMonthName = (month) => {
  const months = [
    'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
    'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
  ]
  return months[month - 1] || 'Desconocido'
}

onMounted(() => {
  loadStats()
})
</script>