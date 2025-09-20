import mongoose from 'mongoose';
import User from '../server/models/User';
import bcrypt from 'bcryptjs';

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

async function testLoginDirect() {
  try {
    await connectDB();
    
    console.log('🔍 Probando login directo...');
    
    // Buscar usuario Álvaro
    const alvaro = await User.findOne({ email: 'alvaroserr@gmail.com' }).select('+password');
    if (alvaro) {
      console.log(`\n👤 Usuario encontrado: ${alvaro.name}`);
      console.log(`📧 Email: ${alvaro.email}`);
      console.log(`🔐 Contraseña hasheada: ${alvaro.password.substring(0, 30)}...`);
      
      // Probar contraseña directamente con bcrypt
      const isValid = await bcrypt.compare('alvaro123', alvaro.password);
      console.log(`🔑 Contraseña 'alvaro123' válida (bcrypt directo): ${isValid ? '✅' : '❌'}`);
      
      // Probar con el método del modelo
      const isValidMethod = await alvaro.comparePassword('alvaro123');
      console.log(`🔑 Contraseña 'alvaro123' válida (método modelo): ${isValidMethod ? '✅' : '❌'}`);
    }
    
    // Buscar usuario servidor
    const servidor = await User.findOne({ email: 'usuario.servidor@trastalia.com' }).select('+password');
    if (servidor) {
      console.log(`\n👤 Usuario encontrado: ${servidor.name}`);
      console.log(`📧 Email: ${servidor.email}`);
      console.log(`🔐 Contraseña hasheada: ${servidor.password.substring(0, 30)}...`);
      
      // Probar contraseña directamente con bcrypt
      const isValid = await bcrypt.compare('servidor123', servidor.password);
      console.log(`🔑 Contraseña 'servidor123' válida (bcrypt directo): ${isValid ? '✅' : '❌'}`);
      
      // Probar con el método del modelo
      const isValidMethod = await servidor.comparePassword('servidor123');
      console.log(`🔑 Contraseña 'servidor123' válida (método modelo): ${isValidMethod ? '✅' : '❌'}`);
    }
    
  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await mongoose.connection.close();
    console.log('\n📡 Conexión cerrada');
  }
}

testLoginDirect();
