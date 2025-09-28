import { 
  signInWithPopup, 
  signOut, 
  onAuthStateChanged,
  GoogleAuthProvider 
} from 'firebase/auth'
import { auth, googleProvider } from './config'

// Login con Google
export const signInWithGoogle = async () => {
  try {
    // Configurar el provider para desarrollo
    googleProvider.setCustomParameters({
      prompt: 'select_account'
    })
    
    const result = await signInWithPopup(auth, googleProvider)
    const credential = GoogleAuthProvider.credentialFromResult(result)
    const token = credential.accessToken
    const user = result.user
    
    console.log('✅ Usuario autenticado con Google:', user.displayName)
    
    return {
      success: true,
      user: {
        uid: user.uid,
        email: user.email,
        name: user.displayName,
        photoURL: user.photoURL,
        token: token
      }
    }
  } catch (error) {
    console.error('❌ Error en login con Google:', error)
    return {
      success: false,
      error: error.message
    }
  }
}

// Logout
export const signOutUser = async () => {
  try {
    await signOut(auth)
    console.log('✅ Usuario deslogueado')
    return { success: true }
  } catch (error) {
    console.error('❌ Error en logout:', error)
    return {
      success: false,
      error: error.message
    }
  }
}

// Observar cambios en el estado de autenticación
export const onAuthStateChange = (callback) => {
  return onAuthStateChanged(auth, callback)
}

// Obtener usuario actual
export const getCurrentUser = () => {
  return auth.currentUser
}
