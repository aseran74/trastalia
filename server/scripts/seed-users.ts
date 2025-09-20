import dotenv from 'dotenv';
import { connectDatabase } from '../config/database';
import User from '../models/User';

// Cargar variables de entorno desde .env.server
dotenv.config({ path: '../../.env.server' });

const seedUsers = async () => {
  try {
    // Conectar a la base de datos
    await connectDatabase();

    // Limpiar usuarios existentes (opcional)
    await User.deleteMany({});

    // Crear usuarios de prueba
    const users = [
      {
        name: 'Administrador',
        email: 'admin@tailadmin.com',
        password: 'admin123',
        role: 'admin' as const
      },
      {
        name: 'Usuario Demo',
        email: 'user@tailadmin.com',
        password: 'user123',
        role: 'user' as const
      },
      {
        name: 'Moderador',
        email: 'moderator@tailadmin.com',
        password: 'mod123',
        role: 'moderator' as const
      },
      {
        name: 'Juan Pérez',
        email: 'juan.perez@example.com',
        password: 'password123',
        role: 'user' as const
      },
      {
        name: 'María García',
        email: 'maria.garcia@example.com',
        password: 'password123',
        role: 'user' as const
      }
    ];

    // Crear usuarios
    for (const userData of users) {
      const user = new User(userData);
      await user.save();
      console.log(`✅ Usuario creado: ${user.email}`);
    }

    console.log(`\n🎉 Se crearon ${users.length} usuarios de prueba`);
    console.log('\n📋 Credenciales de prueba:');
    console.log('👑 Admin: admin@tailadmin.com / admin123');
    console.log('👤 Usuario: user@tailadmin.com / user123');
    console.log('🛡️ Moderador: moderator@tailadmin.com / mod123');
    console.log('👥 Usuarios adicionales: juan.perez@example.com, maria.garcia@example.com / password123');

    process.exit(0);

  } catch (error) {
    console.error('❌ Error al poblar usuarios:', error);
    process.exit(1);
  }
};

seedUsers();
