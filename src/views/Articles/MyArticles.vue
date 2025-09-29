<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Sidebar -->
    <AppSidebar />
    
    <!-- Header -->
    <AppHeader />
    
    <!-- Backdrop -->
    <Backdrop />
    
    <!-- Main Content -->
    <div class="lg:pl-64">
      <div class="p-8 pl-12">
        <!-- Header -->
        <div class="mb-12">
          <h1 class="text-3xl font-bold text-gray-900">Mis Artículos</h1>
          <p class="text-gray-600 mt-3">Artículos que aún te pertenecen y están disponibles para venta o intercambio</p>
        </div>

        <!-- Stats Cards -->
        <div class="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
          <div class="bg-white rounded-lg shadow p-8">
            <div class="flex items-center">
              <div class="p-2 bg-blue-100 rounded-lg">
                <svg class="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"></path>
                </svg>
              </div>
              <div class="ml-4">
                <p class="text-sm font-medium text-gray-600">Total Artículos</p>
                <p class="text-2xl font-semibold text-gray-900">{{ totalArticles }}</p>
              </div>
            </div>
          </div>

          <div class="bg-white rounded-lg shadow p-8">
            <div class="flex items-center">
              <div class="p-2 bg-green-100 rounded-lg">
                <svg class="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
              </div>
              <div class="ml-4">
                <p class="text-sm font-medium text-gray-600">En Venta</p>
                <p class="text-2xl font-semibold text-gray-900">{{ enVentaCount }}</p>
              </div>
            </div>
          </div>

          <div class="bg-white rounded-lg shadow p-8">
            <div class="flex items-center">
              <div class="p-2 bg-yellow-100 rounded-lg">
                <svg class="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
              </div>
              <div class="ml-4">
                <p class="text-sm font-medium text-gray-600">Pendientes</p>
                <p class="text-2xl font-semibold text-gray-900">{{ pendientesCount }}</p>
              </div>
            </div>
          </div>

          <div class="bg-white rounded-lg shadow p-8">
            <div class="flex items-center">
              <div class="p-2 bg-purple-100 rounded-lg">
                <svg class="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path>
                </svg>
              </div>
              <div class="ml-4">
                <p class="text-sm font-medium text-gray-600">Con Ofertas</p>
                <p class="text-2xl font-semibold text-gray-900">{{ ofertasCount }}</p>
              </div>
            </div>
          </div>
        </div>

        <!-- Filter Tabs -->
        <div class="mb-6">
          <div class="border-b border-gray-200">
            <nav class="-mb-px flex space-x-8">
              <button
                v-for="filter in filters"
                :key="filter.key"
                @click="activeFilter = filter.key"
                :class="[
                  activeFilter === filter.key
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300',
                  'whitespace-nowrap py-2 px-1 border-b-2 font-medium text-sm'
                ]"
              >
                {{ filter.label }} ({{ getFilterCount(filter.key) }})
              </button>
            </nav>
          </div>
        </div>

        <!-- Loading State -->
        <div v-if="loading" class="flex justify-center items-center py-12">
          <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>

        <!-- Error State -->
        <div v-else-if="error" class="text-center py-12">
          <div class="text-red-600 mb-4">
            <svg class="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"></path>
            </svg>
          </div>
          <h3 class="text-lg font-medium text-gray-900 mb-2">Error al cargar artículos</h3>
          <p class="text-gray-600 mb-4">{{ error }}</p>
          <button @click="loadMyArticles" class="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">
            Reintentar
          </button>
        </div>

        <!-- Empty State -->
        <div v-else-if="filteredArticles.length === 0" class="text-center py-12">
          <div class="text-gray-400 mb-4">
            <svg class="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"></path>
            </svg>
          </div>
          <h3 class="text-lg font-medium text-gray-900 mb-2">No tienes artículos aún</h3>
          <p class="text-gray-600 mb-4">Cuando publiques artículos, aparecerán aquí</p>
          <router-link to="/vender-articulo" class="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">
            Publicar Artículo
          </router-link>
        </div>

        <!-- Articles List -->
        <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div v-for="article in filteredArticles" :key="article._id" class="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
            <!-- Article Image -->
            <div class="h-48 bg-gray-200 flex items-center justify-center">
              <img v-if="article.fotos && article.fotos.length > 0" 
                   :src="article.fotos[0]" 
                   :alt="article.nombre"
                   class="w-full h-full object-cover">
              <div v-else class="text-gray-400">
                <svg class="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                </svg>
              </div>
            </div>

            <!-- Article Info -->
            <div class="p-6">
              <h3 class="text-lg font-semibold text-gray-900 mb-2">{{ article.nombre }}</h3>
              <p class="text-gray-600 text-sm mb-4 line-clamp-2">{{ article.descripcion }}</p>
              
              <!-- Price Info -->
              <div class="flex items-center justify-between mb-4">
                <div class="text-2xl font-bold text-green-600">
                  €{{ article.precio_sugerido }}
                </div>
                <span :class="getStatusBadgeClass(article.estado)" class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium">
                  {{ getStatusText(article.estado) }}
                </span>
              </div>

              <!-- Location -->
              <div class="mb-4 flex items-center text-sm text-gray-600">
                <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path>
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path>
                </svg>
                <span>{{ article.ubicacion }}</span>
              </div>

              <!-- Category -->
              <div class="mb-4 flex items-center text-sm text-gray-600">
                <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"></path>
                </svg>
                <span class="capitalize">{{ article.categoria }}</span>
              </div>

              <!-- Published Date -->
              <div class="mb-4 text-xs text-gray-500">
                Publicado: {{ formatDate(article.createdAt) }}
              </div>
            </div>

            <!-- Action Buttons -->
            <div class="px-6 pb-6">
              <div class="flex space-x-2">
                <button
                  @click="editArticle(article)"
                  class="flex-1 rounded bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
                >
                  Editar
                </button>
                <button
                  @click="deleteArticle(article)"
                  class="flex-1 rounded bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700"
                >
                  Eliminar
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useAuthStore } from '@/stores/auth'
import AppSidebar from '@/components/layout/AppSidebar.vue'
import AppHeader from '@/components/layout/AppHeader.vue'
import Backdrop from '@/components/layout/Backdrop.vue'
import { useSidebar } from '@/composables/useSidebar'

