const fetch = require('node-fetch');

async function testFrontendLogin() {
  try {
    console.log('🧪 Probando login desde el frontend...');
    
    // Probar el endpoint de login
    const loginResponse = await fetch('http://localhost:3002/api/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: 'admin@trastalia.com',
        password: 'admin123456'
      })
    });
    
    console.log('📊 Status del login:', loginResponse.status);
    
    if (loginResponse.ok) {
      const loginData = await loginResponse.json();
      console.log('✅ Login exitoso!');
      console.log('👤 Usuario:', loginData.data.user.name);
      console.log('🔑 Token:', loginData.data.token.substring(0, 20) + '...');
      console.log('🎭 Rol:', loginData.data.user.role);
      
      // Probar el endpoint de verificación de usuario
      const meResponse = await fetch('http://localhost:3002/api/auth/me', {
        headers: {
          'Authorization': `Bearer ${loginData.data.token}`
        }
      });
      
      console.log('\n📊 Status de verificación:', meResponse.status);
      
      if (meResponse.ok) {
        const meData = await meResponse.json();
        console.log('✅ Verificación exitosa!');
        console.log('👤 Usuario verificado:', meData.data.user.name);
      } else {
        console.log('❌ Error en verificación:', await meResponse.text());
      }
      
    } else {
      console.log('❌ Error en login:', await loginResponse.text());
    }
    
  } catch (error) {
    console.error('❌ Error en la prueba:', error.message);
  }
}

testFrontendLogin();