import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import compression from 'compression';
import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const app = express();
const PORT = 3002;

// Middleware de seguridad
app.use(helmet());
app.use(compression());
app.use(morgan('combined'));

// CORS
app.use(cors({
  origin: ['http://localhost:5173', 'http://localhost:5174'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Manejar preflight requests
app.use((req, res, next) => {
  if (req.method === 'OPTIONS') {
    res.header('Access-Control-Allow-Origin', req.headers.origin);
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    res.header('Access-Control-Allow-Credentials', 'true');
    res.sendStatus(200);
  } else {
    next();
  }
});

// Middleware para parsear JSON
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Conectar a MongoDB Atlas
const MONGODB_URI = 'mongodb+srv://mikabodea_db_user:Mika1974%26@cluster0.zehostg.mongodb.net/tailadmin?retryWrites=true&w=majority&appName=Cluster0';

const connectDatabase = async () => {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Conectado a MongoDB Atlas exitosamente');
  } catch (error) {
    console.error('❌ Error al conectar con MongoDB Atlas:', error);
    console.log('🔄 Continuando con modo simulado...');
  }
};

// Esquemas de MongoDB
const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['admin', 'user', 'moderator'], default: 'user' },
  avatar: String,
  isActive: { type: Boolean, default: true },
  lastLogin: Date,
  points: { type: Number, default: 0 },
  logisticsLevel: { type: String, enum: ['civil', 'comerciante', 'transportista', 'capitán', 'almirante'], default: 'civil' },
  reputation: { type: Number, default: 100 },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

const ArticleSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true, minlength: 10 },
  price: { type: Number, required: true },
  pointsPrice: Number,
  category: { type: String, required: true },
  condition: { type: String, enum: ['nuevo', 'usado', 'excelente', 'bueno', 'regular'], required: true },
  images: [String],
  seller: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  status: { type: String, enum: ['disponible', 'vendido', 'reservado', 'intercambiado', 'en_centro_logistico', 'comprado_por_trastalia'], default: 'disponible' },
  isForSale: { type: Boolean, default: true },
  isForExchange: { type: Boolean, default: false },
  exchangeFor: String,
  location: { type: String, required: true },
  tags: [String],
  views: { type: Number, default: 0 },
  // Tipo de venta principal
  saleType: { 
    type: String, 
    enum: ['from_home', 'from_logistics_center'], 
    required: true 
  },
  
  // Venta desde casa
  fromHome: {
    enabled: { type: Boolean, default: false },
    price: Number,
    shippingCost: Number,
    status: { type: String, enum: ['active', 'sold', 'cancelled'], default: 'active' }
  },
  
  // Venta desde centro logístico
  fromLogisticsCenter: {
    enabled: { type: Boolean, default: false },
    logisticsCenter: { type: mongoose.Schema.Types.ObjectId, ref: 'LogisticsCenter' },
    commission: { type: Number, default: 0.1 }, // 10% por defecto
    
    // Compra directa por Trastalia
    directPurchase: {
      enabled: { type: Boolean, default: false },
      status: { type: String, enum: ['disabled', 'pending', 'approved', 'rejected'], default: 'disabled' },
      offeredPrice: Number,
      adminNotes: String,
      processedAt: Date,
      processedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
    },
    
    // Venta por puntos
    pointsSale: {
      enabled: { type: Boolean, default: false },
      status: { type: String, enum: ['disabled', 'pending', 'approved', 'rejected'], default: 'disabled' },
      conversionRate: { type: Number, default: 1.2 },
      pointsOffered: Number,
      adminNotes: String,
      processedAt: Date,
      processedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
    }
  },
  
  // Estado general de solicitudes
  requestStatus: {
    type: String, 
    enum: ['none', 'pending_review', 'approved', 'rejected', 'partially_approved'],
    default: 'none'
  },
  
  // Notas del administrador
  adminNotes: String,
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

// Middleware para encriptar contraseña
UserSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  try {
    const salt = await bcrypt.genSalt(12);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Método para comparar contraseñas
UserSchema.methods.comparePassword = async function(candidatePassword) {
  try {
    return await bcrypt.compare(candidatePassword, this.password);
  } catch (error) {
    throw new Error('Error al comparar contraseñas');
  }
};

const User = mongoose.model('User', UserSchema);
// Esquema para Centros Logísticos
const LogisticsCenterSchema = new mongoose.Schema({
  name: { type: String, required: true },
  location: { type: String, required: true },
  address: { type: String, required: true },
  city: { type: String, required: true },
  postalCode: String,
  country: { type: String, default: 'España' },
  contactPhone: String,
  contactEmail: String,
  capacity: { type: Number, default: 1000 }, // Capacidad en artículos
  currentOccupancy: { type: Number, default: 0 },
  isActive: { type: Boolean, default: true },
  commissionRate: { type: Number, default: 0.1 }, // 10% por defecto
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

const Article = mongoose.model('Article', ArticleSchema);
const LogisticsCenter = mongoose.model('LogisticsCenter', LogisticsCenterSchema);

// Middleware de autenticación
const authMiddleware = async (req, res, next) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    
    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'Token de autorización requerido'
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'fallback-secret');
    const user = await User.findById(decoded.userId);
    
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Token inválido'
      });
    }

    req.user = user;
    req.userId = user._id;
    req.userRole = user.role;
    next();
  } catch (error) {
    res.status(401).json({
      success: false,
      message: 'Token inválido'
    });
  }
};

