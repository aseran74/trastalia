import fetch from 'node-fetch';

async function testMyArticles() {
  try {
    console.log('🔍 Probando endpoint /my-articles...');
    
    // Simular token de autenticación
    const token = 'test-token'; // En una implementación real, esto vendría del login
    
    const response = await fetch('http://localhost:3002/api/articles/my-articles', {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    
    console.log('📊 Status de respuesta:', response.status);
    
    if (response.ok) {
      const data = await response.json();
      console.log('✅ Datos recibidos:', data.success);
      console.log('📋 Artículos encontrados:', data.data?.length || 0);
      
      if (data.data && data.data.length > 0) {
        console.log('\n📋 Lista de mis artículos:');
        data.data.forEach((article, index) => {
          console.log(`${index + 1}. ${article.title} - €${article.price}`);
        });
      }
    } else {
      const errorText = await response.text();
      console.log('❌ Error en la respuesta:', response.status, errorText);
    }
    
  } catch (error) {
    console.log('❌ Error:', error.message);
  }
}

testMyArticles();
