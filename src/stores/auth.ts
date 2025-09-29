import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import { SignJWT, jwtVerify } from 'jose';
import API_BASE_URL from '@/config/api';

interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'user' | 'moderator';
  avatar?: string;
}

interface LoginCredentials {
  email: string;
  password: string;
  rememberMe: boolean;
}

interface RegisterData {
  name: string;
  email: string;
  password: string;
}

export const useAuthStore = defineStore('auth', () => {
  // Estado
  const user = ref<User | null>(null);
  const token = ref<string | null>(null);
  const isLoading = ref(false);
  const isCheckingAuth = ref(false);
  const lastCheckTime = ref(0);

  // Getters
  const isAuthenticated = computed(() => {
    return !!user.value && !!token.value;
  });
  const isAdmin = computed(() => user.value?.role === 'admin');
  const isModerator = computed(() => user.value?.role === 'moderator' || user.value?.role === 'admin');

  // Acciones
  const login = async (email: string, password: string, rememberMe: boolean = false) => {
    try {
      isLoading.value = true;

      // Llamada a API real
      const response = await fetch(`${API_BASE_URL}/api/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password })
      });

      const data = await response.json();

      if (data.success) {
        const { user: userData, token: authToken } = data.data;
        
        user.value = userData;
        token.value = authToken;

        // Guardar en localStorage si "recordarme" está marcado
        if (rememberMe) {
          localStorage.setItem('auth_token', authToken);
          localStorage.setItem('user_data', JSON.stringify(userData));
        } else {
          sessionStorage.setItem('auth_token', authToken);
          sessionStorage.setItem('user_data', JSON.stringify(userData));
        }

        return { success: true };
      } else {
        throw new Error(data.message || 'Error al iniciar sesión');
      }
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    } finally {
      isLoading.value = false;
    }
  };

  const register = async (name: string, email: string, password: string) => {
    try {
      isLoading.value = true;

      // Llamada a API real
      const response = await fetch(`${API_BASE_URL}/api/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, email, password })
      });

      const data = await response.json();

      if (data.success) {
        const { user: userData, token: authToken } = data.data;
        
        user.value = userData;
        token.value = authToken;

        // Guardar en sessionStorage por defecto
        sessionStorage.setItem('auth_token', authToken);
        sessionStorage.setItem('user_data', JSON.stringify(userData));

        return { success: true };
      } else {
        throw new Error(data.message || 'Error al crear la cuenta');
      }
    } catch (error) {
      console.error('Register error:', error);
      throw error;
    } finally {
      isLoading.value = false;
    }
  };

  const logout = () => {
    user.value = null;
    token.value = null;
    
    // Limpiar almacenamiento
    localStorage.removeItem('auth_token');
    localStorage.removeItem('user_data');
    sessionStorage.removeItem('auth_token');
    sessionStorage.removeItem('user_data');
  };

  const checkAuth = async () => {
    const now = Date.now();
    
    // Evitar llamadas múltiples simultáneas o muy frecuentes
    if (isCheckingAuth.value || (now - lastCheckTime.value < 1000)) {
      console.log('🔄 checkAuth ya en progreso o muy reciente, saltando...');
      return isAuthenticated.value;
    }
    
    isCheckingAuth.value = true;
    lastCheckTime.value = now;
    
    try {
      const storedToken = localStorage.getItem('auth_token') || sessionStorage.getItem('auth_token');
      const storedUser = localStorage.getItem('user_data') || sessionStorage.getItem('user_data');

      if (storedToken && storedUser) {
        // Verificar token con API real
        console.log('🔍 checkAuth - Verificando token con API');
        
        // Verificar si es un usuario de Firebase (tiene uid)
        try {
          const userData = JSON.parse(storedUser);
          
          // Si es un usuario de Firebase (tiene id como uid), usar datos locales
          if (userData.id && userData.email && userData.id.length > 20) { // Firebase UIDs son largos
            user.value = userData;
            token.value = storedToken;
            console.log('✅ checkAuth - Usuario Firebase autenticado');
            isCheckingAuth.value = false;
            return true;
          }
        } catch (parseError) {
          console.error('❌ checkAuth - Error parseando datos de usuario:', parseError);
        }
        
        // Si no es Firebase, intentar verificar con API
        try {
          const response = await fetch(`${API_BASE_URL}/api/auth/me`, {
            headers: {
              'Authorization': `Bearer ${storedToken}`
            }
          });

          console.log('🔍 checkAuth - API response status:', response.status);
          if (response.ok) {
            const data = await response.json();
            console.log('🔍 checkAuth - API data:', data);
            if (data.success) {
              user.value = data.data;
              token.value = storedToken;
              console.log('✅ checkAuth - Usuario API autenticado');
              isCheckingAuth.value = false;
              return true;
            }
          } else {
            console.error('❌ checkAuth - Error de respuesta:', response.status, response.statusText);
          }
        } catch (error) {
          console.error('❌ checkAuth - Error de fetch:', error);
        }
      }

      // Si no hay token válido, limpiar datos
      logout();
      return false;
    } catch (error) {
      console.error('Check auth error:', error);
      // En caso de error de conexión, usar datos locales como fallback
      const storedToken = localStorage.getItem('auth_token') || sessionStorage.getItem('auth_token');
      const storedUser = localStorage.getItem('user_data') || sessionStorage.getItem('user_data');
      
      if (storedToken && storedUser) {
        try {
          const userData = JSON.parse(storedUser);
          user.value = userData;
          token.value = storedToken;
          return true;
        } catch (parseError) {
          logout();
          return false;
        }
      }
      logout();
      return false;
    } finally {
      isCheckingAuth.value = false;
    }
  };

  const updateProfile = async (profileData: Partial<User>) => {
    try {
      isLoading.value = true;

      if (!user.value || !token.value) {
        throw new Error('Usuario no autenticado');
      }

      // Llamada a API real
      const response = await fetch(`${API_BASE_URL}/api/users/${user.value.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token.value}`
        },
        body: JSON.stringify(profileData)
      });

      const data = await response.json();

      if (data.success) {
        // Actualizar datos del usuario
        user.value = { ...user.value, ...data.data.user };
        
        // Actualizar almacenamiento
        const storage = localStorage.getItem('auth_token') ? localStorage : sessionStorage;
        storage.setItem('user_data', JSON.stringify(user.value));
        
        return { success: true };
      } else {
        throw new Error(data.message || 'Error al actualizar perfil');
      }
    } catch (error) {
      console.error('Update profile error:', error);
      throw error;
    } finally {
      isLoading.value = false;
    }
  };

  // Generar token JWT simulado
  const generateMockToken = async () => {
    const secret = new TextEncoder().encode('mock-secret-key');
    const payload = {
      userId: Date.now().toString(),
      email: 'user@example.com',
      exp: Math.floor(Date.now() / 1000) + (24 * 60 * 60) // 24 horas
    };
    
    return await new SignJWT(payload)
      .setProtectedHeader({ alg: 'HS256' })
      .setIssuedAt()
      .setExpirationTime('24h')
      .sign(secret);
  };

  return {
    // Estado
    user,
    token,
    isLoading,
    
    // Getters
    isAuthenticated,
    isAdmin,
    isModerator,
    
    // Acciones
    login,
    register,
    logout,
    checkAuth,
    updateProfile
  };
});
