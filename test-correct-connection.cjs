const mongoose = require('mongoose');
require('dotenv').config();

async function testCorrectConnection() {
  const MONGODB_URI = 'mongodb+srv://alvaroserr:alvaro123@cluster0.zehostg.mongodb.net/trastalia?retryWrites=true&w=majority&appName=Cluster0';
  
  console.log('🔗 Probando conexión con el connection string correcto...');
  console.log('📋 URI:', MONGODB_URI);
  
  try {
    await mongoose.connect(MONGODB_URI, {
      serverSelectionTimeoutMS: 10000,
      connectTimeoutMS: 10000,
    });
    
    console.log('✅ ¡Conexión exitosa a MongoDB Atlas!');
    
    // Probar operaciones básicas
    const db = mongoose.connection.db;
    const collections = await db.listCollections().toArray();
    console.log(`📊 Colecciones encontradas: ${collections.length}`);
    
    collections.forEach(collection => {
      console.log(`   - ${collection.name}`);
    });
    
    // Probar una consulta simple en cada colección
    for (const collection of collections) {
      try {
        const count = await db.collection(collection.name).countDocuments();
        console.log(`   📈 ${collection.name}: ${count} documentos`);
      } catch (error) {
        console.log(`   ❌ Error en ${collection.name}: ${error.message}`);
      }
    }
    
    await mongoose.disconnect();
    console.log('📡 Conexión cerrada');
    return true;
    
  } catch (error) {
    console.error('❌ Error conectando a MongoDB Atlas:', error.message);
    return false;
  }
}

testCorrectConnection();
