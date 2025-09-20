import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { Article } from '../server/models/Article.js';
import { User } from '../server/models/User.js';

dotenv.config();

async function fixArticles() {
  try {
    console.log('🔌 Conectando a MongoDB Atlas...');
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb+srv://alvaroserr:alvaro123@cluster0.8xqjq.mongodb.net/trastalia?retryWrites=true&w=majority');
    console.log('✅ Conectado a MongoDB Atlas');
    
    // Verificar artículos existentes
    const existingArticles = await Article.find({});
    console.log('📦 Artículos existentes:', existingArticles.length);
    
    if (existingArticles.length === 0) {
      console.log('❌ No hay artículos. Creando artículos de prueba...');
      
      // Buscar usuarios
      const alvaro = await User.findOne({ email: 'alvaroserr@gmail.com' });
      const servidor = await User.findOne({ email: 'usuario.servidor@trastalia.com' });
      
      if (!alvaro) {
        console.log('❌ Usuario alvaroserr@gmail.com no encontrado');
        return;
      }
      
      if (!servidor) {
        console.log('❌ Usuario usuario.servidor@trastalia.com no encontrado');
        return;
      }
      
      console.log('👤 Usuarios encontrados:');
      console.log('   - Álvaro:', alvaro.name, '(Puntos:', alvaro.points, ')');
      console.log('   - Servidor:', servidor.name, '(Puntos:', servidor.points, ')');
      
      // Crear artículos de prueba
      const sampleArticles = [
        {
          title: 'iPhone 13 Pro Max',
          description: 'iPhone 13 Pro Max en excelente estado, con caja y accesorios originales. Perfecto para fotografía profesional.',
          price: 800,
          pointsPrice: 800,
          category: 'Electrónicos',
          condition: 'excelente',
          images: ['iphone-13.svg'],
          seller: alvaro._id,
          status: 'disponible',
          isForSale: true,
          isForExchange: true,
          exchangeFor: 'Samsung Galaxy S23 o similar',
          location: 'Madrid, España',
          tags: ['iphone', 'apple', 'smartphone', 'pro max'],
          views: 0,
          wantsPoints: true,
          wantsDirectExchange: true,
          useLogisticsCenter: false
        },
        {
          title: 'Sillón de Cuero Negro',
          description: 'Sillón de cuero negro de alta calidad, perfecto estado. Ideal para salón o oficina.',
          price: 450,
          pointsPrice: 450,
          category: 'Hogar',
          condition: 'excelente',
          images: ['sillon-cuero.svg'],
          seller: alvaro._id,
          status: 'disponible',
          isForSale: true,
          isForExchange: true,
          exchangeFor: 'Sofá de 3 plazas o mesa de centro',
          location: 'Barcelona, España',
          tags: ['sillon', 'cuero', 'hogar', 'muebles'],
          views: 0,
          wantsPoints: true,
          wantsDirectExchange: true,
          useLogisticsCenter: true
        },
        {
          title: 'Smart TV Samsung 55"',
          description: 'Televisor Samsung 55 pulgadas 4K, con Smart TV integrado. Excelente para gaming y películas.',
          price: 600,
          pointsPrice: 600,
          category: 'Electrónicos',
          condition: 'bueno',
          images: ['smart-tv-samsung.svg'],
          seller: servidor._id,
          status: 'disponible',
          isForSale: true,
          isForExchange: true,
          exchangeFor: 'Proyector o monitor gaming',
          location: 'Valencia, España',
          tags: ['tv', 'samsung', '4k', 'smart'],
          views: 0,
          wantsPoints: true,
          wantsDirectExchange: true,
          useLogisticsCenter: true
        },
        {
          title: 'Libro: Cien años de soledad',
          description: 'Primera edición de Cien años de soledad de Gabriel García Márquez. En perfecto estado.',
          price: 25,
          pointsPrice: 25,
          category: 'Libros',
          condition: 'bueno',
          images: ['libro-garcia-marquez.svg'],
          seller: servidor._id,
          status: 'disponible',
          isForSale: true,
          isForExchange: true,
          exchangeFor: 'Otros libros clásicos',
          location: 'Sevilla, España',
          tags: ['libro', 'garcia marquez', 'literatura', 'clasico'],
          views: 0,
          wantsPoints: true,
          wantsDirectExchange: true,
          useLogisticsCenter: false
        }
      ];
      
      const createdArticles = await Article.insertMany(sampleArticles);
      console.log('✅ Creados', createdArticles.length, 'artículos de prueba');
      
      // Mostrar los artículos creados
      console.log('\n📦 Artículos creados:');
      for (const article of createdArticles) {
        console.log(`   - ${article.title} - ${article.price}€ - ${article.seller.name}`);
      }
    } else {
      console.log('📦 Artículos existentes:');
      existingArticles.forEach((article, index) => {
        console.log(`   ${index + 1}. ${article.title} - ${article.price}€`);
      });
    }
    
    await mongoose.disconnect();
    console.log('📡 Conexión cerrada');
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

fixArticles();

