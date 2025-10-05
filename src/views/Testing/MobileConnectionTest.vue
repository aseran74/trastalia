<template>
  <div class="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
    <div class="max-w-4xl mx-auto px-4">
      <h1 class="text-3xl font-bold text-center mb-8 text-gray-900 dark:text-white">
        📱 Mobile Connection Test
      </h1>

      <!-- Información del dispositivo -->
      <div class="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-6">
        <h2 class="text-xl font-semibold mb-4 text-gray-900 dark:text-white">
          📱 Device Information
        </h2>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <div>
            <strong>User Agent:</strong>
            <p class="break-all text-gray-600 dark:text-gray-300">{{ deviceInfo.userAgent }}</p>
          </div>
          <div>
            <strong>Platform:</strong>
            <p class="text-gray-600 dark:text-gray-300">{{ deviceInfo.platform }}</p>
          </div>
          <div>
            <strong>Is Mobile:</strong>
            <p class="text-gray-600 dark:text-gray-300">{{ deviceInfo.isMobile }}</p>
          </div>
          <div>
            <strong>Capacitor:</strong>
            <p class="text-gray-600 dark:text-gray-300">{{ deviceInfo.capacitorAvailable }}</p>
          </div>
          <div>
            <strong>Network Status:</strong>
            <p class="text-gray-600 dark:text-gray-300">{{ networkStatus }}</p>
          </div>
          <div>
            <strong>Current URL:</strong>
            <p class="break-all text-gray-600 dark:text-gray-300">{{ deviceInfo.currentUrl }}</p>
          </div>
        </div>
      </div>

      <!-- Test de conectividad básica -->
      <div class="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-6">
        <h2 class="text-xl font-semibold mb-4 text-gray-900 dark:text-white">
          🌐 Basic Connectivity Test
        </h2>
        
        <div class="space-y-4">
          <!-- Test 1: Railway Health -->
          <div class="border rounded-lg p-4">
            <div class="flex items-center justify-between mb-2">
              <h3 class="font-semibold">Railway Health Check</h3>
              <button 
                @click="testRailwayHealth" 
                :disabled="testing.health"
                class="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 disabled:opacity-50"
              >
                {{ testing.health ? 'Testing...' : 'Test' }}
              </button>
            </div>
            <div v-if="results.health" class="mt-2">
              <p :class="results.health.success ? 'text-green-600' : 'text-red-600'">
                {{ results.health.success ? '✅ Success' : '❌ Failed' }}
              </p>
              <p class="text-sm text-gray-600 dark:text-gray-300">
                Status: {{ results.health.status }}
              </p>
              <p class="text-sm text-gray-600 dark:text-gray-300">
                Time: {{ results.health.responseTime }}ms
              </p>
              <p v-if="results.health.error" class="text-sm text-red-600">
                Error: {{ results.health.error }}
              </p>
            </div>
          </div>

          <!-- Test 2: Railway Articles -->
          <div class="border rounded-lg p-4">
            <div class="flex items-center justify-between mb-2">
              <h3 class="font-semibold">Railway Articles</h3>
              <button 
                @click="testRailwayArticles" 
                :disabled="testing.articles"
                class="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 disabled:opacity-50"
              >
                {{ testing.articles ? 'Testing...' : 'Test' }}
              </button>
            </div>
            <div v-if="results.articles" class="mt-2">
              <p :class="results.articles.success ? 'text-green-600' : 'text-red-600'">
                {{ results.articles.success ? '✅ Success' : '❌ Failed' }}
              </p>
              <p class="text-sm text-gray-600 dark:text-gray-300">
                Articles: {{ results.articles.count || 'N/A' }}
              </p>
              <p class="text-sm text-gray-600 dark:text-gray-300">
                Time: {{ results.articles.responseTime }}ms
              </p>
              <p v-if="results.articles.error" class="text-sm text-red-600">
                Error: {{ results.articles.error }}
              </p>
            </div>
          </div>

          <!-- Test 3: Simple HTTP Test -->
          <div class="border rounded-lg p-4">
            <div class="flex items-center justify-between mb-2">
              <h3 class="font-semibold">Simple HTTP Test</h3>
              <button 
                @click="testSimpleHTTP" 
                :disabled="testing.simple"
                class="bg-purple-500 text-white px-4 py-2 rounded hover:bg-purple-600 disabled:opacity-50"
              >
                {{ testing.simple ? 'Testing...' : 'Test' }}
              </button>
            </div>
            <div v-if="results.simple" class="mt-2">
              <p :class="results.simple.success ? 'text-green-600' : 'text-red-600'">
                {{ results.simple.success ? '✅ Success' : '❌ Failed' }}
              </p>
              <p class="text-sm text-gray-600 dark:text-gray-300">
                Status: {{ results.simple.status }}
              </p>
              <p class="text-sm text-gray-600 dark:text-gray-300">
                Time: {{ results.simple.responseTime }}ms
              </p>
              <p v-if="results.simple.error" class="text-sm text-red-600">
                Error: {{ results.simple.error }}
              </p>
            </div>
          </div>

          <!-- Test 4: Railway con diferentes métodos -->
          <div class="border rounded-lg p-4">
            <div class="flex items-center justify-between mb-2">
              <h3 class="font-semibold">Railway Multi-Method Test</h3>
              <button 
                @click="testRailwayMultiMethod" 
                :disabled="testing.multiMethod"
                class="bg-orange-500 text-white px-4 py-2 rounded hover:bg-orange-600 disabled:opacity-50"
              >
                {{ testing.multiMethod ? 'Testing...' : 'Test' }}
              </button>
            </div>
            <div v-if="results.multiMethod" class="mt-2">
              <p :class="results.multiMethod.success ? 'text-green-600' : 'text-red-600'">
                {{ results.multiMethod.success ? '✅ Success' : '❌ Failed' }}
              </p>
              <p class="text-sm text-gray-600 dark:text-gray-300">
                Method: {{ results.multiMethod.method }}
              </p>
              <p class="text-sm text-gray-600 dark:text-gray-300">
                Status: {{ results.multiMethod.status }}
              </p>
              <p class="text-sm text-gray-600 dark:text-gray-300">
                Time: {{ results.multiMethod.responseTime }}ms
              </p>
              <p v-if="results.multiMethod.error" class="text-sm text-red-600">
                Error: {{ results.multiMethod.error }}
              </p>
            </div>
          </div>

          <!-- Test 5: CORS Test -->
          <div class="border rounded-lg p-4">
            <div class="flex items-center justify-between mb-2">
              <h3 class="font-semibold">CORS Test (After Server Update)</h3>
              <button 
                @click="testCORSAfterUpdate" 
                :disabled="testing.cors"
                class="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 disabled:opacity-50"
              >
                {{ testing.cors ? 'Testing...' : 'Test' }}
              </button>
            </div>
            <div v-if="results.cors" class="mt-2">
              <p :class="results.cors.success ? 'text-green-600' : 'text-red-600'">
                {{ results.cors.success ? '✅ CORS Fixed' : '❌ CORS Still Failing' }}
              </p>
              <p class="text-sm text-gray-600 dark:text-gray-300">
                Status: {{ results.cors.status }}
              </p>
              <p class="text-sm text-gray-600 dark:text-gray-300">
                Time: {{ results.cors.responseTime }}ms
              </p>
              <p v-if="results.cors.error" class="text-sm text-red-600">
                Error: {{ results.cors.error }}
              </p>
            </div>
          </div>
        </div>
      </div>

      <!-- Logs de debug -->
      <div class="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
        <h2 class="text-xl font-semibold mb-4 text-gray-900 dark:text-white">
          📋 Debug Logs
        </h2>
        <div class="bg-gray-100 dark:bg-gray-700 p-4 rounded-lg max-h-64 overflow-y-auto">
          <pre class="text-xs text-gray-800 dark:text-gray-200 whitespace-pre-wrap">{{ debugLogs }}</pre>
        </div>
        <button 
          @click="clearLogs"
          class="mt-2 bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
        >
          Clear Logs
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'

