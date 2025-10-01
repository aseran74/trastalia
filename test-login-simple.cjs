const fetch = require('node-fetch');

async function testLogin() {
  console.log('🔍 Probando login...\n');
  
  try {
    const response = await fetch('http://localhost:3002/api/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        email: 'juan@correo.com',
        password: 'contrasena'
      })
    });
    
    console.log('📡 Status:', response.status);
    console.log('📡 Status Text:', response.statusText);
    
    const data = await response.json();
    console.log('\n📦 Respuesta:', JSON.stringify(data, null, 2));
    
    if (data.success) {
      console.log('\n✅ Login exitoso!');
      console.log('👤 Usuario:', data.data.user.name);
      console.log('📧 Email:', data.data.user.email);
      console.log('🔑 Token presente:', !!data.data.token);
    } else {
      console.log('\n❌ Login falló:', data.message);
    }
  } catch (error) {
    console.error('\n❌ Error:', error.message);
  }
}

testLogin();

