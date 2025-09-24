const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
const PORT = 3002;

// Middleware
app.use(cors({
  origin: [
    'http://localhost:5173', 
    'http://localhost:5174',
    'http://localhost:3000',
    'https://trastalia.vercel.app',
    'https://*.vercel.app'
  ],
  credentials: true
}));

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Conectar a MongoDB
const MONGODB_URI = 'mongodb+srv://mikabodea:Mika1974%26@trastalia.ycg2lvb.mongodb.net/trastalia?retryWrites=true&w=majority&appName=Trastalia';

mongoose.connect(MONGODB_URI)
  .then(() => {
    console.log('✅ Conectado a MongoDB Atlas');
  })
  .catch((error) => {
    console.error('❌ Error conectando a MongoDB:', error);
  });

// ===== NUEVOS ESQUEMAS SEGÚN LA LÓGICA ESPECIFICADA =====

// Esquema de Usuarios (mantenemos el existente)
const UserSchema = new mongoose.Schema({
  name: String,
  email: String,
  password: String,
  role: { type: String, default: 'user' },
  avatar: String,
  isActive: { type: Boolean, default: true },
  lastLogin: Date,
  points: { type: Number, default: 0 },
  logisticsLevel: String,
  reputation: { type: Number, default: 0 }
}, { timestamps: true });

// Esquema de Artículos con la nueva lógica
const ArticleSchema = new mongoose.Schema({
  // Información básica del artículo
  nombre: { type: String, required: true },
  descripcion: { type: String, required: true },
  categoria: { type: String, required: true },
  precio_sugerido: { type: Number, required: true },
  condicion: { type: String, required: true },
  ubicacion: { type: String, required: true },
  fotos: [String],
  tags: [String],
  views: { type: Number, default: 0 },
  
  // Referencias
  vendedor_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  comprador_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  
  // Ubicación de venta
  ubicacion_venta: {
    type: String,
    enum: ['casa', 'centro_logistico'],
    required: true
  },
  
  // Estado del artículo
  estado: {
    type: String,
    enum: [
      'en_venta',
      'solicitud_compra_pendiente',
      'oferta_enviada',
      'vendido_a_comprador',
      'vendido_a_admin_dinero',
      'vendido_a_admin_puntos',
      'rechazado_por_admin',
      'rechazado_por_vendedor'
    ],
    default: 'en_venta'
  },
  
  // Gastos de envío
  gastos_envio_logistico_pagados_por: {
    type: String,
    enum: ['vendedor', 'comprador', 'admin'],
    default: 'vendedor'
  },
  precio_envio_logistico: { type: Number, default: 0 },
  
  gasto_envio_comprador_por: {
    type: String,
    enum: ['comprador_vendedor', 'venta_logistico', 'compra_empresa'],
    default: 'comprador_vendedor'
  },
  precio_envio_comprador: { type: Number, default: 0 },
  
  // Ofertas del administrador
  oferta_admin: {
    precio_ofertado: Number,
    puntos_ofertados: Number,
    tipo_oferta: {
      type: String,
      enum: ['dinero', 'puntos', 'ambos']
    },
    fecha_oferta: Date,
    estado_oferta: {
      type: String,
      enum: ['pendiente', 'aceptada', 'rechazada'],
      default: 'pendiente'
    },
    comentarios: String
  },
  
  // Información del centro logístico (si aplica)
  centro_logistico: {
    nombre: String,
    ubicacion: String,
    comision: { type: Number, default: 0.03 },
    costo_almacenamiento: { type: Number, default: 0 }
  }
}, { timestamps: true });

// Esquema de Ofertas del Administrador (colección separada para historial)
const OfertaAdminSchema = new mongoose.Schema({
  articulo_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Article', required: true },
  admin_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  precio_ofertado: Number,
  puntos_ofertados: Number,
  tipo_oferta: {
    type: String,
    enum: ['dinero', 'puntos', 'ambos'],
    required: true
  },
  estado_oferta: {
    type: String,
    enum: ['pendiente', 'aceptada', 'rechazada'],
    default: 'pendiente'
  },
  comentarios: String,
  fecha_respuesta: Date,
  respuesta_vendedor: {
    aceptada: Boolean,
    comentarios: String,
    fecha_respuesta: Date
  }
}, { timestamps: true });

