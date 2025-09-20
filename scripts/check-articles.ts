import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { Article } from '../server/models/Article.js';

dotenv.config();

async function checkArticles() {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb+srv://alvaroserr:alvaro123@cluster0.8xqjq.mongodb.net/trastalia?retryWrites=true&w=majority');
    console.log('✅ Conectado a MongoDB Atlas');
    
    const articles = await Article.find({}).populate('seller', 'name email');
    console.log('📦 Total de artículos:', articles.length);
    
    if (articles.length === 0) {
      console.log('❌ No hay artículos en la base de datos');
    } else {
      articles.forEach((article, index) => {
        console.log(`\n📦 Artículo ${index + 1}:`);
        console.log(`   - Título: ${article.title}`);
        console.log(`   - Precio: ${article.price}€`);
        console.log(`   - Puntos: ${article.pointsPrice || 'N/A'}`);
        console.log(`   - Vendedor: ${article.seller.name} (${article.seller.email})`);
        console.log(`   - Estado: ${article.status}`);
        console.log(`   - Para venta: ${article.isForSale}`);
        console.log(`   - Para intercambio: ${article.isForExchange}`);
      });
    }
    
    await mongoose.disconnect();
    console.log('📡 Conexión cerrada');
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

checkArticles();
