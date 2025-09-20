import fetch from 'node-fetch';

async function updateLogic() {
  try {
    console.log('🔄 Actualizando lógica de artículos...');
    
    const response = await fetch('http://localhost:3002/api/articles/update-logic', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      }
    });
    
    const result = await response.json();
    
    if (response.ok) {
      console.log('✅', result.message);
      console.log('💰 Artículos solo para compra:', result.data.onlyMoney);
      console.log('🔄 Artículos con intercambio:', result.data.withExchange);
    } else {
      console.log('❌ Error:', result.message);
    }
    
  } catch (error) {
    console.log('❌ Error de conexión:', error.message);
  }
}

updateLogic();
