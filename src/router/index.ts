import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  scrollBehavior(to, from, savedPosition) {
    return savedPosition || { left: 0, top: 0 }
  },
  routes: [
    {
      path: '/',
      name: 'Landing',
      component: () => import('../views/LandingPage.vue'),
      meta: {
        title: 'Trastalia - Nueva manera de vender artículos de segunda mano',
        requiresAuth: false
      },
    },
      {
        path: '/articulos',
        name: 'Public Articles',
        component: () => import('../views/Public/PublicBuyArticlesUltraSimple.vue'),
        meta: {
          title: 'Artículos Disponibles - Trastalia',
          requiresAuth: false
        },
      },
      {
        path: '/articulos/:id',
        name: 'Article Detail',
        component: () => import('../views/Public/ArticleDetailNew.vue'),
        meta: {
          title: 'Detalle del Artículo - Trastalia',
          requiresAuth: false
        },
      },
      {
        path: '/paquetes',
        name: 'Themed Packages',
        component: () => import('../views/Packages/ThemedPackages.vue'),
        meta: {
          title: 'Paquetes Temáticos - Trastalia',
          requiresAuth: false
        },
      },
    {
      path: '/auth/callback',
      name: 'AuthCallback',
      component: () => import('../views/Auth/AuthCallback.vue'),
      meta: {
        title: 'Autenticación - Trastalia',
        requiresAuth: false
      },
    },
    {
      path: '/login',
      name: 'Login',
      component: () => import('../views/Auth/LoginPage.vue'),
      meta: {
        title: 'Iniciar Sesión - Trastalia',
        requiresAuth: false
      },
    },
    {
      path: '/dashboard',
      name: 'Dashboard',
      component: () => import('../views/Admin/RealDashboard.vue'),
      meta: {
        title: 'Dashboard de Administración',
        requiresAuth: true
      },
    },
    {
      path: '/comprar-articulos',
      name: 'Comprar Articulos',
      component: () => import('../views/Articles/BuyArticle.vue'),
      meta: {
        title: 'Comprar Artículos',
        requiresAuth: true
      },
    },
      {
        path: '/mis-compras',
        name: 'My Purchases',
        component: () => import('../views/Articles/MyPurchases.vue'),
        meta: {
          title: 'Mis Canjes - Trastalia',
          requiresAuth: true
        },
      },
      {
        path: '/mis-compras-dinero',
        name: 'My Money Purchases',
        component: () => import('../views/Articles/MyMoneyPurchases.vue'),
        meta: {
          title: 'Mis Compras - Trastalia',
          requiresAuth: true
        },
      },
    {
      path: '/vender-articulo',
      name: 'Vender Articulo',
      component: () => import('../views/Articles/SellArticleNew.vue'),
      meta: {
        title: 'Vender Artículo',
        requiresAuth: true
      },
    },
    {
      path: '/vender-articulo-nuevo',
      name: 'Sell Article New Logic',
      component: () => import('../views/Articles/SellArticleNewLogic.vue'),
      meta: {
        title: 'Vender Artículo - Nueva Lógica',
        requiresAuth: true
      },
    },
    {
      path: '/articulo/:id',
      name: 'Detalle Articulo',
      component: () => import('../views/Articles/ArticleDetail.vue'),
      meta: {
        title: 'Detalle del Artículo',
        requiresAuth: true
      },
    },
    {
      path: '/mis-intercambios',
      name: 'Mis Canjes',
      component: () => import('../views/Articles/MyExchanges.vue'),
      meta: {
        title: 'Mis Canjes',
        requiresAuth: true
      },
    },
    {
      path: '/articulos-vendidos',
      name: 'Articulos Vendidos',
      component: () => import('../views/Articles/SoldArticles.vue'),
      meta: {
        title: 'Artículos Vendidos',
        requiresAuth: true
      },
    },
    {
      path: '/mis-articulos',
      name: 'Mis Artículos',
      component: () => import('../views/Articles/MyArticles.vue'),
      meta: {
        title: 'Mis Artículos',
        requiresAuth: true
      },
    },
    {
      path: '/mis-transacciones-puntos',
      name: 'Historial Puntos',
      component: () => import('../views/Points/PointsHistory.vue'),
      meta: {
        title: 'Historial de Puntos',
        requiresAuth: true
      },
    },
    {
      path: '/mis-solicitudes-compra',
      name: 'Mis Solicitudes Compra',
      component: () => import('../views/TrastaliaPurchases/PurchaseRequestsNew.vue'),
      meta: {
        title: 'Mis Solicitudes de Compra',
        requiresAuth: true
      },
    },
    {
      path: '/mi-nave',
      name: 'Mi Nave',
      component: () => import('../views/Logistics/MyShip.vue'),
      meta: {
        title: 'Mi Nave',
        requiresAuth: true
      },
    },
    {
      path: '/centros-logisticos',
      name: 'Centros Logísticos',
      component: () => import('../views/Logistics/LogisticsCenters.vue'),
      meta: {
        title: 'Centros Logísticos',
        requiresAuth: true
      },
    },
    {
      path: '/ventas-gestionadas',
      name: 'ManagedSalesStats',
      component: () => import('../views/Admin/ManagedSalesStats.vue'),
      meta: {
        title: 'Ventas Gestionadas',
        requiresAuth: true,
        requiresAdmin: true
      },
    },
    {
      path: '/servicios-logisticos',
      name: 'Servicios Logísticos',
      component: () => import('../views/Logistics/LogisticsServices.vue'),
      meta: {
        title: 'Servicios Logísticos',
        requiresAuth: true
      },
    },
    {
      path: '/profile',
      name: 'Profile',
      component: () => import('../views/Others/UserProfile.vue'),
      meta: {
        title: 'Profile',
        requiresAuth: true
      },
    },
    {
      path: '/error-404',
      name: '404 Error',
      component: () => import('../views/Errors/FourZeroFour.vue'),
      meta: {
        title: '404 Error',
      },
    },
    {
      path: '/google-places-example',
      name: 'Google Places Example',
      component: () => import('../views/Examples/GooglePlacesExample.vue'),
      meta: {
        title: 'Google Places Example',
        requiresAuth: true
      },
    },
    {
      path: '/test-google-places',
      name: 'Test Google Places',
      component: () => import('../views/TestGooglePlaces.vue'),
      meta: {
        title: 'Test Google Places',
        requiresAuth: true
      },
    },
    {
      path: '/toast-demo',
      name: 'Toast Demo',
      component: () => import('../views/ToastDemo.vue'),
      meta: {
        title: 'Demostración de Toasts',
        requiresAuth: true
      },
    },
    {
      path: '/notifications',
      name: 'Notifications',
      component: () => import('../views/Notifications.vue'),
      meta: {
        title: 'Notificaciones',
        requiresAuth: true
      },
    },
    {
      path: '/admin',
      name: 'Admin Dashboard',
      component: () => import('../views/Admin/RealDashboard.vue'),
      meta: {
        title: 'Panel de Administración',
        requiresAuth: true,
        requiresAdmin: true
      },
    },
      {
        path: '/admin/articles-management',
        name: 'Admin Articles Management',
        component: () => import('../views/Admin/AdminDashboard.vue'),
        meta: {
          title: 'Editar Artículos',
          requiresAuth: true,
          requiresAdmin: true
        },
      },
      {
        path: '/admin/purchase-requests',
        name: 'Manage Purchase Requests',
        component: () => import('../views/Admin/ManagePurchaseRequests.vue'),
        meta: {
          title: 'Gestionar Solicitudes de Compra',
          requiresAuth: true,
          requiresAdmin: true
        },
      },
      {
        path: '/admin/articulos',
        name: 'Article Management',
        component: () => import('../views/Admin/ArticleManagement.vue'),
        meta: {
          title: 'Gestión de Artículos',
          requiresAuth: true,
          requiresAdmin: true
        },
      },
      {
        path: '/admin/articulos/pendientes-valoracion',
        name: 'Pending Price Valuation',
        component: () => import('../views/Admin/PendingPriceValuation.vue'),
        meta: {
          title: 'Pendientes de Valoración',
          requiresAuth: true,
          requiresAdmin: true
        },
      },
      {
        path: '/admin/articulos/:id/editar',
        name: 'Edit Article',
        component: () => import('../views/Admin/EditArticle.vue'),
        meta: {
          title: 'Editar Artículo',
          requiresAuth: true,
          requiresAdmin: true
        },
      },
    {
      path: '/admin/articles',
      name: 'Admin Articles',
      component: () => import('../views/AdminArticles.vue'),
      meta: {
        title: 'Administración de Artículos',
        requiresAuth: true,
        requiresAdmin: true
      },
    },
    {
      path: '/payment/success',
      name: 'Payment Success',
      component: () => import('../views/Payment/PaymentSuccess.vue'),
      meta: {
        title: 'Pago Exitoso - Trastalia',
        requiresAuth: true
      },
    },
    {
      path: '/payment/cancel',
      name: 'Payment Cancel',
      component: () => import('../views/Payment/PaymentCancel.vue'),
      meta: {
        title: 'Pago Cancelado - Trastalia',
        requiresAuth: false
      },
    },

  ],
})

