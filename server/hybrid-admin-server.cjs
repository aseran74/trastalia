const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');

const app = express();
const PORT = 3002;

// Middleware
app.use(cors({
  origin: ['http://localhost:5173', 'http://localhost:5174'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Variables globales
let isMongoConnected = false;
let User, Article, LogisticsCenter;

// Conectar a MongoDB
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb+srv://mikabodea:Mika1974%26@trastalia.ycg2lvb.mongodb.net/trastalia?retryWrites=true&w=majority&appName=Trastalia';

mongoose.connect(MONGODB_URI)
  .then(() => {
    console.log('✅ Conectado a MongoDB Atlas');
    isMongoConnected = true;
    
    // Definir esquemas solo si MongoDB está conectado
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

    User = mongoose.model('User', UserSchema);
    Article = mongoose.model('Article', ArticleSchema);
    LogisticsCenter = mongoose.model('LogisticsCenter', LogisticsCenterSchema);
  })
  .catch((error) => {
    console.error('❌ Error conectando a MongoDB:', error);
    console.log('🔄 Continuando con datos simulados...');
    isMongoConnected = false;
  });

// Datos simulados como fallback
const mockUser = {
  _id: 'admin-user-id',
  name: 'Administrador',
  email: 'admin@trastalia.com',
  password: 'admin123456',
  role: 'admin',
  points: 10000,
  logisticsLevel: 'almirante',
  reputation: 1000
};

const mockArticles = [
  {
    _id: '68ca7e441765addd057b6c2e',
    title: 'iPhone 13 Pro Max 256GB - Azul Sierra',
    description: 'iPhone 13 Pro Max en excelente estado, sin rayones ni golpes. Incluye cargador original y funda de regalo.',
    price: 850,
    pointsPrice: 8500,
    category: 'electrónica',
    condition: 'excelente',
    images: ['/images/placeholder.jpg'],
    seller: {
      _id: '68ca7e0344ba4f80c6c0c3c6',
      name: 'Juan Pérez',
      email: 'juan@example.com',
      points: 1500,
      logisticsLevel: 'comerciante',
      reputation: 95
    },
    status: 'disponible',
    adminStatus: 'pending',
    location: 'Madrid, España',
    tags: ['iphone', 'apple', 'smartphone'],
    views: 45,
    createdAt: new Date('2024-01-15'),
    updatedAt: new Date('2024-01-15')
  },
  {
    _id: '68ca7e441765addd057b6c2f',
    title: 'MacBook Air M1 13" - Gris Espacial',
    description: 'MacBook Air con chip M1, 8GB RAM, 256GB SSD. Perfecto para trabajo y estudios.',
    price: 950,
    pointsPrice: 9500,
    category: 'electrónica',
    condition: 'excelente',
    images: ['/images/placeholder.jpg'],
    seller: {
      _id: '68ca7e0344ba4f80c6c0c3c6',
      name: 'María García',
      email: 'maria@example.com',
      points: 2300,
      logisticsLevel: 'transportista',
      reputation: 88
    },
    status: 'disponible',
    adminStatus: 'pending',
    location: 'Barcelona, España',
    tags: ['macbook', 'apple', 'laptop'],
    views: 67,
    createdAt: new Date('2024-01-16'),
    updatedAt: new Date('2024-01-16')
  },
  {
    _id: '68ca7e441765addd057b6c30',
    title: 'Nintendo Switch OLED - Blanco',
    description: 'Nintendo Switch OLED modelo blanco, incluye 2 mandos Joy-Con y 3 juegos.',
    price: 320,
    pointsPrice: 3200,
    category: 'juegos',
    condition: 'bueno',
    images: ['/images/placeholder.jpg'],
    seller: {
      _id: '68ca7e0444ba4f80c6c0c3d7',
      name: 'Carlos López',
      email: 'carlos@example.com',
      points: 800,
      logisticsLevel: 'civil',
      reputation: 75
    },
    status: 'disponible',
    adminStatus: 'pending',
    location: 'Valencia, España',
    tags: ['nintendo', 'switch', 'consola'],
    views: 23,
    createdAt: new Date('2024-01-17'),
    updatedAt: new Date('2024-01-17')
  }
];

// Datos simulados para centros logísticos
const mockLogisticsCenters = [
  {
    _id: '68ca7e441765addd057b6c31',
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
    status: 'active',
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01')
  },
  {
    _id: '68ca7e441765addd057b6c32',
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
    status: 'active',
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01')
  },
  {
    _id: '68ca7e441765addd057b6c33',
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
    status: 'active',
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01')
  },
  {
    _id: '68ca7e441765addd057b6c34',
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
    status: 'active',
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01')
  }
];

// Middleware de autenticación simple
const authMiddleware = (req, res, next) => {
  const authHeader = req.headers.authorization;
  
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({
      success: false,
      message: 'Token de acceso requerido'
    });
  }

  // Para tokens de MongoDB, extraer el ID del token
  if (authHeader.includes('mongodb-admin-token-')) {
    // Buscar el usuario admin en la base de datos
    if (isMongoConnected) {
      User.findOne({ email: 'admin@trastalia.com' })
        .then(user => {
          if (user) {
            req.userId = user._id.toString();
            req.userRole = user.role;
            next();
          } else {
            res.status(401).json({
              success: false,
              message: 'Usuario no encontrado'
            });
          }
        })
        .catch(error => {
          console.error('Error en middleware de auth:', error);
          res.status(500).json({
            success: false,
            message: 'Error de autenticación'
          });
        });
    } else {
      req.userId = 'admin-user-id';
      req.userRole = 'admin';
      next();
    }
  } else {
    req.userId = 'admin-user-id';
    req.userRole = 'admin';
    next();
  }
};

// Rutas de autenticación
app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    
    if (isMongoConnected) {
      // Usar MongoDB
      const user = await User.findOne({ email: email });
      
      if (user && user.password === password) {
        const token = 'mongodb-admin-token-' + Date.now();
        
        res.json({
          success: true,
          message: 'Login exitoso (MongoDB)',
          data: {
            token: token,
            user: {
              id: user._id,
              name: user.name,
              email: user.email,
              role: user.role,
              points: user.points,
              logisticsLevel: user.logisticsLevel,
              reputation: user.reputation
            }
          }
        });
      } else {
        res.status(401).json({
          success: false,
          message: 'Credenciales inválidas'
        });
      }
    } else {
      // Usar datos simulados
      if (email === mockUser.email && password === mockUser.password) {
        const token = 'mock-admin-token-' + Date.now();
        
        res.json({
          success: true,
          message: 'Login exitoso (Datos simulados)',
          data: {
            token: token,
            user: {
              id: mockUser._id,
              name: mockUser.name,
              email: mockUser.email,
              role: mockUser.role,
              points: mockUser.points,
              logisticsLevel: mockUser.logisticsLevel,
              reputation: mockUser.reputation
            }
          }
        });
      } else {
        res.status(401).json({
          success: false,
          message: 'Credenciales inválidas'
        });
      }
    }
  } catch (error) {
    console.error('Error en login:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor'
    });
  }
});

