const fetch = require('node-fetch');

async function testRoutes() {
  try {
    console.log('🧪 Probando rutas de solicitudes de compra...');
    
    // Probar ruta de aceptar oferta
    console.log('\n1. Probando POST /api/articles/accept-offer...');
    const acceptResponse = await fetch('http://localhost:3002/api/articles/accept-offer', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer mongodb-user-token-68cd4472601315508398cd53'
      },
      body: JSON.stringify({
        articleId: '68cd4472601315508398cd55'
      })
    });
    
    console.log('Status:', acceptResponse.status);
    const acceptData = await acceptResponse.text();
    console.log('Response:', acceptData);
    
    // Probar ruta de rechazar oferta
    console.log('\n2. Probando POST /api/articles/reject-offer...');
    const rejectResponse = await fetch('http://localhost:3002/api/articles/reject-offer', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer mongodb-user-token-68cd4472601315508398cd53'
      },
      body: JSON.stringify({
        articleId: '68cd4472601315508398cd55',
        reason: 'No me interesa la oferta'
      })
    });
    
    console.log('Status:', rejectResponse.status);
    const rejectData = await rejectResponse.text();
    console.log('Response:', rejectData);
    
  } catch (error) {
    console.error('Error:', error.message);
  }
}

testRoutes();
