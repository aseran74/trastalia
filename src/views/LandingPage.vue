<template>
  <div class="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
    <!-- Header -->
    <header 
      :class="[
        'fixed top-0 left-0 right-0 z-50 transition-all duration-300',
        isScrolled ? 'bg-white/95 backdrop-blur-sm border-b border-gray-200 shadow-sm' : 'bg-transparent'
      ]"
    >
      <!-- Navigation -->
      <nav class="relative z-10 px-4 py-3">
        <div class="mx-auto max-w-5xl">
          <div class="flex items-center justify-between">
            <div class="flex items-center space-x-2">
              <img src="/images/Trastalia3.png" alt="Trastalia" class="h-16 w-auto sm:h-18 md:h-20">
            </div>
            
            <!-- Desktop Menu -->
            <div class="hidden md:flex items-center space-x-6">
              <a href="#features" class="text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white transition-colors">Características</a>
              <a href="#how-it-works" class="text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white transition-colors">Cómo funciona</a>
              <a href="#pricing" class="text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white transition-colors">Precios</a>
              <router-link to="/articulos" class="text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white transition-colors">Ver Artículos</router-link>
              
              <!-- Menú de perfil si está logueado, botón de login si no -->
              <UserProfileMenu v-if="authStore.isAuthenticated" />
              <router-link v-else to="/login" class="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-2 rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-300 transform hover:scale-105">
                Iniciar Sesión
              </router-link>
            </div>

            <!-- Mobile Menu Button -->
            <div class="md:hidden flex items-center space-x-4">
              <!-- Menú de perfil móvil si está logueado -->
              <UserProfileMenu v-if="authStore.isAuthenticated" />
              
              <!-- Botón de menú hamburguesa -->
              <button
                @click="toggleMobileMenu"
                class="text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white transition-colors"
              >
                <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>
            </div>
          </div>

          <!-- Mobile Menu -->
          <div v-if="mobileMenuOpen" class="md:hidden mt-4 mx-4 py-6 px-6 border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 relative z-50 shadow-lg rounded-xl">
            <div class="flex flex-col space-y-5">
              <a href="#features" class="text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white transition-colors ml-4" @click="mobileMenuOpen = false">Características</a>
              <a href="#how-it-works" class="text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white transition-colors ml-4" @click="mobileMenuOpen = false">Cómo funciona</a>
              <a href="#pricing" class="text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white transition-colors ml-4" @click="mobileMenuOpen = false">Precios</a>
              <router-link to="/articulos" class="text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white transition-colors ml-4" @click="mobileMenuOpen = false">Ver Artículos</router-link>
              
              <!-- Botón de login para móvil si no está logueado -->
              <router-link v-if="!authStore.isAuthenticated" to="/login" class="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-2 rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-300 text-center" @click="mobileMenuOpen = false">
                Iniciar Sesión
              </router-link>
            </div>
          </div>
        </div>
      </nav>
    </header>

    <!-- Hero Section -->
    <div class="relative px-6 py-16 lg:py-24 pt-32">
        <div class="mx-auto max-w-7xl">
          <div class="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <!-- Left Column -->
            <div class="space-y-8 pt-8">
              <div class="space-y-6">
                <!-- Título principal -->
                <h1 class="text-4xl lg:text-6xl font-bold text-gray-900 dark:text-white leading-tight">
                  Ha llegado otra manera de vender artículos
                  <span class="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                    de segunda mano
                  </span>
                </h1>
              </div>
              
              <div class="flex flex-col sm:flex-row gap-4">
                <router-link to="/login" class="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-4 rounded-xl text-lg font-semibold hover:from-blue-700 hover:to-purple-700 transition-all duration-300 transform hover:scale-105 shadow-lg">
                  Comenzar Gratis
                </router-link>
                <router-link to="/articulos" class="bg-gradient-to-r from-green-600 to-teal-600 text-white px-8 py-4 rounded-xl text-lg font-semibold hover:from-green-700 hover:to-teal-700 transition-all duration-300 transform hover:scale-105 shadow-lg">
                  Ver Artículos
                </router-link>
                <button class="border-2 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 px-8 py-4 rounded-xl text-lg font-semibold hover:border-blue-600 hover:text-blue-600 dark:hover:text-blue-400 transition-all duration-300">
                  Ver Demo
                </button>
              </div>

              <!-- Stats -->
              <div class="grid grid-cols-3 gap-8 pt-8">
                <div class="text-center">
                  <div class="text-3xl font-bold text-blue-600">1000+</div>
                  <div class="text-sm text-gray-600 dark:text-gray-400">Artículos</div>
                </div>
                <div class="text-center">
                  <div class="text-3xl font-bold text-purple-600">500+</div>
                  <div class="text-sm text-gray-600 dark:text-gray-400">Usuarios</div>
                </div>
                <div class="text-center">
                  <div class="text-3xl font-bold text-green-600">95%</div>
                  <div class="text-sm text-gray-600 dark:text-gray-400">Satisfacción</div>
                </div>
              </div>
            </div>

            <!-- Right Column - Hero Image -->
            <div class="relative">
              <div class="relative z-10">
                <div class="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-8 transform rotate-3 hover:rotate-0 transition-transform duration-500">
                  <div class="space-y-4">
                    <div class="flex items-center space-x-3">
                      <div class="h-3 w-3 bg-red-500 rounded-full"></div>
                      <div class="h-3 w-3 bg-yellow-500 rounded-full"></div>
                      <div class="h-3 w-3 bg-green-500 rounded-full"></div>
                    </div>
                    <div class="space-y-3">
                      <div class="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
                      <div class="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
                      <div class="h-32 bg-gradient-to-br from-blue-100 to-purple-100 dark:from-blue-900 dark:to-purple-900 rounded-lg flex items-center justify-center">
                        <span class="text-4xl">📱</span>
                      </div>
                      <div class="flex space-x-2">
                        <div class="h-8 bg-blue-600 rounded w-20"></div>
                        <div class="h-8 bg-purple-600 rounded w-16"></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <!-- Background decoration -->
              <div class="absolute -top-4 -right-4 w-72 h-72 bg-gradient-to-r from-blue-400 to-purple-400 rounded-full opacity-20 blur-3xl"></div>
              <div class="absolute -bottom-4 -left-4 w-64 h-64 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full opacity-20 blur-3xl"></div>
            </div>
          </div>
        </div>
      </div>

    <!-- Features Section -->
    <section id="features" class="py-20 px-6">
      <div class="mx-auto max-w-7xl">
        <div class="text-center mb-16">
          <h2 class="text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white mb-6">
            Características Únicas
          </h2>
          <p class="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            Descubre las funcionalidades que hacen de Trastalia la plataforma más innovadora para el comercio de segunda mano
          </p>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <!-- Feature 1 -->
          <div class="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 group feature-card">
            <div class="relative">
              <div class="w-16 h-16 bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl flex items-center justify-center mb-6 animate-money-bounce group-hover:animate-pulse group-hover:scale-110 transition-all duration-300">
                <span class="text-2xl animate-money-shake">💰</span>
              </div>
              <!-- Money particles -->
              <div class="absolute -top-1 -right-1 w-2 h-2 bg-yellow-400 rounded-full animate-money-float opacity-80"></div>
              <div class="absolute -bottom-1 -left-1 w-1.5 h-1.5 bg-yellow-300 rounded-full animate-money-float opacity-60" style="animation-delay: 0.5s;"></div>
            </div>
            <h3 class="text-2xl font-bold text-gray-900 dark:text-white mb-4 group-hover:text-blue-600 transition-colors duration-300">Sistema Híbrido</h3>
            <p class="text-gray-600 dark:text-gray-300 group-hover:text-gray-700 dark:group-hover:text-gray-200 transition-colors duration-300">
              Combina compra con dinero y puntos Trastalia. Los puntos equivalen exactamente al valor en euros (1 punto = 1€).
            </p>
          </div>

          <!-- Feature 2 -->
          <div class="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 group feature-card">
            <div class="relative">
              <div class="w-16 h-16 bg-gradient-to-r from-purple-500 to-purple-600 rounded-xl flex items-center justify-center mb-6 animate-rotate-slow group-hover:animate-pulse group-hover:scale-110 transition-all duration-300">
                <span class="text-2xl animate-rotate-icon">🔄</span>
              </div>
              <!-- Rotating particles -->
              <div class="absolute -top-1 -right-1 w-2 h-2 bg-purple-400 rounded-full animate-orbit opacity-80"></div>
              <div class="absolute -bottom-1 -left-1 w-1.5 h-1.5 bg-pink-400 rounded-full animate-orbit opacity-60" style="animation-delay: 0.3s;"></div>
            </div>
            <h3 class="text-2xl font-bold text-gray-900 dark:text-white mb-4 group-hover:text-purple-600 transition-colors duration-300">Intercambio Inteligente</h3>
            <p class="text-gray-600 dark:text-gray-300 group-hover:text-gray-700 dark:group-hover:text-gray-200 transition-colors duration-300">
              Intercambio directo con filtro de precios ±20%. Solo artículos con valor similar aparecen como opciones.
            </p>
          </div>

          <!-- Feature 3 -->
          <div class="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 group feature-card">
            <div class="relative">
              <div class="w-16 h-16 bg-gradient-to-r from-green-500 to-green-600 rounded-xl flex items-center justify-center mb-6 animate-truck-move group-hover:animate-pulse group-hover:scale-110 transition-all duration-300">
                <span class="text-2xl animate-truck-bounce">🚚</span>
              </div>
              <!-- Moving particles -->
              <div class="absolute -top-1 -right-1 w-2 h-2 bg-green-400 rounded-full animate-truck-trail opacity-80"></div>
              <div class="absolute -bottom-1 -left-1 w-1.5 h-1.5 bg-emerald-400 rounded-full animate-truck-trail opacity-60" style="animation-delay: 0.4s;"></div>
            </div>
            <h3 class="text-2xl font-bold text-gray-900 dark:text-white mb-4 group-hover:text-green-600 transition-colors duration-300">Centro Logístico</h3>
            <p class="text-gray-600 dark:text-gray-300 group-hover:text-gray-700 dark:group-hover:text-gray-200 transition-colors duration-300">
              Sistema de "Nave" como centro logístico centralizado para gestionar envíos y entregas de forma eficiente.
            </p>
          </div>

          <!-- Feature 4 -->
          <div class="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 group feature-card">
            <div class="relative">
              <div class="w-16 h-16 bg-gradient-to-r from-orange-500 to-orange-600 rounded-xl flex items-center justify-center mb-6 animate-target-pulse group-hover:animate-pulse group-hover:scale-110 transition-all duration-300">
                <span class="text-2xl animate-target-zoom">🎯</span>
              </div>
              <!-- Target particles -->
              <div class="absolute -top-1 -right-1 w-2 h-2 bg-orange-400 rounded-full animate-target-ring opacity-80"></div>
              <div class="absolute -bottom-1 -left-1 w-1.5 h-1.5 bg-red-400 rounded-full animate-target-ring opacity-60" style="animation-delay: 0.6s;"></div>
            </div>
            <h3 class="text-2xl font-bold text-gray-900 dark:text-white mb-4 group-hover:text-orange-600 transition-colors duration-300">Filtros Avanzados</h3>
            <p class="text-gray-600 dark:text-gray-300 group-hover:text-gray-700 dark:group-hover:text-gray-200 transition-colors duration-300">
              Filtra por tipo de pago, categoría, estado y ubicación. Encuentra exactamente lo que buscas.
            </p>
          </div>

          <!-- Feature 5 -->
          <div class="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 group feature-card">
            <div class="relative">
              <div class="w-16 h-16 bg-gradient-to-r from-pink-500 to-pink-600 rounded-xl flex items-center justify-center mb-6 animate-lock-shake group-hover:animate-pulse group-hover:scale-110 transition-all duration-300">
                <span class="text-2xl animate-lock-glow">🔒</span>
              </div>
              <!-- Security particles -->
              <div class="absolute -top-1 -right-1 w-2 h-2 bg-pink-400 rounded-full animate-security-pulse opacity-80"></div>
              <div class="absolute -bottom-1 -left-1 w-1.5 h-1.5 bg-rose-400 rounded-full animate-security-pulse opacity-60" style="animation-delay: 0.7s;"></div>
            </div>
            <h3 class="text-2xl font-bold text-gray-900 dark:text-white mb-4 group-hover:text-pink-600 transition-colors duration-300">Seguridad Total</h3>
            <p class="text-gray-600 dark:text-gray-300 group-hover:text-gray-700 dark:group-hover:text-gray-200 transition-colors duration-300">
              Sistema de autenticación robusto con verificación de usuarios y transacciones seguras.
            </p>
          </div>

          <!-- Feature 6 -->
          <div class="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 group feature-card">
            <div class="relative">
              <div class="w-16 h-16 bg-gradient-to-r from-indigo-500 to-indigo-600 rounded-xl flex items-center justify-center mb-6 animate-phone-flip group-hover:animate-pulse group-hover:scale-110 transition-all duration-300">
                <span class="text-2xl animate-phone-rotate">📱</span>
              </div>
              <!-- Phone particles -->
              <div class="absolute -top-1 -right-1 w-2 h-2 bg-indigo-400 rounded-full animate-phone-bounce opacity-80"></div>
              <div class="absolute -bottom-1 -left-1 w-1.5 h-1.5 bg-blue-400 rounded-full animate-phone-bounce opacity-60" style="animation-delay: 0.8s;"></div>
            </div>
            <h3 class="text-2xl font-bold text-gray-900 dark:text-white mb-4 group-hover:text-indigo-600 transition-colors duration-300">Responsive Design</h3>
            <p class="text-gray-600 dark:text-gray-300 group-hover:text-gray-700 dark:group-hover:text-gray-200 transition-colors duration-300">
              Interfaz moderna y responsive que funciona perfectamente en cualquier dispositivo.
            </p>
          </div>
        </div>
      </div>
    </section>

    <!-- Comparison Section -->
    <section class="py-24 px-6 bg-gradient-to-br from-slate-50 via-blue-50/30 to-purple-50/30 dark:from-gray-900 dark:via-slate-900 dark:to-gray-900 relative overflow-hidden">
      <!-- Background decorations -->
      <div class="absolute inset-0 overflow-hidden pointer-events-none">
        <div class="absolute -top-40 -right-40 w-80 h-80 bg-blue-200/20 dark:bg-blue-500/10 rounded-full blur-3xl"></div>
        <div class="absolute -bottom-40 -left-40 w-80 h-80 bg-purple-200/20 dark:bg-purple-500/10 rounded-full blur-3xl"></div>
      </div>

      <div class="mx-auto max-w-7xl relative z-10">
        <!-- Header -->
        <div class="text-center mb-20">
          <div class="inline-block mb-4">
            <span class="px-4 py-2 bg-gradient-to-r from-blue-100 to-purple-100 dark:from-blue-900/30 dark:to-purple-900/30 rounded-full text-sm font-semibold text-blue-700 dark:text-blue-300">
              La Diferencia
            </span>
          </div>
          <h2 class="text-5xl lg:text-7xl font-extrabold text-gray-900 dark:text-white mb-6 leading-tight">
            ¿Por qué 
            <span class="bg-gradient-to-r from-blue-600 via-purple-600 to-blue-600 bg-clip-text text-transparent animate-gradient">
              Trastalia
            </span>?
          </h2>
          <p class="text-xl lg:text-2xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto font-medium">
            La revolución del comercio de segunda mano
          </p>
        </div>

        <!-- Comparison Cards -->
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 mb-16">
          <!-- Otras Apps - Problemas -->
          <div class="group relative">
            <div class="absolute -inset-0.5 bg-gradient-to-r from-rose-800 via-rose-900 to-rose-950 rounded-3xl opacity-25 group-hover:opacity-35 blur-2xl transition-opacity duration-300"></div>
            <div class="relative bg-gray-900 dark:bg-gray-950 rounded-3xl p-8 lg:p-10 shadow-2xl border-2 border-rose-800/40 dark:border-rose-900/50 transform transition-all duration-300 hover:scale-[1.02] overflow-hidden">
              <!-- Pattern overlay -->
              <div class="absolute inset-0 opacity-5">
                <div class="absolute inset-0" style="background-image: repeating-linear-gradient(45deg, transparent, transparent 10px, rgba(190, 18, 60, 0.1) 10px, rgba(190, 18, 60, 0.1) 20px);"></div>
              </div>
              
              <!-- Header -->
              <div class="text-center mb-10 relative z-10">
                <div class="inline-flex items-center justify-center w-24 h-24 bg-gradient-to-br from-rose-800 via-rose-900 to-rose-950 rounded-3xl mb-5 shadow-2xl ring-4 ring-rose-800/30 transform transition-transform duration-300 group-hover:scale-110 group-hover:rotate-6">
                  <span class="text-5xl">😤</span>
                </div>
                <h3 class="text-3xl lg:text-4xl font-extrabold text-rose-400 mb-3 drop-shadow-lg">
                  Otras Apps
                </h3>
                <p class="text-gray-400 text-lg font-medium">
                  Wallapop, Milanuncios, etc.
                </p>
              </div>
              
              <!-- Problems List -->
              <div class="space-y-4 relative z-10">
                <div class="flex items-start gap-4 p-5 bg-red-950/50 dark:bg-red-900/20 rounded-2xl border-2 border-rose-800/40 dark:border-rose-900/50 backdrop-blur-sm transform transition-all duration-300 hover:scale-[1.02] hover:border-rose-700/50 hover:shadow-lg hover:shadow-rose-900/30">
                  <div class="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-rose-800 via-rose-900 to-rose-950 rounded-xl flex items-center justify-center shadow-xl ring-2 ring-rose-800/40">
                    <svg class="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M6 18L18 6M6 6l12 12"></path>
                    </svg>
                  </div>
                  <p class="text-lg font-bold text-rose-200 dark:text-rose-300 pt-2 leading-relaxed">
                    Olvídate de los mensajes que nunca acaban
                  </p>
                </div>
                
                <div class="flex items-start gap-4 p-5 bg-red-950/50 dark:bg-red-900/20 rounded-2xl border-2 border-rose-800/40 dark:border-rose-900/50 backdrop-blur-sm transform transition-all duration-300 hover:scale-[1.02] hover:border-rose-700/50 hover:shadow-lg hover:shadow-rose-900/30">
                  <div class="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-rose-800 via-rose-900 to-rose-950 rounded-xl flex items-center justify-center shadow-xl ring-2 ring-rose-800/40">
                    <svg class="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M6 18L18 6M6 6l12 12"></path>
                    </svg>
                  </div>
                  <p class="text-lg font-bold text-rose-200 dark:text-rose-300 pt-2 leading-relaxed">
                    Chatear durante días para vender un artículo de 20€
                  </p>
                </div>
                
                <div class="flex items-start gap-4 p-5 bg-red-950/50 dark:bg-red-900/20 rounded-2xl border-2 border-rose-800/40 dark:border-rose-900/50 backdrop-blur-sm transform transition-all duration-300 hover:scale-[1.02] hover:border-rose-700/50 hover:shadow-lg hover:shadow-rose-900/30">
                  <div class="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-rose-800 via-rose-900 to-rose-950 rounded-xl flex items-center justify-center shadow-xl ring-2 ring-rose-800/40">
                    <svg class="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M6 18L18 6M6 6l12 12"></path>
                    </svg>
                  </div>
                  <p class="text-lg font-bold text-rose-200 dark:text-rose-300 pt-2 leading-relaxed">
                    Publicar y esperar que alguien se interese
                  </p>
                </div>
                
                <div class="flex items-start gap-4 p-5 bg-red-950/50 dark:bg-red-900/20 rounded-2xl border-2 border-rose-800/40 dark:border-rose-900/50 backdrop-blur-sm transform transition-all duration-300 hover:scale-[1.02] hover:border-rose-700/50 hover:shadow-lg hover:shadow-rose-900/30">
                  <div class="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-rose-800 via-rose-900 to-rose-950 rounded-xl flex items-center justify-center shadow-xl ring-2 ring-rose-800/40">
                    <svg class="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M6 18L18 6M6 6l12 12"></path>
                    </svg>
                  </div>
                  <p class="text-lg font-bold text-rose-200 dark:text-rose-300 pt-2 leading-relaxed">
                    Regateos interminables y compradores fantasma
                  </p>
                </div>
              </div>
            </div>
          </div>

          <!-- Trastalia - Solución -->
          <div class="group relative">
            <div class="absolute -inset-0.5 bg-gradient-to-r from-green-500 via-blue-500 to-purple-500 rounded-3xl opacity-40 group-hover:opacity-50 blur-2xl transition-opacity duration-300 animate-pulse"></div>
            <div class="relative bg-gradient-to-br from-green-50 via-emerald-50 via-blue-50 to-purple-50 dark:from-green-900/30 dark:via-emerald-900/20 dark:via-blue-900/30 dark:to-purple-900/20 rounded-3xl p-8 lg:p-10 shadow-2xl border-4 border-green-400/50 dark:border-green-500/50 transform transition-all duration-300 hover:scale-[1.02] overflow-hidden">
              <!-- Decorative elements -->
              <div class="absolute top-0 right-0 w-48 h-48 bg-gradient-to-br from-green-400/30 to-blue-400/30 rounded-full blur-3xl -translate-y-24 translate-x-24 animate-pulse"></div>
              <div class="absolute bottom-0 left-0 w-40 h-40 bg-gradient-to-tr from-blue-400/30 to-purple-400/30 rounded-full blur-3xl translate-y-20 -translate-x-20 animate-pulse" style="animation-delay: 1s;"></div>
              <div class="absolute top-1/2 left-1/2 w-32 h-32 bg-gradient-to-r from-emerald-400/20 to-cyan-400/20 rounded-full blur-2xl -translate-x-1/2 -translate-y-1/2"></div>
              
              <!-- Shine effect -->
              <div class="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
              
              <!-- Header -->
              <div class="text-center mb-10 relative z-10">
                <div class="inline-flex items-center justify-center w-24 h-24 bg-gradient-to-br from-green-500 via-blue-500 to-purple-500 rounded-3xl mb-5 shadow-2xl ring-4 ring-green-400/30 dark:ring-green-500/20 transform transition-all duration-300 group-hover:scale-110 group-hover:rotate-6 group-hover:shadow-green-500/50">
                  <img src="/images/favi.png" alt="Trastalia" class="w-14 h-14 object-contain drop-shadow-lg" />
                </div>
                <h3 class="text-3xl lg:text-4xl font-extrabold bg-gradient-to-r from-green-600 via-blue-600 to-purple-600 bg-clip-text text-transparent mb-3 drop-shadow-lg">
                  Con Trastalia
                </h3>
                <p class="text-gray-700 dark:text-gray-200 text-lg font-semibold">
                  La revolución del comercio de segunda mano
                </p>
              </div>
              
              <!-- Benefits List -->
              <div class="space-y-4 relative z-10">
                <div class="flex items-start gap-4 p-5 bg-white/90 dark:bg-white/10 backdrop-blur-md rounded-2xl border-3 border-green-400/60 dark:border-green-500/40 shadow-xl transform transition-all duration-300 hover:scale-[1.02] hover:shadow-2xl hover:border-green-500 dark:hover:border-green-400 hover:bg-white dark:hover:bg-white/15">
                  <div class="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-green-500 via-emerald-500 to-blue-500 rounded-xl flex items-center justify-center shadow-xl ring-2 ring-green-400/30 dark:ring-green-500/20">
                    <svg class="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M5 13l4 4L19 7"></path>
                    </svg>
                  </div>
                  <p class="text-lg font-extrabold text-gray-900 dark:text-white pt-2 leading-relaxed">
                    Rápido. Fácil. Sin chats.
                  </p>
                </div>
                
                <div class="flex items-start gap-4 p-5 bg-white/90 dark:bg-white/10 backdrop-blur-md rounded-2xl border-3 border-green-400/60 dark:border-green-500/40 shadow-xl transform transition-all duration-300 hover:scale-[1.02] hover:shadow-2xl hover:border-green-500 dark:hover:border-green-400 hover:bg-white dark:hover:bg-white/15">
                  <div class="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-green-500 via-emerald-500 to-blue-500 rounded-xl flex items-center justify-center shadow-xl ring-2 ring-green-400/30 dark:ring-green-500/20">
                    <svg class="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M5 13l4 4L19 7"></path>
                    </svg>
                  </div>
                  <p class="text-lg font-extrabold text-gray-900 dark:text-white pt-2 leading-relaxed">
                    De trastos a dinero en un clic
                  </p>
                </div>
                
                <div class="flex items-start gap-4 p-5 bg-white/90 dark:bg-white/10 backdrop-blur-md rounded-2xl border-3 border-green-400/60 dark:border-green-500/40 shadow-xl transform transition-all duration-300 hover:scale-[1.02] hover:shadow-2xl hover:border-green-500 dark:hover:border-green-400 hover:bg-white dark:hover:bg-white/15">
                  <div class="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-green-500 via-emerald-500 to-blue-500 rounded-xl flex items-center justify-center shadow-xl ring-2 ring-green-400/30 dark:ring-green-500/20">
                    <svg class="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M5 13l4 4L19 7"></path>
                    </svg>
                  </div>
                  <p class="text-lg font-extrabold text-gray-900 dark:text-white pt-2 leading-relaxed">
                    Menos espera, más espacio
                  </p>
                </div>
                
                <div class="flex items-start gap-4 p-5 bg-white/90 dark:bg-white/10 backdrop-blur-md rounded-2xl border-3 border-green-400/60 dark:border-green-500/40 shadow-xl transform transition-all duration-300 hover:scale-[1.02] hover:shadow-2xl hover:border-green-500 dark:hover:border-green-400 hover:bg-white dark:hover:bg-white/15">
                  <div class="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-green-500 via-emerald-500 to-blue-500 rounded-xl flex items-center justify-center shadow-xl ring-2 ring-green-400/30 dark:ring-green-500/20">
                    <svg class="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M5 13l4 4L19 7"></path>
                    </svg>
                  </div>
                  <p class="text-lg font-extrabold text-gray-900 dark:text-white pt-2 leading-relaxed">
                    Decides: dinero directo o puntos para canjear
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Call to Action -->
        <div class="text-center mt-16">
          <div class="relative inline-block">
            <div class="absolute -inset-1 bg-gradient-to-r from-green-500 via-blue-500 to-purple-500 rounded-3xl opacity-20 blur-xl"></div>
            <div class="relative bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-3xl p-10 lg:p-12 shadow-2xl border border-gray-200 dark:border-gray-700 max-w-4xl mx-auto">
              <h3 class="text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white mb-4">
                ¿Listo para cambiar tu forma de vender?
              </h3>
              <p class="text-xl text-gray-600 dark:text-gray-300 mb-8 font-medium">
                Únete a la revolución del comercio de segunda mano
              </p>
              <div class="flex flex-col sm:flex-row gap-4 justify-center">
                <router-link 
                  to="/signup" 
                  class="group relative inline-flex items-center justify-center px-8 py-4 text-lg font-bold text-white bg-gradient-to-r from-green-600 via-blue-600 to-purple-600 rounded-xl shadow-lg hover:shadow-2xl transform transition-all duration-300 hover:scale-105 overflow-hidden"
                >
                  <span class="absolute inset-0 bg-gradient-to-r from-green-700 via-blue-700 to-purple-700 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
                  <span class="relative z-10 flex items-center gap-2">
                    Empezar Ahora
                    <svg class="w-5 h-5 transform group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7l5 5m0 0l-5 5m5-5H6"></path>
                    </svg>
                  </span>
                </router-link>
                <router-link 
                  to="/articulos" 
                  class="inline-flex items-center justify-center px-8 py-4 text-lg font-semibold text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 border-2 border-gray-300 dark:border-gray-600 rounded-xl hover:border-green-600 hover:text-green-600 dark:hover:border-green-500 dark:hover:text-green-400 transition-all duration-300 transform hover:scale-105 shadow-md hover:shadow-lg"
                >
                  Ver Artículos
                </router-link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- How it Works Section -->
    <section id="how-it-works" class="py-20 px-6 bg-gray-50 dark:bg-gray-800">
      <div class="mx-auto max-w-7xl">
        <div class="text-center mb-16">
          <h2 class="text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white mb-6">
            Cómo Funciona
          </h2>
          <p class="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            Tres pasos simples para comenzar a usar Trastalia
          </p>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
          <!-- Step 1 -->
          <div class="text-center group">
            <div class="relative">
              <div class="w-20 h-20 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-6 animate-float group-hover:animate-pulse group-hover:scale-110 transition-all duration-300">
                <span class="text-3xl font-bold text-white animate-bounce-slow">1</span>
              </div>
              <!-- Floating particles around step 1 -->
              <div class="absolute -top-2 -right-2 w-3 h-3 bg-blue-400 rounded-full animate-ping opacity-75"></div>
              <div class="absolute -bottom-1 -left-1 w-2 h-2 bg-purple-400 rounded-full animate-ping opacity-75" style="animation-delay: 0.5s;"></div>
            </div>
            <h3 class="text-2xl font-bold text-gray-900 dark:text-white mb-4 group-hover:text-blue-600 transition-colors duration-300">Regístrate</h3>
            <p class="text-gray-600 dark:text-gray-300 group-hover:text-gray-700 dark:group-hover:text-gray-200 transition-colors duration-300">
              Crea tu cuenta gratuita en menos de 2 minutos. Verifica tu identidad para mayor seguridad.
            </p>
          </div>

          <!-- Step 2 -->
          <div class="text-center group">
            <div class="relative">
              <div class="w-20 h-20 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full flex items-center justify-center mx-auto mb-6 animate-float-delayed group-hover:animate-pulse group-hover:scale-110 transition-all duration-300">
                <span class="text-3xl font-bold text-white animate-bounce-slow" style="animation-delay: 0.3s;">2</span>
              </div>
              <!-- Floating particles around step 2 -->
              <div class="absolute -top-2 -right-2 w-3 h-3 bg-purple-400 rounded-full animate-ping opacity-75" style="animation-delay: 0.2s;"></div>
              <div class="absolute -bottom-1 -left-1 w-2 h-2 bg-pink-400 rounded-full animate-ping opacity-75" style="animation-delay: 0.7s;"></div>
            </div>
            <h3 class="text-2xl font-bold text-gray-900 dark:text-white mb-4 group-hover:text-purple-600 transition-colors duration-300">Publica o Busca</h3>
            <p class="text-gray-600 dark:text-gray-300 group-hover:text-gray-700 dark:group-hover:text-gray-200 transition-colors duration-300">
              Sube tus artículos con fotos y descripción, o busca lo que necesitas con filtros avanzados.
            </p>
          </div>

          <!-- Step 3 -->
          <div class="text-center group">
            <div class="relative">
              <div class="w-20 h-20 bg-gradient-to-r from-pink-600 to-red-600 rounded-full flex items-center justify-center mx-auto mb-6 animate-float-delayed-2 group-hover:animate-pulse group-hover:scale-110 transition-all duration-300">
                <span class="text-3xl font-bold text-white animate-bounce-slow" style="animation-delay: 0.6s;">3</span>
              </div>
              <!-- Floating particles around step 3 -->
              <div class="absolute -top-2 -right-2 w-3 h-3 bg-pink-400 rounded-full animate-ping opacity-75" style="animation-delay: 0.4s;"></div>
              <div class="absolute -bottom-1 -left-1 w-2 h-2 bg-red-400 rounded-full animate-ping opacity-75" style="animation-delay: 0.9s;"></div>
            </div>
            <h3 class="text-2xl font-bold text-gray-900 dark:text-white mb-4 group-hover:text-pink-600 transition-colors duration-300">Intercambia</h3>
            <p class="text-gray-600 dark:text-gray-300 group-hover:text-gray-700 dark:group-hover:text-gray-200 transition-colors duration-300">
              Compra con dinero, intercambia por puntos o haz trueque directo. ¡Tú decides!
            </p>
          </div>
        </div>
      </div>
    </section>


    <!-- Footer -->
    <footer class="bg-gray-900 text-white py-12 px-6">
      <div class="mx-auto max-w-7xl">
        <div class="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div class="col-span-1 md:col-span-2">
            <div class="flex items-center space-x-2 mb-4">
              <img src="/images/Trastalia3.png" alt="Trastalia" class="h-24 w-auto sm:h-28 md:h-32 lg:h-36 brightness-0 invert">
            </div>
            <p class="text-gray-400 mb-4">
              <strong>Rápido. Fácil. Sin chats.</strong><br>
              La plataforma que convierte tus trastos en dinero real en segundos. 
              Deja de esperar compradores fantasma.
            </p>
          </div>
          
          <div>
            <h3 class="text-lg font-semibold mb-4">Producto</h3>
            <ul class="space-y-2 text-gray-400">
              <li><a href="#features" class="hover:text-white transition-colors">Características</a></li>
              <li><a href="#how-it-works" class="hover:text-white transition-colors">Cómo funciona</a></li>
              <li><a href="#" class="hover:text-white transition-colors">Precios</a></li>
            </ul>
          </div>
          
          <div>
            <h3 class="text-lg font-semibold mb-4">Soporte</h3>
            <ul class="space-y-2 text-gray-400">
              <li><a href="#" class="hover:text-white transition-colors">Ayuda</a></li>
              <li><a href="#" class="hover:text-white transition-colors">Contacto</a></li>
              <li><a href="#" class="hover:text-white transition-colors">Términos</a></li>
            </ul>
          </div>
        </div>
        
        <div class="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
          <p>&copy; 2024 Trastalia. Todos los derechos reservados.</p>
        </div>
      </div>
    </footer>
  </div>
