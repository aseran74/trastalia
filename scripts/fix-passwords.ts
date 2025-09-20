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

async function fixPasswords() {
  try {
    await connectDB();
    
    console.log('🔧 Corrigiendo contraseñas...');
    
    // Buscar usuario Álvaro
    const alvaro = await User.findOne({ email: 'alvaroserr@gmail.com' });
    if (alvaro) {
      console.log(`\n👤 Corrigiendo contraseña para: ${alvaro.name}`);
      
      // Hashear contraseña manualmente
      const salt = await bcrypt.genSalt(12);
      alvaro.password = await bcrypt.hash('alvaro123', salt);
      await alvaro.save();
      
      console.log('✅ Contraseña de Álvaro corregida');
      
      // Verificar
      const isValid = await alvaro.comparePassword('alvaro123');
      console.log(`🔑 Verificación: ${isValid ? '✅' : '❌'}`);
    }
    
    // Buscar usuario servidor
    const servidor = await User.findOne({ email: 'usuario.servidor@trastalia.com' });
    if (servidor) {
      console.log(`\n👤 Corrigiendo contraseña para: ${servidor.name}`);
      
      // Hashear contraseña manualmente
      const salt = await bcrypt.genSalt(12);
      servidor.password = await bcrypt.hash('servidor123', salt);
      await servidor.save();
      
      console.log('✅ Contraseña del Usuario Servidor corregida');
      
      // Verificar
      const isValid = await servidor.comparePassword('servidor123');
      console.log(`🔑 Verificación: ${isValid ? '✅' : '❌'}`);
    }
    
    console.log('\n🎉 ¡Contraseñas corregidas exitosamente!');
    
  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await mongoose.connection.close();
    console.log('\n📡 Conexión cerrada');
  }
}

fixPasswords();
