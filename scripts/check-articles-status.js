import mongoose from 'mongoose';

// Conectar a MongoDB
const MONGODB_URI = 'mongodb+srv://mikabodea_db_user:Mika1974%26@cluster0.zehostg.mongodb.net/tailadmin?retryWrites=true&w=majority&appName=Cluster0';

async function checkStatus() {
  try {
    console.log('🔌 Conectando a MongoDB...');
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Conectado a MongoDB Atlas');

    // Definir el esquema de Article
    const articleSchema = new mongoose.Schema({}, { collection: 'articles', strict: false });
    const Article = mongoose.model('Article', articleSchema);

    console.log('📋 Estado actual de los artículos:');
    const articles = await Article.find({}, 'title isForSale isForExchange wantsPoints wantsDirectExchange');
    
    articles.forEach((article, index) => {
      const type = article.isForExchange ? '🔄 INTERCAMBIO' : '💰 SOLO COMPRA';
      console.log(`${index + 1}. ${type} - ${article.title}`);
      console.log(`   isForSale: ${article.isForSale}, isForExchange: ${article.isForExchange}, wantsPoints: ${article.wantsPoints}, wantsDirectExchange: ${article.wantsDirectExchange}`);
    });

  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await mongoose.disconnect();
    console.log('📡 Desconectado de MongoDB');
  }
}

checkStatus();