</template>

<script setup lang="ts">
import { onMounted, onUnmounted, ref } from 'vue'
import { useAuthStore } from '@/stores/auth'
import UserProfileMenu from '@/components/landing/UserProfileMenu.vue'

const authStore = useAuthStore()
const mobileMenuOpen = ref(false)
const isScrolled = ref(false)

const toggleMobileMenu = () => {
  mobileMenuOpen.value = !mobileMenuOpen.value
}

const handleScroll = () => {
  isScrolled.value = window.scrollY > 50
}

onMounted(() => {
  // Add scroll event listener
  window.addEventListener('scroll', handleScroll)
  
  // Smooth scrolling for anchor links
  const links = document.querySelectorAll('a[href^="#"]')
  links.forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault()
      const target = document.querySelector(link.getAttribute('href') || '')
      if (target) {
        target.scrollIntoView({
          behavior: 'smooth',
          block: 'start'
        })
      }
    })
  })
})

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll)
})
</script>

<style scoped>
/* Custom scrollbar */
::-webkit-scrollbar {
  width: 8px;
}

::-webkit-scrollbar-track {
  background: #f1f1f1;
}

::-webkit-scrollbar-thumb {
  background: linear-gradient(to bottom, #3b82f6, #8b5cf6);
  border-radius: 4px;
}

::-webkit-scrollbar-thumb:hover {
  background: linear-gradient(to bottom, #2563eb, #7c3aed);
}

/* Custom animations for step icons */
@keyframes float {
  0%, 100% {
    transform: translateY(0px);
  }
  50% {
    transform: translateY(-10px);
  }
}

@keyframes float-delayed {
  0%, 100% {
    transform: translateY(0px);
  }
  50% {
    transform: translateY(-8px);
  }
}

@keyframes float-delayed-2 {
  0%, 100% {
    transform: translateY(0px);
  }
  50% {
    transform: translateY(-12px);
  }
}

@keyframes bounce-slow {
  0%, 100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-5px);
  }
}