// Ruta de salud
app.get('/api/health', (req, res) => {
  res.json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    environment: 'development'
  });
});

// Rutas de autenticación
app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Email y contraseña son obligatorios'
      });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Credenciales inválidas'
      });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Credenciales inválidas'
      });
    }

    const token = jwt.sign(
      { userId: user._id },
      process.env.JWT_SECRET || 'fallback-secret',
      { expiresIn: '7d' }
    );

    user.lastLogin = new Date();
    await user.save();

    res.json({
      success: true,
      message: 'Login exitoso',
      data: {
        token,
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role
        }
      }
    });
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
    res.json({
      success: true,
      data: {
        id: req.user._id,
        name: req.user.name,
        email: req.user.email,
        role: req.user.role
      }
    });
  } catch (error) {
    console.error('Error verificando usuario:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor'
    });
  }
});

// Rutas de artículos
app.get('/api/articles', async (req, res) => {
  try {
    const articles = await Article.find({ status: 'disponible' })
      .populate('seller', 'name email')
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      data: articles
    });
  } catch (error) {
    console.error('Error obteniendo artículos:', error);
    res.status(500).json({
      success: false,
      message: 'Error al obtener artículos'
    });
  }
});

// Rutas específicas de artículos (deben ir antes de /:id)
app.get('/api/articles/my-purchase-requests', authMiddleware, async (req, res) => {
  try {
    const articles = await Article.find({ 
      seller: req.userId,
      saleType: 'from_logistics_center',
      'fromLogisticsCenter.enabled': true,
      $or: [
        { 'fromLogisticsCenter.directPurchase.status': { $in: ['pending', 'approved', 'rejected'] } },
        { 'fromLogisticsCenter.pointsSale.status': { $in: ['pending', 'approved', 'rejected'] } }
      ]
    })
      .populate('seller', 'name email')
      .populate('fromLogisticsCenter.logisticsCenter', 'name location address')
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      data: articles
    });
  } catch (error) {
    console.error('Error obteniendo solicitudes de compra:', error);
    res.status(500).json({
      success: false,
      message: 'Error al obtener solicitudes de compra'
    });
  }
});

