<template>
  <AdminLayout>
    <div class="mx-auto max-w-screen-2xl p-4 md:p-6 2xl:p-10">
      <!-- Header -->
      <div class="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 class="text-title-md2 font-semibold text-black dark:text-white">
            Vender Artículo
          </h2>
          <p class="mt-2 text-sm text-gray-600 dark:text-gray-400">Publica tu artículo para vender o intercambiar</p>
        </div>
      </div>

      <!-- Formulario de Venta -->
      <div class="rounded-sm border border-stroke bg-white p-6 shadow-default dark:border-strokedark dark:bg-boxdark">
        <form @submit.prevent="submitArticle" class="space-y-6">
          <!-- Información básica -->
          <div class="grid grid-cols-1 gap-6 md:grid-cols-2">
            <div>
              <label class="mb-2 block text-sm font-medium text-black dark:text-white">
                Título del artículo *
              </label>
              <input
                v-model="form.title"
                type="text"
                required
                class="w-full rounded border border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                placeholder="Ej: iPhone 12 Pro Max 256GB"
              />
            </div>

            <div>
              <label class="mb-2 block text-sm font-medium text-black dark:text-white">
                Categoría *
              </label>
              <select
                v-model="form.category"
                required
                class="w-full rounded border border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
              >
                <option value="">Selecciona una categoría</option>
                <option value="tecnologia">Tecnología</option>
                <option value="hogar">Hogar</option>
                <option value="deportes">Deportes</option>
                <option value="moda">Moda</option>
                <option value="mascotas">Mascotas</option>
                <option value="herramientas">Herramientas</option>
                <option value="juegos">Juegos</option>
                <option value="electrónica">Electrónica</option>
              </select>
            </div>
          </div>

          <div>
            <label class="mb-2 block text-sm font-medium text-black dark:text-white">
              Descripción *
            </label>
            <textarea
              v-model="form.description"
              required
              rows="4"
              class="w-full rounded border border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
              placeholder="Describe tu artículo en detalle..."
            ></textarea>
          </div>

          <div class="grid grid-cols-1 gap-6 md:grid-cols-3">
            <div>
              <label class="mb-2 block text-sm font-medium text-black dark:text-white">
                Precio (€) *
              </label>
              <input
                v-model.number="form.price"
                type="number"
                required
                min="0"
                step="0.01"
                class="w-full rounded border border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                placeholder="0.00"
              />
            </div>

            <div>
              <label class="mb-2 block text-sm font-medium text-black dark:text-white">
                Condición *
              </label>
              <select
                v-model="form.condition"
                required
                class="w-full rounded border border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
              >
                <option value="">Selecciona condición</option>
                <option value="nuevo">Nuevo</option>
                <option value="excelente">Excelente</option>
                <option value="bueno">Bueno</option>
                <option value="regular">Regular</option>
                <option value="usado">Usado</option>
              </select>
            </div>

            <div>
              <GooglePlacesInput
                v-model="form.location"
                label="Ubicación"
                placeholder="Buscar ubicación..."
                required
                :search-options="{ types: ['geocode'], componentRestrictions: { country: 'es' } }"
                @place-selected="handlePlaceSelected"
                class="w-full"
              />
            </div>
          </div>

          <!-- Opciones de venta -->
          <div class="space-y-4">
            <h3 class="text-lg font-medium text-black dark:text-white">Opciones de Venta</h3>
            
            <!-- Venta desde casa -->
            <div class="rounded-lg border border-stroke p-4 dark:border-strokedark">
              <div class="flex items-center justify-between">
                <div>
                  <h4 class="font-medium text-black dark:text-white">Venta desde casa</h4>
                  <p class="text-sm text-gray-600 dark:text-gray-400">Vende directamente desde tu domicilio</p>
                </div>
                <label class="relative inline-flex cursor-pointer items-center">
                  <input
                    v-model="form.saleOptions.fromHome"
                    type="checkbox"
                    class="peer sr-only"
                  />
                  <div class="peer h-6 w-11 rounded-full bg-gray-200 after:absolute after:top-[2px] after:left-[2px] after:h-5 after:w-5 after:rounded-full after:border after:border-gray-300 after:bg-white after:transition-all after:content-[''] peer-checked:bg-primary peer-checked:after:translate-x-full peer-checked:after:border-white dark:border-gray-600 dark:bg-gray-700"></div>
                </label>
              </div>
            </div>

            <!-- Centro logístico (solo para admins) -->
            <div v-if="authStore.user?.role === 'admin'" class="rounded-lg border border-stroke p-4 dark:border-strokedark">
              <div class="flex items-center justify-between">
                <div>
                  <h4 class="font-medium text-black dark:text-white">Centro logístico</h4>
                  <p class="text-sm text-gray-600 dark:text-gray-400">Envía tu artículo a un centro logístico</p>
                </div>
                <label class="relative inline-flex cursor-pointer items-center">
                  <input
                    v-model="form.saleOptions.fromLogisticsCenter"
                    type="checkbox"
                    class="peer sr-only"
                  />
                  <div class="peer h-6 w-11 rounded-full bg-gray-200 after:absolute after:top-[2px] after:left-[2px] after:h-5 after:w-5 after:rounded-full after:border after:border-gray-300 after:bg-white after:transition-all after:content-[''] peer-checked:bg-primary peer-checked:after:translate-x-full peer-checked:after:border-white dark:border-gray-600 dark:bg-gray-700"></div>
                </label>
              </div>

              <!-- Opciones del centro logístico -->
              <div v-if="form.saleOptions.fromLogisticsCenter" class="mt-4 space-y-4">
                <div class="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <div>
                    <label class="mb-2 block text-sm font-medium text-black dark:text-white">
                      Centro logístico
                    </label>
                    <select
                      v-model="form.logisticsCenter"
                      class="w-full rounded border border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                    >
                      <option value="">Selecciona centro</option>
                      <option v-for="center in logisticsCenters" :key="center._id" :value="center._id">
                        {{ center.name }} - {{ center.city }}
                      </option>
                    </select>
                  </div>

                  <div>
                    <label class="mb-2 block text-sm font-medium text-black dark:text-white">
                      Comisión (%)
                    </label>
                    <input
                      v-model.number="form.commission"
                      type="number"
                      min="0"
                      max="100"
                      step="0.1"
                      class="w-full rounded border border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                      placeholder="10"
                    />
                  </div>
                </div>

                <!-- Opciones de compra por Trastalia -->
                <div class="space-y-3">
                  <h5 class="font-medium text-black dark:text-white">¿Quieres que Trastalia te compre el artículo?</h5>
                  
                  <div class="flex items-center space-x-4">
                    <label class="flex items-center">
                      <input
                        v-model="form.trastaliaOptions.money"
                        type="checkbox"
                        class="rounded border-gray-300 text-primary shadow-sm focus:border-primary focus:ring focus:ring-primary focus:ring-opacity-50"
                      />
                      <span class="ml-2 text-sm text-black dark:text-white">Venta por dinero</span>
                    </label>

                    <label class="flex items-center">
                      <input
                        v-model="form.trastaliaOptions.points"
                        type="checkbox"
                        class="rounded border-gray-300 text-primary shadow-sm focus:border-primary focus:ring focus:ring-primary focus:ring-opacity-50"
                      />
                      <span class="ml-2 text-sm text-black dark:text-white">Venta por puntos</span>
                    </label>
                  </div>

                  <div v-if="form.trastaliaOptions.points" class="mt-3">
                    <label class="mb-2 block text-sm font-medium text-black dark:text-white">
                      Precio en puntos
                    </label>
                    <input
                      v-model.number="form.pointsPrice"
                      type="number"
                      min="0"
                      class="w-full rounded border border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                      placeholder="1000"
                    />
                  </div>

                  <!-- Opciones de aceptación automática -->
                  <div v-if="form.trastaliaOptions.money || form.trastaliaOptions.points" class="mt-4 p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
                    <h6 class="font-medium text-blue-900 dark:text-blue-100 mb-3">Opciones de Aceptación Automática</h6>
                    <p class="text-sm text-blue-800 dark:text-blue-200 mb-3">
                      Si Trastalia ofrece un precio un 20% menor al sugerido, ¿quieres aceptar automáticamente?
                    </p>
                    
                    <div class="space-y-2">
                      <label v-if="form.trastaliaOptions.money" class="flex items-center">
                        <input
                          v-model="form.autoAcceptOptions.money"
                          type="checkbox"
                          class="rounded border-gray-300 text-green-600 shadow-sm focus:border-green-300 focus:ring focus:ring-green-200 focus:ring-opacity-50"
                        />
                        <span class="ml-2 text-sm text-black dark:text-white">
                          Aceptar automáticamente ofertas de dinero (20% menos)
                        </span>
                      </label>

                      <label v-if="form.trastaliaOptions.points" class="flex items-center">
                        <input
                          v-model="form.autoAcceptOptions.points"
                          type="checkbox"
                          class="rounded border-gray-300 text-green-600 shadow-sm focus:border-green-300 focus:ring focus:ring-green-200 focus:ring-opacity-50"
                        />
                        <span class="ml-2 text-sm text-black dark:text-white">
                          Aceptar automáticamente ofertas de puntos (20% menos)
                        </span>
                      </label>
                    </div>
                    
                    <p class="text-xs text-blue-600 dark:text-blue-300 mt-2">
                      Si no marcas estas opciones, siempre tendrás que validar manualmente las ofertas en "Solicitudes de Compra"
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Botones -->
          <div class="flex justify-end space-x-4">
            <button
              type="button"
              @click="resetForm"
              class="inline-flex items-center justify-center rounded-md border border-stroke bg-white py-3 px-6 text-center font-medium text-black hover:bg-opacity-90 dark:border-strokedark dark:bg-boxdark dark:text-white"
            >
              Cancelar
            </button>
            <button
              type="submit"
              :disabled="loading"
              class="inline-flex items-center justify-center rounded-md bg-primary py-3 px-6 text-center font-medium text-white hover:bg-opacity-90 disabled:opacity-50"
            >
              <span v-if="loading" class="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></span>
              {{ loading ? 'Publicando...' : 'Publicar Artículo' }}
            </button>
          </div>
        </form>
      </div>
    </div>
  </AdminLayout>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import AdminLayout from '@/components/layout/AdminLayout.vue'
