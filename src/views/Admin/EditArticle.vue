<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Header -->
    <div class="bg-white shadow-sm">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between items-center py-6">
          <div class="flex items-center space-x-4">
            <img src="/images/Trastalia3.png" alt="Trastalia" class="h-12 w-auto"/>
            <h1 class="text-2xl font-bold text-gray-900">Editar Artículo</h1>
          </div>
          <div class="flex items-center space-x-4">
            <router-link to="/admin" class="text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium">
              Panel Admin
            </router-link>
            <router-link :to="`/articulos/${articleId}`" class="text-blue-600 hover:text-blue-900 px-3 py-2 rounded-md text-sm font-medium">
              ← Ver Artículo
            </router-link>
          </div>
        </div>
      </div>
    </div>

    <!-- Main Content -->
    <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <!-- Loading State -->
      <div v-if="loading" class="flex justify-center py-12">
        <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>

      <!-- Edit Form -->
      <div v-else-if="article" class="bg-white rounded-lg shadow-lg overflow-hidden">
        <form @submit.prevent="updateArticle" class="p-8 space-y-6">
          <!-- Información Básica -->
          <div class="border-b border-gray-200 pb-6">
            <h2 class="text-lg font-semibold text-gray-900 mb-4">Información Básica</h2>
            
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <!-- Nombre/Título -->
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">Nombre del Artículo</label>
                <input
                  v-model="formData.nombre"
                  type="text"
                  class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Nombre del artículo"
                  required
                />
              </div>

              <!-- Categoría -->
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">Categoría</label>
                <select
                  v-model="formData.categoria"
                  class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                >
                  <option value="">Seleccionar categoría</option>
                  <option value="tecnologia">Tecnología</option>
                  <option value="hogar">Hogar</option>
                  <option value="deportes">Deportes</option>
                  <option value="juegos">Juegos</option>
                  <option value="moda">Moda</option>
                  <option value="libros">Libros</option>
                  <option value="musica">Música</option>
                  <option value="cocina">Cocina</option>
                  <option value="jardineria">Jardinería</option>
                  <option value="automoviles">Automóviles</option>
                  <option value="belleza">Belleza</option>
                  <option value="salud">Salud</option>
                </select>
              </div>
            </div>

            <!-- Descripción -->
            <div class="mt-6">
              <label class="block text-sm font-medium text-gray-700 mb-2">Descripción</label>
              <textarea
                v-model="formData.descripcion"
                rows="4"
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Descripción detallada del artículo"
                required
              ></textarea>
            </div>
          </div>

          <!-- Precios -->
          <div class="border-b border-gray-200 pb-6">
            <h2 class="text-lg font-semibold text-gray-900 mb-4">Precios</h2>
            
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <!-- Precio en dinero -->
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">Precio (€)</label>
                <input
                  v-model.number="formData.precio_propuesto_vendedor"
                  type="number"
                  step="0.01"
                  min="0"
                  class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="0.00"
                />
              </div>

              <!-- Precio en puntos -->
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">Precio en Puntos</label>
                <input
                  v-model.number="formData.precio_puntos"
                  type="number"
                  min="0"
                  class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="0"
                />
              </div>
            </div>
          </div>

          <!-- Estado y Condición -->
          <div class="border-b border-gray-200 pb-6">
            <h2 class="text-lg font-semibold text-gray-900 mb-4">Estado y Condición</h2>
            
            <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
              <!-- Condición -->
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">Condición</label>
                <select
                  v-model="formData.condicion"
                  class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                >
                  <option value="">Seleccionar condición</option>
                  <option value="nuevo">Nuevo</option>
                  <option value="como_nuevo">Como Nuevo</option>
                  <option value="bueno">Bueno</option>
                  <option value="aceptable">Aceptable</option>
                </select>
              </div>

              <!-- Estado del artículo -->
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">Estado del Artículo</label>
                <select
                  v-model="formData.estado_articulo"
                  class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="DRAFT">Borrador</option>
                  <option value="PENDIENTE_APROBACION">Pendiente Aprobación</option>
                  <option value="APROBADO">Aprobado</option>
                  <option value="RECHAZADO">Rechazado</option>
                  <option value="VENDIDO_A_TRASTALIA_DINERO">Vendido a Trastalia (Dinero)</option>
                  <option value="VENDIDO_A_TRASTALIA_PUNTOS">Vendido a Trastalia (Puntos)</option>
                  <option value="COMPRADO_POR_ADMIN">Comprado por Admin</option>
                </select>
              </div>

              <!-- Estado de admin -->
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">Estado Admin</label>
                <select
                  v-model="formData.adminStatus"
                  class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="pending">Pendiente</option>
                  <option value="approved_money">Aprobado (Dinero)</option>
                  <option value="approved_points">Aprobado (Puntos)</option>
                  <option value="rejected">Rechazado</option>
                </select>
              </div>
            </div>
          </div>

          <!-- Ubicación y Logística -->
          <div class="border-b border-gray-200 pb-6">
            <h2 class="text-lg font-semibold text-gray-900 mb-4">Ubicación y Logística</h2>
            
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <!-- Ubicación -->
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">Ubicación</label>
                <input
                  v-model="formData.ubicacion"
                  type="text"
                  class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Ciudad, País"
                />
              </div>

              <!-- Modo de venta -->
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">Modo de Venta</label>
                <select
                  v-model="formData.modo_venta"
                  class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="venta_desde_casa">Venta desde Casa</option>
                  <option value="venta_desde_centro_logistico">Venta desde Centro Logístico</option>
                  <option value="intercambio">Intercambio</option>
                </select>
              </div>
            </div>
          </div>

          <!-- Botones de Acción -->
          <div class="flex justify-end space-x-4">
            <router-link
              :to="`/articulos/${articleId}`"
              class="px-6 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors"
            >
              Cancelar
            </router-link>
            
            <button
              type="submit"
              :disabled="saving"
              class="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center"
            >
              <svg v-if="saving" class="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              {{ saving ? 'Guardando...' : 'Guardar Cambios' }}
            </button>
          </div>
        </form>
      </div>

      <!-- Error State -->
      <div v-else class="text-center py-12">
        <svg class="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.5 0L4.268 19.5c-.77.833.192 2.5 1.732 2.5z" />
        </svg>
        <h3 class="mt-2 text-sm font-medium text-gray-900">Artículo no encontrado</h3>
        <p class="mt-1 text-sm text-gray-500">No se pudo cargar la información del artículo.</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'

