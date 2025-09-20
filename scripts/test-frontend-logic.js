import fetch from 'node-fetch';

async function testFrontendLogic() {
  try {
    console.log('🔍 Simulando lógica del frontend...');
    
    // Simular token de autenticación (como lo hace el frontend)
    const token = null; // En Node.js no tenemos localStorage
    console.log('🔑 Token encontrado:', token ? 'Sí' : 'No');
    
    // Hacer la misma llamada que hace el frontend
    const response = await fetch('http://localhost:3002/api/articles', {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    
    console.log('📊 Status de respuesta:', response.status);
    
    if (response.ok) {
      const data = await response.json();
      console.log('✅ Datos recibidos:', data.success);
      
      const articles = data.data || [];
      console.log(`📋 Total de artículos: ${articles.length}`);
      
      // Filtrar solo artículos marcados para intercambio (como lo hace el frontend)
      const exchangeArticles = articles.filter(article => 
        article.isForExchange === true
      );
      
      console.log(`🔄 Artículos de intercambio encontrados: ${exchangeArticles.length}`);
      
      if (exchangeArticles.length > 0) {
        console.log('\n📋 Lista de artículos de intercambio:');
        exchangeArticles.forEach((article, index) => {
          console.log(`${index + 1}. ${article.title}`);
          console.log(`   - wantsDirectExchange: ${article.wantsDirectExchange}`);
          console.log(`   - wantsPoints: ${article.wantsPoints}`);
        });
      } else {
        console.log('❌ No se encontraron artículos de intercambio');
      }
      
    } else {
      const errorText = await response.text();
      console.log('❌ Error en la respuesta:', response.status, errorText);
    }
    
  } catch (error) {
    console.log('❌ Error:', error.message);
  }
}

testFrontendLogic();
