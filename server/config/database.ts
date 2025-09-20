import mongoose from 'mongoose';

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb+srv://mikabodea_db_user:Mika1974%26@cluster0.zehostg.mongodb.net/tailadmin?retryWrites=true&w=majority&appName=Cluster0';

export const connectDatabase = async (): Promise<void> => {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Conectado a MongoDB Atlas exitosamente');
  } catch (error) {
    console.error('❌ Error al conectar con MongoDB Atlas:', error);
    console.log('🔄 Continuando con modo simulado...');
    // No lanzar error, continuar en modo simulado
  }
};

// Manejar eventos de conexión
mongoose.connection.on('connected', () => {
  console.log('📡 Mongoose conectado a MongoDB Atlas');
});

mongoose.connection.on('error', (err) => {
  console.error('❌ Error de conexión Mongoose:', err);
});

mongoose.connection.on('disconnected', () => {
  console.log('📡 Mongoose desconectado de MongoDB Atlas');
});

// Cerrar conexión al terminar la aplicación
process.on('SIGINT', async () => {
  await mongoose.connection.close();
  console.log('📡 Conexión a MongoDB Atlas cerrada');
  process.exit(0);
});