app.get('/api/auth/me', authMiddleware, async (req, res) => {
  try {
    if (isMongoConnected) {
      const user = await User.findOne({ role: 'admin' });
      
      if (user) {
        res.json({
          success: true,
          data: {
            id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
            points: user.points,
            logisticsLevel: user.logisticsLevel,
            reputation: user.reputation
          }
        });
      } else {
        res.status(404).json({
          success: false,
          message: 'Usuario no encontrado'
        });
      }
    } else {
      // Usar datos simulados
      res.json({
        success: true,
        data: {
          id: mockUser._id,
          name: mockUser.name,
          email: mockUser.email,
          role: mockUser.role,
          points: mockUser.points,
          logisticsLevel: mockUser.logisticsLevel,
          reputation: mockUser.reputation
        }
      });
    }
  } catch (error) {
    console.error('Error obteniendo usuario:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor'
    });
  }
});

// Rutas de administración
app.get('/api/articles/admin/pending', authMiddleware, async (req, res) => {
  try {
    if (isMongoConnected) {
      const articles = await Article.find({ adminStatus: 'pending' })
        .populate('seller', 'name email points logisticsLevel reputation')
        .sort({ createdAt: -1 });

      res.json({
        success: true,
        data: articles
      });
    } else {
      // Usar datos simulados - solo artículos pendientes
      const pendingArticles = mockArticles.filter(article => article.adminStatus === 'pending');
      res.json({
        success: true,
        data: pendingArticles
      });
    }
  } catch (error) {
    console.error('Error obteniendo artículos pendientes:', error);
    res.status(500).json({
      success: false,
      message: 'Error al obtener artículos pendientes'
    });
  }
});

