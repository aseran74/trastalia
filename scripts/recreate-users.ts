import mongoose from 'mongoose';
import User from '../server/models/User';
import Article from '../server/models/Article';
import Exchange from '../server/models/Exchange';

// Conectar a MongoDB Atlas
const connectDB = async () => {
  try {
    const MONGODB_URI = process.env.MONGODB_URI || 'mongodb+srv://trastalia_user:E8wlpttDBlCqY7cn@cluster0.zehostg.mongodb.net/tailadmin?retryWrites=true&w=majority&appName=Cluster0';
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Conectado a MongoDB Atlas');
  } catch (error) {
    console.error('❌ Error al conectar:', error);
    process.exit(1);
  }
};

async function recreateUsers() {
  try {
    await connectDB();
    
    console.log('🗑️ Eliminando usuarios existentes...');
    
    // Eliminar usuarios existentes
    await User.deleteMany({ email: { $in: ['alvaroserr@gmail.com', 'usuario.servidor@trastalia.com'] } });
    console.log('✅ Usuarios eliminados');
    
    // Eliminar artículos relacionados
    await Article.deleteMany({});
    console.log('✅ Artículos eliminados');
    
    // Eliminar intercambios relacionados
    await Exchange.deleteMany({});
    console.log('✅ Intercambios eliminados');
    
    console.log('\n🆕 Creando usuarios nuevos...');
    
    // Crear usuario Álvaro
    const alvaroUser = new User({
      name: 'Álvaro Serrano',
      email: 'alvaroserr@gmail.com',
      password: 'alvaro123',
      role: 'user',
      avatar: '/images/user/user-1.jpg',
      isActive: true,
      points: 1500,
      logisticsLevel: 'comerciante',
      reputation: 850
    });
    
    await alvaroUser.save();
    console.log('✅ Usuario Álvaro creado');
    
    // Crear usuario servidor
    const serverUser = new User({
      name: 'Usuario Servidor',
      email: 'usuario.servidor@trastalia.com',
      password: 'servidor123',
      role: 'moderator',
      avatar: '/images/user/user-2.jpg',
      isActive: true,
      points: 5000,
      logisticsLevel: 'capitán',
      reputation: 950
    });
    
    await serverUser.save();
    console.log('✅ Usuario Servidor creado');
    
    // Verificar contraseñas
    console.log('\n🔍 Verificando contraseñas...');
    
    const alvaroCheck = await User.findOne({ email: 'alvaroserr@gmail.com' }).select('+password');
    const alvaroValid = await alvaroCheck?.comparePassword('alvaro123');
    console.log(`🔑 Álvaro - Contraseña válida: ${alvaroValid ? '✅' : '❌'}`);
    
    const serverCheck = await User.findOne({ email: 'usuario.servidor@trastalia.com' }).select('+password');
    const serverValid = await serverCheck?.comparePassword('servidor123');
    console.log(`🔑 Servidor - Contraseña válida: ${serverValid ? '✅' : '❌'}`);
    
    if (alvaroValid && serverValid) {
      console.log('\n🎉 ¡Usuarios creados correctamente!');
      console.log('📧 Email Álvaro: alvaroserr@gmail.com');
      console.log('🔑 Contraseña Álvaro: alvaro123');
      console.log('📧 Email Servidor: usuario.servidor@trastalia.com');
      console.log('🔑 Contraseña Servidor: servidor123');
    } else {
      console.log('\n❌ Error en la creación de usuarios');
    }
    
  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await mongoose.connection.close();
    console.log('\n📡 Conexión cerrada');
  }
}

recreateUsers();
