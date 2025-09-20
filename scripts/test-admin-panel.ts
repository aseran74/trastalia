import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Article from '../server/models/Article.js';
import User from '../server/models/User.js';

dotenv.config();

async function testAdminPanel() {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb+srv://alvaroserr:alvaro123@cluster0.8xqjq.mongodb.net/trastalia?retryWrites=true&w=majority');
    console.log('✅ Conectado a MongoDB Atlas');
    
    // Verificar que hay artículos pendientes
    const pendingArticles = await Article.find({ adminStatus: 'pending' });
    console.log(`📦 Artículos pendientes: ${pendingArticles.length}`);
    
    // Verificar que hay usuarios admin
    const adminUsers = await User.find({ role: 'admin' });
    console.log(`👑 Usuarios admin: ${adminUsers.length}`);
    
    if (adminUsers.length === 0) {
      console.log('⚠️  No hay usuarios admin. Creando uno...');
      
      const adminUser = new User({
        name: 'Administrador',
        email: 'admin@trastalia.com',
        password: 'admin123456',
        role: 'admin',
        points: 10000,
        logisticsLevel: 'almirante',
        reputation: 1000
      });
      
      await adminUser.save();
      console.log('✅ Usuario admin creado: admin@trastalia.com / admin123456');
    }
    
    // Mostrar estadísticas
    const stats = await Article.aggregate([
      {
        $group: {
          _id: '$adminStatus',
          count: { $sum: 1 }
        }
      }
    ]);
    
    console.log('\n📊 Estadísticas de artículos:');
    stats.forEach(stat => {
      console.log(`   - ${stat._id}: ${stat.count}`);
    });
    
    console.log('\n🎯 Panel de administración listo para usar!');
    console.log('   - URL: http://localhost:3000/admin/articles');
    console.log('   - Login: admin@trastalia.com / admin123456');
    
    await mongoose.disconnect();
    console.log('\n📡 Conexión cerrada');
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

testAdminPanel();