// Esquema de Centros Logísticos
const CentroLogisticoSchema = new mongoose.Schema({
  nombre: { type: String, required: true },
  ubicacion: { type: String, required: true },
  direccion: String,
  telefono: String,
  email: String,
  capacidad: { type: Number, default: 100 },
  comision: { type: Number, default: 0.03 },
  costo_almacenamiento_diario: { type: Number, default: 5 },
  sectores_cubiertos: [String],
  coordenadas: {
    latitud: { type: Number, required: true },
    longitud: { type: Number, required: true }
  },
  isActive: { type: Boolean, default: true }
}, { timestamps: true });

// Crear modelos
const User = mongoose.model('User', UserSchema);
const Article = mongoose.model('Article', ArticleSchema);
const OfertaAdmin = mongoose.model('OfertaAdmin', OfertaAdminSchema);
const CentroLogistico = mongoose.model('CentroLogistico', CentroLogisticoSchema);

// ===== MIDDLEWARE DE AUTENTICACIÓN =====
const authMiddleware = (req, res, next) => {
  const authHeader = req.headers.authorization;
  
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({
      success: false,
      message: 'Token de acceso requerido'
    });
  }

  const token = authHeader.split(' ')[1];
  
  // Si es un token de admin, buscar el usuario admin
  if (token.startsWith('mongodb-admin-token-')) {
    User.findOne({ email: 'admin@trastalia.com' })
      .then(user => {
        if (user) {
          req.userId = user._id.toString();
          req.userRole = user.role;
          next();
        } else {
          res.status(401).json({
            success: false,
            message: 'Usuario administrador no encontrado'
          });
        }
      })
      .catch(error => {
        console.error('Error en middleware de auth (admin):', error);
        res.status(500).json({
          success: false,
          message: 'Error interno del servidor'
        });
      });
  } else {
    // Token de usuario normal
    User.findById(token.replace('mongodb-user-token-', ''))
      .then(user => {
        if (user) {
          req.userId = user._id.toString();
          req.userRole = user.role;
          next();
        } else {
          res.status(401).json({
            success: false,
            message: 'Token inválido'
          });
        }
      })
      .catch(error => {
        console.error('Error en middleware de auth (user):', error);
        res.status(500).json({
          success: false,
          message: 'Error interno del servidor'
        });
      });
  }
};

// ===== RUTAS DE AUTENTICACIÓN =====
app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    
    const user = await User.findOne({ email: email });
    
    if (user && user.password === password) {
      // Generar token diferente según el rol del usuario
      const token = user.role === 'admin' 
        ? 'mongodb-admin-token-' + Date.now()
        : 'mongodb-user-token-' + user._id.toString();
      
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
    const user = await User.findById(req.userId);
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

// ===== RUTAS DE ARTÍCULOS =====

// Crear artículo (OPCIÓN 1: Venta desde Casa)
app.post('/api/articles/venta-casa', authMiddleware, async (req, res) => {
  try {
    const {
      nombre,
      descripcion,
      categoria,
      precio_sugerido,
      condicion,
      ubicacion,
      fotos = [],
      tags = []
    } = req.body;

    const articleData = {
      nombre,
      descripcion,
      categoria,
      precio_sugerido,
      condicion,
      ubicacion,
      fotos,
      tags,
      vendedor_id: new mongoose.Types.ObjectId(req.userId),
      ubicacion_venta: 'casa',
      estado: 'en_venta',
      gasto_envio_comprador_por: 'comprador_vendedor',
      precio_envio_comprador: 0 // El comprador paga el envío
    };

    const article = new Article(articleData);
    await article.save();

    res.json({
      success: true,
      message: 'Artículo publicado para venta desde casa',
      data: article
    });
  } catch (error) {
    console.error('Error creando artículo venta casa:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor'
    });
  }
});

