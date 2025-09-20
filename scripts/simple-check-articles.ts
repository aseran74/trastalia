import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Article from '../server/models/Article.js';

dotenv.config();

async function checkArticles() {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb+srv://alvaroserr:alvaro123@cluster0.8xqjq.mongodb.net/trastalia?retryWrites=true&w=majority');
    console.log('✅ Conectado a MongoDB Atlas');
    
    const articles = await Article.find({});
    console.log('📦 Total de artículos:', articles.length);
    
    if (articles.length === 0) {
      console.log('❌ No hay artículos en la base de datos');
      return;
    }

    console.log('\n🔍 Revisando estructura de artículos existentes...\n');
    
    let needsUpdate = 0;
    let hasNewStructureCount = 0;
    
    articles.forEach((article, index) => {
      console.log(`\n📦 Artículo ${index + 1}: ${article.title}`);
      console.log(`   - ID: ${article._id}`);
      console.log(`   - Precio: ${article.price}€`);
      console.log(`   - Puntos: ${article.pointsPrice || 'N/A'}`);
      console.log(`   - Vendedor ID: ${article.seller}`);
      console.log(`   - Estado: ${article.status}`);
      console.log(`   - Admin Status: ${article.adminStatus || 'N/A'}`);
      
      // Verificar si tiene la nueva estructura
      const hasNewStructure = article.adminStatus !== undefined && 
                             article.adminDecision !== undefined &&
                             article.saleMode !== undefined;
      
      if (hasNewStructure) {
        console.log('   ✅ Tiene nueva estructura');
        hasNewStructureCount++;
      } else {
        console.log('   ❌ Necesita actualización');
        needsUpdate++;
      }
    });
    
    console.log(`\n📊 Resumen:`);
    console.log(`   - Artículos con nueva estructura: ${hasNewStructureCount}`);
    console.log(`   - Artículos que necesitan actualización: ${needsUpdate}`);
    
    await mongoose.disconnect();
    console.log('\n📡 Conexión cerrada');
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

checkArticles();
