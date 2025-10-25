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
          <div class="mb-8 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 class="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                {{ isAdmin ? 'Dashboard de Administración' : 'Mi Panel de Usuario' }}
              </h2>
              <p class="mt-2 text-gray-600 dark:text-gray-400">
                {{ isAdmin ? 'Gestiona y supervisa toda la plataforma' : 'Bienvenido a tu espacio personal' }}
              </p>
            </div>
            <div v-if="isAdmin" class="flex items-center space-x-3">
              <button 
                @click="loadStats"
                class="group flex items-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 px-6 py-3 text-white shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
              >
                <svg class="h-5 w-5 group-hover:rotate-180 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                <span class="font-medium">Actualizar</span>
              </button>
              <button 
                @click="checkAuthStatus"
                class="group flex items-center gap-2 rounded-xl bg-gray-100 dark:bg-gray-800 px-6 py-3 text-gray-700 dark:text-gray-300 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
              >
                <svg class="h-5 w-5 group-hover:scale-110 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span class="font-medium">Verificar Auth</span>
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
              <div class="group relative overflow-hidden rounded-2xl border border-stroke bg-white p-6 shadow-lg transition-all duration-300 hover:shadow-2xl hover:-translate-y-1 dark:border-strokedark dark:bg-boxdark">
                <div class="absolute inset-0 bg-gradient-to-br from-blue-50 to-indigo-50 opacity-0 transition-opacity duration-300 group-hover:opacity-100 dark:from-blue-900/20 dark:to-indigo-900/20"></div>
                <div class="relative flex items-center justify-between">
                  <div>
                    <p class="text-sm font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wide">Total Artículos</p>
                    <p class="text-3xl font-bold text-black dark:text-white mt-2">{{ stats.articles.total }}</p>
                    <p class="text-xs text-gray-500 dark:text-gray-500 mt-1">En la plataforma</p>
                  </div>
                  <div class="rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 p-4 shadow-lg">
                    <svg class="h-8 w-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                    </svg>
                  </div>
                </div>
              </div>

              <!-- Artículos en Venta -->
              <div class="group relative overflow-hidden rounded-2xl border border-stroke bg-white p-6 shadow-lg transition-all duration-300 hover:shadow-2xl hover:-translate-y-1 dark:border-strokedark dark:bg-boxdark">
                <div class="absolute inset-0 bg-gradient-to-br from-green-50 to-emerald-50 opacity-0 transition-opacity duration-300 group-hover:opacity-100 dark:from-green-900/20 dark:to-emerald-900/20"></div>
                <div class="relative flex items-center justify-between">
                  <div>
                    <p class="text-sm font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wide">En Venta</p>
                    <p class="text-3xl font-bold text-black dark:text-white mt-2">{{ stats.articles.enVenta }}</p>
                    <p class="text-xs text-gray-500 dark:text-gray-500 mt-1">Disponibles</p>
                  </div>
                  <div class="rounded-2xl bg-gradient-to-br from-green-500 to-emerald-600 p-4 shadow-lg">
                    <svg class="h-8 w-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                    </svg>
                  </div>
                </div>
              </div>

              <!-- Artículos Canjeados -->
              <div class="group relative overflow-hidden rounded-2xl border border-stroke bg-white p-6 shadow-lg transition-all duration-300 hover:shadow-2xl hover:-translate-y-1 dark:border-strokedark dark:bg-boxdark">
                <div class="absolute inset-0 bg-gradient-to-br from-purple-50 to-violet-50 opacity-0 transition-opacity duration-300 group-hover:opacity-100 dark:from-purple-900/20 dark:to-violet-900/20"></div>
                <div class="relative flex items-center justify-between">
                  <div>
                    <p class="text-sm font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wide">Canjeados</p>
                    <p class="text-3xl font-bold text-black dark:text-white mt-2">{{ stats.articles.canjeados }}</p>
                    <p class="text-xs text-gray-500 dark:text-gray-500 mt-1">Completados</p>
                  </div>
                  <div class="rounded-2xl bg-gradient-to-br from-purple-500 to-violet-600 p-4 shadow-lg">
                    <svg class="h-8 w-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                  </div>
                </div>
              </div>

              <!-- Artículos Pendientes -->
              <div class="group relative overflow-hidden rounded-2xl border border-stroke bg-white p-6 shadow-lg transition-all duration-300 hover:shadow-2xl hover:-translate-y-1 dark:border-strokedark dark:bg-boxdark">
                <div class="absolute inset-0 bg-gradient-to-br from-yellow-50 to-orange-50 opacity-0 transition-opacity duration-300 group-hover:opacity-100 dark:from-yellow-900/20 dark:to-orange-900/20"></div>
                <div class="relative flex items-center justify-between">
                  <div>
                    <p class="text-sm font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wide">Pendientes</p>
                    <p class="text-3xl font-bold text-black dark:text-white mt-2">{{ stats.articles.pendientes }}</p>
                    <p class="text-xs text-gray-500 dark:text-gray-500 mt-1">En proceso</p>
                  </div>
                  <div class="rounded-2xl bg-gradient-to-br from-yellow-500 to-orange-600 p-4 shadow-lg">
                    <svg class="h-8 w-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                </div>
              </div>
            </div>

            <!-- Segunda fila de estadísticas -->
            <div class="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
              <!-- Total de Usuarios -->
              <div class="group relative overflow-hidden rounded-2xl border border-stroke bg-white p-6 shadow-lg transition-all duration-300 hover:shadow-2xl hover:-translate-y-1 dark:border-strokedark dark:bg-boxdark">
                <div class="absolute inset-0 bg-gradient-to-br from-indigo-50 to-blue-50 opacity-0 transition-opacity duration-300 group-hover:opacity-100 dark:from-indigo-900/20 dark:to-blue-900/20"></div>
                <div class="relative flex items-center justify-between">
                  <div>
                    <p class="text-sm font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wide">Total Usuarios</p>
                    <p class="text-3xl font-bold text-black dark:text-white mt-2">{{ stats.users.total }}</p>
                    <p class="text-xs text-gray-500 dark:text-gray-500 mt-1">Registrados</p>
                  </div>
                  <div class="rounded-2xl bg-gradient-to-br from-indigo-500 to-blue-600 p-4 shadow-lg">
                    <svg class="h-8 w-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
                    </svg>
                  </div>
                </div>
              </div>

              <!-- Usuarios Activos -->
              <div class="group relative overflow-hidden rounded-2xl border border-stroke bg-white p-6 shadow-lg transition-all duration-300 hover:shadow-2xl hover:-translate-y-1 dark:border-strokedark dark:bg-boxdark">
                <div class="absolute inset-0 bg-gradient-to-br from-emerald-50 to-green-50 opacity-0 transition-opacity duration-300 group-hover:opacity-100 dark:from-emerald-900/20 dark:to-green-900/20"></div>
                <div class="relative flex items-center justify-between">
                  <div>
                    <p class="text-sm font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wide">Usuarios Activos</p>
                    <p class="text-3xl font-bold text-black dark:text-white mt-2">{{ stats.users.active }}</p>
                    <p class="text-xs text-gray-500 dark:text-gray-500 mt-1">En línea</p>
                  </div>
                  <div class="rounded-2xl bg-gradient-to-br from-emerald-500 to-green-600 p-4 shadow-lg">
                    <svg class="h-8 w-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                </div>
              </div>

              <!-- Administradores -->
              <div class="group relative overflow-hidden rounded-2xl border border-stroke bg-white p-6 shadow-lg transition-all duration-300 hover:shadow-2xl hover:-translate-y-1 dark:border-strokedark dark:bg-boxdark">
                <div class="absolute inset-0 bg-gradient-to-br from-red-50 to-pink-50 opacity-0 transition-opacity duration-300 group-hover:opacity-100 dark:from-red-900/20 dark:to-pink-900/20"></div>
                <div class="relative flex items-center justify-between">
                  <div>
                    <p class="text-sm font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wide">Administradores</p>
                    <p class="text-3xl font-bold text-black dark:text-white mt-2">{{ stats.users.admins }}</p>
                    <p class="text-xs text-gray-500 dark:text-gray-500 mt-1">Con privilegios</p>
                  </div>
                  <div class="rounded-2xl bg-gradient-to-br from-red-500 to-pink-600 p-4 shadow-lg">
                    <svg class="h-8 w-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                    </svg>
                  </div>
                </div>
              </div>

              <!-- Total Puntos -->
              <div class="group relative overflow-hidden rounded-2xl border border-stroke bg-white p-6 shadow-lg transition-all duration-300 hover:shadow-2xl hover:-translate-y-1 dark:border-strokedark dark:bg-boxdark">
                <div class="absolute inset-0 bg-gradient-to-br from-orange-50 to-yellow-50 opacity-0 transition-opacity duration-300 group-hover:opacity-100 dark:from-orange-900/20 dark:to-yellow-900/20"></div>
                <div class="relative flex items-center justify-between">
                  <div>
                    <p class="text-sm font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wide">Total Puntos</p>
                    <p class="text-3xl font-bold text-black dark:text-white mt-2">{{ formatNumber(stats.points.total) }}</p>
                    <p class="text-xs text-gray-500 dark:text-gray-500 mt-1">Acumulados</p>
                  </div>
                  <div class="rounded-2xl bg-gradient-to-br from-orange-500 to-yellow-600 p-4 shadow-lg">
                    <svg class="h-8 w-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                    </svg>
                  </div>
                </div>
              </div>
            </div>

            <!-- Transacciones del mes -->
            <div v-if="stats.transactions.monthly.length > 0" class="group relative overflow-hidden rounded-2xl border border-stroke bg-white p-8 shadow-lg transition-all duration-300 hover:shadow-2xl dark:border-strokedark dark:bg-boxdark">
              <div class="absolute inset-0 bg-gradient-to-br from-green-50 to-emerald-50 opacity-0 transition-opacity duration-300 group-hover:opacity-100 dark:from-green-900/20 dark:to-emerald-900/20"></div>
              <div class="relative">
                <div class="mb-6 flex items-center gap-3">
                  <div class="rounded-2xl bg-gradient-to-br from-green-500 to-emerald-600 p-3 shadow-lg">
                    <svg class="h-6 w-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                    </svg>
                  </div>
                  <h3 class="text-2xl font-bold text-black dark:text-white">Transacciones del Mes</h3>
                </div>
                <div class="space-y-4">
                  <div v-for="transaction in stats.transactions.monthly" :key="`${transaction._id.year}-${transaction._id.month}`" 
                       class="group/item flex items-center justify-between rounded-xl bg-gradient-to-r from-green-50 to-emerald-50 p-6 transition-all duration-300 hover:shadow-lg hover:scale-105 dark:from-green-900/20 dark:to-emerald-900/20">
                    <div>
                      <p class="text-lg font-bold text-black dark:text-white">
                        {{ getMonthName(transaction._id.month) }} {{ transaction._id.year }}
                      </p>
                      <p class="text-sm text-gray-600 dark:text-gray-400">{{ transaction.count }} transacciones</p>
                    </div>
                    <div class="text-right">
                      <p class="text-2xl font-bold text-green-600 dark:text-green-400">
                        {{ formatNumber(transaction.totalValue) }}€
                      </p>
                      <p class="text-xs text-gray-500 dark:text-gray-500">Valor total</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Categorías populares -->
            <div v-if="stats.categories.popular.length > 0" class="group relative overflow-hidden rounded-2xl border border-stroke bg-white p-8 shadow-lg transition-all duration-300 hover:shadow-2xl dark:border-strokedark dark:bg-boxdark">
              <div class="absolute inset-0 bg-gradient-to-br from-blue-50 to-indigo-50 opacity-0 transition-opacity duration-300 group-hover:opacity-100 dark:from-blue-900/20 dark:to-indigo-900/20"></div>
              <div class="relative">
                <div class="mb-6 flex items-center gap-3">
                  <div class="rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 p-3 shadow-lg">
                    <svg class="h-6 w-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                    </svg>
                  </div>
                  <h3 class="text-2xl font-bold text-black dark:text-white">Categorías Populares</h3>
                </div>
                <div class="space-y-4">
                  <div v-for="category in stats.categories.popular" :key="category._id" 
                       class="group/item flex items-center justify-between rounded-xl bg-gradient-to-r from-blue-50 to-indigo-50 p-6 transition-all duration-300 hover:shadow-lg hover:scale-105 dark:from-blue-900/20 dark:to-indigo-900/20">
                    <div>
                      <p class="text-lg font-bold text-black dark:text-white capitalize">{{ category._id }}</p>
                      <p class="text-sm text-gray-600 dark:text-gray-400">Categoría popular</p>
                    </div>
                    <div class="text-right">
                      <p class="text-2xl font-bold text-blue-600 dark:text-blue-400">{{ category.count }}</p>
                      <p class="text-xs text-gray-500 dark:text-gray-500">artículos</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Top usuarios con puntos -->
            <div v-if="stats.points.topUsers.length > 0" class="group relative overflow-hidden rounded-2xl border border-stroke bg-white p-8 shadow-lg transition-all duration-300 hover:shadow-2xl dark:border-strokedark dark:bg-boxdark">
              <div class="absolute inset-0 bg-gradient-to-br from-orange-50 to-yellow-50 opacity-0 transition-opacity duration-300 group-hover:opacity-100 dark:from-orange-900/20 dark:to-yellow-900/20"></div>
              <div class="relative">
                <div class="mb-6 flex items-center gap-3">
                  <div class="rounded-2xl bg-gradient-to-br from-orange-500 to-yellow-600 p-3 shadow-lg">
                    <svg class="h-6 w-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                    </svg>
                  </div>
                  <h3 class="text-2xl font-bold text-black dark:text-white">Top Usuarios por Puntos</h3>
                </div>
                <div class="overflow-x-auto">
                  <table class="w-full">
                    <thead>
                      <tr class="border-b-2 border-orange-200 dark:border-orange-800">
                        <th class="text-left py-4 px-6 font-bold text-black dark:text-white text-lg">Usuario</th>
                        <th class="text-left py-4 px-6 font-bold text-black dark:text-white text-lg">Email</th>
                        <th class="text-right py-4 px-6 font-bold text-black dark:text-white text-lg">Puntos</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr v-for="(user, index) in stats.points.topUsers" :key="user._id" 
                          class="border-b border-orange-100 dark:border-orange-900/50 transition-all duration-300 hover:bg-orange-50 dark:hover:bg-orange-900/20">
                        <td class="py-4 px-6">
                          <div class="flex items-center gap-3">
                            <div class="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-orange-500 to-yellow-600 text-white font-bold text-lg">
                              {{ index + 1 }}
                            </div>
                            <span class="font-bold text-black dark:text-white text-lg">{{ user.name }}</span>
                          </div>
                        </td>
                        <td class="py-4 px-6 text-gray-600 dark:text-gray-400 text-lg">{{ user.email }}</td>
                        <td class="py-4 px-6 text-right">
                          <span class="text-2xl font-bold text-orange-600 dark:text-orange-400">{{ formatNumber(user.points) }}</span>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>

          <!-- Dashboard Content para Usuarios Normales -->
          <div v-else-if="!isAdmin" class="space-y-8">
            <!-- Mensaje de bienvenida -->
            <div class="group relative overflow-hidden rounded-3xl border border-stroke bg-gradient-to-br from-blue-50 to-purple-50 p-12 shadow-2xl text-center transition-all duration-300 hover:shadow-3xl dark:border-strokedark dark:from-blue-900/20 dark:to-purple-900/20">
              <div class="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-purple-500/10 opacity-0 transition-opacity duration-300 group-hover:opacity-100"></div>
              <div class="relative">
                <div class="mx-auto mb-8 h-24 w-24 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center shadow-2xl">
                  <svg class="h-12 w-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
                  </svg>
                </div>
                <h3 class="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-4">¡Bienvenido a Trastalia!</h3>
                <p class="text-xl text-gray-600 dark:text-gray-400 mb-8">Tu plataforma para vender y comprar artículos de segunda mano</p>
                <div class="flex justify-center">
                  <div class="rounded-full bg-gradient-to-r from-blue-500 to-purple-600 px-8 py-3 text-white font-semibold shadow-lg">
                    ¡Comienza tu experiencia!
                  </div>
                </div>
              </div>
            </div>

            <!-- Acciones rápidas para usuarios -->
            <div class="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
              <!-- Vender Artículo -->
              <div class="group relative overflow-hidden rounded-2xl border border-stroke bg-white p-8 shadow-lg transition-all duration-300 hover:shadow-2xl hover:-translate-y-2 dark:border-strokedark dark:bg-boxdark">
                <div class="absolute inset-0 bg-gradient-to-br from-green-50 to-emerald-50 opacity-0 transition-opacity duration-300 group-hover:opacity-100 dark:from-green-900/20 dark:to-emerald-900/20"></div>
                <div class="relative">
                  <div class="mb-6 flex items-center gap-4">
                    <div class="h-16 w-16 rounded-2xl bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center shadow-lg">
                      <svg class="h-8 w-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
                      </svg>
                    </div>
                    <h3 class="text-2xl font-bold text-black dark:text-white">Vender Artículo</h3>
                  </div>
                  <p class="text-gray-600 dark:text-gray-400 mb-6 text-lg">Sube tu artículo y recibe una oferta de Trastalia</p>
                  <router-link 
                    to="/vender-articulo" 
                    class="group/link inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-green-500 to-emerald-600 px-6 py-3 text-white font-semibold shadow-lg transition-all duration-300 hover:shadow-xl hover:scale-105"
                  >
                    Crear artículo
                    <svg class="h-5 w-5 group-hover/link:translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path>
                    </svg>
                  </router-link>
                </div>
              </div>

              <!-- Comprar Artículos -->
              <div class="group relative overflow-hidden rounded-2xl border border-stroke bg-white p-8 shadow-lg transition-all duration-300 hover:shadow-2xl hover:-translate-y-2 dark:border-strokedark dark:bg-boxdark">
                <div class="absolute inset-0 bg-gradient-to-br from-blue-50 to-indigo-50 opacity-0 transition-opacity duration-300 group-hover:opacity-100 dark:from-blue-900/20 dark:to-indigo-900/20"></div>
                <div class="relative">
                  <div class="mb-6 flex items-center gap-4">
                    <div class="h-16 w-16 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shadow-lg">
                      <svg class="h-8 w-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"></path>
                      </svg>
                    </div>
                    <h3 class="text-2xl font-bold text-black dark:text-white">Comprar Artículos</h3>
                  </div>
                  <p class="text-gray-600 dark:text-gray-400 mb-6 text-lg">Explora artículos disponibles para compra</p>
                  <router-link 
                    to="/comprar-articulos" 
                    class="group/link inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-blue-500 to-indigo-600 px-6 py-3 text-white font-semibold shadow-lg transition-all duration-300 hover:shadow-xl hover:scale-105"
                  >
                    Ver artículos
                    <svg class="h-5 w-5 group-hover/link:translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path>
                    </svg>
                  </router-link>
                </div>
              </div>

              <!-- Mis Solicitudes -->
              <div class="group relative overflow-hidden rounded-2xl border border-stroke bg-white p-8 shadow-lg transition-all duration-300 hover:shadow-2xl hover:-translate-y-2 dark:border-strokedark dark:bg-boxdark">
                <div class="absolute inset-0 bg-gradient-to-br from-purple-50 to-violet-50 opacity-0 transition-opacity duration-300 group-hover:opacity-100 dark:from-purple-900/20 dark:to-violet-900/20"></div>
                <div class="relative">
                  <div class="mb-6 flex items-center gap-4">
                    <div class="h-16 w-16 rounded-2xl bg-gradient-to-br from-purple-500 to-violet-600 flex items-center justify-center shadow-lg">
                      <svg class="h-8 w-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"></path>
                      </svg>
                    </div>
                    <h3 class="text-2xl font-bold text-black dark:text-white">Mis Solicitudes</h3>
                  </div>
                  <p class="text-gray-600 dark:text-gray-400 mb-6 text-lg">Gestiona tus solicitudes de compra</p>
                  <router-link 
                    to="/mis-solicitudes-compra" 
                    class="group/link inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-purple-500 to-violet-600 px-6 py-3 text-white font-semibold shadow-lg transition-all duration-300 hover:shadow-xl hover:scale-105"
                  >
                    Ver solicitudes
                    <svg class="h-5 w-5 group-hover/link:translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path>
                    </svg>
                  </router-link>
                </div>
              </div>
            </div>

            <!-- Información adicional -->
            <div class="rounded-lg border border-stroke bg-white p-6 shadow-default dark:border-strokedark dark:bg-boxdark">
              <h3 class="text-lg font-semibold text-black dark:text-white mb-4">¿Cómo funciona Trastalia?</h3>
              <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div class="text-center">
                  <div class="mx-auto mb-3 h-12 w-12 rounded-full bg-yellow-100 flex items-center justify-center">
                    <span class="text-xl font-bold text-yellow-600">1</span>
                  </div>
                  <h4 class="font-semibold text-black dark:text-white mb-2">Sube tu artículo</h4>
                  <p class="text-sm text-gray-600 dark:text-gray-400">Describe y fotografía tu artículo</p>
                </div>
                <div class="text-center">
                  <div class="mx-auto mb-3 h-12 w-12 rounded-full bg-yellow-100 flex items-center justify-center">
                    <span class="text-xl font-bold text-yellow-600">2</span>
                  </div>
                  <h4 class="font-semibold text-black dark:text-white mb-2">Recibe una oferta</h4>
                  <p class="text-sm text-gray-600 dark:text-gray-400">Trastalia te hace una oferta justa</p>
                </div>
                <div class="text-center">
                  <div class="mx-auto mb-3 h-12 w-12 rounded-full bg-yellow-100 flex items-center justify-center">
                    <span class="text-xl font-bold text-yellow-600">3</span>
                  </div>
                  <h4 class="font-semibold text-black dark:text-white mb-2">Acepta y vende</h4>
                  <p class="text-sm text-gray-600 dark:text-gray-400">Recibe tu pago o puntos</p>
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
    console.log('👤 Usuario:', authStore.user?.email, 'Rol:', authStore.user?.role)
    
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
      
      // Si es error 401, el token puede estar expirado
      if (response.status === 401) {
        error.value = 'Sesión expirada. Por favor, inicia sesión nuevamente.'
        // Opcional: redirigir al login
        // router.push('/login')
        return
      }
      
      // Si es error 403, el usuario no es admin
      if (response.status === 403) {
        error.value = 'No tienes permisos de administrador para acceder a estas estadísticas.'
        return
      }
      
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

const checkAuthStatus = () => {
  console.log('🔍 Estado de autenticación:', {
    isAuthenticated: authStore.isAuthenticated,
    user: authStore.user,
    token: authStore.token ? 'Presente' : 'Ausente',
    role: authStore.user?.role,
    isAdmin: isAdmin.value
  })
  
  // Mostrar alerta con la información
  alert(`Estado de autenticación:
- Autenticado: ${authStore.isAuthenticated}
- Usuario: ${authStore.user?.email || 'No disponible'}
- Rol: ${authStore.user?.role || 'No disponible'}
- Token: ${authStore.token ? 'Presente' : 'Ausente'}
- Es Admin: ${isAdmin.value}`)
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