import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
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

// Crear usuarios
const createUsers = async () => {
  try {
    // Usuario Álvaro Serrano
    const alvaroUser = await User.findOneAndUpdate(
      { email: 'alvaroserr@gmail.com' },
      {
        name: 'Álvaro Serrano',
        email: 'alvaroserr@gmail.com',
        password: 'alvaro123',
        role: 'user',
        avatar: '/images/user/user-1.jpg',
        isActive: true,
        points: 1500,
        logisticsLevel: 'comerciante',
        reputation: 850
      },
      { upsert: true, new: true }
    );

    // Usuario Servidor
    const serverUser = await User.findOneAndUpdate(
      { email: 'usuario.servidor@trastalia.com' },
      {
        name: 'Usuario Servidor',
        email: 'usuario.servidor@trastalia.com',
        password: 'servidor123',
        role: 'moderator',
        avatar: '/images/user/user-2.jpg',
        isActive: true,
        points: 5000,
        logisticsLevel: 'capitán',
        reputation: 950
      },
      { upsert: true, new: true }
    );

    console.log('✅ Usuarios creados/actualizados');
    return { alvaroUser, serverUser };
  } catch (error) {
    console.error('❌ Error al crear usuarios:', error);
    throw error;
  }
};

// Crear artículos para Álvaro
const createAlvaroArticles = async (alvaroUserId: string) => {
  try {
    const articles = [
      {
        title: 'iPhone 13 Pro Max 256GB - Azul Sierra',
        description: 'iPhone 13 Pro Max en excelente estado, con caja original y accesorios. Pantalla perfecta, batería al 95%. Incluye cargador original y funda de cuero.',
        price: 850,
        pointsPrice: 8500,
        category: 'electrónica',
        condition: 'excelente',
        images: ['/images/product/iphone-13-pro.jpg'],
        seller: alvaroUserId,
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
        seller: alvaroUserId,
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
        seller: alvaroUserId,
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
      },
      {
        title: 'Bicicleta Eléctrica Trek Powerfly 5',
        description: 'Bicicleta eléctrica de montaña Trek Powerfly 5, motor Bosch Performance Line. Perfecta para rutas de montaña y ciudad. Batería con 500km de autonomía.',
        price: 2200,
        pointsPrice: 22000,
        category: 'bicicletas',
        condition: 'excelente',
        images: ['/images/product/trek-powerfly.jpg'],
        seller: alvaroUserId,
        status: 'disponible',
        isForSale: true,
        isForExchange: true,
        exchangeFor: 'Moto eléctrica o scooter de alta gama',
        location: 'Madrid, España',
        tags: ['bicicleta', 'eléctrica', 'trek', 'montaña', 'bosch'],
        views: 28,
        wantsPoints: true,
        wantsDirectExchange: true,
        useLogisticsCenter: true
      },
      {
        title: 'Cámara Canon EOS R5 + Objetivo 24-70mm f/2.8',
        description: 'Cámara profesional Canon EOS R5 con objetivo RF 24-70mm f/2.8L IS USM. Equipo completo para fotografía profesional. Incluye tarjetas CFexpress y baterías extra.',
        price: 3800,
        pointsPrice: 38000,
        category: 'electrónica',
        condition: 'excelente',
        images: ['/images/product/canon-eos-r5.jpg'],
        seller: alvaroUserId,
        status: 'disponible',
        isForSale: true,
        isForExchange: true,
        exchangeFor: 'Sony A7R V o equipo de video profesional',
        location: 'Madrid, España',
        tags: ['canon', 'cámara', 'profesional', 'eos', 'r5'],
        views: 19,
        wantsPoints: true,
        wantsDirectExchange: true,
        useLogisticsCenter: true
      }
    ];

    const createdArticles = await Article.insertMany(articles);
    console.log(`✅ Creados ${createdArticles.length} artículos para Álvaro`);
    return createdArticles;
  } catch (error) {
    console.error('❌ Error al crear artículos de Álvaro:', error);
    throw error;
  }
};

// Crear artículos para Usuario Servidor
const createServerArticles = async (serverUserId: string) => {
  try {
    const articles = [
      {
        title: 'Samsung Galaxy S22 Ultra 512GB - Negro',
        description: 'Samsung Galaxy S22 Ultra en perfecto estado, con S Pen incluido. Pantalla Dynamic AMOLED 2X de 6.8". Cámara de 108MP con zoom óptico 10x.',
        price: 900,
        pointsPrice: 9000,
        category: 'electrónica',
        condition: 'excelente',
        images: ['/images/product/samsung-s22-ultra.jpg'],
        seller: serverUserId,
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
        seller: serverUserId,
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
        seller: serverUserId,
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
      },
      {
        title: 'Moto Honda CB650R - Rojo',
        description: 'Moto Honda CB650R 2022, 649cc, 4 cilindros. En excelente estado, solo 5000km. Incluye casco integral Shoei y chaqueta de cuero.',
        price: 7500,
        pointsPrice: 75000,
        category: 'motos',
        condition: 'excelente',
        images: ['/images/product/honda-cb650r.jpg'],
        seller: serverUserId,
        status: 'disponible',
        isForSale: true,
        isForExchange: true,
        exchangeFor: 'Bicicleta eléctrica de alta gama o coche deportivo',
        location: 'Barcelona, España',
        tags: ['honda', 'moto', 'cb650r', 'naked', 'deportiva'],
        views: 41,
        wantsPoints: true,
        wantsDirectExchange: true,
        useLogisticsCenter: true
      },
      {
        title: 'Sony A7R V + Objetivo 70-200mm f/2.8',
        description: 'Cámara Sony A7R V con objetivo FE 70-200mm f/2.8 GM OSS II. Equipo profesional para fotografía y video. Incluye tarjetas SD y baterías.',
        price: 4200,
        pointsPrice: 42000,
        category: 'electrónica',
        condition: 'excelente',
        images: ['/images/product/sony-a7r-v.jpg'],
        seller: serverUserId,
        status: 'disponible',
        isForSale: true,
        isForExchange: true,
        exchangeFor: 'Canon EOS R5 o equipo de video profesional',
        location: 'Barcelona, España',
        tags: ['sony', 'a7r', 'cámara', 'profesional', 'alpha'],
        views: 25,
        wantsPoints: true,
        wantsDirectExchange: true,
        useLogisticsCenter: true
      }
    ];

    const createdArticles = await Article.insertMany(articles);
    console.log(`✅ Creados ${createdArticles.length} artículos para Usuario Servidor`);
    return createdArticles;
  } catch (error) {
    console.error('❌ Error al crear artículos del servidor:', error);
    throw error;
  }
};