app.put('/api/articles/admin/:id/approve', authMiddleware, async (req, res) => {
  try {
    const { money, points, moneyPrice, pointsAmount } = req.body;
    const articleId = req.params.id;

    if (isMongoConnected) {
      const article = await Article.findById(articleId);
      if (!article) {
        return res.status(404).json({
          success: false,
          message: 'Artículo no encontrado'
        });
      }

      const adminDecision = {
        money: money || false,
        points: points || false,
        moneyPrice: moneyPrice || 0,
        pointsAmount: pointsAmount || 0,
        reject: false,
        date: new Date()
      };

      let newAdminStatus = 'pending';
      if (money && points) {
        newAdminStatus = 'approved_both';
      } else if (money) {
        newAdminStatus = 'approved_money';
      } else if (points) {
        newAdminStatus = 'approved_points';
      }

      const updatedArticle = await Article.findByIdAndUpdate(
        articleId,
        {
          adminStatus: newAdminStatus,
          adminDecision: adminDecision
        },
        { new: true }
      ).populate('seller', 'name email points logisticsLevel reputation');

      res.json({
        success: true,
        message: 'Artículo aprobado exitosamente',
        data: updatedArticle
      });
    } else {
      // Usar datos simulados
      const article = mockArticles.find(a => a._id === articleId);
      if (!article) {
        return res.status(404).json({
          success: false,
          message: 'Artículo no encontrado'
        });
      }

      const adminDecision = {
        money: money || false,
        points: points || false,
        moneyPrice: moneyPrice || 0,
        pointsAmount: pointsAmount || 0,
        reject: false,
        date: new Date()
      };

      let newAdminStatus = 'pending';
      if (money && points) {
        newAdminStatus = 'approved_both';
      } else if (money) {
        newAdminStatus = 'approved_money';
      } else if (points) {
        newAdminStatus = 'approved_points';
      }

      article.adminStatus = newAdminStatus;
      article.adminDecision = adminDecision;

      res.json({
        success: true,
        message: 'Artículo aprobado exitosamente',
        data: article
      });
    }
  } catch (error) {
    console.error('Error aprobando artículo:', error);
    res.status(500).json({
      success: false,
      message: 'Error al aprobar el artículo'
    });
  }
});

app.put('/api/articles/admin/:id/reject', authMiddleware, async (req, res) => {
  try {
    const { rejectReason } = req.body;
    const articleId = req.params.id;

    if (isMongoConnected) {
      const article = await Article.findById(articleId);
      if (!article) {
        return res.status(404).json({
          success: false,
          message: 'Artículo no encontrado'
        });
      }

      const adminDecision = {
        money: false,
        points: false,
        moneyPrice: 0,
        pointsAmount: 0,
        reject: true,
        rejectReason: rejectReason || 'Artículo rechazado por el administrador',
        date: new Date()
      };

      const updatedArticle = await Article.findByIdAndUpdate(
        articleId,
        {
          adminStatus: 'rejected',
          adminDecision: adminDecision
        },
        { new: true }
      ).populate('seller', 'name email points logisticsLevel reputation');

      res.json({
        success: true,
        message: 'Artículo rechazado exitosamente',
        data: updatedArticle
      });
    } else {
      // Usar datos simulados
      const article = mockArticles.find(a => a._id === articleId);
      if (!article) {
        return res.status(404).json({
          success: false,
          message: 'Artículo no encontrado'
        });
      }

      const adminDecision = {
        money: false,
        points: false,
        moneyPrice: 0,
        pointsAmount: 0,
        reject: true,
        rejectReason: rejectReason || 'Artículo rechazado por el administrador',
        date: new Date()
      };

      article.adminStatus = 'rejected';
      article.adminDecision = adminDecision;

      res.json({
        success: true,
        message: 'Artículo rechazado exitosamente',
        data: article
      });
    }
  } catch (error) {
    console.error('Error rechazando artículo:', error);
    res.status(500).json({
      success: false,
      message: 'Error al rechazar el artículo'
    });
  }
});