app.get('/api/articles/admin-pending', authMiddleware, async (req, res) => {
  try {
    // Verificar que el usuario sea administrador
    if (req.userRole !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Acceso denegado. Se requieren permisos de administrador'
      });
    }

    // Buscar artículos con la nueva estructura (saleType: 'from_logistics_center')
    const newStructureArticles = await Article.find({ 
      saleType: 'from_logistics_center',
      'fromLogisticsCenter.enabled': true,
      $or: [
        { 'fromLogisticsCenter.directPurchase.status': 'pending' },
        { 'fromLogisticsCenter.pointsSale.status': 'pending' }
      ]
    })
      .populate('seller', 'name email')
      .populate('fromLogisticsCenter.logisticsCenter', 'name location address')
      .sort({ createdAt: -1 });

    // Buscar artículos con la estructura antigua (useLogisticsCenter: true)
    const oldStructureArticles = await Article.find({ 
      useLogisticsCenter: true,
      status: 'disponible',
      $or: [
        { adminStatus: { $exists: false } },
        { adminStatus: 'pending' },
        { adminStatus: { $in: ['approved_money', 'approved_points', 'approved_both', 'rejected'] } }
      ]
    })
      .populate('seller', 'name email')
      .sort({ createdAt: -1 });

    // Combinar ambos resultados
    const allArticles = [...newStructureArticles, ...oldStructureArticles];

    res.json({
      success: true,
      data: allArticles
    });
  } catch (error) {
    console.error('Error obteniendo artículos pendientes:', error);
    res.status(500).json({
      success: false,
      message: 'Error al obtener artículos pendientes'
    });
  }
});

app.get('/api/articles/:id', async (req, res) => {
  try {
    const article = await Article.findById(req.params.id)
      .populate('seller', 'name email points logisticsLevel reputation');

    if (!article) {
      return res.status(404).json({
        success: false,
        message: 'Artículo no encontrado'
      });
    }

    // Incrementar contador de vistas
    article.views += 1;
    await article.save();

    res.json({
      success: true,
      data: article
    });
  } catch (error) {
    console.error('Error obteniendo artículo:', error);
    res.status(500).json({
      success: false,
      message: 'Error al obtener el artículo'
    });
  }
});

app.post('/api/articles', authMiddleware, async (req, res) => {
  try {
    const { saleType, fromHome, fromLogisticsCenter, ...basicData } = req.body;

    // Validar que se proporcione el tipo de venta
    if (!saleType || !['from_home', 'from_logistics_center'].includes(saleType)) {
      return res.status(400).json({
        success: false,
        message: 'Tipo de venta requerido: from_home o from_logistics_center'
      });
    }

    const articleData = {
      ...basicData,
      seller: req.userId,
      saleType,
      fromHome: saleType === 'from_home' ? fromHome : { enabled: false },
      fromLogisticsCenter: saleType === 'from_logistics_center' ? fromLogisticsCenter : { enabled: false }
    };

    // Si es venta desde centro logístico, validar que se proporcione el centro
    if (saleType === 'from_logistics_center' && fromLogisticsCenter?.logisticsCenter) {
      const center = await LogisticsCenter.findById(fromLogisticsCenter.logisticsCenter);
      if (!center) {
        return res.status(400).json({
          success: false,
          message: 'Centro logístico no encontrado'
        });
      }
    }

    const article = new Article(articleData);
    await article.save();

    const populatedArticle = await Article.findById(article._id)
      .populate('seller', 'name email')
      .populate('fromLogisticsCenter.logisticsCenter', 'name location address');

    res.status(201).json({
      success: true,
      message: 'Artículo creado exitosamente',
      data: populatedArticle
    });
  } catch (error) {
    console.error('Error creating article:', error);
    res.status(500).json({
      success: false,
      message: 'Error al crear el artículo'
    });
  }
});

// Endpoints de administración

