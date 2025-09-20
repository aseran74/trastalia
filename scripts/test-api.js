import fetch from 'node-fetch';

async function testAPI() {
  try {
    console.log('🔍 Probando API de artículos...');
    
    const response = await fetch('http://localhost:3002/api/articles');
    const data = await response.json();
    
    console.log('📊 Respuesta del servidor:');
    console.log('Status:', response.status);
    console.log('Success:', data.success);
    console.log('Artículos encontrados:', data.data ? data.data.length : 0);
    
    if (data.data && data.data.length > 0) {
      console.log('\n📋 Lista de artículos:');
      data.data.forEach((article, index) => {
        console.log(`${index + 1}. ${article.title} - €${article.price}`);
      });
    } else {
      console.log('❌ No hay artículos en la base de datos');
    }
    
  } catch (error) {
    console.log('❌ Error:', error.message);
  }
}

testAPI();
