const mongoose = require('mongoose');
require('dotenv').config();

async function testUsernameVariations() {
  const baseUri = 'mongodb+srv://{username}:Mika1974%26@cluster0.zehostg.mongodb.net/trastalia?retryWrites=true&w=majority&appName=Cluster0';
  
  // Diferentes nombres de usuario posibles
  const usernames = [
    'mikabodea',  // Sin el dominio
    'mikabodea@gmail.com',  // Email completo (puede que funcione en algunos casos)
    'admin',
    'user',
    'root',
    'trastalia',
    'mika',
    'mikabodea1974',
    'mikabodea_gmail',
    'mikabodea-gmail',
    'mikabodea.gmail',
  ];
  
  for (let i = 0; i < usernames.length; i++) {
    const username = usernames[i];
    const uri = baseUri.replace('{username}', username);
    
    console.log(`\n🔑 Probando usuario ${i + 1}/${usernames.length}:`);
    console.log(`👤 Usuario: ${username}`);
    console.log(`📋 URI: ${uri.substring(0, 80)}...`);
    
    try {
      await mongoose.connect(uri, {
        serverSelectionTimeoutMS: 5000,
        connectTimeoutMS: 5000,
      });
      
      console.log('✅ ¡Conexión exitosa!');
      console.log(`🎯 Usuario correcto: ${username}`);
      
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
  
  console.log('\n❌ No se pudo conectar con ningún nombre de usuario');
  console.log('\n💡 Posibles soluciones:');
  console.log('1. Verificar el nombre de usuario en MongoDB Atlas');
  console.log('2. Crear un nuevo usuario en MongoDB Atlas');
  console.log('3. Verificar que la contraseña sea correcta');
  console.log('4. Verificar que la IP esté en la whitelist');
  return false;
}

testUsernameVariations();
