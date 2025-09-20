const mongoose = require('mongoose');
require('dotenv').config();

async function populateDatabase() {
  const MONGODB_URI = 'mongodb+srv://mikabodea:Mika1974%26@trastalia.ycg2lvb.mongodb.net/trastalia?retryWrites=true&w=majority&appName=Trastalia';
  
  console.log('🔗 Conectando a MongoDB Atlas...');
  
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Conectado a MongoDB Atlas');
    
    // Definir esquemas
    const UserSchema = new mongoose.Schema({
      name: String,
      email: String,
      password: String,
      role: { type: String, default: 'user' },
      points: { type: Number, default: 0 },
      logisticsLevel: { type: String, default: 'civil' },
      reputation: { type: Number, default: 100 }
    }, { timestamps: true });

    const ArticleSchema = new mongoose.Schema({
      title: String,
      description: String,
      price: Number,
      pointsPrice: Number,
      category: String,
      condition: String,
      images: [String],
      seller: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
      status: { type: String, default: 'disponible' },
      isForSale: { type: Boolean, default: true },
      isForExchange: { type: Boolean, default: false },
      exchangeFor: String,
      location: String,
      tags: [String],
      views: { type: Number, default: 0 },
      saleMode: { type: String, default: 'direct_from_home' },
      directFromHome: {
        enabled: { type: Boolean, default: true },
        price: Number,
        shippingCost: { type: Number, default: 0 }
      },
      logisticsCenterSale: {
        enabled: { type: Boolean, default: false },
        price: Number,
        commission: { type: Number, default: 10 },
        storageCost: { type: Number, default: 0 }
      },
      trastaliaPurchase: {
        enabled: { type: Boolean, default: false },
        adminPrice: Number,
        demandLevel: { type: String, default: 'low' },
        adminApproved: { type: Boolean, default: false }
      },
      pointsExchange: {
        enabled: { type: Boolean, default: false },
        pointsPrice: Number,
        pointsPerEuro: { type: Number, default: 100 }
      },
      useLogisticsCenter: { type: Boolean, default: false },
      adminStatus: { type: String, default: 'pending' },
      adminDecision: {
        money: { type: Boolean, default: false },
        points: { type: Boolean, default: false },
        moneyPrice: { type: Number, default: 0 },
        pointsAmount: { type: Number, default: 0 },
        reject: { type: Boolean, default: false },
        rejectReason: String,
        date: { type: Date, default: Date.now }
      },
      sellerAccepted: { type: Boolean, default: false },
      sellerAcceptedDate: Date,
      sellerRejected: { type: Boolean, default: false },
      sellerRejectedDate: Date
    }, { timestamps: true });

    const LogisticsCenterSchema = new mongoose.Schema({
      name: String,
      address: String,
      city: String,
      region: String,
      postalCode: String,
      country: String,
      coordinates: {
        latitude: Number,
        longitude: Number
      },
      capacity: Number,
      availableCapacity: Number,
      services: [String],
      operatingHours: {
        monday: String,
        tuesday: String,
        wednesday: String,
        thursday: String,
        friday: String,
        saturday: String,
        sunday: String
      },
      contact: {
        phone: String,
        email: String
      },
      status: { type: String, default: 'active' }
    }, { timestamps: true });

    const User = mongoose.model('User', UserSchema);
    const Article = mongoose.model('Article', ArticleSchema);
    const LogisticsCenter = mongoose.model('LogisticsCenter', LogisticsCenterSchema);

    // Limpiar colecciones existentes
    await User.deleteMany({});
    await Article.deleteMany({});
    await LogisticsCenter.deleteMany({});
    console.log('🧹 Colecciones limpiadas');

    // Crear usuarios
    const users = await User.insertMany([
      {
        name: 'Administrador',
        email: 'admin@trastalia.com',
        password: 'admin123456',
        role: 'admin',
        points: 10000,
        logisticsLevel: 'almirante',
        reputation: 1000
      },
      {
        name: 'Juan Pérez',
        email: 'juan@example.com',
        password: 'juan123',
        role: 'user',
        points: 1500,
        logisticsLevel: 'comerciante',
        reputation: 95
      },
      {
        name: 'María García',
        email: 'maria@example.com',
        password: 'maria123',
        role: 'user',
        points: 2300,
        logisticsLevel: 'transportista',
        reputation: 88
      },
      {
        name: 'Carlos López',
        email: 'carlos@example.com',
        password: 'carlos123',
        role: 'user',
        points: 800,
        logisticsLevel: 'civil',
        reputation: 75
      }
    ]);
    console.log(`👥 ${users.length} usuarios creados`);

    // Crear artículos
    const articles = await Article.insertMany([
      {
        title: 'iPhone 13 Pro Max 256GB - Azul Sierra',
        description: 'iPhone 13 Pro Max en excelente estado, sin rayones ni golpes. Incluye cargador original y funda de regalo.',
        price: 850,
        pointsPrice: 8500,
        category: 'electrónica',
        condition: 'excelente',
        images: ['/images/placeholder.jpg'],
        seller: users[1]._id,
        status: 'disponible',
        adminStatus: 'pending',
        location: 'Madrid, España',
        tags: ['iphone', 'apple', 'smartphone'],
        views: 45
      },
      {
        title: 'MacBook Air M1 13" - Gris Espacial',
        description: 'MacBook Air con chip M1, 8GB RAM, 256GB SSD. Perfecto para trabajo y estudios.',
        price: 950,
        pointsPrice: 9500,
        category: 'electrónica',
        condition: 'excelente',
        images: ['/images/placeholder.jpg'],
        seller: users[2]._id,
        status: 'disponible',
        adminStatus: 'pending',
        location: 'Barcelona, España',
        tags: ['macbook', 'apple', 'laptop'],
        views: 67
      },
      {
        title: 'Nintendo Switch OLED - Blanco',
        description: 'Nintendo Switch OLED modelo blanco, incluye 2 mandos Joy-Con y 3 juegos.',
        price: 320,
        pointsPrice: 3200,
        category: 'juegos',
        condition: 'bueno',
        images: ['/images/placeholder.jpg'],
        seller: users[3]._id,
        status: 'disponible',
        adminStatus: 'pending',
        location: 'Valencia, España',
        tags: ['nintendo', 'switch', 'consola'],
        views: 23
      }
    ]);
    console.log(`📦 ${articles.length} artículos creados`);

    // Crear centros logísticos
    const logisticsCenters = await LogisticsCenter.insertMany([
      {
        name: 'Centro Logístico Madrid Norte',
        address: 'Calle de la Logística, 123, 28001 Madrid',
        city: 'Madrid',
        region: 'Comunidad de Madrid',
        postalCode: '28001',
        country: 'España',
        coordinates: {
          latitude: 40.4168,
          longitude: -3.7038
        },
        capacity: 5000,
        availableCapacity: 3500,
        services: ['almacenamiento', 'embalaje', 'envio', 'recogida'],
        operatingHours: {
          monday: '08:00-20:00',
          tuesday: '08:00-20:00',
          wednesday: '08:00-20:00',
          thursday: '08:00-20:00',
          friday: '08:00-20:00',
          saturday: '09:00-18:00',
          sunday: '10:00-16:00'
        },
        contact: {
          phone: '+34 91 123 4567',
          email: 'madrid@trastalia.com'
        },
        status: 'active'
      },
      {
        name: 'Centro Logístico Barcelona Sur',
        address: 'Avinguda de la Logística, 456, 08001 Barcelona',
        city: 'Barcelona',
        region: 'Cataluña',
        postalCode: '08001',
        country: 'España',
        coordinates: {
          latitude: 41.3851,
          longitude: 2.1734
        },
        capacity: 4000,
        availableCapacity: 2800,
        services: ['almacenamiento', 'embalaje', 'envio', 'recogida', 'inspeccion'],
        operatingHours: {
          monday: '08:00-20:00',
          tuesday: '08:00-20:00',
          wednesday: '08:00-20:00',
          thursday: '08:00-20:00',
          friday: '08:00-20:00',
          saturday: '09:00-18:00',
          sunday: '10:00-16:00'
        },
        contact: {
          phone: '+34 93 123 4567',
          email: 'barcelona@trastalia.com'
        },
        status: 'active'
      },
      {
        name: 'Centro Logístico Valencia Este',
        address: 'Carrer de la Logística, 789, 46001 Valencia',
        city: 'Valencia',
        region: 'Comunidad Valenciana',
        postalCode: '46001',
        country: 'España',
        coordinates: {
          latitude: 39.4699,
          longitude: -0.3763
        },
        capacity: 3000,
        availableCapacity: 2100,
        services: ['almacenamiento', 'embalaje', 'envio', 'recogida'],
        operatingHours: {
          monday: '08:00-20:00',
          tuesday: '08:00-20:00',
          wednesday: '08:00-20:00',
          thursday: '08:00-20:00',
          friday: '08:00-20:00',
          saturday: '09:00-18:00',
          sunday: '10:00-16:00'
        },
        contact: {
          phone: '+34 96 123 4567',
          email: 'valencia@trastalia.com'
        },
        status: 'active'
      },
      {
        name: 'Centro Logístico Sevilla Oeste',
        address: 'Calle Logística, 321, 41001 Sevilla',
        city: 'Sevilla',
        region: 'Andalucía',
        postalCode: '41001',
        country: 'España',
        coordinates: {
          latitude: 37.3891,
          longitude: -5.9845
        },
        capacity: 2500,
        availableCapacity: 1750,
        services: ['almacenamiento', 'embalaje', 'envio', 'recogida'],
        operatingHours: {
          monday: '08:00-20:00',
          tuesday: '08:00-20:00',
          wednesday: '08:00-20:00',
          thursday: '08:00-20:00',
          friday: '08:00-20:00',
          saturday: '09:00-18:00',
          sunday: '10:00-16:00'
        },
        contact: {
          phone: '+34 95 123 4567',
          email: 'sevilla@trastalia.com'
        },
        status: 'active'
      }
    ]);
    console.log(`🏢 ${logisticsCenters.length} centros logísticos creados`);

    await mongoose.disconnect();
    console.log('📡 Conexión cerrada');
    console.log('🎉 ¡Base de datos poblada exitosamente!');
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

populateDatabase();
