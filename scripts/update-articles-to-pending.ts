import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Article from '../server/models/Article.js';

dotenv.config();

async function updateArticlesToPending() {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb+srv://alvaroserr:alvaro123@cluster0.8xqjq.mongodb.net/trastalia?retryWrites=true&w=majority');
    console.log('✅ Conectado a MongoDB Atlas');
    
    // Actualizar todos los artículos que no tienen adminStatus a 'pending'
    const result = await Article.updateMany(
      { adminStatus: { $exists: false } },
      { $set: { adminStatus: 'pending' } }
    );
    
    console.log(`📦 Artículos actualizados a estado pendiente: ${result.modifiedCount}`);
    
    // Verificar el resultado
    const pendingArticles = await Article.find({ adminStatus: 'pending' });
    console.log(`📦 Total de artículos pendientes: ${pendingArticles.length}`);
    
    // Mostrar algunos ejemplos
    console.log('\n📋 Ejemplos de artículos pendientes:');
    pendingArticles.slice(0, 5).forEach((article, index) => {
      console.log(`   ${index + 1}. ${article.title} - ${article.price}€`);
    });
    
    await mongoose.disconnect();
    console.log('\n📡 Conexión cerrada');
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

updateArticlesToPending();

