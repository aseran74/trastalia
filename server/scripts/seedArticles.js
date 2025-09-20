import mongoose from 'mongoose';
import Article from '../models/Article.js';
import User from '../models/User.js';

// Conectar a MongoDB Atlas
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb+srv://trastalia_user:E8wlpttDBlCqY7cn@cluster0.zehostg.mongodb.net/tailadmin?retryWrites=true&w=majority&appName=Cluster0';

const connectDB = async () => {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Conectado a MongoDB Atlas');
  } catch (error) {
    console.error('❌ Error al conectar:', error);
    process.exit(1);
  }
};

const seedArticles = async () => {
  try {
    // Buscar un usuario existente o crear uno
    let user = await User.findOne();
    if (!user) {
      console.log('📝 Creando usuario de prueba...');
      user = new User({
        name: 'Usuario Demo',
        email: 'demo@trastalia.com',
        password: '12345678',
        role: 'user',
        points: 1000,
        logisticsLevel: 'comerciante',
        reputation: 100
      });
      await user.save();
      console.log('✅ Usuario creado:', user.email);
    }

    // Limpiar artículos existentes
    await Article.deleteMany({});
    console.log('🧹 Artículos existentes eliminados');

    // Crear artículos de ejemplo
    const articles = [
      {
        title: 'iPhone 13 Pro Max 256GB',
        description: 'iPhone 13 Pro Max en excelente estado, con funda y cargador original. Sin rayones ni daños. Incluye caja original y todos los accesorios.',
        price: 899,
        pointsPrice: 4500,
        category: 'electrónica',
        condition: 'excelente',
        location: 'Madrid, España',
        tags: ['apple', 'iphone', 'smartphone', '256gb'],
        seller: user._id,
        wantsPoints: true,
        wantsDirectExchange: true,
        useLogisticsCenter: false,
        images: ['/images/placeholder.jpg'],
        status: 'disponible',
        views: 45
      },
      {
        title: 'Bicicleta de Montaña Trek X-Caliber 8',
        description: 'Bicicleta de montaña Trek modelo 2022, perfecta para senderos y montaña. Revisada recientemente por mecánico especializado. Incluye casco y luces.',
        price: 450,
        pointsPrice: 2200,
        category: 'deportes',
        condition: 'bueno',
        location: 'Barcelona, España',
        tags: ['bicicleta', 'montaña', 'trek', 'deportes'],
        seller: user._id,
        wantsPoints: true,
        wantsDirectExchange: false,
        useLogisticsCenter: true,
        images: ['/images/placeholder.jpg'],
        status: 'disponible',
        views: 23
      },
      {
        title: 'Sofá 3 plazas gris moderno',
        description: 'Sofá de 3 plazas en color gris, tapizado en tela resistente. Perfecto estado, solo se vende por mudanza. Incluye cojines decorativos.',
        price: 300,
        pointsPrice: null,
        category: 'hogar',
        condition: 'bueno',
        location: 'Valencia, España',
        tags: ['sofá', 'hogar', 'gris', '3 plazas'],
        seller: user._id,
        wantsPoints: false,
        wantsDirectExchange: true,
        useLogisticsCenter: true,
        images: ['/images/placeholder.jpg'],
        status: 'disponible',
        views: 67
      },
      {
        title: 'MacBook Air M1 8GB RAM 256GB SSD',
        description: 'MacBook Air con chip M1, 8GB de RAM y 256GB de almacenamiento. En perfecto estado, con menos de 6 meses de uso. Incluye cargador original.',
        price: 750,
        pointsPrice: 3750,
        category: 'electrónica',
        condition: 'excelente',
        location: 'Sevilla, España',
        tags: ['macbook', 'apple', 'm1', 'laptop'],
        seller: user._id,
        wantsPoints: true,
        wantsDirectExchange: false,
        useLogisticsCenter: false,
        images: ['/images/placeholder.jpg'],
        status: 'disponible',
        views: 89
      },
      {
        title: 'Guitarra Acústica Yamaha F310',
        description: 'Guitarra acústica Yamaha F310, perfecta para principiantes y estudiantes. Incluye funda rígida y cuerdas nuevas. Excelente sonido.',
        price: 120,
        pointsPrice: 600,
        category: 'música',
        condition: 'bueno',
        location: 'Bilbao, España',
        tags: ['guitarra', 'acústica', 'yamaha', 'música'],
        seller: user._id,
        wantsPoints: true,
        wantsDirectExchange: true,
        useLogisticsCenter: false,
        images: ['/images/placeholder.jpg'],
        status: 'disponible',
        views: 34
      },
      {
        title: 'Libro "Cien Años de Soledad" - Edición Especial',
        description: 'Edición de lujo de la obra maestra de Gabriel García Márquez. Nuevo, sin abrir, con tapa dura y sobrecubierta. Colección completa.',
        price: 25,
        pointsPrice: 150,
        category: 'libros',
        condition: 'nuevo',
        location: 'Bogotá, Colombia',
        tags: ['libro', 'garcía márquez', 'literatura', 'colección'],
        seller: user._id,
        wantsPoints: true,
        wantsDirectExchange: true,
        useLogisticsCenter: false,
        images: ['/images/placeholder.jpg'],
        status: 'disponible',
        views: 56
      },
      {
        title: 'Smart TV Samsung 55" 4K UHD',
        description: 'Televisor inteligente Samsung de 55 pulgadas, 4K UHD. Poco uso, en perfecto estado. Incluye mando a distancia y manuales.',
        price: 600,
        pointsPrice: 3000,
        category: 'electrónica',
        condition: 'excelente',
        location: 'Valencia, España',
        tags: ['tv', 'samsung', '4k', '55 pulgadas'],
        seller: user._id,
        wantsPoints: false,
        wantsDirectExchange: true,
        useLogisticsCenter: true,
        images: ['/images/placeholder.jpg'],
        status: 'disponible',
        views: 78
      },
      {
        title: 'Sillón Reclinable de Cuero Negro',
        description: 'Sillón reclinable de cuero genuino negro, muy cómodo y en buen estado. Ideal para sala de estar o oficina en casa.',
        price: 180,
        pointsPrice: null,
        category: 'hogar',
        condition: 'usado',
        location: 'Sevilla, España',
        tags: ['sillón', 'cuero', 'reclinable', 'negro'],
        seller: user._id,
        wantsPoints: false,
        wantsDirectExchange: false,
        useLogisticsCenter: false,
        images: ['/images/placeholder.jpg'],
        status: 'disponible',
        views: 30
      }
    ];

    // Insertar artículos
    const createdArticles = await Article.insertMany(articles);
    console.log(`✅ ${createdArticles.length} artículos creados exitosamente`);

    // Mostrar resumen
    console.log('\n📊 Resumen de artículos creados:');
    createdArticles.forEach((article, index) => {
      console.log(`${index + 1}. ${article.title} - ${article.price}€`);
    });

    console.log('\n🎉 Base de datos poblada exitosamente!');
    process.exit(0);

  } catch (error) {
    console.error('❌ Error al poblar la base de datos:', error);
    process.exit(1);
  }
};

// Ejecutar el script
const run = async () => {
  await connectDB();
  await seedArticles();
};

run();