app.get('/api/articles/admin/stats', authMiddleware, async (req, res) => {
  try {
    if (isMongoConnected) {
      const stats = await Article.aggregate([
        {
          $group: {
            _id: '$adminStatus',
            count: { $sum: 1 }
          }
        }
      ]);

      const totalArticles = await Article.countDocuments();
      const pendingArticles = await Article.countDocuments({ adminStatus: 'pending' });
      const approvedArticles = await Article.countDocuments({ 
        adminStatus: { $in: ['approved_money', 'approved_points', 'approved_both'] } 
      });
      const rejectedArticles = await Article.countDocuments({ adminStatus: 'rejected' });

      res.json({
        success: true,
        data: {
          total: totalArticles,
          pending: pendingArticles,
          approved: approvedArticles,
          rejected: rejectedArticles,
          byStatus: stats
        }
      });
    } else {
      // Usar datos simulados
      const stats = [
        { _id: 'pending', count: 3 },
        { _id: 'approved_money', count: 0 },
        { _id: 'approved_points', count: 0 },
        { _id: 'approved_both', count: 0 },
        { _id: 'rejected', count: 0 }
      ];

      res.json({
        success: true,
        data: {
          total: 3,
          pending: 3,
          approved: 0,
          rejected: 0,
          byStatus: stats
        }
      });
    }
  } catch (error) {
    console.error('Error obteniendo estadísticas:', error);
    res.status(500).json({
      success: false,
      message: 'Error al obtener estadísticas'
    });
  }
});

// Rutas de artículos para el frontend
app.get('/api/articles', async (req, res) => {
  try {
    const { adminStatus } = req.query;
    
    if (isMongoConnected) {
      let query = { status: 'disponible' };
      if (adminStatus) {
        query.adminStatus = adminStatus;
      }
      
      const articles = await Article.find(query)
        .populate('seller', 'name email points logisticsLevel reputation')
        .sort({ createdAt: -1 });

      res.json({
        success: true,
        data: articles
      });
    } else {
      // Usar datos simulados - filtrar según query
      let availableArticles = mockArticles.filter(article => article.status === 'disponible');
      if (adminStatus) {
        availableArticles = availableArticles.filter(article => article.adminStatus === adminStatus);
      }
      res.json({
        success: true,
        data: availableArticles
      });
    }
  } catch (error) {
    console.error('Error obteniendo artículos:', error);
    res.status(500).json({
      success: false,
      message: 'Error al obtener artículos'
    });
  }
});

// Ruta para crear un nuevo artículo
app.post('/api/articles', authMiddleware, async (req, res) => {
  try {
    if (isMongoConnected) {
      const {
        title,
        description,
        price,
        pointsPrice,
        category,
        condition,
        images,
        isForSale,
        isForExchange,
        exchangeFor,
        location,
        tags,
        saleMode,
        directFromHome,
        logisticsCenterSale,
        trastaliaPurchase,
        pointsExchange,
        useLogisticsCenter
      } = req.body;

      // Determinar el estado inicial del artículo según el modo de venta
      let initialStatus = 'disponible';
      let initialAdminStatus = 'pending';
      
      // Si es venta desde casa, el artículo queda disponible inmediatamente
      if (saleMode === 'direct_from_home') {
        initialStatus = 'disponible';
        initialAdminStatus = 'approved_money'; // Aprobado automáticamente
      }
      // Si es centro logístico con venta directa, queda disponible
      else if (saleMode === 'logistics_center' && !trastaliaPurchase?.enabled && !pointsExchange?.enabled) {
        initialStatus = 'disponible';
        initialAdminStatus = 'approved_money'; // Aprobado automáticamente
      }
      // Si es compra por Trastalia o puntos, queda pendiente de aprobación
      else if (trastaliaPurchase?.enabled || pointsExchange?.enabled) {
        initialStatus = 'disponible'; // Disponible pero pendiente de aprobación admin
        initialAdminStatus = 'pending';
      }

      // Crear el artículo
      const article = new Article({
        title,
        description,
        price,
        pointsPrice,
        category,
        condition,
        images: images || [],
        seller: req.userId,
        status: initialStatus,
        isForSale,
        isForExchange,
        exchangeFor,
        location,
        tags: tags || [],
        views: 0,
        saleMode,
        directFromHome,
        logisticsCenterSale,
        trastaliaPurchase,
        pointsExchange,
        useLogisticsCenter,
        adminStatus: initialAdminStatus,
        sellerAccepted: false,
        sellerRejected: false
      });

      const savedArticle = await article.save();
      await savedArticle.populate('seller', 'name email points logisticsLevel reputation');

      res.status(201).json({
        success: true,
        message: 'Artículo creado exitosamente',
        data: savedArticle
      });
    } else {
      // Usar datos simulados
      const newArticle = {
        _id: `mock-article-${Date.now()}`,
        ...req.body,
        seller: {
          _id: req.userId,
          name: 'Usuario Mock',
          email: 'mock@example.com',
          points: 1000,
          logisticsLevel: 'capitan',
          reputation: 100
        },
        status: 'disponible',
        views: 0,
        adminStatus: 'pending',
        sellerAccepted: false,
        sellerRejected: false,
        createdAt: new Date(),
        updatedAt: new Date()
      };

      mockArticles.push(newArticle);

      res.status(201).json({
        success: true,
        message: 'Artículo creado exitosamente (simulado)',
        data: newArticle
      });
    }
  } catch (error) {
    console.error('Error creando artículo:', error);
    res.status(500).json({
      success: false,
      message: 'Error al crear el artículo'
    });
  }
});

