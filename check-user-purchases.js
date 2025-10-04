import fetch from 'node-fetch';

const API_BASE_URL = 'https://web-production-08299.up.railway.app';

async function checkUserPurchases(email) {
  try {
    console.log(`🔍 Buscando compras para el usuario: ${email}`);
    console.log('⏳ Esperando a que Railway haga el redeploy del nuevo endpoint...');
    
    // Esperar un momento para que Railway haga el redeploy
    await new Promise(resolve => setTimeout(resolve, 30000)); // 30 segundos
    
    console.log('🚀 Consultando endpoint de administración...');
    
    // Usar endpoint de desarrollo (sin autenticación)
    const response = await fetch(`${API_BASE_URL}/api/dev/user-purchases/${encodeURIComponent(email)}`, {
      headers: {
        'Content-Type': 'application/json'
      }
    });
    
    console.log(`📊 Status de respuesta: ${response.status} ${response.statusText}`);
    
    if (response.status === 401 || response.status === 403) {
      console.log('🔒 Endpoint protegido - requiere autenticación de administrador');
      console.log('💡 Para usar este endpoint necesitas:');
      console.log('1. Token JWT de un usuario con role: "admin"');
      console.log('2. Agregar el header: Authorization: Bearer <token>');
      console.log('3. O hacer login como admin en la aplicación web');
      
      const responseText = await response.text();
      console.log('📄 Respuesta del servidor:', responseText);
      
    } else if (response.ok) {
      const data = await response.json();
      console.log('\n✅ Datos obtenidos exitosamente:');
      console.log(JSON.stringify(data, null, 2));
      
    } else {
      console.log('❌ Error en la respuesta');
      const errorText = await response.text();
      console.log('📄 Error:', errorText);
    }
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

// Ejecutar la consulta
checkUserPurchases('alvaroserr@gmail.com');