export default router

router.beforeEach(async (to, from, next) => {
  const authStore = useAuthStore()
  
  console.log('🛣️ Router Guard:', {
    to: to.path,
    from: from.path,
    requiresAuth: to.meta.requiresAuth,
    isAuthenticated: authStore.isAuthenticated,
    user: authStore.user?.email
  })
  
  // Evitar verificaciones innecesarias si ya estamos en la misma ruta
  if (to.path === from.path) {
    next()
    return
  }
  
  // Actualizar título
  document.title = `${to.meta.title} - Trastalia`
  
  // Verificar si la ruta requiere autenticación explícitamente
  const requiresAuth = to.meta.requiresAuth === true
  
  // Verificar si hay token en storage
  const hasToken = !!(localStorage.getItem('auth_token') || sessionStorage.getItem('auth_token'))
  const hasUserData = !!(localStorage.getItem('user_data') || sessionStorage.getItem('user_data'))
  
  // Si hay datos de usuario en storage pero no está autenticado, cargar datos locales
  if (hasToken && hasUserData && !authStore.isAuthenticated) {
    console.log('🔄 Router: Cargando datos de usuario desde storage...')
    try {
      const userData = JSON.parse(localStorage.getItem('user_data') || sessionStorage.getItem('user_data'))
      const token = localStorage.getItem('auth_token') || sessionStorage.getItem('auth_token')
      
      // Actualizar el store directamente
      authStore.$patch({
        user: userData,
        token: token
      })
      
      console.log('✅ Usuario cargado desde storage:', userData.email)
    } catch (error) {
      console.error('❌ Error cargando datos de usuario:', error)
    }
  }
  
  console.log('🔐 Auth check:', { 
    requiresAuth, 
    isAuthenticated: authStore.isAuthenticated,
    hasToken,
    userRole: authStore.user?.role
  })
  
  // Si la ruta requiere autenticación y no está autenticado
  if (requiresAuth && !authStore.isAuthenticated) {
    console.log('❌ Redirigiendo a login - requiere autenticación')
    next('/login')
  } else if (to.path === '/login' && authStore.isAuthenticated) {
    // Si ya está autenticado y va a login, redirigir según el rol
    console.log('✅ Ya autenticado, redirigiendo según rol')
    if (authStore.user?.role === 'admin') {
      next('/admin')
    } else {
      next('/comprar-articulos')
    }
  } else if (to.meta.requiresAdmin && authStore.user?.role !== 'admin') {
    // Si requiere admin y no es admin
    console.log('❌ No es admin, redirigiendo')
    next('/comprar-articulos')
  } else {
    // Todo OK, permitir navegación
    console.log('✅ Navegación permitida')
    next()
  }
})



