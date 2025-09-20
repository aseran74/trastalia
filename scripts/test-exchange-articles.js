import fetch from 'node-fetch';

async function testExchangeArticles() {
  try {
    console.log('🔍 Probando artículos de intercambio...');
    
    const response = await fetch('http://localhost:3002/api/articles');
    const data = await response.json();
    
    if (!data.success) {
      console.log('❌ Error obteniendo artículos:', data.message);
      return;
    }
    
    const articles = data.data || [];
    console.log(`📋 Total de artículos: ${articles.length}`);
    
    // Filtrar artículos de intercambio (como lo hace el frontend)
    const exchangeArticles = articles.filter(article => 
      article.isForExchange === true
    );
    
    console.log(`🔄 Artículos de intercambio: ${exchangeArticles.length}`);
    
    if (exchangeArticles.length > 0) {
      console.log('\n📋 Lista de artículos de intercambio:');
      exchangeArticles.forEach((article, index) => {
        console.log(`${index + 1}. ${article.title}`);
        console.log(`   - isForSale: ${article.isForSale}`);
        console.log(`   - isForExchange: ${article.isForExchange}`);
        console.log(`   - wantsPoints: ${article.wantsPoints}`);
        console.log(`   - wantsDirectExchange: ${article.wantsDirectExchange}`);
        console.log(`   - Precio: €${article.price}`);
        console.log('');
      });
    } else {
      console.log('❌ No se encontraron artículos de intercambio');
    }
    
  } catch (error) {
    console.log('❌ Error:', error.message);
  }
}

testExchangeArticles();
