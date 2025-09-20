const mongoose = require('mongoose');
require('dotenv').config();

async function testEmailEncoding() {
  const baseUri = 'mongodb+srv://{email}:Mika1974%26@cluster0.zehostg.mongodb.net/trastalia?retryWrites=true&w=majority&appName=Cluster0';
  
  // Diferentes formas de codificar el email
  const emailVariations = [
    'mikabodea@gmail.com',  // Sin codificar
    'mikabodea%40gmail.com',  // @ codificado como %40
    'mikabodea%2B@gmail.com',  // + codificado como %2B
    'mikabodea%40gmail%2Ecom',  // @ y . codificados
  ];
  
  for (let i = 0; i < emailVariations.length; i++) {
    const email = emailVariations[i];
    const uri = baseUri.replace('{email}', email);
    
    console.log(`\n🔑 Probando email ${i + 1}/${emailVariations.length}:`);
    console.log(`📧 Email: ${email}`);
    console.log(`📋 URI: ${uri.substring(0, 80)}...`);
    
    try {
      await mongoose.connect(uri, {
        serverSelectionTimeoutMS: 5000,
        connectTimeoutMS: 5000,
      });
      
      console.log('✅ ¡Conexión exitosa!');
      console.log(`🎯 Email correcto: ${email}`);
      
      // Probar operaciones básicas
      const db = mongoose.connection.db;
      const collections = await db.listCollections().toArray();
      console.log(`📊 Colecciones encontradas: ${collections.length}`);
      
      collections.forEach(collection => {
        console.log(`   - ${collection.name}`);
      });
      
      await mongoose.disconnect();
      console.log('📡 Conexión cerrada');
      
      console.log(`\n🎉 ¡CONNECTION STRING CORRECTO ENCONTRADO!`);
      console.log(`📋 URI: ${uri}`);
      
      return true;
      
    } catch (error) {
      console.log(`❌ Error: ${error.message}`);
    }
  }
  
  console.log('\n❌ No se pudo conectar con ninguna variación del email');
  return false;
}

testEmailEncoding();
