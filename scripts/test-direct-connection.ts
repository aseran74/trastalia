import mongoose from 'mongoose';

// Cadena de conexión correcta
const MONGODB_URI = 'mongodb+srv://trastalia_user:E8wlpttDBlCqY7cn@cluster0.zehostg.mongodb.net/tailadmin?retryWrites=true&w=majority&appName=Cluster0';

const testDirectConnection = async () => {
  try {
    console.log('🔌 Probando conexión directa a MongoDB Atlas...');
    console.log('📍 URI:', MONGODB_URI.replace(/\/\/.*@/, '//***:***@'));
    
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Conexión exitosa!');
    
    // Crear un usuario de prueba directamente
    const User = mongoose.model('User', new mongoose.Schema({
      name: String,
      email: String,
      password: String,
      role: String,
      createdAt: { type: Date, default: Date.now }
    }));
    
    console.log('\n👤 Creando usuario de prueba...');
    const testUser = new User({
      name: 'Usuario Prueba',
      email: 'prueba@trastalia.com',
      password: 'password123',
      role: 'user'
    });
    
    await testUser.save();
    console.log('✅ Usuario creado exitosamente');
    
    // Verificar que se guardó
    const users = await User.find({});
    console.log(`\n👥 Total de usuarios: ${users.length}`);
    users.forEach((user: any, index: number) => {
      console.log(`  ${index + 1}. ${user.name} (${user.email}) - Rol: ${user.role}`);
    });
    
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

testDirectConnection();