.animate-float {
  animation: float 3s ease-in-out infinite;
}

.animate-float-delayed {
  animation: float-delayed 3s ease-in-out infinite;
  animation-delay: 0.5s;
}

.animate-float-delayed-2 {
  animation: float-delayed-2 3s ease-in-out infinite;
  animation-delay: 1s;
}

.animate-bounce-slow {
  animation: bounce-slow 2s ease-in-out infinite;
}

/* Hover effects */
.group:hover .animate-float,
.group:hover .animate-float-delayed,
.group:hover .animate-float-delayed-2 {
  animation-play-state: paused;
  transform: translateY(-15px) scale(1.1);
}

/* Particle animations */
@keyframes particle-float {
  0%, 100% {
    transform: translateY(0px) scale(1);
    opacity: 0.75;
  }
  50% {
    transform: translateY(-20px) scale(1.2);
    opacity: 1;
  }
}

.animate-ping {
  animation: particle-float 2s ease-in-out infinite;
}

/* Feature-specific animations */
@keyframes money-bounce {
  0%, 100% {
    transform: translateY(0px) scale(1);
  }
  50% {
    transform: translateY(-8px) scale(1.05);
  }
}

@keyframes money-shake {
  0%, 100% {
    transform: rotate(0deg);
  }
  25% {
    transform: rotate(-5deg);
  }
  75% {
    transform: rotate(5deg);
  }
}

