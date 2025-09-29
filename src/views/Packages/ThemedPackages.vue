<template>
  <div class="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
    <!-- Header -->
    <header 
      :class="[
        'fixed top-0 left-0 right-0 z-50 transition-all duration-300',
        isScrolled ? 'bg-white/95 backdrop-blur-sm border-b border-gray-200 shadow-sm' : 'bg-transparent'
      ]"
    >
      <!-- Navigation -->
      <nav class="relative z-10 px-4 py-3">
        <div class="mx-auto max-w-7xl">
          <div class="flex items-center justify-between">
            <div class="flex items-center space-x-2">
              <router-link to="/">
                <img src="/images/Trastalia3.png" alt="Trastalia" class="h-16 w-auto sm:h-18 md:h-20">
              </router-link>
            </div>
            
            <!-- Desktop Menu -->
            <div class="hidden md:flex items-center space-x-6">
              <router-link to="/" class="text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white transition-colors">Inicio</router-link>
              <router-link to="/articulos" class="text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white transition-colors">Artículos</router-link>
              <router-link to="/paquetes" class="text-blue-600 hover:text-blue-700 font-semibold transition-colors">Paquetes</router-link>
              
              <!-- Menú de perfil si está logueado, botón de login si no -->
              <UserProfileMenu v-if="authStore.isAuthenticated" />
              <router-link v-else to="/login" class="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-2 rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-300 transform hover:scale-105">
                Iniciar Sesión
              </router-link>
            </div>

            <!-- Mobile Menu Button -->
            <div class="md:hidden flex items-center space-x-4">
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
              <router-link to="/" class="text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white transition-colors ml-4" @click="mobileMenuOpen = false">Inicio</router-link>
              <router-link to="/articulos" class="text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white transition-colors ml-4" @click="mobileMenuOpen = false">Artículos</router-link>
              <router-link to="/paquetes" class="text-blue-600 hover:text-blue-700 font-semibold transition-colors ml-4" @click="mobileMenuOpen = false">Paquetes</router-link>
              
              <!-- Botón de login para móvil si no está logueado -->
              <router-link v-if="!authStore.isAuthenticated" to="/login" class="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-2 rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-300 text-center" @click="mobileMenuOpen = false">
                Iniciar Sesión
              </router-link>
            </div>
          </div>
        </div>
      </nav>
    </header>

    <!-- Main Content -->
    <div class="pt-24 pb-8">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <!-- Hero Section -->
        <div class="text-center mb-16">
          <div class="relative">
            <!-- Badge superior -->
            <div class="inline-flex items-center px-4 py-2 rounded-full bg-gradient-to-r from-blue-100 to-purple-100 text-blue-800 text-sm font-semibold mb-6 shadow-sm">
              <svg class="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"/>
              </svg>
              Paquetes Temáticos Verificados
            </div>
            
            <!-- Título principal -->
            <h1 class="text-5xl lg:text-7xl font-bold tracking-tight text-gray-900 mb-6">
              Paquetes
              <span class="bg-gradient-to-r from-blue-600 via-purple-600 to-green-600 bg-clip-text text-transparent">
                Temáticos
              </span>
            </h1>
            
            <!-- Subtítulo mejorado -->
            <p class="text-xl lg:text-2xl text-gray-600 max-w-4xl mx-auto leading-relaxed mb-8">
              Combos perfectos para <span class="font-semibold text-gray-800">ahorrar dinero</span> y obtener 
              <span class="font-semibold text-blue-600">todo lo que necesitas</span> en un solo lugar
            </p>
            
            <!-- Estadísticas rápidas -->
            <div class="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-2xl mx-auto mb-8">
              <div class="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
                <div class="text-2xl font-bold text-blue-600">30%</div>
                <div class="text-sm text-gray-600">Ahorro Promedio</div>
              </div>
              <div class="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
                <div class="text-2xl font-bold text-purple-600">6</div>
                <div class="text-sm text-gray-600">Categorías</div>
              </div>
              <div class="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
                <div class="text-2xl font-bold text-green-600">100%</div>
                <div class="text-sm text-gray-600">Verificado</div>
              </div>
            </div>
          </div>
        </div>

        <!-- Barra de búsqueda -->
        <div class="mb-12">
          <div class="max-w-2xl mx-auto">
            <div class="relative">
              <input
                v-model="searchQuery"
                type="text"
                placeholder="Buscar paquetes..."
                class="w-full px-6 py-4 pl-12 text-lg border border-gray-300 rounded-xl shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
              />
              <div class="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <svg class="h-6 w-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
            </div>
          </div>
        </div>

        <!-- Paquetes Grid -->
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <div 
            v-for="pkg in filteredPackages" 
            :key="pkg.id"
            class="group bg-white rounded-2xl shadow-lg overflow-hidden transition-all duration-300 hover:shadow-2xl hover:-translate-y-2"
          >
            <!-- Header del paquete -->
            <div :class="[
              'relative h-32 bg-gradient-to-r',
              pkg.color,
              'p-6 flex items-center justify-between'
            ]">
              <div class="text-white">
                <div class="text-4xl mb-2">{{ pkg.emoji }}</div>
                <h3 class="text-xl font-bold">{{ pkg.name }}</h3>
              </div>
              <div class="text-white/80">
                <div class="text-right">
                  <div class="text-sm">Ahorro</div>
                  <div class="text-2xl font-bold">30%</div>
                </div>
              </div>
            </div>

            <!-- Contenido del paquete -->
            <div class="p-6">
              <p class="text-gray-600 mb-4">{{ pkg.description }}</p>
              
              <!-- Items del paquete -->
              <div class="mb-6">
                <h4 class="text-sm font-semibold text-gray-900 mb-3">Incluye:</h4>
                <div class="grid grid-cols-2 gap-2">
                  <div 
                    v-for="item in pkg.items.slice(0, 6)" 
                    :key="item.name"
                    class="flex items-center space-x-2 text-sm"
                  >
                    <span class="text-lg">{{ item.emoji }}</span>
                    <span class="text-gray-700">{{ item.name }}</span>
                    <span v-if="item.essential" class="text-xs bg-green-100 text-green-800 px-1 rounded">★</span>
                  </div>
                  <div v-if="pkg.items.length > 6" class="text-sm text-gray-500 col-span-2">
                    +{{ pkg.items.length - 6 }} artículos más...
                  </div>
                </div>
              </div>

              <!-- Beneficios -->
              <div class="mb-6">
                <h4 class="text-sm font-semibold text-gray-900 mb-3">Beneficios:</h4>
                <ul class="space-y-1">
                  <li v-for="benefit in pkg.benefits.slice(0, 2)" :key="benefit" class="flex items-start space-x-2 text-sm text-gray-600">
                    <svg class="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                      <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"/>
                    </svg>
                    <span>{{ benefit }}</span>
                  </li>
                </ul>
              </div>

              <!-- Botones de acción -->
              <div class="space-y-3">
                <button
                  @click="viewPackageDetails(pkg)"
                  class="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 px-4 rounded-xl font-semibold hover:from-blue-700 hover:to-purple-700 transition-all duration-300 transform hover:scale-105 shadow-lg"
                >
                  Ver Detalles
                </button>
                
                <button
                  @click="addToWishlist(pkg)"
                  class="w-full border-2 border-gray-300 text-gray-700 py-3 px-4 rounded-xl font-semibold hover:border-blue-600 hover:text-blue-600 transition-all duration-300"
                >
                  💝 Agregar a Favoritos
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- Mensaje cuando no hay resultados -->
        <div v-if="filteredPackages.length === 0" class="text-center py-12">
          <div class="w-24 h-24 mx-auto mb-4 bg-gray-200 rounded-full flex items-center justify-center">
            <svg class="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.172 16.172a4 4 0 015.656 0M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
            </svg>
          </div>
          <h3 class="mt-2 text-sm font-medium text-gray-900">No se encontraron paquetes</h3>
          <p class="mt-1 text-sm text-gray-500">Intenta con otros términos de búsqueda.</p>
        </div>
      </div>
    </div>

    <!-- Modal de detalles del paquete -->
    <PackageDetailModal
      v-if="selectedPackage"
      :package="selectedPackage"
      :is-open="showPackageModal"
      @close="closePackageModal"
      @add-to-cart="addPackageToCart"
    />

    <footer class="bg-gray-800 text-white py-12">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="text-center">
          <img src="/images/Trastalia3.png" alt="Trastalia" class="h-16 w-auto mx-auto mb-4"/>
          <p class="text-gray-400">© 2025 Trastalia. Todos los derechos reservados.</p>
        </div>
      </div>
    </footer>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { getAllPackages, searchPackages } from '@/config/packages'
