import mongoose from 'mongoose';

// Cadena de conexión correcta
const MONGODB_URI = 'mongodb+srv://trastalia_user:E8wlpttDBlCqY7cn@cluster0.zehostg.mongodb.net/tailadmin?retryWrites=true&w=majority&appName=Cluster0';

const testServerAtlas = async () => {
  try {
    console.log('🔌 Conectando a MongoDB Atlas...');
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Conectado exitosamente');
    
    // Crear un usuario de prueba desde el servidor
    const User = mongoose.model('User', new mongoose.Schema({
      name: String,
      email: String,
      password: String,
      role: String,
      avatar: String,
      isActive: Boolean,
      lastLogin: Date,
      createdAt: { type: Date, default: Date.now },
      updatedAt: { type: Date, default: Date.now }
    }));
    
    console.log('\n👤 Creando usuario desde servidor...');
    const serverUser = new User({
      name: 'Usuario Servidor',
      email: 'servidor@trastalia.com',
      password: 'servidor123',
      role: 'user',
      avatar: '',
      isActive: true
    });
    
    await serverUser.save();
    console.log('✅ Usuario del servidor creado exitosamente');
    
    // Verificar todos los usuarios
    const users = await User.find({});
    console.log(`\n👥 Total de usuarios en Atlas: ${users.length}`);
    users.forEach((user: any, index: number) => {
      console.log(`  ${index + 1}. ${user.name} (${user.email}) - Rol: ${user.role} - Creado: ${user.createdAt}`);
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

testServerAtlas();






