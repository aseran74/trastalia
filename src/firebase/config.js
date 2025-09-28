// Firebase configuration
import { initializeApp } from 'firebase/app'
import { getAuth, GoogleAuthProvider } from 'firebase/auth'

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "AIzaSyDzyhdNuoDcZN49QURXJfreMjWX-R97kjU",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "quincenalia-5eaa2.firebaseapp.com",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "quincenalia-5eaa2",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "quincenalia-5eaa2.firebasestorage.app",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "754938560838",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "1:754938560838:web:f8912f3d195eb1b9aee547",
  measurementId: "G-NT6JBGS3EC"
}

// Initialize Firebase
const app = initializeApp(firebaseConfig)

// Initialize Firebase Authentication and get a reference to the service
export const auth = getAuth(app)

// Initialize Google Auth Provider
export const googleProvider = new GoogleAuthProvider()

export default app
