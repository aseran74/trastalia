const mongoose = require('mongoose');
require('dotenv').config();

async function testAtlasConnection() {
  try {
    console.log('🔗 Probando conexión a MongoDB Atlas...');
    console.log('📋 Project ID:', process.env.MDB_MCP_API_CLIENT_ID);
    console.log('🔑 API Key:', process.env.MDB_MCP_API_CLIENT_ID);
    console.log('🔐 API Secret:', process.env.MDB_MCP_API_CLIENT_SECRET ? 'Configurado' : 'No configurado');
    console.log('🌐 Connection String:', process.env.MONGODB_URI ? 'Configurado' : 'No configurado');
    
    const MONGODB_URI = process.env.MONGODB_URI || 'mongodb+srv://alvaroserr:alvaro123@cluster0.8xqjq.mongodb.net/trastalia?retryWrites=true&w=majority&appName=Cluster0';
    
    console.log('\n🚀 Conectando a MongoDB Atlas...');
    await mongoose.connect(MONGODB_URI);
    
    console.log('✅ ¡Conexión exitosa a MongoDB Atlas!');
    
    // Probar operaciones básicas
    const db = mongoose.connection.db;
    const collections = await db.listCollections().toArray();
    console.log(`📊 Colecciones encontradas: ${collections.length}`);
    
    collections.forEach(collection => {
      console.log(`   - ${collection.name}`);
    });
    
    await mongoose.disconnect();
    console.log('📡 Conexión cerrada');
    
  } catch (error) {
    console.error('❌ Error conectando a MongoDB Atlas:', error.message);
    console.log('\n🔧 Posibles soluciones:');
    console.log('   1. Verificar que el cluster esté activo');
    console.log('   2. Verificar las credenciales de conexión');
    console.log('   3. Verificar que la IP esté en la whitelist');
    console.log('   4. Verificar que el usuario tenga permisos');
  }
}

testAtlasConnection();