import GooglePlacesInput from '@/components/GooglePlacesInput.vue'

// Interfaz para centro logístico
interface LogisticsCenter {
  _id: string
  name: string
  city: string
  address?: string
  capacity?: number
}

const router = useRouter()
const authStore = useAuthStore()

// Estado reactivo
const loading = ref(false)
const logisticsCenters = ref<LogisticsCenter[]>([])

// Formulario
const form = ref({
  title: '',
  description: '',
  price: 0,
  pointsPrice: 0,
  category: '',
  condition: '',
  location: '',
  saleOptions: {
    fromHome: false,
    fromLogisticsCenter: false
  },
  logisticsCenter: '',
  commission: 10,
  trastaliaOptions: {
    money: false,
    points: false
  },
  autoAcceptOptions: {
    money: false,
    points: false
  }
})

// Cargar centros logísticos
const loadLogisticsCenters = async () => {
  try {
    const response = await fetch('/api/logistics-centers', {
      headers: {
        'Authorization': `Bearer ${authStore.token}`
      }
    })
    
    if (response.ok) {
      const data = await response.json()
      logisticsCenters.value = data.data || []
    }
  } catch (error) {
    console.error('Error cargando centros logísticos:', error)
  }
}

// Manejar selección de lugar de Google Places
const handlePlaceSelected = (place: any) => {
  console.log('Lugar seleccionado:', place)
  // El valor ya se actualiza automáticamente por v-model
  // Aquí puedes agregar lógica adicional si necesitas procesar el lugar seleccionado
}

