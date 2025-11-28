require('dotenv').config();
const mongoose = require('mongoose');

const MONGODB_URI = 'mongodb+srv://mikabodea:Mika1974%26@trastalia.ycg2lvb.mongodb.net/trastalia?retryWrites=true&w=majority&appName=Trastalia';

async function getFirstArticle() {
  try {
    await mongoose.connect(MONGODB_URI);
    const db = mongoose.connection.db;
    
    const article = await db.collection('articles').findOne({});
    
    if (article) {
      console.log('✅ Artículo encontrado:');
      console.log(`   ID: ${article._id}`);
      console.log(`   Nombre: ${article.nombre || article.title || 'N/A'}`);
      console.log(`   Categoría: ${article.categoria || article.category || 'N/A'}`);
      console.log(`\n💡 Para cargar fotos de Pexels:`);
      console.log(`   npm run load-pexels ${article._id} ${article.categoria || 'electronica'} 3`);
    } else {
      console.log('❌ No se encontraron artículos');
    }
    
    await mongoose.disconnect();
  } catch (error) {
    console.error('Error:', error);
    await mongoose.disconnect();
  }
}

getFirstArticle();