// Ruta para obtener un artículo específico
app.get('/api/articles/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    if (isMongoConnected) {
      const article = await Article.findById(id)
        .populate('seller', 'name email points logisticsLevel reputation');
      
      if (!article) {
        return res.status(404).json({
          success: false,
          message: 'Artículo no encontrado'
        });
      }
      
      res.json({
        success: true,
        data: article
      });
    } else {
      // Usar datos simulados
      const article = mockArticles.find(a => a._id === id);
      if (!article) {
        return res.status(404).json({
          success: false,
          message: 'Artículo no encontrado'
        });
      }
      
      res.json({
        success: true,
        data: article
      });
    }
  } catch (error) {
    console.error('Error obteniendo artículo:', error);
    res.status(500).json({
      success: false,
      message: 'Error al obtener el artículo'
    });
  }
});

// Ruta para solicitudes de compra de Trastalia (artículos que el admin quiere comprar)
app.get('/api/articles/trastalia-purchase-requests', authMiddleware, async (req, res) => {
  try {
    if (isMongoConnected) {
      const articles = await Article.find({ 
        'seller': req.userId,
        adminStatus: { $in: ['approved_money', 'approved_points', 'approved_both'] },
        sellerAccepted: false,
        sellerRejected: false
      })
        .populate('seller', 'name email points logisticsLevel reputation')
        .sort({ createdAt: -1 });

      res.json({
        success: true,
        data: articles
      });
    } else {
      // Usar datos simulados - artículos aprobados por admin pero no aceptados por vendedor
      const purchaseRequests = mockArticles.filter(article => 
        article.seller._id === req.userId && 
        ['approved_money', 'approved_points', 'approved_both'].includes(article.adminStatus) &&
        !article.sellerAccepted && 
        !article.sellerRejected
      );
      
      res.json({
        success: true,
        data: purchaseRequests
      });
    }
  } catch (error) {
    console.error('Error obteniendo solicitudes de compra:', error);
    res.status(500).json({
      success: false,
      message: 'Error al obtener solicitudes de compra'
    });
  }
});

// Ruta para solicitudes de compra del usuario
app.get('/api/articles/my-purchase-requests', authMiddleware, async (req, res) => {
  try {
    if (isMongoConnected) {
      const articles = await Article.find({ 
        'seller': req.userId,
        adminStatus: { $in: ['pending', 'approved_money', 'approved_points', 'approved_both', 'rejected'] }
      })
        .populate('seller', 'name email points logisticsLevel reputation')
        .sort({ createdAt: -1 });

      res.json({
        success: true,
        data: articles
      });
    } else {
      // Usar datos simulados - devolver artículos del usuario actual
      // Para el admin, devolver todos los artículos ya que es el administrador
      const userArticles = mockArticles.filter(article => 
        article.adminStatus && ['pending', 'approved_money', 'approved_points', 'approved_both', 'rejected'].includes(article.adminStatus)
      );
      res.json({
        success: true,
        data: userArticles
      });
    }
  } catch (error) {
    console.error('Error obteniendo solicitudes de compra:', error);
    res.status(500).json({
      success: false,
      message: 'Error al obtener solicitudes de compra'
    });
  }
});

