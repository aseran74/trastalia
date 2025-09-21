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
                Nombre del artículo *
              </label>
              <input
                v-model="form.nombre"
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
                v-model="form.categoria"
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
                <option value="electronica">Electrónica</option>
              </select>
            </div>
          </div>

          <div class="grid grid-cols-1 gap-6 md:grid-cols-2">
            <div>
              <label class="mb-2 block text-sm font-medium text-black dark:text-white">
                Precio propuesto (€) *
              </label>
              <input
                v-model.number="form.precio_propuesto_vendedor"
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
                v-model="form.condicion"
                required
                class="w-full rounded border border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
              >
                <option value="">Selecciona la condición</option>
                <option value="nuevo">Nuevo</option>
                <option value="excelente">Excelente</option>
                <option value="bueno">Bueno</option>
                <option value="regular">Regular</option>
                <option value="usado">Usado</option>
              </select>
            </div>
          </div>

          <div>
            <label class="mb-2 block text-sm font-medium text-black dark:text-white">
              Descripción *
            </label>
            <textarea
              v-model="form.descripcion"
              required
              rows="4"
              class="w-full rounded border border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
              placeholder="Describe tu artículo en detalle..."
            ></textarea>
          </div>

          <div>
            <GooglePlacesInput
              v-model="form.ubicacion"
              label="Ubicación"
              placeholder="Buscar ubicación..."
              required
              :search-options="{ types: ['geocode'], componentRestrictions: { country: 'es' } }"
              @place-selected="handlePlaceSelected"
              class="w-full"
            />
          </div>

          <!-- Modalidad de venta -->
          <div class="space-y-4">
            <h3 class="text-lg font-medium text-black dark:text-white">Modalidad de Venta</h3>
            
            <!-- Venta directa desde casa -->
            <div class="rounded-lg border border-stroke p-4 dark:border-strokedark">
              <label class="flex items-center space-x-3">
                <input
                  v-model="form.modo_venta"
                  value="directa_casa"
                  type="radio"
                  name="modo_venta"
                  class="text-blue-600 focus:ring-blue-500"
                />
                <div>
                  <span class="font-medium text-black dark:text-white">Venta Directa desde Casa</span>
                  <p class="text-sm text-gray-600 dark:text-gray-400">
                    El comprador te contacta directamente. Solo pagas gastos de envío.
                  </p>
                </div>
              </label>
            </div>

            <!-- Venta desde centro logístico -->
            <div class="rounded-lg border border-stroke p-4 dark:border-strokedark">
              <label class="flex items-center space-x-3">
                <input
                  v-model="form.modo_venta"
                  value="centro_logistico"
                  type="radio"
                  name="modo_venta"
                  class="text-green-600 focus:ring-green-500"
                />
                <div>
                  <span class="font-medium text-black dark:text-white">Venta desde Centro Logístico</span>
                  <p class="text-sm text-gray-600 dark:text-gray-400">
                    Nosotros gestionamos la recogida y almacenamiento. Más opciones de venta.
                  </p>
                </div>
              </label>
            </div>
          </div>

          <!-- Opciones del centro logístico -->
          <div v-if="form.modo_venta === 'centro_logistico'" class="space-y-4">
            <h3 class="text-lg font-medium text-black dark:text-white">Opciones del Centro Logístico</h3>
            <p class="text-sm text-gray-600 dark:text-gray-400">
              Puedes seleccionar múltiples opciones. El administrador decidirá cuál aplicar.
            </p>
            
            <!-- Opción 1: Porcentaje fijo -->
            <div class="rounded-lg border border-stroke p-4 dark:border-strokedark">
              <label class="flex items-center space-x-3">
                <input
                  v-model="form.opciones_logisticas"
                  value="porcentaje_fijo"
                  type="checkbox"
                  class="rounded border-gray-300 text-green-600 shadow-sm focus:border-green-300 focus:ring focus:ring-green-200 focus:ring-opacity-50"
                />
                <div>
                  <span class="font-medium text-black dark:text-white">Comisión por Venta (3%)</span>
                  <p class="text-sm text-gray-600 dark:text-gray-400">
                    Pagas 3% de comisión solo si se vende el artículo.
                  </p>
                </div>
              </label>
            </div>

            <!-- Opción 2: Compra directa -->
            <div class="rounded-lg border border-stroke p-4 dark:border-strokedark">
              <label class="flex items-center space-x-3">
                <input
                  v-model="form.opciones_logisticas"
                  value="compra_directa"
                  type="checkbox"
                  class="rounded border-gray-300 text-blue-600 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
                />
                <div>
                  <span class="font-medium text-black dark:text-white">Compra Directa por Trastalia</span>
                  <p class="text-sm text-gray-600 dark:text-gray-400">
                    Te compramos el artículo directamente si nos interesa.
                  </p>
                </div>
              </label>
            </div>

            <!-- Opción 3: Intercambio por puntos -->
            <div class="rounded-lg border border-stroke p-4 dark:border-strokedark">
              <label class="flex items-center space-x-3">
                <input
                  v-model="form.opciones_logisticas"
                  value="intercambio_puntos"
                  type="checkbox"
                  class="rounded border-gray-300 text-purple-600 shadow-sm focus:border-purple-300 focus:ring focus:ring-purple-200 focus:ring-opacity-50"
                />
                <div>
                  <span class="font-medium text-black dark:text-white">Intercambio por Puntos</span>
                  <p class="text-sm text-gray-600 dark:text-gray-400">
                    Recibe puntos para canjear por otros artículos.
                  </p>
                </div>
              </label>
            </div>

            <!-- Checkbox de descuento automático -->
            <div v-if="form.opciones_logisticas.includes('compra_directa') || form.opciones_logisticas.includes('intercambio_puntos')" class="rounded-lg border border-stroke p-4 dark:border-strokedark bg-blue-50 dark:bg-blue-900/20">
              <label class="flex items-center space-x-3">
                <input
                  v-model="form.acepta_descuento_admin"
                  type="checkbox"
                  class="rounded border-gray-300 text-blue-600 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
                />
                <div>
                  <span class="font-medium text-black dark:text-white">Aceptar descuento automático (hasta 20%)</span>
                  <p class="text-sm text-gray-600 dark:text-gray-400">
                    Si nuestra oferta es hasta 20% menor a tu precio, se acepta automáticamente.
                  </p>
                </div>
              </label>
            </div>
          </div>

          <!-- Botones -->
          <div class="flex justify-end space-x-4">
            <button
              type="button"
              @click="router.back()"
              class="rounded-lg border border-stroke bg-white px-6 py-3 text-black transition hover:bg-gray-50 dark:border-strokedark dark:bg-boxdark dark:text-white dark:hover:bg-boxdark-2"
            >
              Cancelar
            </button>
            <button
              type="submit"
              :disabled="loading"
              class="rounded-lg bg-primary px-6 py-3 text-white transition hover:bg-opacity-90 disabled:opacity-50"
            >
              <span v-if="loading">Publicando...</span>
              <span v-else>Publicar Artículo</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  </AdminLayout>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { useToast } from '@/composables/useToast'