// Crear artículo (OPCIÓN 2: Venta desde Centro Logístico)
app.post('/api/articles/venta-centro-logistico', authMiddleware, async (req, res) => {
  try {
    const {
      nombre,
      descripcion,
      categoria,
      precio_sugerido,
      condicion,
      ubicacion,
      centro_logistico_id,
      fotos = [],
      tags = []
    } = req.body;

    // Buscar el centro logístico
    const centro = await CentroLogistico.findById(centro_logistico_id);
    if (!centro) {
      return res.status(404).json({
        success: false,
        message: 'Centro logístico no encontrado'
      });
    }

    const articleData = {
      nombre,
      descripcion,
      categoria,
      precio_sugerido,
      condicion,
      ubicacion,
      fotos,
      tags,
      vendedor_id: new mongoose.Types.ObjectId(req.userId),
      ubicacion_venta: 'centro_logistico',
      estado: 'en_venta',
      gastos_envio_logistico_pagados_por: 'vendedor',
      precio_envio_logistico: 0, // Se calcula según la distancia
      centro_logistico: {
        nombre: centro.nombre,
        ubicacion: centro.ubicacion,
        comision: centro.comision,
        costo_almacenamiento: centro.costo_almacenamiento_diario
      }
    };

    const article = new Article(articleData);
    await article.save();

    res.json({
      success: true,
      message: 'Artículo publicado para venta desde centro logístico',
      data: article
    });
  } catch (error) {
    console.error('Error creando artículo centro logístico:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor'
    });
  }
});

// Crear solicitud de compra por parte del administrador
app.post('/api/articles/solicitud-compra-admin', authMiddleware, async (req, res) => {
  try {
    const {
      nombre,
      descripcion,
      categoria,
      precio_sugerido,
      condicion,
      ubicacion,
      centro_logistico_id,
      tipo_solicitud = [],
      fotos = [],
      tags = []
    } = req.body;

    // Buscar el centro logístico
    const centro = await CentroLogistico.findById(centro_logistico_id);
    if (!centro) {
      return res.status(404).json({
        success: false,
        message: 'Centro logístico no encontrado'
      });
    }

    const articleData = {
      nombre,
      descripcion,
      categoria,
      precio_sugerido,
      condicion,
      ubicacion,
      fotos,
      tags,
      vendedor_id: new mongoose.Types.ObjectId(req.userId),
      ubicacion_venta: 'centro_logistico',
      estado: 'solicitud_compra_pendiente',
      gastos_envio_logistico_pagados_por: 'admin',
      precio_envio_logistico: 0,
      centro_logistico: {
        nombre: centro.nombre,
        ubicacion: centro.ubicacion,
        comision: centro.comision,
        costo_almacenamiento: centro.costo_almacenamiento_diario
      }
    };

    const article = new Article(articleData);
    await article.save();

    // Crear mensaje personalizado según el tipo de solicitud
    let message = 'Solicitud creada. El administrador revisará tu artículo.';
    if (tipo_solicitud.includes('dinero') && tipo_solicitud.includes('puntos')) {
      message = 'Solicitud de compra e intercambio por puntos creada. El administrador revisará tu artículo.';
    } else if (tipo_solicitud.includes('dinero')) {
      message = 'Solicitud de compra creada. El administrador revisará tu artículo.';
    } else if (tipo_solicitud.includes('puntos')) {
      message = 'Solicitud de intercambio por puntos creada. El administrador revisará tu artículo.';
    }

    res.json({
      success: true,
      message: message,
      data: article
    });
  } catch (error) {
    console.error('Error creando solicitud compra admin:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor'
    });
  }
});

// Obtener todos los artículos
app.get('/api/articles', authMiddleware, async (req, res) => {
  try {
    const articles = await Article.find()
      .populate('vendedor_id', 'name email points logisticsLevel reputation')
      .populate('comprador_id', 'name email')
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      data: articles
    });
  } catch (error) {
    console.error('Error obteniendo artículos:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor'
    });
  }
});

// Obtener artículos del usuario
app.get('/api/articles/mis-articulos', authMiddleware, async (req, res) => {
  try {
    const articles = await Article.find({ vendedor_id: new mongoose.Types.ObjectId(req.userId) })
      .populate('vendedor_id', 'name email points logisticsLevel reputation')
      .populate('comprador_id', 'name email')
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      data: articles
    });
  } catch (error) {
    console.error('Error obteniendo mis artículos:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor'
    });
  }
});