// Ruta para aceptar oferta de compra de Trastalia
app.post('/api/articles/accept-trastalia-offer', authMiddleware, async (req, res) => {
  try {
    const { articleId } = req.body;

    if (isMongoConnected) {
      const article = await Article.findById(articleId);
      if (!article) {
        return res.status(404).json({
          success: false,
          message: 'Artículo no encontrado'
        });
      }

      // Verificar que el usuario es el vendedor
      if (article.seller.toString() !== req.userId) {
        return res.status(403).json({
          success: false,
          message: 'No tienes permisos para aceptar esta oferta'
        });
      }

      // Actualizar el artículo
      const updatedArticle = await Article.findByIdAndUpdate(
        articleId,
        {
          sellerAccepted: true,
          sellerAcceptedDate: new Date(),
          status: 'comprado_por_trastalia'
        },
        { new: true }
      ).populate('seller', 'name email points logisticsLevel reputation');

      res.json({
        success: true,
        message: 'Oferta aceptada exitosamente',
        data: updatedArticle
      });
    } else {
      // Usar datos simulados
      const articleIndex = mockArticles.findIndex(a => a._id === articleId);
      if (articleIndex === -1) {
        return res.status(404).json({
          success: false,
          message: 'Artículo no encontrado'
        });
      }

      mockArticles[articleIndex].sellerAccepted = true;
      mockArticles[articleIndex].sellerAcceptedDate = new Date();
      mockArticles[articleIndex].status = 'comprado_por_trastalia';

      res.json({
        success: true,
        message: 'Oferta aceptada exitosamente (simulado)',
        data: mockArticles[articleIndex]
      });
    }
  } catch (error) {
    console.error('Error aceptando oferta:', error);
    res.status(500).json({
      success: false,
      message: 'Error al aceptar la oferta'
    });
  }
});

// Ruta para rechazar oferta de compra de Trastalia
app.post('/api/articles/reject-trastalia-offer', authMiddleware, async (req, res) => {
  try {
    const { articleId } = req.body;

    if (isMongoConnected) {
      const article = await Article.findById(articleId);
      if (!article) {
        return res.status(404).json({
          success: false,
          message: 'Artículo no encontrado'
        });
      }

      // Verificar que el usuario es el vendedor
      if (article.seller.toString() !== req.userId) {
        return res.status(403).json({
          success: false,
          message: 'No tienes permisos para rechazar esta oferta'
        });
      }

      // Actualizar el artículo
      const updatedArticle = await Article.findByIdAndUpdate(
        articleId,
        {
          sellerRejected: true,
          sellerRejectedDate: new Date(),
          adminStatus: 'rejected_by_seller'
        },
        { new: true }
      ).populate('seller', 'name email points logisticsLevel reputation');

      res.json({
        success: true,
        message: 'Oferta rechazada exitosamente',
        data: updatedArticle
      });
    } else {
      // Usar datos simulados
      const articleIndex = mockArticles.findIndex(a => a._id === articleId);
      if (articleIndex === -1) {
        return res.status(404).json({
          success: false,
          message: 'Artículo no encontrado'
        });
      }

      mockArticles[articleIndex].sellerRejected = true;
      mockArticles[articleIndex].sellerRejectedDate = new Date();
      mockArticles[articleIndex].adminStatus = 'rejected_by_seller';

      res.json({
        success: true,
        message: 'Oferta rechazada exitosamente (simulado)',
        data: mockArticles[articleIndex]
      });
    }
  } catch (error) {
    console.error('Error rechazando oferta:', error);
    res.status(500).json({
      success: false,
      message: 'Error al rechazar la oferta'
    });
  }
});

// Ruta para aceptar oferta
app.post('/api/articles/accept-offer', authMiddleware, async (req, res) => {
  try {
    const { articleId } = req.body;
    
    if (isMongoConnected) {
      const article = await Article.findById(articleId);
      if (!article) {
        return res.status(404).json({
          success: false,
          message: 'Artículo no encontrado'
        });
      }
      
      article.sellerAccepted = true;
      article.sellerAcceptedDate = new Date();
      await article.save();
      
      res.json({
        success: true,
        message: 'Oferta aceptada exitosamente'
      });
    } else {
      // Usar datos simulados
      const article = mockArticles.find(a => a._id === articleId);
      if (!article) {
        return res.status(404).json({
          success: false,
          message: 'Artículo no encontrado'
        });
      }
      
      article.sellerAccepted = true;
      article.sellerAcceptedDate = new Date();
      
      res.json({
        success: true,
        message: 'Oferta aceptada exitosamente'
      });
    }
  } catch (error) {
    console.error('Error aceptando oferta:', error);
    res.status(500).json({
      success: false,
      message: 'Error al aceptar la oferta'
    });
  }
});

