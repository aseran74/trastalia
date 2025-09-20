import mongoose from 'mongoose';

// Probar con el nuevo usuario
const testConnections = [
  {
    name: 'Nuevo usuario trastalia_user con contraseña E8wlpttDBlCqY7cn',
    uri: 'mongodb+srv://trastalia_user:E8wlpttDBlCqY7cn@cluster0.zehostg.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0'
  },
  {
    name: 'Nuevo usuario con base de datos tailadmin',
    uri: 'mongodb+srv://trastalia_user:E8wlpttDBlCqY7cn@cluster0.zehostg.mongodb.net/tailadmin?retryWrites=true&w=majority&appName=Cluster0'
  },
  {
    name: 'Nuevo usuario con base de datos trastalia',
    uri: 'mongodb+srv://trastalia_user:E8wlpttDBlCqY7cn@cluster0.zehostg.mongodb.net/trastalia?retryWrites=true&w=majority&appName=Cluster0'
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
    
    // Si hay colección users, mostrar algunos documentos
    if (collections.some((c: any) => c.name === 'users')) {
      const usersCount = await db.collection('users').countDocuments();
      console.log(`\n👥 Total de usuarios: ${usersCount}`);
      
      if (usersCount > 0) {
        const users = await db.collection('users').find({}).limit(3).toArray();
        console.log('📋 Primeros usuarios:');
        users.forEach((user: any) => {
          console.log(`  - ${user.name || user.email} (${user.email}) - Rol: ${user.role || 'N/A'}`);
        });
      }
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
  console.log('🧪 Probando nuevo usuario trastalia_user...\n');
  
  let successCount = 0;
  for (const test of testConnections) {
    const success = await testConnection(test.name, test.uri);
    if (success) {
      successCount++;
      console.log('\n🎉 ¡Conexión exitosa encontrada!');
      console.log('📝 Usa esta cadena de conexión en tu aplicación:');
      console.log(`   ${test.uri.replace(/\/\/.*@/, '//***:***@')}`);
      break;
    }
  }
  
  if (successCount === 0) {
    console.log('\n❌ La conexión falló.');
    console.log('\n🔍 Verifica en MongoDB Atlas:');
    console.log('1. Database Access - que el usuario trastalia_user existe');
    console.log('2. Network Access - que tu IP está en la lista blanca');
    console.log('3. Que la contraseña es correcta');
  }
};

runTests();