// Obtener solicitudes de compra pendientes (para admin)
app.get('/api/articles/solicitudes-pendientes', authMiddleware, async (req, res) => {
  try {
    if (req.userRole !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Solo los administradores pueden ver solicitudes pendientes'
      });
    }

    const articles = await Article.find({ estado: 'solicitud_compra_pendiente' })
      .populate('vendedor_id', 'name email points logisticsLevel reputation')
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      data: articles
    });
  } catch (error) {
    console.error('Error obteniendo solicitudes pendientes:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor'
    });
  }
});

// ===== RUTAS DE OFERTAS DEL ADMINISTRADOR =====

// Crear oferta del administrador
app.post('/api/ofertas-admin', authMiddleware, async (req, res) => {
  try {
    if (req.userRole !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Solo los administradores pueden crear ofertas'
      });
    }

    const {
      articulo_id,
      precio_ofertado,
      puntos_ofertados,
      tipo_oferta,
      comentarios
    } = req.body;

    // Verificar que el artículo existe y está en solicitud pendiente
    const article = await Article.findById(articulo_id);
    if (!article) {
      return res.status(404).json({
        success: false,
        message: 'Artículo no encontrado'
      });
    }

    if (article.estado !== 'solicitud_compra_pendiente') {
      return res.status(400).json({
        success: false,
        message: 'El artículo no está en estado de solicitud pendiente'
      });
    }

    // Crear la oferta
    const ofertaData = {
      articulo_id,
      admin_id: req.userId,
      precio_ofertado,
      puntos_ofertados,
      tipo_oferta,
      comentarios
    };

    const oferta = new OfertaAdmin(ofertaData);
    await oferta.save();

    // Actualizar el artículo con la oferta y cambiar el estado
    article.oferta_admin = {
      precio_ofertado,
      puntos_ofertados,
      tipo_oferta,
      fecha_oferta: new Date(),
      estado_oferta: 'pendiente',
      comentarios
    };
    
    // Cambiar el estado del artículo a "oferta_enviada"
    article.estado = 'oferta_enviada';

    await article.save();

    res.json({
      success: true,
      message: 'Oferta creada exitosamente',
      data: oferta
    });
  } catch (error) {
    console.error('Error creando oferta admin:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor'
    });
  }
});

// Responder a oferta del administrador (vendedor)
app.put('/api/ofertas-admin/:id/respuesta', authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;
    const { aceptada, comentarios } = req.body;

    const oferta = await OfertaAdmin.findById(id);
    if (!oferta) {
      return res.status(404).json({
        success: false,
        message: 'Oferta no encontrada'
      });
    }

    // Verificar que el usuario es el vendedor del artículo
    const article = await Article.findById(oferta.articulo_id);
    if (article.vendedor_id.toString() !== req.userId) {
      return res.status(403).json({
        success: false,
        message: 'No tienes permisos para responder a esta oferta'
      });
    }

    // Actualizar la oferta
    oferta.estado_oferta = aceptada ? 'aceptada' : 'rechazada';
    oferta.respuesta_vendedor = {
      aceptada,
      comentarios,
      fecha_respuesta: new Date()
    };
    await oferta.save();

    // Actualizar el artículo
    if (aceptada) {
      article.estado = oferta.tipo_oferta === 'dinero' ? 'vendido_a_admin_dinero' : 'vendido_a_admin_puntos';
      article.comprador_id = oferta.admin_id;
      article.oferta_admin.estado_oferta = 'aceptada';
    } else {
      article.estado = 'rechazado_por_vendedor';
      article.oferta_admin.estado_oferta = 'rechazada';
    }

    await article.save();

    res.json({
      success: true,
      message: aceptada ? 'Oferta aceptada' : 'Oferta rechazada',
      data: oferta
    });
  } catch (error) {
    console.error('Error respondiendo oferta:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor'
    });
  }
});

// ===== RUTAS DE CENTROS LOGÍSTICOS =====
app.get('/api/centros-logisticos', async (req, res) => {
  try {
    const centros = await CentroLogistico.find({ isActive: true });
    res.json({
      success: true,
      data: centros
    });
  } catch (error) {
    console.error('Error obteniendo centros logísticos:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor'
    });
  }
});

