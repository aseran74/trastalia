const mongoose = require('mongoose');
require('dotenv').config();

async function testFinalConnection() {
  const MONGODB_URI = 'mongodb+srv://mikabodea:Mika1974%26@trastalia.ycg2lvb.mongodb.net/trastalia?retryWrites=true&w=majority&appName=Trastalia';
  
  console.log('🔗 Probando conexión con el connection string final...');
  console.log('👤 Usuario: mikabodea');
  console.log('🔐 Contraseña: Mika1974&');
  console.log('📋 Cluster: trastalia.ycg2lvb');
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
        
        // Mostrar algunos documentos de ejemplo
        if (count > 0) {
          const sample = await db.collection(collection.name).findOne();
          console.log(`   📄 Ejemplo: ${JSON.stringify(sample, null, 2).substring(0, 100)}...`);
        }
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

testFinalConnection();