// Reactive data
const deviceInfo = ref({
  userAgent: '',
  platform: '',
  isMobile: false,
  capacitorAvailable: false,
  currentUrl: ''
})

const networkStatus = ref('Checking...')
const testing = ref({
  health: false,
  articles: false,
  simple: false,
  multiMethod: false,
  cors: false
})

const results = ref({
  health: null,
  articles: null,
  simple: null,
  multiMethod: null,
  cors: null
})

const debugLogs = ref('')

// Logging function
const log = (message) => {
  const timestamp = new Date().toLocaleTimeString()
  debugLogs.value += `[${timestamp}] ${message}\n`
  console.log(message)
}

// Clear logs
const clearLogs = () => {
  debugLogs.value = ''
}

// Test functions
const testRailwayHealth = async () => {
  testing.value.health = true
  log('🧪 Testing Railway Health...')
  
  try {
    const start = Date.now()
    const response = await fetch('https://web-production-08299.up.railway.app/api/health', {
      method: 'GET',
      headers: {
        'Accept': 'application/json'
      }
    })
    
    const end = Date.now()
    const responseTime = end - start
    
    if (response.ok) {
      const data = await response.json()
      log(`✅ Railway Health: Success (${responseTime}ms) - ${JSON.stringify(data)}`)
      results.value.health = {
        success: true,
        status: 'Success',
        responseTime,
        data
      }
    } else {
      log(`❌ Railway Health: HTTP ${response.status} (${responseTime}ms)`)
      results.value.health = {
        success: false,
        status: `HTTP ${response.status}`,
        responseTime,
        error: `HTTP ${response.status}`
      }
    }
  } catch (error) {
    const end = Date.now()
    const responseTime = end - Date.now()
    log(`❌ Railway Health: ${error.message}`)
    results.value.health = {
      success: false,
      status: 'Error',
      responseTime,
      error: error.message
    }
  }
  
  testing.value.health = false
}

