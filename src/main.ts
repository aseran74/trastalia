import './assets/main.css'
// Import Swiper styles
import 'swiper/css'
import 'swiper/css/navigation'
import 'swiper/css/pagination'
import 'jsvectormap/dist/jsvectormap.css'
import 'flatpickr/dist/flatpickr.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import router from './router'
import VueApexCharts from 'vue3-apexcharts'

const app = createApp(App)
const pinia = createPinia()

app.use(pinia)
app.use(router)
app.use(VueApexCharts)

// Configurar el título de la página
document.title = 'Trastalia - Nueva manera de vender artículos de segunda mano'

// Forzar el título cada vez que cambie
const originalTitle = 'Trastalia - Nueva manera de vender artículos de segunda mano'
document.title = originalTitle

// TEMPORALMENTE DESHABILITADO: Observar cambios en el título y corregirlos
// const titleObserver = new MutationObserver(() => {
//   if (document.title !== originalTitle) {
//     console.log('🔧 Título cambiado a:', document.title, '- Corrigiendo a:', originalTitle)
//     document.title = originalTitle
//   }
// })

// Observar cambios en el head
// titleObserver.observe(document.head, {
//   childList: true,
//   subtree: true
// })

// TEMPORALMENTE DESHABILITADO: También escuchar cambios en el título directamente
// let titleCheckInterval = setInterval(() => {
//   if (document.title !== originalTitle) {
//     console.log('🔧 Título detectado como:', document.title, '- Corrigiendo a:', originalTitle)
//     document.title = originalTitle
//   }
// }, 100)

// TEMPORALMENTE DESHABILITADO: Limpiar el intervalo después de 10 segundos
// setTimeout(() => {
//   clearInterval(titleCheckInterval)
// }, 10000)

app.mount('#app')
// Updated for Vercel deployment - 09/29/2025 10:00:56
