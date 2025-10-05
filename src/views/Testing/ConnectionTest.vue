<template>
  <div class="min-h-screen bg-gray-100 p-4">
    <div class="max-w-4xl mx-auto">
      <h1 class="text-3xl font-bold text-gray-900 mb-8">🔧 Connection Testing Tool</h1>
      
      <!-- Información del Sistema -->
      <div class="bg-white rounded-lg shadow-md p-6 mb-6">
        <h2 class="text-xl font-semibold mb-4">📱 System Information</h2>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <p><strong>User Agent:</strong></p>
            <p class="text-sm text-gray-600 break-all">{{ systemInfo.userAgent }}</p>
          </div>
          <div>
            <p><strong>Platform:</strong></p>
            <p class="text-sm text-gray-600">{{ systemInfo.platform }}</p>
          </div>
          <div>
            <p><strong>Is Native App:</strong></p>
            <p class="text-sm text-gray-600">{{ systemInfo.isNativeApp }}</p>
          </div>
          <div>
            <p><strong>Is Production:</strong></p>
            <p class="text-sm text-gray-600">{{ systemInfo.isProduction }}</p>
          </div>
          <div>
            <p><strong>Capacitor Available:</strong></p>
            <p class="text-sm text-gray-600">{{ systemInfo.capacitorAvailable }}</p>
          </div>
          <div>
            <p><strong>Current API URL:</strong></p>
            <p class="text-sm text-gray-600">{{ systemInfo.apiUrl }}</p>
          </div>
        </div>
      </div>

      <!-- Tests de Conectividad -->
      <div class="bg-white rounded-lg shadow-md p-6 mb-6">
        <h2 class="text-xl font-semibold mb-4">🌐 Connectivity Tests</h2>
        
        <div class="space-y-4">
          <!-- Test 1: Railway Health -->
          <div class="border rounded-lg p-4">
            <div class="flex items-center justify-between mb-2">
              <h3 class="font-semibold">Test 1: Railway Health Check</h3>
              <button 
                @click="testRailwayHealth" 
                :disabled="testing.railway"
                class="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 disabled:opacity-50"
              >
                {{ testing.railway ? 'Testing...' : 'Test' }}
              </button>
            </div>
            <div v-if="results.railway" class="mt-2">
              <p :class="results.railway.success ? 'text-green-600' : 'text-red-600'">
                {{ results.railway.success ? '✅ Success' : '❌ Failed' }}
              </p>
              <p class="text-sm text-gray-600">Status: {{ results.railway.status }}</p>
              <p class="text-sm text-gray-600">Response: {{ results.railway.response }}</p>
            </div>
          </div>

          <!-- Test 2: Railway Articles -->
          <div class="border rounded-lg p-4">
            <div class="flex items-center justify-between mb-2">
              <h3 class="font-semibold">Test 2: Railway Articles Endpoint</h3>
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
              <p class="text-sm text-gray-600">Status: {{ results.articles.status }}</p>
              <p class="text-sm text-gray-600">Articles Count: {{ results.articles.count }}</p>
              <p class="text-sm text-gray-600">Response Time: {{ results.articles.responseTime }}ms</p>
            </div>
          </div>

          <!-- Test 3: Localhost -->
          <div class="border rounded-lg p-4">
            <div class="flex items-center justify-between mb-2">
              <h3 class="font-semibold">Test 3: Localhost (Development)</h3>
              <button 
                @click="testLocalhost" 
                :disabled="testing.localhost"
                class="bg-purple-500 text-white px-4 py-2 rounded hover:bg-purple-600 disabled:opacity-50"
              >
                {{ testing.localhost ? 'Testing...' : 'Test' }}
              </button>
            </div>
            <div v-if="results.localhost" class="mt-2">
              <p :class="results.localhost.success ? 'text-green-600' : 'text-red-600'">
                {{ results.localhost.success ? '✅ Success' : '❌ Failed' }}
              </p>
              <p class="text-sm text-gray-600">Status: {{ results.localhost.status }}</p>
              <p class="text-sm text-gray-600">Response: {{ results.localhost.response }}</p>
            </div>
          </div>

          <!-- Test 4: Current API Configuration -->
          <div class="border rounded-lg p-4">
            <div class="flex items-center justify-between mb-2">
              <h3 class="font-semibold">Test 4: Current API Configuration</h3>
              <button 
                @click="testCurrentAPI" 
                :disabled="testing.current"
                class="bg-orange-500 text-white px-4 py-2 rounded hover:bg-orange-600 disabled:opacity-50"
              >
                {{ testing.current ? 'Testing...' : 'Test' }}
              </button>
            </div>
            <div v-if="results.current" class="mt-2">
              <p :class="results.current.success ? 'text-green-600' : 'text-red-600'">
                {{ results.current.success ? '✅ Success' : '❌ Failed' }}
              </p>
              <p class="text-sm text-gray-600">Status: {{ results.current.status }}</p>
              <p class="text-sm text-gray-600">Articles Count: {{ results.current.count }}</p>
              <p class="text-sm text-gray-600">Response Time: {{ results.current.responseTime }}ms</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Logs de Debug -->
      <div class="bg-white rounded-lg shadow-md p-6">
        <h2 class="text-xl font-semibold mb-4">📋 Debug Logs</h2>
        <div class="bg-gray-900 text-green-400 p-4 rounded-lg font-mono text-sm max-h-96 overflow-y-auto">
          <div v-for="(log, index) in debugLogs" :key="index" class="mb-1">
            {{ log }}
          </div>
        </div>
        <button 
          @click="clearLogs" 
          class="mt-4 bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
        >
          Clear Logs
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { Capacitor } from '@capacitor/core'
import API_BASE_URL from '@/config/api.js'