// ===== RUTAS DE ESTADÍSTICAS =====
app.get('/api/admin/dashboard-stats', authMiddleware, async (req, res) => {
  try {
    if (req.userRole !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Solo los administradores pueden acceder a las estadísticas'
      });
    }

    // Estadísticas de artículos
    const totalArticles = await Article.countDocuments();
    const articlesEnVenta = await Article.countDocuments({ estado: 'en_venta' });
    const articlesVendidos = await Article.countDocuments({ 
      estado: { $in: ['vendido_a_comprador', 'vendido_a_admin_dinero', 'vendido_a_admin_puntos'] } 
    });
    const solicitudesPendientes = await Article.countDocuments({ estado: 'solicitud_compra_pendiente' });

    // Estadísticas de usuarios
    const totalUsers = await User.countDocuments();
    const activeUsers = await User.countDocuments({ isActive: true });
    const adminUsers = await User.countDocuments({ role: 'admin' });

    // Estadísticas de ofertas
    const totalOfertas = await OfertaAdmin.countDocuments();
    const ofertasPendientes = await OfertaAdmin.countDocuments({ estado_oferta: 'pendiente' });
    const ofertasAceptadas = await OfertaAdmin.countDocuments({ estado_oferta: 'aceptada' });

    res.json({
      success: true,
      data: {
        articles: {
          total: totalArticles,
          enVenta: articlesEnVenta,
          vendidos: articlesVendidos,
          solicitudesPendientes: solicitudesPendientes
        },
        users: {
          total: totalUsers,
          active: activeUsers,
          admins: adminUsers
        },
        ofertas: {
          total: totalOfertas,
          pendientes: ofertasPendientes,
          aceptadas: ofertasAceptadas
        }
      }
    });
  } catch (error) {
    console.error('Error obteniendo estadísticas:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor'
    });
  }
});

// ===== RUTAS DE LIMPIEZA (SOLO PARA DESARROLLO) =====
app.delete('/api/clear-all', async (req, res) => {
  try {
    await Article.deleteMany({});
    await OfertaAdmin.deleteMany({});
    await CentroLogistico.deleteMany({});
    
    res.json({
      success: true,
      message: 'Todas las colecciones han sido limpiadas'
    });
  } catch (error) {
    console.error('Error limpiando datos:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor'
    });
  }
});

// ===== RUTA PARA OBTENER SOLICITUDES DE COMPRA DEL USUARIO =====

// Obtener solicitudes de compra del usuario (artículos con ofertas enviadas)
app.get('/api/articles/my-purchase-requests', authMiddleware, async (req, res) => {
  try {
    // Buscar artículos del usuario que tienen ofertas enviadas
    const articles = await Article.find({
      vendedor_id: new mongoose.Types.ObjectId(req.userId),
      estado: 'oferta_enviada'
    }).populate('vendedor_id', 'name email points logisticsLevel reputation');

    res.json({
      success: true,
      data: articles
    });
  } catch (error) {
    console.error('Error obteniendo solicitudes de compra:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor'
    });
  }
});

// ===== RUTA PARA OBTENER COMPRAS CON DINERO DEL USUARIO =====

// Obtener compras con dinero del usuario
app.get('/api/articles/my-purchases', authMiddleware, async (req, res) => {
  try {
    // Buscar artículos comprados por el usuario con dinero
    const articles = await Article.find({
      comprador_id: new mongoose.Types.ObjectId(req.userId),
      estado: 'vendido_a_comprador',
      'oferta_admin.tipo_oferta': 'dinero'
    }).populate('vendedor_id', 'name email points logisticsLevel reputation')
      .populate('comprador_id', 'name email points logisticsLevel reputation');

    res.json({
      success: true,
      data: articles
    });
  } catch (error) {
    console.error('Error obteniendo compras con dinero:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor'
    });
  }
});

// ===== RUTA PARA OBTENER CANJES POR PUNTOS DEL USUARIO =====

// Obtener canjes por puntos del usuario (compras con puntos)
app.get('/api/articles/point-exchanges', authMiddleware, async (req, res) => {
  try {
    // Buscar artículos comprados por el usuario con puntos
    const articles = await Article.find({
      comprador_id: new mongoose.Types.ObjectId(req.userId),
      estado: 'vendido_a_comprador',
      'oferta_admin.tipo_oferta': 'puntos'
    }).populate('vendedor_id', 'name email points logisticsLevel reputation')
      .populate('comprador_id', 'name email points logisticsLevel reputation');

    res.json({
      success: true,
      data: articles
    });
  } catch (error) {
    console.error('Error obteniendo canjes por puntos:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor'
    });
  }
});

