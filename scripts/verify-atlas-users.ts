import mongoose from 'mongoose';

// Cadena de conexión correcta
const MONGODB_URI = 'mongodb+srv://trastalia_user:E8wlpttDBlCqY7cn@cluster0.zehostg.mongodb.net/tailadmin?retryWrites=true&w=majority&appName=Cluster0';

const verifyUsers = async () => {
  try {
    console.log('🔌 Conectando a MongoDB Atlas...');
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Conectado exitosamente');
    
    // Obtener la base de datos
    const db = mongoose.connection.db;
    
    // Listar todas las colecciones
    const collections = await db.listCollections().toArray();
    console.log('\n📁 Todas las colecciones:');
    if (collections.length === 0) {
      console.log('  ❌ No hay colecciones');
    } else {
      collections.forEach((collection: any) => {
        console.log(`  - ${collection.name}`);
      });
    }
    
    // Verificar si existe la colección users
    const usersCollection = db.collection('users');
    const usersCount = await usersCollection.countDocuments();
    console.log(`\n👥 Total de usuarios en colección 'users': ${usersCount}`);
    
    if (usersCount > 0) {
      const users = await usersCollection.find({}).toArray();
      console.log('\n📋 Todos los usuarios:');
      users.forEach((user: any, index: number) => {
        console.log(`  ${index + 1}. ${user.name || 'Sin nombre'} (${user.email}) - Rol: ${user.role || 'N/A'} - Creado: ${user.createdAt || 'N/A'}`);
      });
    } else {
      console.log('📝 No hay usuarios en la colección');
    }
    
    // Verificar si hay usuarios en otras colecciones
    console.log('\n🔍 Buscando usuarios en otras colecciones...');
    for (const collection of collections) {
      if (collection.name !== 'users') {
        const count = await db.collection(collection.name).countDocuments();
        console.log(`  - ${collection.name}: ${count} documentos`);
      }
    }
    
    await mongoose.disconnect();
    console.log('\n🔌 Desconectado de MongoDB');
    
  } catch (error: any) {
    console.error('❌ Error:', error.message);
    if (mongoose.connection.readyState === 1) {
      await mongoose.disconnect();
    }
  }
};

verifyUsers();






