const mongoose = require('mongoose');
require('dotenv').config();

async function testDirectConnection() {
  // Intentar diferentes variaciones del connection string
  const connectionStrings = [
    // Usando el Project ID en el connection string
    'mongodb+srv://alvaroserr:alvaro123@cluster0.68c7dde45281f22dfdaebc62.mongodb.net/trastalia?retryWrites=true&w=majority',
    
    // Sin el Project ID
    'mongodb+srv://alvaroserr:alvaro123@cluster0.mongodb.net/trastalia?retryWrites=true&w=majority',
    
    // Con diferentes nombres de cluster comunes
    'mongodb+srv://alvaroserr:alvaro123@cluster0-8xqjq.mongodb.net/trastalia?retryWrites=true&w=majority',
    'mongodb+srv://alvaroserr:alvaro123@cluster0-8xqjq.mongodb.net/?retryWrites=true&w=majority',
    
    // Con el nombre del cluster que aparece en el error
    'mongodb+srv://alvaroserr:alvaro123@cluster0.8xqjq.mongodb.net/trastalia?retryWrites=true&w=majority&serverSelectionTimeoutMS=30000',
  ];

  for (let i = 0; i < connectionStrings.length; i++) {
    const uri = connectionStrings[i];
    console.log(`\n🔗 Probando conexión ${i + 1}:`);
    console.log(`📋 URI: ${uri.substring(0, 60)}...`);
    
    try {
      await mongoose.connect(uri, {
        serverSelectionTimeoutMS: 10000,
        connectTimeoutMS: 10000,
      });
      
      console.log('✅ ¡Conexión exitosa!');
      
      // Probar operaciones básicas
      const db = mongoose.connection.db;
      const collections = await db.listCollections().toArray();
      console.log(`📊 Colecciones encontradas: ${collections.length}`);
      
      collections.forEach(collection => {
        console.log(`   - ${collection.name}`);
      });
      
      // Probar una consulta simple
      const testCollection = db.collection('users');
      const userCount = await testCollection.countDocuments();
      console.log(`👥 Usuarios en la base de datos: ${userCount}`);
      
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

testDirectConnection();
