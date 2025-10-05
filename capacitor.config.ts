import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.trastalia.app',
  appName: 'Trastalia',
  webDir: 'dist',
  server: {
    androidScheme: 'https'
  },
  plugins: {
    SplashScreen: {
      launchShowDuration: 2000,
      backgroundColor: "#ffffff",
      showSpinner: false
    },
    Network: {
      enabled: true
    }
  }
};

// Forzar modo producción para APKs
if (typeof window !== 'undefined') {
  // @ts-ignore
  window.__VUE_PROD_DEVTOOLS__ = false;
  // @ts-ignore
  window.__VUE_OPTIONS_API__ = true;
}

export default config;
