// Tipos globales para evitar errores de TypeScript
declare module '*.vue' {
  import type { DefineComponent } from 'vue'
  const component: DefineComponent<{}, {}, any>
  export default component
}

declare module '@/composables/useToast' {
  export interface ToastOptions {
    duration?: number;
    position?: 'top-left' | 'top-center' | 'top-right' | 'bottom-left' | 'bottom-center' | 'bottom-right';
  }

  export interface Toast {
    success: (message: string, options?: ToastOptions) => void;
    error: (message: string, options?: ToastOptions) => void;
    warning: (message: string, options?: ToastOptions) => void;
    info: (message: string, options?: ToastOptions) => void;
  }

  const useToast: () => Toast;
  export default useToast;
}

// Tipos para variables de entorno
declare global {
  interface ImportMetaEnv {
    readonly VITE_API_URL?: string;
    readonly VITE_GOOGLE_PLACES_API_KEY?: string;
  }

  interface ImportMeta {
    readonly env: ImportMetaEnv;
  }
}

export {};
