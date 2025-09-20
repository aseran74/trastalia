import mongoose from 'mongoose';

// Conectar a MongoDB
const MONGODB_URI = 'mongodb+srv://mikabodea_db_user:Mika1974%26@cluster0.zehostg.mongodb.net/tailadmin?retryWrites=true&w=majority&appName=Cluster0';

async function checkTitles() {
  try {
    console.log('🔌 Conectando a MongoDB...');
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Conectado a MongoDB Atlas');

    // Definir el esquema de Article
    const articleSchema = new mongoose.Schema({}, { collection: 'articles', strict: false });
    const Article = mongoose.model('Article', articleSchema);

    console.log('📋 Listando todos los títulos de artículos:');
    const articles = await Article.find({}, 'title');
    
    articles.forEach((article, index) => {
      console.log(`${index + 1}. "${article.title}"`);
    });

  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await mongoose.disconnect();
    console.log('📡 Desconectado de MongoDB');
  }
}

checkTitles();