const testRailwayArticles = async () => {
  testing.value.articles = true
  log('🧪 Testing Railway Articles...')
  
  try {
    const start = Date.now()
    const response = await fetch('https://web-production-08299.up.railway.app/api/articles/public', {
      method: 'GET',
      headers: {
        'Accept': 'application/json'
      }
    })
    
    const end = Date.now()
    const responseTime = end - start
    
    if (response.ok) {
      const data = await response.json()
      log(`✅ Railway Articles: Success (${responseTime}ms) - ${data.length} articles`)
      results.value.articles = {
        success: true,
        status: 'Success',
        responseTime,
        count: data.length,
        data
      }
    } else {
      log(`❌ Railway Articles: HTTP ${response.status} (${responseTime}ms)`)
      results.value.articles = {
        success: false,
        status: `HTTP ${response.status}`,
        responseTime,
        error: `HTTP ${response.status}`
      }
    }
  } catch (error) {
    const end = Date.now()
    const responseTime = end - Date.now()
    log(`❌ Railway Articles: ${error.message}`)
    results.value.articles = {
      success: false,
      status: 'Error',
      responseTime,
      error: error.message
    }
  }
  
  testing.value.articles = false
}

const testSimpleHTTP = async () => {
  testing.value.simple = true
  log('🧪 Testing Simple HTTP...')
  
  try {
    const start = Date.now()
    const response = await fetch('https://httpbin.org/get', {
      method: 'GET'
    })
    
    const end = Date.now()
    const responseTime = end - start
    
    if (response.ok) {
      log(`✅ Simple HTTP: Success (${responseTime}ms)`)
      results.value.simple = {
        success: true,
        status: 'Success',
        responseTime
      }
    } else {
      log(`❌ Simple HTTP: HTTP ${response.status} (${responseTime}ms)`)
      results.value.simple = {
        success: false,
        status: `HTTP ${response.status}`,
        responseTime,
        error: `HTTP ${response.status}`
      }
    }
  } catch (error) {
    const end = Date.now()
    const responseTime = end - Date.now()
    log(`❌ Simple HTTP: ${error.message}`)
    results.value.simple = {
      success: false,
      status: 'Error',
      responseTime,
      error: error.message
    }
  }
  
  testing.value.simple = false
}