const router = useRouter()
const route = useRoute()

// Estado
const article = ref(null)
const loading = ref(false)
const saving = ref(false)
const articleId = ref(null)

// Formulario
const formData = ref({
  nombre: '',
  descripcion: '',
  categoria: '',
  precio_propuesto_vendedor: 0,
  precio_puntos: 0,
  condicion: '',
  estado_articulo: '',
  adminStatus: '',
  ubicacion: '',
  modo_venta: ''
})

// Cargar artículo
const loadArticle = async () => {
  articleId.value = route.params.id
  if (!articleId.value) return

  loading.value = true
  try {
    const token = localStorage.getItem('token')
    const response = await fetch(`/api/articles/${articleId.value}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Authorization': `Bearer ${token}`
      }
    })
    
    if (response.ok) {
      const data = await response.json()
      article.value = data.data || data
      
      // Llenar formulario con datos del artículo
      formData.value = {
        nombre: article.value.nombre || article.value.title || '',
        descripcion: article.value.descripcion || article.value.description || '',
        categoria: article.value.categoria || article.value.category || '',
        precio_propuesto_vendedor: article.value.precio_propuesto_vendedor || article.value.price || 0,
        precio_puntos: article.value.precio_puntos || article.value.points || 0,
        condicion: article.value.condicion || article.value.condition || '',
        estado_articulo: article.value.estado_articulo || article.value.status || '',
        adminStatus: article.value.adminStatus || '',
        ubicacion: article.value.ubicacion || article.value.location || '',
        modo_venta: article.value.modo_venta || article.value.saleMode || ''
      }
    } else {
      console.error('Error cargando artículo:', response.status)
    }
  } catch (error) {
    console.error('Error cargando artículo:', error)
  } finally {
    loading.value = false
  }
}

// Actualizar artículo
const updateArticle = async () => {
  saving.value = true
  try {
    const token = localStorage.getItem('token')
    const response = await fetch(`/api/articles/${articleId.value}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(formData.value)
    })
    
    if (response.ok) {
      const data = await response.json()
      console.log('Artículo actualizado:', data)
      
      // Redirigir a la vista del artículo
      router.push(`/articulos/${articleId.value}`)
    } else {
      const errorData = await response.json()
      console.error('Error actualizando artículo:', errorData)
      alert('Error al actualizar el artículo: ' + (errorData.message || 'Error desconocido'))
    }
  } catch (error) {
    console.error('Error actualizando artículo:', error)
    alert('Error al actualizar el artículo')
  } finally {
    saving.value = false
  }
}

onMounted(() => {
  loadArticle()
})
</script>
