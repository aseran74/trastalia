import mongoose from 'mongoose';

// Diferentes combinaciones para probar
const testConnections = [
  {
    name: 'Usuario original con contraseña nueva',
    uri: 'mongodb+srv://mikabodea_db_user:Tailadmin2024@cluster0.zehostg.mongodb.net/tailadmin?retryWrites=true&w=majority&appName=Cluster0'
  },
  {
    name: 'Usuario original con contraseña original',
    uri: 'mongodb+srv://mikabodea_db_user:Mika1974%26@cluster0.zehostg.mongodb.net/tailadmin?retryWrites=true&w=majority&appName=Cluster0'
  },
  {
    name: 'Sin base de datos específica',
    uri: 'mongodb+srv://mikabodea_db_user:Tailadmin2024@cluster0.zehostg.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0'
  }
];

const testConnection = async (name: string, uri: string) => {
  try {
    console.log(`\n🔌 Probando: ${name}`);
    console.log(`📍 URI: ${uri.replace(/\/\/.*@/, '//***:***@')}`);
    
    await mongoose.connect(uri);
    console.log('✅ Conexión exitosa!');
    
    // Listar bases de datos
    const db = mongoose.connection.db;
    const databases = await db.admin().listDatabases();
    console.log('📊 Bases de datos disponibles:');
    databases.databases.forEach((db: any) => {
      console.log(`  - ${db.name}`);
    });
    
    // Listar colecciones en la base de datos actual
    const collections = await db.listCollections().toArray();
    console.log('\n📁 Colecciones:');
    if (collections.length === 0) {
      console.log('  ❌ No hay colecciones');
    } else {
      collections.forEach((collection: any) => {
        console.log(`  - ${collection.name}`);
      });
    }
    
    await mongoose.disconnect();
    return true;
    
  } catch (error: any) {
    console.log(`❌ Error: ${error.message}`);
    if (mongoose.connection.readyState === 1) {
      await mongoose.disconnect();
    }
    return false;
  }
};

const runTests = async () => {
  console.log('🧪 Probando diferentes configuraciones de conexión...\n');
  
  for (const test of testConnections) {
    const success = await testConnection(test.name, test.uri);
    if (success) {
      console.log('\n🎉 ¡Conexión exitosa encontrada!');
      break;
    }
  }
  
  console.log('\n🔍 Si todas las pruebas fallan, verifica:');
  console.log('1. El usuario existe en MongoDB Atlas');
  console.log('2. La contraseña es correcta');
  console.log('3. Tu IP está en la lista blanca');
  console.log('4. El cluster está activo');
};

runTests();