app.post('/api/admin/process-article', authMiddleware, async (req, res) => {
  try {
    const { articleId, requestType, decision, price, points, notes } = req.body;

    // Verificar que el usuario sea administrador
    if (req.userRole !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Acceso denegado. Se requieren permisos de administrador'
      });
    }

    const article = await Article.findById(articleId);
    if (!article) {
      return res.status(404).json({
        success: false,
        message: 'Artículo no encontrado'
      });
    }

    // Verificar si es estructura nueva o antigua
    if (article.saleType === 'from_logistics_center') {
      // Procesar estructura nueva
      if (requestType === 'direct_purchase') {
        if (decision === 'approve') {
          article.fromLogisticsCenter.directPurchase.status = 'approved';
          article.fromLogisticsCenter.directPurchase.offeredPrice = price;
        } else if (decision === 'reject') {
          article.fromLogisticsCenter.directPurchase.status = 'rejected';
        }
        article.fromLogisticsCenter.directPurchase.adminNotes = notes;
        article.fromLogisticsCenter.directPurchase.processedAt = new Date();
        article.fromLogisticsCenter.directPurchase.processedBy = req.userId;
      } else if (requestType === 'points_sale') {
        if (decision === 'approve') {
          article.fromLogisticsCenter.pointsSale.status = 'approved';
          article.fromLogisticsCenter.pointsSale.pointsOffered = points;
        } else if (decision === 'reject') {
          article.fromLogisticsCenter.pointsSale.status = 'rejected';
        }
        article.fromLogisticsCenter.pointsSale.adminNotes = notes;
        article.fromLogisticsCenter.pointsSale.processedAt = new Date();
        article.fromLogisticsCenter.pointsSale.processedBy = req.userId;
      }

      // Actualizar estado general de solicitudes
      const hasPending = article.fromLogisticsCenter.directPurchase.status === 'pending' || 
                        article.fromLogisticsCenter.pointsSale.status === 'pending';
      const hasApproved = article.fromLogisticsCenter.directPurchase.status === 'approved' || 
                         article.fromLogisticsCenter.pointsSale.status === 'approved';
      const hasRejected = article.fromLogisticsCenter.directPurchase.status === 'rejected' || 
                         article.fromLogisticsCenter.pointsSale.status === 'rejected';

      if (hasPending) {
        article.requestStatus = 'pending_review';
      } else if (hasApproved && hasRejected) {
        article.requestStatus = 'partially_approved';
      } else if (hasApproved) {
        article.requestStatus = 'approved';
      } else if (hasRejected) {
        article.requestStatus = 'rejected';
      }
    } else {
      // Procesar estructura antigua (useLogisticsCenter: true)
      if (requestType === 'direct_purchase') {
        if (decision === 'approve') {
          article.adminStatus = 'approved_money';
          article.adminDecision = {
            money: true,
            moneyPrice: price,
            points: false,
            pointsAmount: 0,
            reject: false,
            rejectReason: ''
          };
        } else if (decision === 'reject') {
          article.adminStatus = 'rejected';
          article.adminDecision = {
            money: false,
            moneyPrice: 0,
            points: false,
            pointsAmount: 0,
            reject: true,
            rejectReason: notes || 'Rechazado por el administrador'
          };
        }
      } else if (requestType === 'points_sale') {
        if (decision === 'approve') {
          article.adminStatus = 'approved_points';
          article.adminDecision = {
            money: false,
            moneyPrice: 0,
            points: true,
            pointsAmount: points,
            reject: false,
            rejectReason: ''
          };
        } else if (decision === 'reject') {
          article.adminStatus = 'rejected';
          article.adminDecision = {
            money: false,
            moneyPrice: 0,
            points: false,
            pointsAmount: 0,
            reject: true,
            rejectReason: notes || 'Rechazado por el administrador'
          };
        }
      }
    }

    article.adminNotes = notes;
    await article.save();

    res.json({
      success: true,
      message: 'Solicitud procesada exitosamente',
      data: article
    });
  } catch (error) {
    console.error('Error procesando solicitud:', error);
    res.status(500).json({
      success: false,
      message: 'Error al procesar la solicitud'
    });
  }
});

// Ruta para obtener centros logísticos
app.get('/api/logistics-centers', async (req, res) => {
  try {
    const centers = await LogisticsCenter.find({ isActive: true })
      .select('name location address city postalCode contactPhone contactEmail capacity currentOccupancy commissionRate')
      .sort({ name: 1 });

    res.json({
      success: true,
      data: centers
    });
  } catch (error) {
    console.error('Error obteniendo centros logísticos:', error);
    res.status(500).json({
      success: false,
      message: 'Error al obtener centros logísticos'
    });
  }
});

