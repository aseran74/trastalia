<template>
  <button
    @click="handleGoogleSignIn"
    :disabled="loading"
    class="w-full flex items-center justify-center gap-3 px-4 py-3 bg-white border border-gray-300 rounded-lg shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
  >
    <svg v-if="!loading" class="w-5 h-5" viewBox="0 0 24 24">
      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
      <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
    </svg>
    <div v-if="loading" class="w-5 h-5 border-2 border-gray-300 border-t-blue-500 rounded-full animate-spin"></div>
    <span class="text-sm font-medium text-gray-700">
      {{ loading ? 'Iniciando sesión...' : 'Continuar con Google' }}
    </span>
  </button>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { signInWithGoogle } from '@/firebase/auth'
import { useAuthStore } from '@/stores/auth'

const router = useRouter()
const authStore = useAuthStore()
const loading = ref(false)

const handleGoogleSignIn = async () => {
  loading.value = true
  
  try {
    const result = await signInWithGoogle()
    
    if (result.success) {
      console.log('✅ Firebase Auth exitoso, sincronizando con MongoDB...')
      
      // Llamar al backend para crear/obtener usuario en MongoDB
      console.log('🔄 Calling backend sync endpoint...')
      const syncResponse = await fetch('http://localhost:3002/api/auth/firebase-user', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          uid: result.user.uid,
          email: result.user.email,
          name: result.user.name,
          photoURL: result.user.photoURL
        })
      })
      
      console.log('📡 Sync response status:', syncResponse.status)
      console.log('📡 Sync response headers:', syncResponse.headers)
      
      if (!syncResponse.ok) {
        const errorText = await syncResponse.text()
        console.error('❌ Sync response error:', errorText)
        throw new Error(`HTTP ${syncResponse.status}: ${errorText}`)
      }
      
      const syncData = await syncResponse.json()
      console.log('📦 Sync response data:', syncData)
      
      if (syncData.success) {
        console.log('✅ Usuario sincronizado con MongoDB:', syncData.data.user)
        
        // Guardar datos del backend (MongoDB)
        localStorage.setItem('auth_token', syncData.data.token)
        localStorage.setItem('user_data', JSON.stringify(syncData.data.user))
        
        // Actualizar el store con datos del backend
        authStore.user = syncData.data.user
        authStore.token = syncData.data.token
        
        // Redirigir según el rol del usuario
        if (syncData.data.user.role === 'admin') {
          router.push('/dashboard')
        } else {
          router.push('/comprar-articulos')
        }
      } else {
        console.error('❌ Error sincronizando con MongoDB:', syncData.message)
        alert('Error al sincronizar usuario: ' + syncData.message)
      }
    } else {
      console.error('❌ Error en Firebase Auth:', result.error)
      alert('Error al iniciar sesión con Google: ' + result.error)
    }
  } catch (error) {
    console.error('❌ Error inesperado:', error)
    alert('Error inesperado al iniciar sesión')
  } finally {
    loading.value = false
  }
}
</script>
