import fetch from 'node-fetch';

const testAPI = async () => {
  try {
    console.log('🔍 Probando API de artículos...');
    
    const response = await fetch('http://localhost:3001/api/articles');
    const data = await response.json();
    
    if (data.success) {
      console.log(`✅ API funcionando correctamente`);
      console.log(`📊 Total de artículos: ${data.data.length}`);
      
      console.log('\n📝 Lista de artículos:');
      data.data.forEach((article, index) => {
        console.log(`${index + 1}. ${article.title} - ${article.price}€`);
        if (article.pointsPrice) {
          console.log(`   ⭐ Puntos: ${article.pointsPrice}`);
        }
        if (article.wantsDirectExchange) {
          console.log(`   🔄 Intercambio: Sí`);
        }
        if (article.useLogisticsCenter) {
          console.log(`   🚀 Nave: Sí`);
        }
        console.log('');
      });
    } else {
      console.log('❌ Error en la API:', data.message);
    }
    
  } catch (error) {
    console.error('❌ Error probando API:', error.message);
  }
};

testAPI();





