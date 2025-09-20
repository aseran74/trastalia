import fetch from 'node-fetch';

const API_URL = 'http://localhost:3002/api/articles';

// Datos de prueba para el nuevo sistema de venta
const testArticle = {
  title: 'iPhone 15 Pro Max 256GB - Titanio Natural',
  description: 'iPhone 15 Pro Max en perfecto estado, con caja original y todos los accesorios. Pantalla de 6.7 pulgadas, cámara de 48MP, chip A17 Pro. Ideal para fotografía profesional.',
  category: 'electrónica',
  condition: 'excelente',
  location: 'Madrid, España',
  tags: ['iphone', 'apple', 'smartphone', 'pro', 'max'],
  
  // Modalidad principal
  saleMode: 'direct_from_home',
  
  // Configuración de modalidades
  directFromHome: {
    enabled: true,
    price: 899.99,
    shippingCost: 15.99
  },
  
  logisticsCenterSale: {
    enabled: true,
    price: 849.99,
    commission: 12,
    storageCost: 5.99
  },
  
  trastaliaPurchase: {
    enabled: true,
    adminPrice: 750.00,
    demandLevel: 'high',
    adminApproved: false
  },
  
  pointsExchange: {
    enabled: true,
    pointsPrice: 75000,
    pointsPerEuro: 100
  }
};

async function testNewSaleModes() {
  try {
    console.log('🚀 Probando nuevo sistema de modalidades de venta...');
    
    // Simular token de autenticación (en producción vendría del login)
    const token = 'test-token';
    
    // Crear artículo con nuevas modalidades
    console.log('📝 Creando artículo de prueba...');
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(testArticle)
    });
    
    if (response.ok) {
      const result = await response.json();
      console.log('✅ Artículo creado exitosamente:');
      console.log('   ID:', result.data?._id);
      console.log('   Título:', result.data?.title);
      console.log('   Modalidad:', result.data?.saleMode);
      console.log('   Venta desde casa:', result.data?.directFromHome?.enabled);
      console.log('   Centro logístico:', result.data?.logisticsCenterSale?.enabled);
      console.log('   Compra Trastalia:', result.data?.trastaliaPurchase?.enabled);
      console.log('   Venta por puntos:', result.data?.pointsExchange?.enabled);
      
      // Probar actualización de modalidad
      if (result.data?._id) {
        console.log('\n🔄 Probando actualización de modalidad...');
        const updateResponse = await fetch(`${API_URL}/${result.data._id}/sale-mode`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({
            saleMode: 'logistics_center',
            logisticsCenterSale: {
              enabled: true,
              price: 799.99,
              commission: 15,
              storageCost: 8.99
            }
          })
        });
        
        if (updateResponse.ok) {
          const updateResult = await updateResponse.json();
          console.log('✅ Modalidad actualizada exitosamente');
          console.log('   Nueva modalidad:', updateResult.data?.saleMode);
          console.log('   Nuevo precio:', updateResult.data?.logisticsCenterSale?.price);
        } else {
          console.log('❌ Error actualizando modalidad:', updateResponse.status);
        }
      }
      
    } else {
      const error = await response.json();
      console.log('❌ Error creando artículo:', error);
    }
    
  } catch (error) {
    console.log('❌ Error:', error.message);
  }
}

testNewSaleModes();

