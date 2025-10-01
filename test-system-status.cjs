const fetch = require('node-fetch');

const API_URL = 'http://localhost:3002';

async function testSystemStatus() {
  console.log('🔍 Verificando estado del sistema...\n');
  
  // 1. Test Health Check
  console.log('1️⃣ Test: Health Check');
  try {
    const response = await fetch(`${API_URL}/api/health`);
    const data = await response.json();
    console.log('✅ Health Check:', data);
  } catch (error) {
    console.error('❌ Health Check falló:', error.message);
    console.log('⚠️ El servidor podría no estar ejecutándose en el puerto 3002');
    return;
  }
  
  console.log('\n2️⃣ Test: Artículos Públicos (sin autenticación)');
  try {
    const response = await fetch(`${API_URL}/api/articles/public`);
    const data = await response.json();
    console.log(`✅ Artículos públicos: ${data.data?.length || 0} encontrados`);
    if (data.data && data.data.length > 0) {
      console.log('📋 Primer artículo:', {
        id: data.data[0]._id,
        title: data.data[0].title || data.data[0].nombre,
        precio: data.data[0].price || data.data[0].precio_propuesto_vendedor,
        estado: data.data[0].estado_articulo
      });
    }
  } catch (error) {
    console.error('❌ Test artículos públicos falló:', error.message);
  }
  
  console.log('\n3️⃣ Test: Login con credenciales de prueba');
  let authToken = null;
  try {
    const response = await fetch(`${API_URL}/api/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: 'juan@correo.com',
        password: 'contrasena'
      })
    });
    const data = await response.json();
    if (data.success) {
      authToken = data.data.token;
      console.log('✅ Login exitoso:', {
        nombre: data.data.user.name,
        email: data.data.user.email,
        role: data.data.user.role,
        points: data.data.user.points
      });
    } else {
      console.log('❌ Login falló:', data.message);
    }
  } catch (error) {
    console.error('❌ Test login falló:', error.message);
  }
  
  if (authToken) {
    console.log('\n4️⃣ Test: Artículos del Admin (con autenticación)');
    try {
      const response = await fetch(`${API_URL}/api/articles/admin-owned`, {
        headers: {
          'Authorization': `Bearer ${authToken}`,
          'Content-Type': 'application/json'
        }
      });
      const data = await response.json();
      console.log(`✅ Artículos del admin: ${data.data?.length || 0} encontrados`);
      if (data.data && data.data.length > 0) {
        console.log('📋 Primer artículo:', {
          id: data.data[0]._id,
          title: data.data[0].title || data.data[0].nombre,
          precio: data.data[0].price || data.data[0].precio_sugerido || data.data[0].precio_propuesto_vendedor,
          estado: data.data[0].estado_articulo
        });
      }
    } catch (error) {
      console.error('❌ Test artículos admin falló:', error.message);
    }
    
    console.log('\n5️⃣ Test: Obtener un artículo específico');
    try {
      const articlesResponse = await fetch(`${API_URL}/api/articles/public`);
      const articlesData = await articlesResponse.json();
      
      if (articlesData.data && articlesData.data.length > 0) {
        const firstArticleId = articlesData.data[0]._id;
        const response = await fetch(`${API_URL}/api/articles/${firstArticleId}`);
        const data = await response.json();
        
        if (data.success) {
          console.log('✅ Artículo obtenido:', {
            id: data.data._id,
            title: data.data.title || data.data.nombre,
            price: data.data.price || data.data.precio_propuesto_vendedor
          });
        } else {
          console.log('❌ No se pudo obtener el artículo:', data.message);
        }
      } else {
        console.log('⚠️ No hay artículos para probar');
      }
    } catch (error) {
      console.error('❌ Test obtener artículo falló:', error.message);
    }
  }
  
  console.log('\n✅ Diagnóstico completado');
  console.log('\n📋 Resumen:');
  console.log('- Si el servidor no responde, ejecuta: npm run dev o node server/working-server.cjs');
  console.log('- Si no hay artículos, necesitas crear algunos desde el panel de administración');
  console.log('- Verifica que el archivo .env tenga la configuración correcta de MongoDB');
}

testSystemStatus().catch(console.error);

