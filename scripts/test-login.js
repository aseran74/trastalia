const fetch = require('node-fetch');

async function testLogin() {
  try {
    const response = await fetch('http://localhost:3002/api/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: 'alvaroserr@gmail.com',
        password: 'alvaro123'
      })
    });

    const data = await response.json();
    console.log('✅ Login exitoso:');
    console.log(JSON.stringify(data, null, 2));
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

testLogin();
