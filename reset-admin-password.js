const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

// Conectar a MongoDB Atlas
const MONGODB_URI = 'mongodb+srv://mikabodea:Mika1974&@trastalia.ycg2lvb.mongodb.net/trastalia?retryWrites=true&w=majority&appName=Trastalia';

async function resetAdminPassword() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Conectado a MongoDB Atlas');

    // Definir el esquema de usuario
    const userSchema = new mongoose.Schema({
      name: String,
      email: String,
      password: String,
      role: String,
      points: Number,
      level: String
    });

    const User = mongoose.model('User', userSchema);

    // Buscar el usuario admin
    const admin = await User.findOne({ email: 'admin@trastalia.com' });
    
    if (!admin) {
      console.log('❌ No se encontró el usuario admin@trastalia.com');
      return;
    }

    console.log('🔍 Usuario admin encontrado:', {
      name: admin.name,
      email: admin.email,
      role: admin.role,
      points: admin.points
    });

    // Generar hash de la nueva contraseña
    const newPassword = 'admin123456';
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Actualizar la contraseña
    await User.updateOne(
      { email: 'admin@trastalia.com' },
      { password: hashedPassword }
    );

    console.log('✅ Contraseña del admin actualizada exitosamente');
    console.log('🔑 Nueva contraseña:', newPassword);

    // Verificar que el login funciona
    const testAdmin = await User.findOne({ email: 'admin@trastalia.com' });
    const isPasswordValid = await bcrypt.compare(newPassword, testAdmin.password);
    
    if (isPasswordValid) {
      console.log('✅ Verificación exitosa: La contraseña funciona correctamente');
    } else {
      console.log('❌ Error: La contraseña no funciona');
    }

  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await mongoose.disconnect();
    console.log('🔌 Desconectado de MongoDB');
  }
}

resetAdminPassword();