@keyframes money-float {
  0%, 100% {
    transform: translateY(0px) scale(1);
    opacity: 0.8;
  }
  50% {
    transform: translateY(-15px) scale(1.2);
    opacity: 1;
  }
}

@keyframes rotate-slow {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}

@keyframes rotate-icon {
  0%, 100% {
    transform: rotate(0deg);
  }
  50% {
    transform: rotate(180deg);
  }
}

@keyframes orbit {
  0% {
    transform: rotate(0deg) translateX(20px) rotate(0deg);
  }
  100% {
    transform: rotate(360deg) translateX(20px) rotate(-360deg);
  }
}

@keyframes truck-move {
  0%, 100% {
    transform: translateX(0px);
  }
  50% {
    transform: translateX(5px);
  }
}

@keyframes truck-bounce {
  0%, 100% {
    transform: translateY(0px) rotate(0deg);
  }
  50% {
    transform: translateY(-3px) rotate(2deg);
  }
}

@keyframes truck-trail {
  0%, 100% {
    transform: translateX(0px) scale(1);
    opacity: 0.8;
  }
  50% {
    transform: translateX(10px) scale(1.1);
    opacity: 1;
  }
}

@keyframes target-pulse {
  0%, 100% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.1);
  }
}

@keyframes target-zoom {
  0%, 100% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.2);
  }
}

