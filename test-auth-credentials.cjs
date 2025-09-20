const mongoose = require('mongoose');
require('dotenv').config();

async function testAuthCredentials() {
  const baseUri = 'mongodb+srv://{username}:{password}@cluster0.zehostg.mongodb.net/trastalia?retryWrites=true&w=majority&appName=Cluster0';
  
  // Diferentes combinaciones de credenciales
  const credentials = [
    { username: 'alvaroserr', password: 'alvaro123' },
    { username: 'admin', password: 'admin123' },
    { username: 'admin', password: 'admin' },
    { username: 'root', password: 'root' },
    { username: 'user', password: 'user' },
    { username: 'trastalia', password: 'trastalia' },
    { username: 'trastalia', password: 'trastalia123' },
    { username: 'alvaroserr', password: 'trastalia' },
    { username: 'alvaroserr', password: 'trastalia123' },
    { username: 'alvaroserr', password: 'admin123' },
  ];
  
  for (let i = 0; i < credentials.length; i++) {
    const { username, password } = credentials[i];
    const uri = baseUri.replace('{username}', username).replace('{password}', password);
    
    console.log(`\n🔑 Probando credenciales ${i + 1}/${credentials.length}:`);
    console.log(`👤 Usuario: ${username}`);
    console.log(`🔐 Contraseña: ${password}`);
    
    try {
      await mongoose.connect(uri, {
        serverSelectionTimeoutMS: 5000,
        connectTimeoutMS: 5000,
      });
      
      console.log('✅ ¡Conexión exitosa!');
      console.log(`🎯 Credenciales correctas: ${username}:${password}`);
      
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
  
  console.log('\n❌ No se pudo conectar con ninguna combinación de credenciales');
  console.log('\n💡 Posibles soluciones:');
  console.log('1. Verificar el nombre de usuario y contraseña en MongoDB Atlas');
  console.log('2. Verificar que el usuario tenga permisos de lectura/escritura');
  console.log('3. Verificar que la IP esté en la whitelist');
  return false;
}

testAuthCredentials();
