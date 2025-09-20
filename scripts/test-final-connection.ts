import mongoose from 'mongoose';

// Probar todas las combinaciones posibles
const testConnections = [
  {
    name: 'Usuario tailadmin_user con contraseña Tailadmin2024',
    uri: 'mongodb+srv://tailadmin_user:Tailadmin2024@cluster0.zehostg.mongodb.net/tailadmin?retryWrites=true&w=majority&appName=Cluster0'
  },
  {
    name: 'Usuario tailadmin_user sin base de datos específica',
    uri: 'mongodb+srv://tailadmin_user:Tailadmin2024@cluster0.zehostg.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0'
  },
  {
    name: 'Usuario mikabodea_db_user con contraseña Mika1974&',
    uri: 'mongodb+srv://mikabodea_db_user:Mika1974%26@cluster0.zehostg.mongodb.net/tailadmin?retryWrites=true&w=majority&appName=Cluster0'
  },
  {
    name: 'Usuario mikabodea_db_user sin base de datos específica',
    uri: 'mongodb+srv://mikabodea_db_user:Mika1974%26@cluster0.zehostg.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0'
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
  console.log('🧪 Probando todas las combinaciones de credenciales...\n');
  
  let successCount = 0;
  for (const test of testConnections) {
    const success = await testConnection(test.name, test.uri);
    if (success) {
      successCount++;
      console.log('\n🎉 ¡Conexión exitosa encontrada!');
      break;
    }
  }
  
  if (successCount === 0) {
    console.log('\n❌ Todas las conexiones fallaron.');
    console.log('\n🔍 Para resolver el problema:');
    console.log('1. Ve a MongoDB Atlas → Database Access');
    console.log('2. Verifica que los usuarios existen:');
    console.log('   - tailadmin_user');
    console.log('   - mikabodea_db_user');
    console.log('3. Verifica las contraseñas:');
    console.log('   - Tailadmin2024');
    console.log('   - Mika1974&');
    console.log('4. Ve a Network Access y agrega tu IP');
    console.log('5. Obtén la cadena de conexión desde Atlas:');
    console.log('   Connect → Connect your application');
  }
};

runTests();






