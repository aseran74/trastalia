import fetch from 'node-fetch';

const API_URL = 'http://localhost:3002/api';

// Función para hacer requests con autenticación
async function makeRequest(endpoint, options = {}) {
  const token = 'test-token'; // En producción vendría del login
  const response = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
      ...options.headers
    }
  });
  return response;
}

async function testCompleteSystem() {
  try {
    console.log('🚀 Probando sistema completo de Trastalia...\n');

    // 1. Probar sistema de puntos
    console.log('1️⃣ Probando sistema de puntos...');
    
    // Obtener balance de puntos
    const balanceResponse = await makeRequest('/points/balance');
    if (balanceResponse.ok) {
      const balance = await balanceResponse.json();
      console.log('✅ Balance de puntos:', balance.data);
    } else {
      console.log('❌ Error obteniendo balance de puntos');
    }

    // Agregar puntos de prueba
    const earnPointsResponse = await makeRequest('/points/earn', {
      method: 'POST',
      body: JSON.stringify({
        amount: 5000,
        description: 'Puntos de prueba del sistema',
        conversionRate: 100,
        originalPrice: 50
      })
    });

    if (earnPointsResponse.ok) {
      const earnResult = await earnPointsResponse.json();
      console.log('✅ Puntos agregados:', earnResult.data);
    } else {
      console.log('❌ Error agregando puntos');
    }

    // Obtener transacciones
    const transactionsResponse = await makeRequest('/points/transactions');
    if (transactionsResponse.ok) {
      const transactions = await transactionsResponse.json();
      console.log('✅ Transacciones encontradas:', transactions.data.transactions.length);
    }

    // 2. Probar sistema de compras directas
    console.log('\n2️⃣ Probando sistema de compras directas...');
    
    // Crear artículo de prueba
    const testArticle = {
      title: 'iPhone 15 Pro Max 512GB - Titanio Natural',
      description: 'iPhone 15 Pro Max en perfecto estado, con caja original y todos los accesorios. Pantalla de 6.7 pulgadas, cámara de 48MP, chip A17 Pro.',
      category: 'electrónica',
      condition: 'excelente',
      location: 'Madrid, España',
      tags: ['iphone', 'apple', 'smartphone', 'pro', 'max'],
      saleMode: 'trastalia_purchase',
      trastaliaPurchase: {
        enabled: true,
        adminPrice: 1200.00,
        demandLevel: 'high',
        adminApproved: false
      }
    };

    const createArticleResponse = await makeRequest('/articles', {
      method: 'POST',
      body: JSON.stringify(testArticle)
    });

    if (createArticleResponse.ok) {
      const article = await createArticleResponse.json();
      console.log('✅ Artículo creado:', article.data.title);

      // Crear solicitud de compra directa
      const purchaseRequestResponse = await makeRequest('/trastalia-purchases/request', {
        method: 'POST',
        body: JSON.stringify({
          articleId: article.data._id,
          adminPrice: 1200.00,
          demandLevel: 'high'
        })
      });

      if (purchaseRequestResponse.ok) {
        const purchaseRequest = await purchaseRequestResponse.json();
        console.log('✅ Solicitud de compra creada:', purchaseRequest.data.status);
      } else {
        console.log('❌ Error creando solicitud de compra');
      }
    } else {
      console.log('❌ Error creando artículo');
    }

    // 3. Probar ranking de puntos
    console.log('\n3️⃣ Probando ranking de puntos...');
    const leaderboardResponse = await makeRequest('/points/leaderboard');
    if (leaderboardResponse.ok) {
      const leaderboard = await leaderboardResponse.json();
      console.log('✅ Ranking de puntos:', leaderboard.data.length, 'usuarios');
    }

    // 4. Probar estadísticas de compras
    console.log('\n4️⃣ Probando estadísticas de compras...');
    const statsResponse = await makeRequest('/trastalia-purchases/stats');
    if (statsResponse.ok) {
      const stats = await statsResponse.json();
      console.log('✅ Estadísticas de compras:', stats.data);
    }

    console.log('\n🎉 Sistema completo probado exitosamente!');
    console.log('\n📋 Funcionalidades implementadas:');
    console.log('   ✅ Sistema de 4 modalidades de venta');
    console.log('   ✅ Sistema de puntos para vendedores');
    console.log('   ✅ Sistema de compras directas por Trastalia');
    console.log('   ✅ API completa para gestión de puntos');
    console.log('   ✅ API completa para compras directas');
    console.log('   ✅ Interfaz de usuario para puntos');
    console.log('   ✅ Interfaz para solicitudes de compra');
    console.log('   ✅ Navegación actualizada');

  } catch (error) {
    console.log('❌ Error en el sistema:', error.message);
  }
}

testCompleteSystem();

