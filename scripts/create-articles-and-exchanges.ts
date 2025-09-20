import mongoose from 'mongoose';
import User from '../server/models/User';
import Article from '../server/models/Article';
import Exchange from '../server/models/Exchange';

// Conectar a MongoDB Atlas
const connectDB = async () => {
  try {
    const MONGODB_URI = process.env.MONGODB_URI || 'mongodb+srv://trastalia_user:E8wlpttDBlCqY7cn@cluster0.zehostg.mongodb.net/tailadmin?retryWrites=true&w=majority&appName=Cluster0';
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Conectado a MongoDB Atlas');
  } catch (error) {
    console.error('❌ Error al conectar:', error);
    process.exit(1);
  }
};

async function createArticlesAndExchanges() {
  try {
    await connectDB();
    
    console.log('🔍 Buscando usuarios...');
    
    // Buscar usuarios
    const alvaroUser = await User.findOne({ email: 'alvaroserr@gmail.com' });
    const serverUser = await User.findOne({ email: 'usuario.servidor@trastalia.com' });
    
    if (!alvaroUser || !serverUser) {
      console.log('❌ Usuarios no encontrados');
      return;
    }
    
    console.log(`✅ Usuarios encontrados: ${alvaroUser.name} y ${serverUser.name}`);
    
    // Crear artículos para Álvaro
    console.log('\n📦 Creando artículos para Álvaro...');
    const alvaroArticles = await Article.insertMany([
      {
        title: 'iPhone 13 Pro Max 256GB - Azul Sierra',
        description: 'iPhone 13 Pro Max en excelente estado, con caja original y accesorios. Pantalla perfecta, batería al 95%. Incluye cargador original y funda de cuero.',
        price: 850,
        pointsPrice: 8500,
        category: 'electrónica',
        condition: 'excelente',
        images: ['/images/product/iphone-13-pro.jpg'],
        seller: alvaroUser._id,
        status: 'disponible',
        isForSale: true,
        isForExchange: true,
        exchangeFor: 'Samsung Galaxy S22 Ultra o MacBook Air M2',
        location: 'Madrid, España',
        tags: ['iphone', 'apple', 'smartphone', 'pro', 'max'],
        views: 45,
        wantsPoints: true,
        wantsDirectExchange: true,
        useLogisticsCenter: true
      },
      {
        title: 'MacBook Air M1 13" - Gris Espacial',
        description: 'MacBook Air con chip M1, 8GB RAM, 256GB SSD. En perfecto estado, apenas usado. Ideal para trabajo y estudios. Incluye cargador original.',
        price: 950,
        pointsPrice: 9500,
        category: 'electrónica',
        condition: 'excelente',
        images: ['/images/product/macbook-air-m1.jpg'],
        seller: alvaroUser._id,
        status: 'disponible',
        isForSale: true,
        isForExchange: true,
        exchangeFor: 'iPad Pro 12.9" o Surface Laptop Studio',
        location: 'Madrid, España',
        tags: ['macbook', 'apple', 'laptop', 'm1', 'portátil'],
        views: 32,
        wantsPoints: true,
        wantsDirectExchange: true,
        useLogisticsCenter: true
      },
      {
        title: 'Nintendo Switch OLED - Blanco',
        description: 'Nintendo Switch OLED modelo 2021, con 2 mandos Joy-Con. En muy buen estado, incluye 3 juegos físicos: Mario Kart 8, Zelda Breath of the Wild y Animal Crossing.',
        price: 320,
        pointsPrice: 3200,
        category: 'juegos',
        condition: 'bueno',
        images: ['/images/product/nintendo-switch-oled.jpg'],
        seller: alvaroUser._id,
        status: 'disponible',
        isForSale: true,
        isForExchange: true,
        exchangeFor: 'PlayStation 5 o Xbox Series X',
        location: 'Madrid, España',
        tags: ['nintendo', 'switch', 'consola', 'juegos', 'oled'],
        views: 67,
        wantsPoints: true,
        wantsDirectExchange: true,
        useLogisticsCenter: false
      }
    ]);
    
    console.log(`✅ Creados ${alvaroArticles.length} artículos para Álvaro`);
    
    // Crear artículos para Usuario Servidor
    console.log('\n📦 Creando artículos para Usuario Servidor...');
    const serverArticles = await Article.insertMany([
      {
        title: 'Samsung Galaxy S22 Ultra 512GB - Negro',
        description: 'Samsung Galaxy S22 Ultra en perfecto estado, con S Pen incluido. Pantalla Dynamic AMOLED 2X de 6.8". Cámara de 108MP con zoom óptico 10x.',
        price: 900,
        pointsPrice: 9000,
        category: 'electrónica',
        condition: 'excelente',
        images: ['/images/product/samsung-s22-ultra.jpg'],
        seller: serverUser._id,
        status: 'disponible',
        isForSale: true,
        isForExchange: true,
        exchangeFor: 'iPhone 13 Pro Max o MacBook Pro M2',
        location: 'Barcelona, España',
        tags: ['samsung', 'galaxy', 's22', 'ultra', 'android'],
        views: 52,
        wantsPoints: true,
        wantsDirectExchange: true,
        useLogisticsCenter: true
      },
      {
        title: 'iPad Pro 12.9" M2 - Gris Espacial',
        description: 'iPad Pro 12.9" con chip M2, 256GB, Wi-Fi + Cellular. Incluye Apple Pencil 2 y Magic Keyboard. Perfecto para diseño y productividad.',
        price: 1200,
        pointsPrice: 12000,
        category: 'electrónica',
        condition: 'excelente',
        images: ['/images/product/ipad-pro-12-9.jpg'],
        seller: serverUser._id,
        status: 'disponible',
        isForSale: true,
        isForExchange: true,
        exchangeFor: 'MacBook Air M2 o Surface Laptop Studio',
        location: 'Barcelona, España',
        tags: ['ipad', 'pro', 'apple', 'tablet', 'm2'],
        views: 38,
        wantsPoints: true,
        wantsDirectExchange: true,
        useLogisticsCenter: true
      },
      {
        title: 'PlayStation 5 + 3 Juegos',
        description: 'PlayStation 5 con 3 juegos: Spider-Man Miles Morales, Horizon Forbidden West y Gran Turismo 7. Consola en perfecto estado, apenas usada.',
        price: 550,
        pointsPrice: 5500,
        category: 'juegos',
        condition: 'excelente',
        images: ['/images/product/playstation-5.jpg'],
        seller: serverUser._id,
        status: 'disponible',
        isForSale: true,
        isForExchange: true,
        exchangeFor: 'Nintendo Switch OLED o Xbox Series X',
        location: 'Barcelona, España',
        tags: ['playstation', 'ps5', 'consola', 'sony', 'juegos'],
        views: 73,
        wantsPoints: true,
        wantsDirectExchange: true,
        useLogisticsCenter: false
      }
    ]);
    
    console.log(`✅ Creados ${serverArticles.length} artículos para Usuario Servidor`);
    
    // Crear intercambios
    console.log('\n🔄 Creando intercambios...');
    const exchanges = await Exchange.insertMany([
      {
        requester: alvaroUser._id,
        requestedArticle: serverArticles[0]._id, // Samsung Galaxy S22 Ultra
        offeredArticle: alvaroArticles[0]._id, // iPhone 13 Pro Max
        owner: serverUser._id,
        status: 'pendiente',
        message: 'Hola! Me interesa tu Samsung Galaxy S22 Ultra. Te ofrezco mi iPhone 13 Pro Max que está en perfecto estado. ¿Te parece bien el intercambio?',
        location: 'Centro Logístico Trastalia - Madrid'
      },
      {
        requester: serverUser._id,
        requestedArticle: alvaroArticles[1]._id, // MacBook Air M1
        offeredArticle: serverArticles[1]._id, // iPad Pro 12.9"
        owner: alvaroUser._id,
        status: 'aceptado',
        message: 'Perfecto! Me interesa tu MacBook Air M1. Te ofrezco mi iPad Pro 12.9" con Apple Pencil y Magic Keyboard. ¿Cuándo podemos hacer el intercambio?',
        location: 'Centro Logístico Trastalia - Barcelona',
        exchangeDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // En una semana
      },
      {
        requester: alvaroUser._id,
        requestedArticle: serverArticles[2]._id, // PlayStation 5
        offeredArticle: alvaroArticles[2]._id, // Nintendo Switch OLED
        owner: serverUser._id,
        status: 'pendiente',
        message: 'Hola! Me gustaría intercambiar mi Nintendo Switch OLED por tu PlayStation 5. Incluye 3 juegos físicos. ¿Te interesa?',
        location: 'Intercambio directo - Madrid'
      }
    ]);
    
    console.log(`✅ Creados ${exchanges.length} intercambios`);
    
    console.log('\n🎉 ¡Datos creados exitosamente!');
    console.log('\n📊 Resumen:');
    console.log(`👤 Álvaro Serrano (alvaroserr@gmail.com)`);
    console.log(`   - Puntos: ${alvaroUser.points}`);
    console.log(`   - Nivel logístico: ${alvaroUser.logisticsLevel}`);
    console.log(`   - Reputación: ${alvaroUser.reputation}`);
    console.log(`   - Artículos: ${alvaroArticles.length}`);
    
    console.log(`\n👤 Usuario Servidor (usuario.servidor@trastalia.com)`);
    console.log(`   - Puntos: ${serverUser.points}`);
    console.log(`   - Nivel logístico: ${serverUser.logisticsLevel}`);
    console.log(`   - Reputación: ${serverUser.reputation}`);
    console.log(`   - Artículos: ${serverArticles.length}`);
    
    console.log('\n🔄 Intercambios disponibles:');
    console.log('   - iPhone 13 Pro Max ↔ Samsung Galaxy S22 Ultra (Pendiente)');
    console.log('   - MacBook Air M1 ↔ iPad Pro 12.9" (Aceptado)');
    console.log('   - Nintendo Switch OLED ↔ PlayStation 5 (Pendiente)');
    
  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await mongoose.connection.close();
    console.log('\n📡 Conexión cerrada');
  }
}

createArticlesAndExchanges();