import UserProfileMenu from '@/components/landing/UserProfileMenu.vue'
import PackageDetailModal from '@/components/modals/PackageDetailModal.vue'

const router = useRouter()
const authStore = useAuthStore()

// Estado
const packages = ref([])
const searchQuery = ref('')
const selectedPackage = ref(null)
const showPackageModal = ref(false)
const mobileMenuOpen = ref(false)
const isScrolled = ref(false)

// Computed
const filteredPackages = computed(() => {
  if (!searchQuery.value.trim()) {
    return packages.value
  }
  
  return searchPackages(searchQuery.value)
})

// Cargar paquetes
const loadPackages = () => {
  packages.value = getAllPackages()
  console.log('📦 Paquetes cargados:', packages.value.length)
}

// Ver detalles del paquete
const viewPackageDetails = (pkg) => {
  selectedPackage.value = pkg
  showPackageModal.value = true
}

// Cerrar modal
const closePackageModal = () => {
  showPackageModal.value = false
  selectedPackage.value = null
}

// Agregar a favoritos
const addToWishlist = (pkg) => {
  if (!authStore.isAuthenticated) {
    router.push('/login')
    return
  }
  
  // TODO: Implementar lógica de favoritos
  console.log('💝 Agregando a favoritos:', pkg.name)
  alert(`"${pkg.name}" agregado a favoritos`)
}

// Agregar paquete al carrito
const addPackageToCart = (pkg) => {
  if (!authStore.isAuthenticated) {
    router.push('/login')
    return
  }
  
  // TODO: Implementar lógica del carrito
  console.log('🛒 Agregando paquete al carrito:', pkg.name)
  alert(`"${pkg.name}" agregado al carrito`)
}

// Funciones para la navbar
const toggleMobileMenu = () => {
  mobileMenuOpen.value = !mobileMenuOpen.value
}

const handleScroll = () => {
  isScrolled.value = window.scrollY > 50
}

// Lifecycle
onMounted(() => {
  loadPackages()
  window.addEventListener('scroll', handleScroll)
})

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll)
})
</script>
