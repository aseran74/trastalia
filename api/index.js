// Vercel Serverless Function para el backend
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Conectar a MongoDB
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Conectado a MongoDB Atlas');
  } catch (error) {
    console.error('❌ Error conectando a MongoDB:', error);
  }
};

// Ejecutar conexión
connectDB();

// Middleware de autenticación
const authMiddleware = (req, res, next) => {
  const token = req.header('Authorization')?.replace('Bearer ', '');
  
  if (!token) {
    return res.status(401).json({ success: false, message: 'Token no proporcionado' });
  }

  try {
    // Verificar si es token de admin
    if (token === 'admin-token') {
      req.userId = 'admin-user-id';
      req.userRole = 'admin';
      return next();
    }

    // Verificar si es token de usuario normal
    if (token.startsWith('mongodb-user-token-')) {
      const userId = token.replace('mongodb-user-token-', '');
      req.userId = userId;
      req.userRole = 'user';
      return next();
    }

    // Token JWT estándar
    const decoded = jwt.verify(token, 'trastalia-secret-key');
    req.userId = decoded.userId;
    req.userRole = decoded.role;
    next();
  } catch (error) {
    res.status(401).json({ success: false, message: 'Token inválido' });
  }
};

// Esquemas de Mongoose (simplificados para Vercel)
const UserSchema = new mongoose.Schema({
  name: String,
  email: String,
  password: String,
  role: { type: String, default: 'user' },
  points: { type: Number, default: 0 },
  logisticsLevel: { type: String, default: 'basic' },
  reputation: { type: Number, default: 0 }
});

const ArticleSchema = new mongoose.Schema({
  nombre: String,
  descripcion: String,
  categoria: String,
  precio_propuesto_vendedor: Number,
  id_vendedor: String,
  estado_articulo: { type: String, default: 'DRAFT' },
  modo_venta: String,
  opciones_logisticas: [String],
  acepta_descuento_admin: Boolean,
  precio_compra_admin: Number,
  ubicacion: String,
  condicion: String,
  tags: [String],
  views: { type: Number, default: 0 },
  seller: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  adminDecision: {
    reject: { type: Boolean, default: false },
    selectedOption: String,
    finalPrice: Number,
    finalPoints: Number
  },
  sellerAccepted: { type: Boolean, default: false },
  sellerRejected: { type: Boolean, default: false },
  comprador: String,
  comprador_tipo: String,
  transferido_a_trastalia: { type: Boolean, default: false }
});

const User = mongoose.model('User', UserSchema);
const Article = mongoose.model('Article', ArticleSchema);

// Rutas principales
app.get('/api/health', (req, res) => {
  res.json({ success: true, message: 'API funcionando correctamente' });
});

