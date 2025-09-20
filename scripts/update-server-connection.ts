import mongoose from 'mongoose';

// Cadena de conexión correcta
const MONGODB_URI = 'mongodb+srv://trastalia_user:E8wlpttDBlCqY7cn@cluster0.zehostg.mongodb.net/tailadmin?retryWrites=true&w=majority&appName=Cluster0';

const testConnection = async () => {
  try {
    console.log('🔌 Conectando a MongoDB Atlas con credenciales correctas...');
    console.log('📍 URI:', MONGODB_URI.replace(/\/\/.*@/, '//***:***@'));
    
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Conexión exitosa!');
    
    // Obtener la base de datos
    const db = mongoose.connection.db;
    
    // Listar bases de datos
    const databases = await db.admin().listDatabases();
    console.log('\n📊 Bases de datos disponibles:');
    databases.databases.forEach((db: any) => {
      console.log(`  - ${db.name}`);
    });
    
    // Listar colecciones en la base de datos tailadmin
    const collections = await db.listCollections().toArray();
    console.log('\n📁 Colecciones en tailadmin:');
    if (collections.length === 0) {
      console.log('  ❌ No hay colecciones (esto es normal para una base de datos nueva)');
    } else {
      collections.forEach((collection: any) => {
        console.log(`  - ${collection.name}`);
      });
    }
    
    // Crear la colección users si no existe
    const usersCollection = db.collection('users');
    const usersCount = await usersCollection.countDocuments();
    console.log(`\n👥 Usuarios en colección 'users': ${usersCount}`);
    
    if (usersCount === 0) {
      console.log('📝 La colección users está vacía (esto es normal para una base de datos nueva)');
      console.log('💡 Los usuarios se crearán cuando te registres desde el frontend');
    } else {
      const users = await usersCollection.find({}).limit(3).toArray();
      console.log('📋 Primeros usuarios:');
      users.forEach((user: any) => {
        console.log(`  - ${user.name || user.email} (${user.email}) - Rol: ${user.role || 'N/A'}`);
      });
    }
    
    await mongoose.disconnect();
    console.log('\n🔌 Desconectado de MongoDB');
    return true;
    
  } catch (error: any) {
    console.error('❌ Error:', error.message);
    if (mongoose.connection.readyState === 1) {
      await mongoose.disconnect();
    }
    return false;
  }
};

testConnection();