app.get('/api/articles/stats', async (req, res) => {
  try {
    if (isMongoConnected) {
      const totalArticles = await Article.countDocuments();
      const availableArticles = await Article.countDocuments({ status: 'disponible' });
      const soldArticles = await Article.countDocuments({ status: 'vendido' });
      const exchangedArticles = await Article.countDocuments({ status: 'intercambiado' });

      res.json({
        success: true,
        data: {
          total: totalArticles,
          available: availableArticles,
          sold: soldArticles,
          exchanged: exchangedArticles
        }
      });
    } else {
      // Usar datos simulados
      res.json({
        success: true,
        data: {
          total: 3,
          available: 3,
          sold: 0,
          exchanged: 0
        }
      });
    }
  } catch (error) {
    console.error('Error obteniendo estadísticas de artículos:', error);
    res.status(500).json({
      success: false,
      message: 'Error al obtener estadísticas de artículos'
    });
  }
});

// Ruta para centros logísticos
app.get('/api/logistics-centers', async (req, res) => {
  try {
    const { city, region, status } = req.query;
    
    if (isMongoConnected) {
      // Si MongoDB está conectado, buscar en la base de datos
      let query = {};
      if (city) query.city = new RegExp(city, 'i');
      if (region) query.region = new RegExp(region, 'i');
      if (status) query.status = status;
      
      const centers = await LogisticsCenter.find(query)
        .sort({ city: 1, name: 1 });

      res.json({
        success: true,
        data: centers
      });
    } else {
      // Usar datos simulados
      let filteredCenters = mockLogisticsCenters;
      
      if (city) {
        filteredCenters = filteredCenters.filter(center => 
          center.city.toLowerCase().includes(city.toLowerCase())
        );
      }
      
      if (region) {
        filteredCenters = filteredCenters.filter(center => 
          center.region.toLowerCase().includes(region.toLowerCase())
        );
      }
      
      if (status) {
        filteredCenters = filteredCenters.filter(center => 
          center.status === status
        );
      }
      
      res.json({
        success: true,
        data: filteredCenters
      });
    }
  } catch (error) {
    console.error('Error obteniendo centros logísticos:', error);
    res.status(500).json({
      success: false,
      message: 'Error al obtener centros logísticos'
    });
  }
});

// Ruta para obtener un centro logístico específico
app.get('/api/logistics-centers/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    if (isMongoConnected) {
      const center = await LogisticsCenter.findById(id);
      
      if (!center) {
        return res.status(404).json({
          success: false,
          message: 'Centro logístico no encontrado'
        });
      }
      
      res.json({
        success: true,
        data: center
      });
    } else {
      // Usar datos simulados
      const center = mockLogisticsCenters.find(c => c._id === id);
      if (!center) {
        return res.status(404).json({
          success: false,
          message: 'Centro logístico no encontrado'
        });
      }
      
      res.json({
        success: true,
        data: center
      });
    }
  } catch (error) {
    console.error('Error obteniendo centro logístico:', error);
    res.status(500).json({
      success: false,
      message: 'Error al obtener el centro logístico'
    });
  }
});

// Ruta de salud
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development',
    database: isMongoConnected ? 'MongoDB Atlas' : 'Datos simulados'
  });
});

// Iniciar servidor
app.listen(PORT, () => {
  console.log(`🚀 Servidor backend HÍBRIDO ejecutándose en puerto ${PORT}`);
  console.log(`📱 Frontend: http://localhost:5173`);
  console.log(`🔗 API: http://localhost:${PORT}/api`);
  console.log(`💾 Almacenamiento: ${isMongoConnected ? 'MongoDB Atlas' : 'Datos simulados'}`);
  console.log(`🎯 Panel Admin: http://localhost:5173/admin/articles`);
  console.log(`🔑 Login: admin@trastalia.com / admin123456`);
});