@keyframes target-ring {
  0%, 100% {
    transform: scale(1);
    opacity: 0.8;
  }
  50% {
    transform: scale(1.5);
    opacity: 0.4;
  }
}

@keyframes lock-shake {
  0%, 100% {
    transform: translateX(0px);
  }
  25% {
    transform: translateX(-2px);
  }
  75% {
    transform: translateX(2px);
  }
}

@keyframes lock-glow {
  0%, 100% {
    filter: brightness(1);
  }
  50% {
    filter: brightness(1.3);
  }
}

@keyframes security-pulse {
  0%, 100% {
    transform: scale(1);
    opacity: 0.8;
  }
  50% {
    transform: scale(1.3);
    opacity: 1;
  }
}

@keyframes phone-flip {
  0%, 100% {
    transform: rotateY(0deg);
  }
  50% {
    transform: rotateY(10deg);
  }
}

@keyframes phone-rotate {
  0%, 100% {
    transform: rotate(0deg);
  }
  50% {
    transform: rotate(5deg);
  }
}

@keyframes phone-bounce {
  0%, 100% {
    transform: translateY(0px) scale(1);
    opacity: 0.8;
  }
  50% {
    transform: translateY(-10px) scale(1.1);
    opacity: 1;
  }
}

@keyframes gradient {
  0%, 100% {
    background-position: 0% 50%;
  }
  50% {
    background-position: 100% 50%;
  }
}