// Endpoints para solicitudes de compra del vendedor (ya definido arriba)

app.post('/api/articles/accept-offer', authMiddleware, async (req, res) => {
  try {
    const { articleId } = req.body;

    if (!articleId) {
      return res.status(400).json({
        success: false,
        message: 'ID del artículo requerido'
      });
    }

    const article = await Article.findById(articleId);
    if (!article) {
      return res.status(404).json({
        success: false,
        message: 'Artículo no encontrado'
      });
    }

    // Verificar que el usuario sea el propietario
    if (article.seller.toString() !== req.userId) {
      return res.status(403).json({
        success: false,
        message: 'No tienes permisos para esta acción'
      });
    }

    // Verificar que la oferta esté aprobada
    if (!['approved_money', 'approved_points', 'approved_both'].includes(article.adminStatus)) {
      return res.status(400).json({
        success: false,
        message: 'No hay oferta aprobada para este artículo'
      });
    }

    // Actualizar estado del artículo
    article.status = 'comprado_por_trastalia';
    article.sellerAccepted = true;
    article.sellerAcceptedDate = new Date();
    await article.save();

    res.json({
      success: true,
      message: 'Oferta aceptada exitosamente',
      data: article
    });
  } catch (error) {
    console.error('Error aceptando oferta:', error);
    res.status(500).json({
      success: false,
      message: 'Error al aceptar la oferta'
    });
  }
});

app.post('/api/articles/reject-offer', authMiddleware, async (req, res) => {
  try {
    const { articleId } = req.body;

    if (!articleId) {
      return res.status(400).json({
        success: false,
        message: 'ID del artículo requerido'
      });
    }

    const article = await Article.findById(articleId);
    if (!article) {
      return res.status(404).json({
        success: false,
        message: 'Artículo no encontrado'
      });
    }

    // Verificar que el usuario sea el propietario
    if (article.seller.toString() !== req.userId) {
      return res.status(403).json({
        success: false,
        message: 'No tienes permisos para esta acción'
      });
    }

    // Actualizar estado del artículo
    article.status = 'disponible';
    article.adminStatus = 'rejected_by_seller';
    article.sellerRejected = true;
    article.sellerRejectedDate = new Date();
    await article.save();

    res.json({
      success: true,
      message: 'Oferta rechazada',
      data: article
    });
  } catch (error) {
    console.error('Error rechazando oferta:', error);
    res.status(500).json({
      success: false,
      message: 'Error al rechazar la oferta'
    });
  }
});

// Endpoint para actualizar rol de usuario
app.put('/api/users/update-role', authMiddleware, async (req, res) => {
  try {
    const { role } = req.body;

    if (!role || !['user', 'admin'].includes(role)) {
      return res.status(400).json({
        success: false,
        message: 'Rol inválido'
      });
    }

    const user = await User.findById(req.userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'Usuario no encontrado'
      });
    }

    user.role = role;
    await user.save();

    res.json({
      success: true,
      message: 'Rol actualizado exitosamente',
      data: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });
  } catch (error) {
    console.error('Error actualizando rol:', error);
    res.status(500).json({
      success: false,
      message: 'Error al actualizar el rol'
    });
  }
});

// Middleware de manejo de errores
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(500).json({
    success: false,
    message: 'Error interno del servidor',
    error: err.message
  });
});

// Ruta 404
app.use((req, res) => {
  res.status(404).json({
    success: false,
    error: 'Ruta no encontrada',
    message: `La ruta ${req.originalUrl} no existe`
  });
});

// Iniciar servidor
const startServer = async () => {
  try {
    await connectDatabase();
    
    app.listen(PORT, () => {
      console.log(`🚀 Servidor ejecutándose en puerto ${PORT}`);
      console.log(`📱 Frontend: http://localhost:5173`);
      console.log(`🔗 API: http://localhost:${PORT}/api`);
      console.log(`💾 Almacenamiento: MongoDB Atlas`);
    });
  } catch (error) {
    console.error('❌ Error al iniciar servidor:', error);
    process.exit(1);
  }
};

startServer();