// Enviar formulario
const submitArticle = async () => {
  loading.value = true
  
  try {
    // Determinar el modo de venta
    let saleMode = 'direct_from_home'
    let adminStatus = 'approved_money' // Por defecto aprobado para venta directa
    
    // Solo los admins pueden usar centro logístico
    if (authStore.user?.role === 'admin' && form.value.saleOptions.fromLogisticsCenter) {
      saleMode = 'logistics_center'
      
      // Si eligió que Trastalia compre, necesita aprobación del admin
      if (form.value.trastaliaOptions.money || form.value.trastaliaOptions.points) {
        adminStatus = 'pending'
      } else {
        adminStatus = 'approved_money'
      }
    }

    const articleData = {
      title: form.value.title,
      description: form.value.description,
      price: form.value.price,
      pointsPrice: form.value.pointsPrice || 0,
      category: form.value.category,
      condition: form.value.condition,
      location: form.value.location,
      saleMode,
      isForSale: true,
      isForExchange: false,
      images: [],
      tags: [],
      directFromHome: {
        enabled: form.value.saleOptions.fromHome,
        price: form.value.price,
        shippingCost: 0
      },
      logisticsCenterSale: {
        enabled: form.value.saleOptions.fromLogisticsCenter,
        price: form.value.price,
        commission: form.value.commission / 100,
        storageCost: 5,
        logisticsCenter: form.value.logisticsCenter
      },
      trastaliaPurchase: {
        enabled: form.value.trastaliaOptions.money || form.value.trastaliaOptions.points,
        adminPrice: 0,
        demandLevel: 'medium',
        adminApproved: false,
        autoAcceptMoney: form.value.autoAcceptOptions.money,
        autoAcceptPoints: form.value.autoAcceptOptions.points
      },
      pointsExchange: {
        enabled: form.value.trastaliaOptions.points,
        pointsPrice: form.value.pointsPrice,
        pointsPerEuro: 100
      },
      useLogisticsCenter: form.value.saleOptions.fromLogisticsCenter,
      adminStatus
    }

    const response = await fetch('/api/articles', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${authStore.token}`
      },
      body: JSON.stringify(articleData)
    })

    if (response.ok) {
      const data = await response.json()
      
      if (adminStatus === 'pending') {
        alert('Artículo enviado para revisión del administrador. Te notificaremos cuando sea aprobado.')
      } else {
        alert('Artículo publicado exitosamente.')
      }
      
      router.push('/mis-articulos')
    } else {
      const error = await response.json()
      alert(`Error: ${error.message}`)
    }
  } catch (error) {
    console.error('Error publicando artículo:', error)
    alert('Error al publicar el artículo. Inténtalo de nuevo.')
  } finally {
    loading.value = false
  }
}

// Resetear formulario
const resetForm = () => {
  form.value = {
    title: '',
    description: '',
    price: 0,
    pointsPrice: 0,
    category: '',
    condition: '',
    location: '',
    saleOptions: {
      fromHome: false,
      fromLogisticsCenter: false
    },
    logisticsCenter: '',
    commission: 10,
    trastaliaOptions: {
      money: false,
      points: false
    },
    autoAcceptOptions: {
      money: false,
      points: false
    }
  }
}

// Lifecycle
onMounted(() => {
  // Solo cargar centros logísticos si el usuario es admin
  if (authStore.user?.role === 'admin') {
    loadLogisticsCenters()
  }
})
</script>
