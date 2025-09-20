import mongoose from 'mongoose';

const MONGODB_URI = import.meta.env.VITE_MONGODB_URI || 'mongodb://localhost:27017/tailadmin';

export const connectDatabase = async (): Promise<void> => {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Conectado a MongoDB exitosamente');
  } catch (error) {
    console.error('❌ Error al conectar a MongoDB:', error);
    process.exit(1);
  }
};

export const disconnectDatabase = async (): Promise<void> => {
  try {
    await mongoose.disconnect();
    console.log('🔌 Desconectado de MongoDB');
  } catch (error) {
    console.error('❌ Error al desconectar de MongoDB:', error);
  }
};

// Eventos de conexión
mongoose.connection.on('connected', () => {
  console.log('🟢 Mongoose conectado a MongoDB');
});

mongoose.connection.on('error', (err) => {
  console.error('🔴 Error de Mongoose:', err);
});

mongoose.connection.on('disconnected', () => {
  console.log('🟡 Mongoose desconectado de MongoDB');
});

// Cerrar conexión cuando la aplicación se cierre
process.on('SIGINT', async () => {
  await mongoose.connection.close();
  process.exit(0);
});