const testRailwayMultiMethod = async () => {
  testing.value.multiMethod = true
  log('🧪 Testing Railway with Multiple Methods...')
  
  const methods = [
    {
      name: 'Standard Fetch',
      options: {
        method: 'GET',
        headers: {
          'Accept': 'application/json'
        }
      }
    },
    {
      name: 'No Headers',
      options: {
        method: 'GET'
      }
    },
    {
      name: 'CORS Mode',
      options: {
        method: 'GET',
        mode: 'cors'
      }
    },
    {
      name: 'No-CORS Mode',
      options: {
        method: 'GET',
        mode: 'no-cors'
      }
    }
  ]
  
  for (const method of methods) {
    try {
      log(`🔄 Trying ${method.name}...`)
      const start = Date.now()
      
      const response = await fetch('https://web-production-08299.up.railway.app/api/health', method.options)
      const end = Date.now()
      const responseTime = end - start
      
      if (method.options.mode === 'no-cors') {
        // no-cors mode doesn't allow reading response
        log(`✅ ${method.name}: Success (no-cors mode)`)
        results.value.multiMethod = {
          success: true,
          status: 'Success (no-cors)',
          responseTime,
          method: method.name
        }
        break
      } else if (response.ok) {
        const data = await response.json()
        log(`✅ ${method.name}: Success (${responseTime}ms)`)
        results.value.multiMethod = {
          success: true,
          status: 'Success',
          responseTime,
          method: method.name,
          data
        }
        break
      } else {
        log(`❌ ${method.name}: HTTP ${response.status}`)
      }
    } catch (error) {
      log(`❌ ${method.name}: ${error.message}`)
    }
  }
  
  if (!results.value.multiMethod) {
    results.value.multiMethod = {
      success: false,
      status: 'All Methods Failed',
      responseTime: 0,
      method: 'None',
      error: 'All fetch methods failed'
    }
  }
  
  testing.value.multiMethod = false
}

const testCORSAfterUpdate = async () => {
  testing.value.cors = true
  log('🧪 Testing CORS after server update...')
  
  try {
    const start = Date.now()
    const response = await fetch('https://web-production-08299.up.railway.app/api/health', {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      credentials: 'include'
    })
    
    const end = Date.now()
    const responseTime = end - start
    
    if (response.ok) {
      const data = await response.json()
      log(`✅ CORS Test: Success (${responseTime}ms) - CORS is now working!`)
      results.value.cors = {
        success: true,
        status: 'CORS Fixed',
        responseTime,
        data
      }
    } else {
      log(`❌ CORS Test: HTTP ${response.status} (${responseTime}ms)`)
      results.value.cors = {
        success: false,
        status: `HTTP ${response.status}`,
        responseTime,
        error: `HTTP ${response.status}`
      }
    }
  } catch (error) {
    const end = Date.now()
    const responseTime = end - Date.now()
    log(`❌ CORS Test: ${error.message}`)
    results.value.cors = {
      success: false,
      status: 'CORS Still Failing',
      responseTime,
      error: error.message
    }
  }
  
  testing.value.cors = false
}

// Initialize
onMounted(async () => {
  log('📱 Mobile Connection Test initialized')
  
  // Device info
  deviceInfo.value = {
    userAgent: navigator.userAgent,
    platform: navigator.platform,
    isMobile: /Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent),
    capacitorAvailable: !!(window.Capacitor),
    currentUrl: window.location.href
  }
  
  log(`📱 Device: ${deviceInfo.value.platform}`)
  log(`📱 Mobile: ${deviceInfo.value.isMobile}`)
  log(`📱 Capacitor: ${deviceInfo.value.capacitorAvailable}`)
  
  // Network status
  if (window.Capacitor) {
    try {
      const { Network } = await import('@capacitor/network')
      const status = await Network.getStatus()
      networkStatus.value = status.connected ? 'Connected' : 'Disconnected'
      log(`📡 Network: ${networkStatus.value}`)
    } catch (error) {
      networkStatus.value = 'Unknown'
      log(`⚠️ Network status unavailable: ${error.message}`)
    }
  } else {
    networkStatus.value = 'Web Browser'
    log('🌐 Running in web browser')
  }
})
</script>
