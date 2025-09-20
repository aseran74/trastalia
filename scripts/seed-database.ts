import mongoose from 'mongoose';
import User from '../src/models/User';
import Metric from '../src/models/Metric';

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/tailadmin';

async function seedDatabase() {
  try {
    // Conectar a MongoDB
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Conectado a MongoDB');

    // Limpiar datos existentes
    await User.deleteMany({});
    await Metric.deleteMany({});
    console.log('🧹 Datos existentes eliminados');

    // Crear usuarios de ejemplo
    const users = await User.insertMany([
      {
        name: 'Juan Pérez',
        email: 'juan@example.com',
        role: 'admin',
        isActive: true,
        lastLogin: new Date()
      },
      {
        name: 'María García',
        email: 'maria@example.com',
        role: 'user',
        isActive: true,
        lastLogin: new Date(Date.now() - 86400000) // Hace 1 día
      },
      {
        name: 'Carlos López',
        email: 'carlos@example.com',
        role: 'moderator',
        isActive: true,
        lastLogin: new Date(Date.now() - 172800000) // Hace 2 días
      },
      {
        name: 'Ana Martínez',
        email: 'ana@example.com',
        role: 'user',
        isActive: false,
        lastLogin: new Date(Date.now() - 604800000) // Hace 1 semana
      }
    ]);
    console.log(`👥 ${users.length} usuarios creados`);

    // Crear métricas de ejemplo
    const today = new Date();
    const metrics = [];
    
    // Métricas de ventas
    for (let i = 0; i < 30; i++) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      
      metrics.push({
        name: 'Ventas Diarias',
        value: Math.floor(Math.random() * 10000) + 5000,
        previousValue: Math.floor(Math.random() * 10000) + 5000,
        change: Math.floor(Math.random() * 20) - 10,
        trend: Math.random() > 0.5 ? 'up' : 'down',
        category: 'sales',
        period: 'daily',
        date: date
      });
    }

    // Métricas de usuarios
    for (let i = 0; i < 12; i++) {
      const date = new Date(today);
      date.setMonth(date.getMonth() - i);
      
      metrics.push({
        name: 'Usuarios Activos',
        value: Math.floor(Math.random() * 1000) + 500,
        previousValue: Math.floor(Math.random() * 1000) + 500,
        change: Math.floor(Math.random() * 15) - 5,
        trend: Math.random() > 0.4 ? 'up' : 'down',
        category: 'users',
        period: 'monthly',
        date: date
      });
    }

    // Métricas de ingresos
    for (let i = 0; i < 7; i++) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      
      metrics.push({
        name: 'Ingresos Semanales',
        value: Math.floor(Math.random() * 50000) + 20000,
        previousValue: Math.floor(Math.random() * 50000) + 20000,
        change: Math.floor(Math.random() * 25) - 10,
        trend: Math.random() > 0.3 ? 'up' : 'down',
        category: 'revenue',
        period: 'weekly',
        date: date
      });
    }

    await Metric.insertMany(metrics);
    console.log(`📊 ${metrics.length} métricas creadas`);

    console.log('🎉 Base de datos poblada exitosamente');
    
  } catch (error) {
    console.error('❌ Error al poblar la base de datos:', error);
  } finally {
    await mongoose.disconnect();
    console.log('🔌 Desconectado de MongoDB');
  }
}

// Ejecutar el script
seedDatabase();
