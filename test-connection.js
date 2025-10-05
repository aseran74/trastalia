// Script de testing de conexión para Trastalia
import https from 'https';
import http from 'http';

console.log('🧪 Trastalia Connection Testing Tool\n');

// Configuración
const RAILWAY_URL = 'https://web-production-08299.up.railway.app';
const LOCALHOST_URL = 'http://localhost:3002';

// Función para hacer peticiones HTTP/HTTPS
function makeRequest(url, description) {
  return new Promise((resolve, reject) => {
    const isHttps = url.startsWith('https');
    const client = isHttps ? https : http;
    
    console.log(`🔍 Testing: ${description}`);
    console.log(`📍 URL: ${url}`);
    
    const startTime = Date.now();
    
    const req = client.get(url, (res) => {
      const endTime = Date.now();
      const responseTime = endTime - startTime;
      
      let data = '';
      res.on('data', (chunk) => {
        data += chunk;
      });
      
      res.on('end', () => {
        try {
          const jsonData = JSON.parse(data);
          console.log(`✅ Success: ${res.statusCode}`);
          console.log(`⏱️  Response Time: ${responseTime}ms`);
          
          if (jsonData.length !== undefined) {
            console.log(`📊 Articles Count: ${jsonData.length}`);
          } else if (jsonData.status) {
            console.log(`📊 Status: ${jsonData.status}`);
          }
          
          console.log('---');
          resolve({
            success: true,
            status: res.statusCode,
            data: jsonData,
            responseTime
          });
        } catch (error) {
          console.log(`⚠️  Response received but not JSON: ${data.substring(0, 100)}...`);
          console.log('---');
          resolve({
            success: true,
            status: res.statusCode,
            data: data,
            responseTime
          });
        }
      });
    });
    
    req.on('error', (error) => {
      const endTime = Date.now();
      const responseTime = endTime - startTime;
      
      console.log(`❌ Error: ${error.message}`);
      console.log(`⏱️  Response Time: ${responseTime}ms`);
      console.log('---');
      resolve({
        success: false,
        status: 'Error',
        error: error.message,
        responseTime
      });
    });
    
    req.setTimeout(10000, () => {
      console.log(`⏰ Timeout after 10 seconds`);
      console.log('---');
      req.destroy();
      resolve({
        success: false,
        status: 'Timeout',
        error: 'Request timeout',
        responseTime: 10000
      });
    });
  });
}

// Tests
async function runTests() {
  console.log('🚀 Starting connection tests...\n');
  
  // Test 1: Railway Health
  const railwayHealth = await makeRequest(
    `${RAILWAY_URL}/api/health`,
    'Railway Health Check'
  );
  
  // Test 2: Railway Articles
  const railwayArticles = await makeRequest(
    `${RAILWAY_URL}/api/articles/public`,
    'Railway Articles Endpoint'
  );
  
  // Test 3: Localhost Health (solo si está corriendo)
  const localhostHealth = await makeRequest(
    `${LOCALHOST_URL}/api/health`,
    'Localhost Health Check'
  );
  
  // Resumen
  console.log('📋 Test Summary:');
  console.log(`Railway Health: ${railwayHealth.success ? '✅' : '❌'} (${railwayHealth.responseTime}ms)`);
  console.log(`Railway Articles: ${railwayArticles.success ? '✅' : '❌'} (${railwayArticles.responseTime}ms)`);
  console.log(`Localhost Health: ${localhostHealth.success ? '✅' : '❌'} (${localhostHealth.responseTime}ms)`);
  
  console.log('\n🎯 Recommendations:');
  if (railwayHealth.success && railwayArticles.success) {
    console.log('✅ Railway is working perfectly!');
    console.log('✅ Your APK should be able to connect to Railway');
    console.log('🔧 Check the APK logs to see why it\'s not connecting');
  } else {
    console.log('❌ Railway has issues - check your deployment');
  }
  
  if (!localhostHealth.success) {
    console.log('ℹ️  Localhost server is not running (this is normal for APK testing)');
  }
}

// Ejecutar tests
runTests().catch(console.error);
