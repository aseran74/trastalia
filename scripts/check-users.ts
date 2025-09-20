import mongoose from 'mongoose';
import User from '../server/models/User';

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

async function checkUsers() {
  try {
    await connectDB();
    
    console.log('🔍 Verificando usuarios...');
    
    const users = await User.find({}).select('name email role points logisticsLevel reputation createdAt');
    console.log(`\n📊 Total de usuarios: ${users.length}`);
    
    users.forEach((user, index) => {
      console.log(`\n👤 Usuario ${index + 1}:`);
      console.log(`   - Nombre: ${user.name}`);
      console.log(`   - Email: ${user.email}`);
      console.log(`   - Rol: ${user.role}`);
      console.log(`   - Puntos: ${user.points}`);
      console.log(`   - Nivel logístico: ${user.logisticsLevel}`);
      console.log(`   - Reputación: ${user.reputation}`);
      console.log(`   - Creado: ${user.createdAt}`);
    });
    
    // Verificar usuarios específicos
    const alvaro = await User.findOne({ email: 'alvaroserr@gmail.com' });
    const servidor = await User.findOne({ email: 'usuario.servidor@trastalia.com' });
    
    console.log('\n🎯 Verificación específica:');
    console.log(`Álvaro existe: ${alvaro ? '✅' : '❌'}`);
    console.log(`Usuario Servidor existe: ${servidor ? '✅' : '❌'}`);
    
  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await mongoose.connection.close();
    console.log('\n📡 Conexión cerrada');
  }
}

checkUsers();