// System Information
const systemInfo = ref({
  userAgent: '',
  platform: '',
  isNativeApp: false,
  isProduction: false,
  capacitorAvailable: false,
  apiUrl: ''
})

// Testing States
const testing = ref({
  railway: false,
  articles: false,
  localhost: false,
  current: false
})

// Test Results
const results = ref({
  railway: null,
  articles: null,
  localhost: null,
  current: null
})

// Debug Logs
const debugLogs = ref([])

const addLog = (message) => {
  const timestamp = new Date().toLocaleTimeString()
  debugLogs.value.push(`[${timestamp}] ${message}`)
}

const clearLogs = () => {
  debugLogs.value = []
}

// Initialize System Information
const initSystemInfo = () => {
  systemInfo.value = {
    userAgent: navigator.userAgent,
    platform: navigator.platform,
    isNativeApp: Capacitor.isNativePlatform(),
    isProduction: import.meta.env.PROD,
    capacitorAvailable: !!window.Capacitor,
    apiUrl: API_BASE_URL
  }
  addLog(`System Info: ${JSON.stringify(systemInfo.value)}`)
}

// Test Functions
const testRailwayHealth = async () => {
  testing.value.railway = true
  addLog('🔍 Testing Railway Health Check...')
  
  try {
    const startTime = Date.now()
    const response = await fetch('https://web-production-08299.up.railway.app/api/health')
    const endTime = Date.now()
    const data = await response.json()
    
    results.value.railway = {
      success: response.ok,
      status: response.status,
      response: JSON.stringify(data),
      responseTime: endTime - startTime
    }
    
    addLog(`✅ Railway Health: ${response.status} - ${JSON.stringify(data)}`)
  } catch (error) {
    results.value.railway = {
      success: false,
      status: 'Error',
      response: error.message
    }
    addLog(`❌ Railway Health Error: ${error.message}`)
  }
  
  testing.value.railway = false
}

const testRailwayArticles = async () => {
  testing.value.articles = true
  addLog('🔍 Testing Railway Articles...')
  
  try {
    const startTime = Date.now()
    const response = await fetch('https://web-production-08299.up.railway.app/api/articles/public')
    const endTime = Date.now()
    const data = await response.json()
    
    results.value.articles = {
      success: response.ok,
      status: response.status,
      count: Array.isArray(data) ? data.length : 'Not an array',
      responseTime: endTime - startTime
    }
    
    addLog(`✅ Railway Articles: ${response.status} - ${Array.isArray(data) ? data.length : 'Invalid response'} articles`)
  } catch (error) {
    results.value.articles = {
      success: false,
      status: 'Error',
      count: 0,
      responseTime: 0
    }
    addLog(`❌ Railway Articles Error: ${error.message}`)
  }
  
  testing.value.articles = false
}

const testLocalhost = async () => {
  testing.value.localhost = true
  addLog('🔍 Testing Localhost...')
  
  try {
    const response = await fetch('http://localhost:3002/api/health')
    const data = await response.json()
    
    results.value.localhost = {
      success: response.ok,
      status: response.status,
      response: JSON.stringify(data)
    }
    
    addLog(`✅ Localhost: ${response.status} - ${JSON.stringify(data)}`)
  } catch (error) {
    results.value.localhost = {
      success: false,
      status: 'Error',
      response: error.message
    }
    addLog(`❌ Localhost Error: ${error.message}`)
  }
  
  testing.value.localhost = false
}

const testCurrentAPI = async () => {
  testing.value.current = true
  addLog(`🔍 Testing Current API: ${API_BASE_URL}`)
  
  try {
    const startTime = Date.now()
    const response = await fetch(`${API_BASE_URL}/api/articles/public`)
    const endTime = Date.now()
    const data = await response.json()
    
    results.value.current = {
      success: response.ok,
      status: response.status,
      count: Array.isArray(data) ? data.length : 'Not an array',
      responseTime: endTime - startTime
    }
    
    addLog(`✅ Current API: ${response.status} - ${Array.isArray(data) ? data.length : 'Invalid response'} articles`)
  } catch (error) {
    results.value.current = {
      success: false,
      status: 'Error',
      count: 0,
      responseTime: 0
    }
    addLog(`❌ Current API Error: ${error.message}`)
  }
  
  testing.value.current = false
}

onMounted(() => {
  initSystemInfo()
  addLog('🚀 Connection Testing Tool Initialized')
})
</script>