// ===== RUTA PARA OBTENER ARTÍCULOS VENDIDOS DEL USUARIO =====

// Obtener artículos vendidos por el usuario
app.get('/api/articles/sold-articles', authMiddleware, async (req, res) => {
  try {
    // Buscar artículos vendidos por el usuario (tanto a usuarios como al admin)
    const articles = await Article.find({
      vendedor_id: new mongoose.Types.ObjectId(req.userId),
      estado: { $in: ['vendido_a_comprador', 'vendido_a_admin_dinero', 'vendido_a_admin_puntos'] }
    }).populate('vendedor_id', 'name email points logisticsLevel reputation')
      .populate('comprador_id', 'name email points logisticsLevel reputation');

    res.json({
      success: true,
      data: articles
    });
  } catch (error) {
    console.error('Error obteniendo artículos vendidos:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor'
    });
  }
});

// Aceptar oferta del administrador
app.put('/api/articles/accept-offer/:id', authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;
    const { tipo_aceptado } = req.body; // 'dinero' o 'puntos'

    const article = await Article.findById(id);
    if (!article) {
      return res.status(404).json({
        success: false,
        message: 'Artículo no encontrado'
      });
    }

    // Verificar que el usuario es el vendedor
    if (article.vendedor_id.toString() !== req.userId) {
      return res.status(403).json({
        success: false,
        message: 'No tienes permisos para aceptar esta oferta'
      });
    }

    // Verificar que el artículo tiene una oferta pendiente
    if (!article.oferta_admin || article.oferta_admin.estado_oferta !== 'pendiente') {
      return res.status(400).json({
        success: false,
        message: 'No hay una oferta pendiente para este artículo'
      });
    }

    // Actualizar el estado de la oferta
    article.oferta_admin.estado_oferta = 'aceptada';
    article.oferta_admin.tipo_aceptado = tipo_aceptado;
    article.oferta_admin.fecha_respuesta = new Date();

    // Cambiar el estado del artículo según el tipo aceptado
    if (tipo_aceptado === 'dinero') {
      article.estado = 'vendido_a_admin_dinero';
    } else if (tipo_aceptado === 'puntos') {
      article.estado = 'vendido_a_admin_puntos';
    }

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
      message: 'Error interno del servidor'
    });
  }
});

// Rechazar oferta del administrador
app.put('/api/articles/reject-offer/:id', authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;
    const { comentarios } = req.body;

    const article = await Article.findById(id);
    if (!article) {
      return res.status(404).json({
        success: false,
        message: 'Artículo no encontrado'
      });
    }

    // Verificar que el usuario es el vendedor
    if (article.vendedor_id.toString() !== req.userId) {
      return res.status(403).json({
        success: false,
        message: 'No tienes permisos para rechazar esta oferta'
      });
    }

    // Verificar que el artículo tiene una oferta pendiente
    if (!article.oferta_admin || article.oferta_admin.estado_oferta !== 'pendiente') {
      return res.status(400).json({
        success: false,
        message: 'No hay una oferta pendiente para este artículo'
      });
    }

    // Actualizar el estado de la oferta
    article.oferta_admin.estado_oferta = 'rechazada';
    article.oferta_admin.comentarios_rechazo = comentarios;
    article.oferta_admin.fecha_respuesta = new Date();

    // Volver el artículo al estado de solicitud pendiente
    article.estado = 'solicitud_compra_pendiente';

    await article.save();

    res.json({
      success: true,
      message: 'Oferta rechazada exitosamente',
      data: article
    });
  } catch (error) {
    console.error('Error rechazando oferta:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor'
    });
  }
});

// Iniciar servidor
app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Servidor con nueva lógica ejecutándose en puerto ${PORT}`);
  console.log(`🔗 API: http://localhost:${PORT}/api`);
  console.log(`💾 Almacenamiento: MongoDB Atlas`);
  console.log(`🔑 Login: admin@trastalia.com / admin123456`);
  console.log(`✅ Conectado a MongoDB Atlas`);
});
