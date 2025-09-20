import { inject } from 'vue'

export function useToast() {
  const toast = inject('toast')
  
  if (!toast) {
    console.warn('useToast debe ser usado dentro de un ToastContainer')
    return {
      success: () => {},
      error: () => {},
      warning: () => {},
      info: () => {},
      add: () => {},
      remove: () => {},
      clear: () => {}
    }
  }
  
  return toast
}