/* Apply animations */
.animate-money-bounce {
  animation: money-bounce 2s ease-in-out infinite;
}

.animate-money-shake {
  animation: money-shake 1.5s ease-in-out infinite;
}

.animate-money-float {
  animation: money-float 2.5s ease-in-out infinite;
}

.animate-rotate-slow {
  animation: rotate-slow 4s linear infinite;
}

.animate-rotate-icon {
  animation: rotate-icon 2s ease-in-out infinite;
}

.animate-orbit {
  animation: orbit 3s linear infinite;
}

.animate-truck-move {
  animation: truck-move 2s ease-in-out infinite;
}

.animate-truck-bounce {
  animation: truck-bounce 1.8s ease-in-out infinite;
}

.animate-truck-trail {
  animation: truck-trail 2.2s ease-in-out infinite;
}

.animate-target-pulse {
  animation: target-pulse 1.5s ease-in-out infinite;
}

.animate-target-zoom {
  animation: target-zoom 2s ease-in-out infinite;
}

.animate-target-ring {
  animation: target-ring 2.5s ease-in-out infinite;
}

.animate-lock-shake {
  animation: lock-shake 1.2s ease-in-out infinite;
}

.animate-lock-glow {
  animation: lock-glow 2s ease-in-out infinite;
}

.animate-security-pulse {
  animation: security-pulse 1.8s ease-in-out infinite;
}

.animate-phone-flip {
  animation: phone-flip 2.5s ease-in-out infinite;
}

.animate-phone-rotate {
  animation: phone-rotate 1.5s ease-in-out infinite;
}

.animate-phone-bounce {
  animation: phone-bounce 2s ease-in-out infinite;
}

.animate-gradient {
  background-size: 200% 200%;
  animation: gradient 3s ease infinite;
}

@keyframes gradient {
  0%, 100% {
    background-position: 0% 50%;
  }
  50% {
    background-position: 100% 50%;
  }
}

/* Feature card hover effects */
.feature-card:hover .animate-money-bounce,
.feature-card:hover .animate-rotate-slow,
.feature-card:hover .animate-truck-move,
.feature-card:hover .animate-target-pulse,
.feature-card:hover .animate-lock-shake,
.feature-card:hover .animate-phone-flip {
  animation-play-state: paused;
  transform: scale(1.1);
}
</style>