const { isOpen } = useSidebar()
const authStore = useAuthStore()

// Estado reactivo
const articles = ref([])
const loading = ref(false)
const error = ref('')
const activeFilter = ref('all')

// Filter options
const filters = [
  { key: 'all', label: 'Todos' },
  { key: 'disponible', label: 'Disponible' },
  { key: 'en_revision', label: 'En Revisión' },
  { key: 'pendiente_aprobacion', label: 'Pendiente Aprobación' }
]

// Computed properties
const totalArticles = computed(() => articles.value.length)

const disponiblesCount = computed(() => 
  articles.value.filter(article => 
    article.estado_articulo === 'disponible' || 
    !article.estado_articulo || 
    article.estado_articulo === null
  ).length
)

const enRevisionCount = computed(() => 
  articles.value.filter(article => 
    article.estado_articulo === 'en_revision' ||
    article.adminStatus === 'pending'
  ).length
)

const pendientesCount = computed(() => 
  articles.value.filter(article => 
    article.estado_articulo === 'pendiente_aprobacion' ||
    article.adminStatus === 'pending_approval'
  ).length
)

const filteredArticles = computed(() => {
  if (activeFilter.value === 'all') {
    return articles.value
  }
  return articles.value.filter(article => article.estado === activeFilter.value)
})

// Cargar artículos del usuario
const loadMyArticles = async () => {
  loading.value = true
  error.value = ''
  
  try {
    const token = localStorage.getItem('auth_token') || sessionStorage.getItem('auth_token')
    const response = await fetch('/api/articles/my-articles', {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    })

    if (!response.ok) {
      throw new Error(`Error ${response.status}: ${response.statusText}`)
    }

    const data = await response.json()
    
    if (data.success) {
      // Filtrar solo artículos que aún no se han vendido
      articles.value = (data.data || []).filter(article => {
        // Excluir artículos vendidos o traspasados
        const estadoVendido = [
          'TRASPASADO_A_TRASTALIA_POR_DINERO',
          'TRASPASADO_A_TRASTALIA_POR_PUNTOS', 
          'COMPRADO_POR_ADMIN',
          'VENDIDO_PUNTOS',
          'VENDIDO_DINERO'
        ]
        
        return !estadoVendido.includes(article.estado_articulo) && !article.comprador
      })
      
      console.log('📦 Artículos del usuario cargados:', articles.value.length)
    } else {
      throw new Error(data.message || 'Error al cargar los artículos')
    }
  } catch (err: any) {
    console.error('Error cargando mis artículos:', err)
    error.value = err.message || 'Error al cargar los artículos'
  } finally {
    loading.value = false
  }
}

// Methods
const getFilterCount = (filterKey: string) => {
  if (filterKey === 'all') return articles.value.length
  return articles.value.filter(article => article.estado === filterKey).length
}

const getStatusBadgeClass = (estado: string) => {
  const classes = {
    'en_venta': 'bg-green-100 text-green-800',
    'solicitud_compra_pendiente': 'bg-yellow-100 text-yellow-800',
    'oferta_enviada': 'bg-purple-100 text-purple-800'
  }
  return classes[estado] || 'bg-gray-100 text-gray-800'
}

const getStatusText = (estado: string) => {
  const texts = {
    'en_venta': 'En Venta',
    'solicitud_compra_pendiente': 'Pendiente Admin',
    'oferta_enviada': 'Con Oferta'
  }
  return texts[estado] || estado
}

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('es-ES', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}

const editArticle = (article: any) => {
  // TODO: Implementar edición de artículo
  console.log('Editar artículo:', article)
}

const deleteArticle = async (article: any) => {
  if (!confirm(`¿Estás seguro de que quieres eliminar "${article.nombre}"?`)) {
    return
  }
  
  try {
    const response = await fetch(`/api/articles/${article._id}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${authStore.token}`
      }
    })
    
    if (response.ok) {
      articles.value = articles.value.filter(a => a._id !== article._id)
      alert('Artículo eliminado correctamente')
    } else {
      alert('Error al eliminar el artículo')
    }
  } catch (error) {
    console.error('Error eliminando artículo:', error)
    alert('Error al eliminar el artículo')
  }
}

// Lifecycle
onMounted(() => {
  loadMyArticles()
})
</script>
