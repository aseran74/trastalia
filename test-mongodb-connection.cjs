const mongoose = require('mongoose');
require('dotenv').config();

async function testMongoDBConnection() {
  const connectionStrings = [
    // String original
    'mongodb+srv://alvaroserr:alvaro123@cluster0.8xqjq.mongodb.net/trastalia?retryWrites=true&w=majority&appName=Cluster0',
    
    // Sin appName
    'mongodb+srv://alvaroserr:alvaro123@cluster0.8xqjq.mongodb.net/trastalia?retryWrites=true&w=majority',
    
    // Con diferentes nombres de cluster
    'mongodb+srv://alvaroserr:alvaro123@cluster0.mongodb.net/trastalia?retryWrites=true&w=majority',
    'mongodb+srv://alvaroserr:alvaro123@cluster0.8xqjq.mongodb.net/?retryWrites=true&w=majority',
    
    // Con timeout más largo
    'mongodb+srv://alvaroserr:alvaro123@cluster0.8xqjq.mongodb.net/trastalia?retryWrites=true&w=majority&serverSelectionTimeoutMS=10000',
  ];

  for (let i = 0; i < connectionStrings.length; i++) {
    const uri = connectionStrings[i];
    console.log(`\n🔗 Probando conexión ${i + 1}:`);
    console.log(`📋 URI: ${uri.substring(0, 50)}...`);
    
    try {
      await mongoose.connect(uri, {
        serverSelectionTimeoutMS: 5000,
        connectTimeoutMS: 5000,
      });
      
      console.log('✅ ¡Conexión exitosa!');
      
      // Probar operaciones básicas
      const db = mongoose.connection.db;
      const collections = await db.listCollections().toArray();
      console.log(`📊 Colecciones encontradas: ${collections.length}`);
      
      collections.forEach(collection => {
        console.log(`   - ${collection.name}`);
      });
      
      await mongoose.disconnect();
      console.log('📡 Conexión cerrada');
      return true;
      
    } catch (error) {
      console.log(`❌ Error: ${error.message}`);
    }
  }
  
  console.log('\n❌ No se pudo conectar con ninguna configuración');
  return false;
}

testMongoDBConnection();