// Ruta de login
app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (email === 'admin@trastalia.com' && password === 'admin123456') {
      return res.json({
        success: true,
        data: {
          user: {
            id: 'admin-user-id',
            name: 'Administrador',
            email: 'admin@trastalia.com',
            role: 'admin',
            points: 10000,
            logisticsLevel: 'premium',
            reputation: 100
          },
          token: 'admin-token'
        }
      });
    }

    const user = await User.findOne({ email });
    if (!user || !await bcrypt.compare(password, user.password)) {
      return res.status(401).json({
        success: false,
        message: 'Credenciales inválidas'
      });
    }

    const token = `mongodb-user-token-${user._id}`;
    res.json({
      success: true,
      data: {
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
          points: user.points || 0,
          logisticsLevel: user.logisticsLevel || 'basic',
          reputation: user.reputation || 0
        },
        token
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

// Ruta para obtener artículos
app.get('/api/articles', async (req, res) => {
  try {
    const articles = await Article.find()
      .populate('seller', 'name email points logisticsLevel reputation')
      .limit(20);
    
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

// Ruta para crear artículo
app.post('/api/articles', authMiddleware, async (req, res) => {
  try {
    const articleData = {
      ...req.body,
      seller: req.userId,
      id_vendedor: req.userId
    };

    const article = new Article(articleData);
    await article.save();

    res.status(201).json({
      success: true,
      message: 'Artículo creado exitosamente',
      data: article
    });
  } catch (error) {
    console.error('Error creando artículo:', error);
    res.status(500).json({
      success: false,
      message: 'Error al crear artículo'
    });
  }
});

// Ruta para obtener solicitudes de compra
app.get('/api/articles/my-purchase-requests', authMiddleware, async (req, res) => {
  try {
    const articles = await Article.find({
      seller: req.userId,
      estado_articulo: 'OFERTA_COMPRA_ENVIADA',
      sellerAccepted: false,
      sellerRejected: false,
      'adminDecision.reject': false,
      transferido_a_trastalia: { $ne: true }
    }).populate('seller', 'name email points logisticsLevel reputation');

    res.json({
      success: true,
      data: articles
    });
  } catch (error) {
    console.error('Error obteniendo solicitudes:', error);
    res.status(500).json({
      success: false,
      message: 'Error al obtener solicitudes'
    });
  }
});

// Ruta para aceptar oferta
app.post('/api/articles/accept-offer', authMiddleware, async (req, res) => {
  try {
    const { articleId, selectedOption } = req.body;

    const article = await Article.findById(articleId);
    if (!article) {
      return res.status(404).json({
        success: false,
        message: 'Artículo no encontrado'
      });
    }

    if (selectedOption === 'points') {
      // Acreditar puntos al vendedor
      await User.findByIdAndUpdate(req.userId, {
        $inc: { points: article.adminDecision.finalPoints || 0 }
      });
    }

    article.sellerAccepted = true;
    article.estado_articulo = 'COMPRADO_POR_ADMIN';
    article.comprador = 'admin-user-id';
    article.comprador_tipo = 'trastalia';
    article.transferido_a_trastalia = true;

    await article.save();

    res.json({
      success: true,
      message: selectedOption === 'points' 
        ? `Oferta aceptada. Se han acreditado ${article.adminDecision.finalPoints || 0} puntos a tu cuenta.`
        : 'Oferta aceptada. El pago se procesará próximamente.'
    });
  } catch (error) {
    console.error('Error aceptando oferta:', error);
    res.status(500).json({
      success: false,
      message: 'Error al aceptar oferta'
    });
  }
});

// Ruta para obtener balance de puntos
app.get('/api/user/points-balance', authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'Usuario no encontrado'
      });
    }

    res.json({
      success: true,
      data: {
        points: user.points || 0,
        availablePoints: user.points || 0
      }
    });
  } catch (error) {
    console.error('Error obteniendo balance:', error);
    res.status(500).json({
      success: false,
      message: 'Error al obtener balance'
    });
  }
});

// Ruta para obtener intercambios por puntos
app.get('/api/articles/point-exchanges', authMiddleware, async (req, res) => {
  try {
    const articles = await Article.find({
      seller: req.userId,
      estado_articulo: 'COMPRADO_POR_ADMIN',
      comprador_tipo: 'trastalia',
      'adminDecision.selectedOption': 'points'
    }).populate('seller', 'name email points logisticsLevel reputation');

    res.json({
      success: true,
      data: articles
    });
  } catch (error) {
    console.error('Error obteniendo intercambios:', error);
    res.status(500).json({
      success: false,
      message: 'Error al obtener intercambios'
    });
  }
});

// Ruta para obtener artículos vendidos
app.get('/api/articles/sold-articles', authMiddleware, async (req, res) => {
  try {
    const articles = await Article.find({
      seller: req.userId,
      estado_articulo: 'COMPRADO_POR_ADMIN',
      comprador_tipo: 'trastalia',
      'adminDecision.selectedOption': 'money'
    }).populate('seller', 'name email points logisticsLevel reputation');

    res.json({
      success: true,
      data: articles
    });
  } catch (error) {
    console.error('Error obteniendo artículos vendidos:', error);
    res.status(500).json({
      success: false,
      message: 'Error al obtener artículos vendidos'
    });
  }
});

// Ruta para obtener transacciones de puntos
app.get('/api/user/points-transactions', authMiddleware, async (req, res) => {
  try {
    // Simular transacciones para el demo
    const transactions = [
      {
        id: '1',
        type: 'credit',
        amount: 100,
        description: 'Compra de puntos',
        date: new Date().toISOString(),
        status: 'completed'
      },
      {
        id: '2',
        type: 'debit',
        amount: -50,
        description: 'Canje por artículo',
        date: new Date(Date.now() - 86400000).toISOString(),
        status: 'completed'
      }
    ];

    res.json({
      success: true,
      data: {
        transactions,
        pagination: {
          page: 1,
          limit: 10,
          total: transactions.length,
          pages: 1
        }
      }
    });
  } catch (error) {
    console.error('Error obteniendo transacciones:', error);
    res.status(500).json({
      success: false,
      message: 'Error al obtener transacciones'
    });
  }
});

// Ruta genérica para artículos por ID
app.get('/api/articles/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: 'ID de artículo no válido'
      });
    }
    
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
  } catch (error) {
    console.error('Error obteniendo artículo:', error);
    res.status(500).json({
      success: false,
      message: 'Error al obtener el artículo'
    });
  }
});

// Exportar la app para Vercel
module.exports = app;
