import fetch from 'node-fetch';

async function testServerLogin() {
  try {
    const response = await fetch('http://localhost:3002/api/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: 'usuario.servidor@trastalia.com',
        password: 'servidor123'
      })
    });

    const data = await response.json();
    console.log('✅ Login Usuario Servidor:');
    console.log(JSON.stringify(data, null, 2));
  } catch (error) {
    console.error('❌ Error:', error);
  }
}

testServerLogin();