import AdminLayout from '@/components/layout/AdminLayout.vue'
import GooglePlacesInput from '@/components/GooglePlacesInput.vue'
import API_BASE_URL from '@/config/api'

// Interfaces
interface ArticleForm {
  nombre: string
  descripcion: string
  categoria: string
  precio_propuesto_vendedor: number
  condicion: string
  ubicacion: string
  modo_venta: 'directa_casa' | 'centro_logistico'
  opciones_logisticas: string[]
  acepta_descuento_admin: boolean
}

const router = useRouter()
const authStore = useAuthStore()
const toast = useToast()

// Estado reactivo
const loading = ref(false)

// Formulario según el guion
const form = ref<ArticleForm>({
  nombre: '',
  descripcion: '',
  categoria: '',
  precio_propuesto_vendedor: 0,
  condicion: '',
  ubicacion: '',
  modo_venta: 'directa_casa',
  opciones_logisticas: [], // Array para múltiples opciones
  acepta_descuento_admin: false
})

// Manejar selección de lugar de Google Places
const handlePlaceSelected = (place: any) => {
  console.log('Lugar seleccionado:', place)
}

// Enviar formulario
const submitArticle = async () => {
  loading.value = true
  
  try {
    // Determinar el estado inicial según el modo de venta y opciones logísticas
    let estado_inicial = 'DRAFT'
    
    if (form.value.modo_venta === 'directa_casa') {
      estado_inicial = 'EN_VENTA'
    } else if (form.value.modo_venta === 'centro_logistico') {
      // Si hay opciones logísticas seleccionadas (compra directa o intercambio por puntos)
      if (form.value.opciones_logisticas && form.value.opciones_logisticas.length > 0) {
        estado_inicial = 'PENDIENTE_APROBACION_ADMIN'
      } else {
        // Solo venta en centro logístico sin compra directa
        estado_inicial = 'EN_LOGISTICA'
      }
    }

    // Configurar opciones de compra directa e intercambio por puntos
    const hasCompraDirecta = form.value.opciones_logisticas.includes('compra_directa')
    const hasIntercambioPuntos = form.value.opciones_logisticas.includes('intercambio_puntos')
    
    // Crear el artículo según el nuevo modelo
    const articleData = {
      nombre: form.value.nombre,
      descripcion: form.value.descripcion,
      categoria: form.value.categoria,
      precio_propuesto_vendedor: form.value.precio_propuesto_vendedor,
      condicion: form.value.condicion,
      ubicacion: form.value.ubicacion,
      modo_venta: form.value.modo_venta,
      opciones_logisticas: form.value.opciones_logisticas, // Array de opciones seleccionadas
      acepta_descuento_admin: form.value.acepta_descuento_admin,
      estado_articulo: estado_inicial,
      id_vendedor: authStore.user?.id,
      
      // Configurar opciones de compra directa e intercambio por puntos
      trastaliaPurchase: {
        enabled: hasCompraDirecta || hasIntercambioPuntos,
        adminPrice: 0,
        demandLevel: 'medium',
        adminApproved: false,
        autoAcceptMoney: form.value.acepta_descuento_admin && hasCompraDirecta,
        autoAcceptPoints: form.value.acepta_descuento_admin && hasIntercambioPuntos
      },
      pointsExchange: {
        enabled: hasIntercambioPuntos,
        pointsPrice: hasIntercambioPuntos ? form.value.precio_propuesto_vendedor * 100 : 0,
        pointsPerEuro: 100
      },
      
      // Configurar centro logístico
      logisticsCenterSale: {
        enabled: form.value.modo_venta === 'centro_logistico',
        commission: 0.1, // 10% de comisión
        storageCost: 5, // Costo de almacenamiento por día
        logisticsCenter: form.value.modo_venta === 'centro_logistico' ? '68cd4472601315508398cd59' : null
      },
      
      // Configurar venta directa desde casa
      directFromHome: {
        enabled: form.value.modo_venta === 'directa_casa',
        shippingCost: 0 // El vendedor se encarga del envío
      },
      
      // Campos de compatibilidad
      title: form.value.nombre,
      description: form.value.descripcion,
      price: form.value.precio_propuesto_vendedor,
      category: form.value.categoria,
      condition: form.value.condicion,
      location: form.value.ubicacion,
      saleMode: form.value.modo_venta,
      seller: authStore.user?.id,
      images: [],
      tags: [],
      views: 0
    }

    console.log('🔍 Enviando artículo con lógica de datos:')
    console.log('- Modo de venta:', form.value.modo_venta)
    console.log('- Opciones logísticas:', form.value.opciones_logisticas)
    console.log('- Acepta descuento admin:', form.value.acepta_descuento_admin)
    console.log('- Estado inicial:', estado_inicial)
    console.log('- Compra directa:', hasCompraDirecta)
    console.log('- Intercambio por puntos:', hasIntercambioPuntos)
    console.log('- Datos completos:', articleData)

    const response = await fetch(`${API_BASE_URL}/api/articles`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${authStore.token}`
      },
      body: JSON.stringify(articleData)
    })

    if (response.ok) {
      const result = await response.json()
      console.log('Artículo creado:', result)
      
      // Mostrar toast de éxito
      toast.success(
        '¡Artículo publicado!',
        `Tu artículo "${form.value.nombre}" ha sido publicado correctamente.`,
        { duration: 4000 }
      )
      
      // Redirigir según el modo de venta
      if (form.value.modo_venta === 'directa_casa') {
        router.push('/mis-articulos')
      } else {
        router.push('/mis-articulos')
      }
    } else {
      const error = await response.json()
      console.error('Error creando artículo:', error)
      toast.error(
        'Error al publicar',
        error.message || 'No se pudo publicar el artículo. Inténtalo de nuevo.',
        { duration: 6000 }
      )
    }
  } catch (error) {
    console.error('Error:', error)
    toast.error(
      'Error de conexión',
      'No se pudo conectar con el servidor. Verifica tu conexión.',
      { duration: 6000 }
    )
  } finally {
    loading.value = false
  }
}
</script>