// Crear intercambios de ejemplo
const createExchanges = async (alvaroUserId: string, serverUserId: string, alvaroArticles: any[], serverArticles: any[]) => {
  try {
    const exchanges = [
      {
        requester: alvaroUserId,
        requestedArticle: serverArticles[0]._id, // Samsung Galaxy S22 Ultra
        offeredArticle: alvaroArticles[0]._id, // iPhone 13 Pro Max
        owner: serverUserId,
        status: 'pendiente',
        message: 'Hola! Me interesa tu Samsung Galaxy S22 Ultra. Te ofrezco mi iPhone 13 Pro Max que está en perfecto estado. ¿Te parece bien el intercambio?',
        location: 'Centro Logístico Trastalia - Madrid'
      },
      {
        requester: serverUserId,
        requestedArticle: alvaroArticles[1]._id, // MacBook Air M1
        offeredArticle: serverArticles[1]._id, // iPad Pro 12.9"
        owner: alvaroUserId,
        status: 'aceptado',
        message: 'Perfecto! Me interesa tu MacBook Air M1. Te ofrezco mi iPad Pro 12.9" con Apple Pencil y Magic Keyboard. ¿Cuándo podemos hacer el intercambio?',
        location: 'Centro Logístico Trastalia - Barcelona',
        exchangeDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // En una semana
      },
      {
        requester: alvaroUserId,
        requestedArticle: serverArticles[2]._id, // PlayStation 5
        offeredArticle: alvaroArticles[2]._id, // Nintendo Switch OLED
        owner: serverUserId,
        status: 'pendiente',
        message: 'Hola! Me gustaría intercambiar mi Nintendo Switch OLED por tu PlayStation 5. Incluye 3 juegos físicos. ¿Te interesa?',
        location: 'Intercambio directo - Madrid'
      }
    ];

    const createdExchanges = await Exchange.insertMany(exchanges);
    console.log(`✅ Creados ${createdExchanges.length} intercambios de ejemplo`);
    return createdExchanges;
  } catch (error) {
    console.error('❌ Error al crear intercambios:', error);
    throw error;
  }
};

// Función principal
const seedData = async () => {
  try {
    await connectDB();
    
    console.log('🚀 Iniciando creación de datos de intercambio...');
    
    // Crear usuarios
    const { alvaroUser, serverUser } = await createUsers();
    
    // Crear artículos
    const alvaroArticles = await createAlvaroArticles(alvaroUser._id);
    const serverArticles = await createServerArticles(serverUser._id);
    
    // Crear intercambios
    await createExchanges(alvaroUser._id, serverUser._id, alvaroArticles, serverArticles);
    
    console.log('🎉 ¡Datos de intercambio creados exitosamente!');
    console.log('\n📊 Resumen:');
    console.log(`👤 Usuario Álvaro: ${alvaroUser.name} (${alvaroUser.email})`);
    console.log(`   - Puntos: ${alvaroUser.points}`);
    console.log(`   - Nivel logístico: ${alvaroUser.logisticsLevel}`);
    console.log(`   - Reputación: ${alvaroUser.reputation}`);
    console.log(`   - Artículos: ${alvaroArticles.length}`);
    
    console.log(`\n👤 Usuario Servidor: ${serverUser.name} (${serverUser.email})`);
    console.log(`   - Puntos: ${serverUser.points}`);
    console.log(`   - Nivel logístico: ${serverUser.logisticsLevel}`);
    console.log(`   - Reputación: ${serverUser.reputation}`);
    console.log(`   - Artículos: ${serverArticles.length}`);
    
    console.log('\n🔄 Intercambios disponibles:');
    console.log('   - iPhone 13 Pro Max ↔ Samsung Galaxy S22 Ultra (Pendiente)');
    console.log('   - MacBook Air M1 ↔ iPad Pro 12.9" (Aceptado)');
    console.log('   - Nintendo Switch OLED ↔ PlayStation 5 (Pendiente)');
    
  } catch (error) {
    console.error('❌ Error general:', error);
  } finally {
    await mongoose.connection.close();
    console.log('📡 Conexión cerrada');
  }
};

// Ejecutar directamente
seedData();

export default seedData;
