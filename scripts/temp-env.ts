import mongoose from 'mongoose';

// Configuración temporal para verificar colecciones
const MONGODB_URI = 'mongodb+srv://mikabodea_db_user:Tailadmin2024@cluster0.zehostg.mongodb.net/tailadmin?retryWrites=true&w=majority&appName=Cluster0';

const checkCollections = async () => {
  try {
    console.log('🔌 Conectando a MongoDB Atlas...');
    console.log('📍 URI:', MONGODB_URI.replace(/\/\/.*@/, '//***:***@')); // Ocultar credenciales
    
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Conectado exitosamente');

    // Obtener la base de datos
    const db = mongoose.connection.db;
    
    // Listar todas las bases de datos
    console.log('\n📊 Bases de datos disponibles:');
    const databases = await db.admin().listDatabases();
    databases.databases.forEach((db: any) => {
      console.log(`  - ${db.name}`);
    });

    // Listar colecciones en la base de datos actual
    console.log('\n📁 Colecciones en la base de datos actual:');
    const collections = await db.listCollections().toArray();
    
    if (collections.length === 0) {
      console.log('  ❌ No hay colecciones en esta base de datos');
    } else {
      collections.forEach((collection: any) => {
        console.log(`  - ${collection.name}`);
      });
    }

    // Verificar si existe la colección 'users'
    const usersCollection = await db.collection('users').countDocuments();
    console.log(`\n👥 Documentos en colección 'users': ${usersCollection}`);

    // Si hay usuarios, mostrar algunos
    if (usersCollection > 0) {
      console.log('\n📋 Primeros usuarios:');
      const users = await db.collection('users').find({}).limit(3).toArray();
      users.forEach((user: any) => {
        console.log(`  - ${user.name} (${user.email}) - Rol: ${user.role}`);
      });
    }

  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await mongoose.disconnect();
    console.log('\n🔌 Desconectado de MongoDB');
  }
};

checkCollections();
