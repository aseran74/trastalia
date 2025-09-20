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

// Conectar a MongoDB
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb+srv://alvaroserr:alvaro123@cluster0.8xqjq.mongodb.net/trastalia?retryWrites=true&w=majority&appName=Cluster0';

mongoose.connect(MONGODB_URI)
  .then(() => {
    console.log('✅ Conectado a MongoDB Atlas');
  })
  .catch((error) => {
    console.error('❌ Error conectando a MongoDB:', error);
  });

// Esquemas
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

const User = mongoose.model('User', UserSchema);
const Article = mongoose.model('Article', ArticleSchema);

// Middleware de autenticación simple
const authMiddleware = (req, res, next) => {
  const authHeader = req.headers.authorization;
  
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({
      success: false,
      message: 'Token de acceso requerido'
    });
  }

  // Para simplificar, asumimos que el token es válido si existe
  req.userId = 'admin-user-id';
  req.userRole = 'admin';
  next();
};

// Rutas de autenticación
app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    
    // Buscar usuario en MongoDB
    const user = await User.findOne({ email: email });
    
    if (user && user.password === password) {
      const token = 'mongodb-admin-token-' + Date.now();
      
      res.json({
        success: true,
        message: 'Login exitoso',
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
    // Buscar usuario admin en MongoDB
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
    const articles = await Article.find({ adminStatus: 'pending' })
      .populate('seller', 'name email points logisticsLevel reputation')
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      data: articles
    });
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

    const article = await Article.findById(req.params.id);
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
      req.params.id,
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

    const article = await Article.findById(req.params.id);
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
      req.params.id,
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
  } catch (error) {
    console.error('Error obteniendo estadísticas:', error);
    res.status(500).json({
      success: false,
      message: 'Error al obtener estadísticas'
    });
  }
});

// Ruta de salud
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development',
    database: 'MongoDB Atlas'
  });
});

// Iniciar servidor
app.listen(PORT, () => {
  console.log(`🚀 Servidor backend MONGODB ejecutándose en puerto ${PORT}`);
  console.log(`📱 Frontend: http://localhost:5173`);
  console.log(`🔗 API: http://localhost:${PORT}/api`);
  console.log(`💾 Almacenamiento: MongoDB Atlas`);
  console.log(`🎯 Panel Admin: http://localhost:5173/admin/articles`);
  console.log(`🔑 Login: admin@trastalia.com / admin123456`);
});
