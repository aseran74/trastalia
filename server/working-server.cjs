// Cargar variables de entorno
require('dotenv').config();

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const passport = require('passport');
const session = require('express-session');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const app = express();
const PORT = process.env.PORT || 3002;

// Middleware
app.use(cors({
  origin: [
    'http://localhost:5173', 
    'http://localhost:3000',
    'https://trastalia.vercel.app',
    'https://*.vercel.app'
  ],
  credentials: true
}));

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Configuración de sesiones
app.use(session({
  secret: process.env.SESSION_SECRET || 'trastalia-session-secret-2024',
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: false, // Cambiar a true en producción con HTTPS
    maxAge: 24 * 60 * 60 * 1000 // 24 horas
  }
}));

// Configuración de Passport
app.use(passport.initialize());
app.use(passport.session());

// Configuración de Google OAuth (solo para desarrollo local)
if (process.env.NODE_ENV !== 'production' && process.env.GOOGLE_CLIENT_ID) {
  passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: process.env.GOOGLE_CALLBACK_URL || "http://localhost:3002/auth/google/callback"
  },
async (accessToken, refreshToken, profile, done) => {
  try {
    console.log('🔍 Google OAuth - Perfil recibido:', profile.id);
    
    // Buscar usuario existente por Google ID o email
    let user = await User.findOne({ 
      $or: [
        { googleId: profile.id },
        { email: profile.emails[0].value }
      ]
    });

    if (user) {
      // Usuario existe, actualizar Google ID si no lo tiene
      if (!user.googleId) {
        user.googleId = profile.id;
        user.avatar = profile.photos[0]?.value || user.avatar;
        await user.save();
      }
      console.log('✅ Usuario existente encontrado:', user.email);
      return done(null, user);
    } else {
      // Crear nuevo usuario
      user = new User({
        googleId: profile.id,
        name: profile.displayName,
        email: profile.emails[0].value,
        avatar: profile.photos[0]?.value || '',
        role: 'user',
        isActive: true,
        points: 100, // Puntos de bienvenida
        lastLogin: new Date()
      });

      await user.save();
      console.log('✅ Nuevo usuario creado:', user.email);
      return done(null, user);
    }
  } catch (error) {
    console.error('❌ Error en Google OAuth:', error);
    return done(error, null);
  }
  }));
} else {
  console.log('⚠️ Google OAuth deshabilitado en producción');
}

// Serialización del usuario para la sesión
passport.serializeUser((user, done) => {
  done(null, user._id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id);
    done(null, user);
  } catch (error) {
    done(error, null);
  }
});

// Conectar a MongoDB
const MONGODB_URI = 'mongodb+srv://mikabodea:Mika1974%26@trastalia.ycg2lvb.mongodb.net/trastalia?retryWrites=true&w=majority&appName=Trastalia';

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
  googleId: String, // ID de Google OAuth
  role: { type: String, default: 'user' },
  avatar: String,
  isActive: { type: Boolean, default: true },
  lastLogin: Date,
  points: { type: Number, default: 0 },
  logisticsLevel: String,
  reputation: { type: Number, default: 0 }
}, { timestamps: true });

const ArticleSchema = new mongoose.Schema({
  // Campos básicos del artículo según el guion
  nombre: { type: String, required: true },
  descripcion: { type: String, required: true },
  categoria: { type: String, required: true },
  fotos: [String],
  precio_propuesto_vendedor: { type: Number, required: true },
  
  // Identificación del vendedor
  id_vendedor: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  
  // Identificación del comprador
  comprador: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  comprador_tipo: { type: String, enum: ['usuario', 'admin'] },
  
  // Estado del artículo según el guion
  estado_articulo: { 
    type: String, 
    enum: [
      'DRAFT', 
      'EN_VENTA', 
      'EN_LOGISTICA', 
      'PENDIENTE_APROBACION_ADMIN', 
      'OFERTA_COMPRA_ENVIADA', 
      'COMPRADO_POR_ADMIN', 
      // Estados de transferencia a Trastalia (artículo sigue en tienda)
      'TRASPASADO_A_TRASTALIA_POR_PUNTOS',
      'TRASPASADO_A_TRASTALIA_POR_DINERO',
      // Estado pendiente de valoración de precio para tienda
      'PENDIENTE_VALORACION_PRECIO_TIENDA',
      // Estados de venta final (artículo desaparece de tienda)
      'VENDIDO_PUNTOS',
      'VENDIDO_DINERO',
      // Estados de seguimiento de envío
      'ENVIADO',
      'ENTREGADO',
      'RECHAZADO_ENVIO',
      'EN_GALERIA_APTOS', 
      'VENDIDO', 
      'RECHAZADO'
    ], 
    default: 'DRAFT' 
  },
  
  // Modo de venta principal
  modo_venta: { 
    type: String, 
    enum: ['venta_desde_casa', 'venta_desde_centro_logistico'], 
    required: true 
  },
  
  // Tipo de paquete para envío y logística
  tipo_paquete: {
    type: String,
    enum: ['CAJA_PEQUEÑA', 'CAJA_MEDIANA', 'CAJA_GRANDE', 'CAJA_EXTRA_GRANDE', 'CAJA_ESTRECHA', 'CAJA_CUBICA'],
    required: true
  },
  
  // Dimensiones del paquete (opcional, para cálculos más precisos)
  dimensiones_paquete: {
    peso: { type: Number }, // en kg
    horizontal: { type: Number }, // en cm (largo)
    vertical: { type: Number }, // en cm (ancho)
    fondo: { type: Number }   // en cm (alto)
  },
  
  // Campos específicos para centro logístico
  opciones_logisticas: [{ 
    type: String, 
    enum: ['guardamos_hasta_vender', 'quieres_que_te_lo_compremos', 'compra_directa', 'intercambio_puntos'] 
  }],
  acepta_descuento_admin: { type: Boolean, default: false },
  fecha_entrada_logistica: Date,
  precio_compra_admin: Number,
  
  // Campos adicionales para funcionalidad
  ubicacion: String,
  condicion: { 
    type: String, 
    enum: ['nuevo', 'excelente', 'bueno', 'regular', 'usado'], 
    default: 'bueno' 
  },
  tags: [String],
  views: { type: Number, default: 0 },
  
  // Nave logística asignada
  nave_logistica: String,
  ubicacion_nave: String,
  
  // Decisiones del administrador
  decision_admin: {
    tipo: { type: String, enum: ['compra_directa', 'intercambio_puntos', 'rechazo'] },
    precio_ofertado: Number,
    puntos_ofertados: Number,
    motivo_rechazo: String,
    fecha_decision: Date
  },

  // Decisión del administrador (nuevo formato)
  adminDecision: {
    money: { type: Boolean, default: false },
    points: { type: Boolean, default: false },
    moneyPrice: { type: Number, default: 0 },
    pointsAmount: { type: Number, default: 0 },
    reject: { type: Boolean, default: false },
    rejectReason: String,
    date: Date,
    selectedOption: { type: String, enum: ['money', 'points'] },
    finalPrice: { type: Number, default: 0 },
    finalPoints: { type: Number, default: 0 }
  },
  
  // Respuesta del vendedor
  respuesta_vendedor: {
    aceptado: Boolean,
    fecha_respuesta: Date,
    motivo_rechazo: String
  },
  
  // Comisiones y tarifas
  comision_venta: { type: Number, default: 0.03 }, // 3% por defecto
  tarifa_tiempo: Number,
  dias_en_logistica: Number,
  
  // Puntos para intercambio
  puntos_intercambio: Number,
  puntos_acreditados: { type: Boolean, default: false },
  
  // Campos de compatibilidad con el sistema actual
  title: String, // Alias para compatibilidad
  description: String, // Alias para compatibilidad
  price: Number, // Alias para compatibilidad
  category: String, // Alias para compatibilidad
  condition: String, // Alias para compatibilidad
  images: [String], // Alias para compatibilidad
  seller: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, // Alias para compatibilidad
  location: String, // Alias para compatibilidad
  saleMode: String, // Alias para compatibilidad
  adminStatus: { type: String, default: 'pending' }, // Alias para compatibilidad
  logisticsShip: String, // Alias para compatibilidad
  logisticsShipLocation: String // Alias para compatibilidad
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

// Función para asignar nave logística más cercana
const assignClosestLogisticsShip = (location) => {
  const ships = [
    { name: 'Nave Estelar Alpha', sectors: ['Madrid', 'Toledo', 'Guadalajara'], capacity: 100 },
    { name: 'Nave Comercial Beta', sectors: ['Barcelona', 'Tarragona', 'Lleida'], capacity: 80 },
    { name: 'Nave Carguera Gamma', sectors: ['Valencia', 'Alicante', 'Castellón'], capacity: 120 },
    { name: 'Nave Transporte Delta', sectors: ['Sevilla', 'Córdoba', 'Cádiz'], capacity: 90 },
    { name: 'Nave Logística Epsilon', sectors: ['Bilbao', 'San Sebastián', 'Vitoria'], capacity: 70 }
  ];

  // Buscar la nave que cubra la ubicación
  if (location) {
    for (const ship of ships) {
      for (const sector of ship.sectors) {
        if (location.toLowerCase().includes(sector.toLowerCase())) {
          return {
            ship: ship.name,
            location: `Sector ${sector}-${Math.floor(Math.random() * 5) + 1}`,
            capacity: ship.capacity
          };
        }
      }
    }
  }

  // Si no se encuentra una nave específica, asignar la nave con más capacidad disponible
  const defaultShip = ships.reduce((max, ship) => ship.capacity > max.capacity ? ship : max);
  return {
    ship: defaultShip.name,
    location: `Sector General-${Math.floor(Math.random() * 10) + 1}`,
    capacity: defaultShip.capacity
  };
};

// Rutas de Google OAuth (solo para desarrollo local)
if (process.env.NODE_ENV !== 'production') {
  app.get('/auth/google', passport.authenticate('google', {
    scope: ['profile', 'email']
  }));

  app.get('/auth/google/callback', 
    passport.authenticate('google', { failureRedirect: 'http://localhost:5173/test-signin?error=google_auth_failed' }),
    async (req, res) => {
    try {
      // Generar token para el usuario autenticado
      const token = req.user.role === 'admin' 
        ? 'mongodb-admin-token-' + Date.now()
        : 'mongodb-user-token-' + req.user._id.toString();
      
      // Actualizar último login
      req.user.lastLogin = new Date();
      await req.user.save();
      
      // Redirigir al frontend con el token
      const frontendUrl = process.env.NODE_ENV === 'production' 
        ? 'https://trastalia.vercel.app' 
        : 'http://localhost:5173';
      
      res.redirect(`${frontendUrl}/auth/callback?token=${token}&success=true`);
    } catch (error) {
      console.error('Error en callback de Google:', error);
      const frontendUrl = process.env.NODE_ENV === 'production' 
        ? 'https://trastalia.vercel.app' 
        : 'http://localhost:5173';
      res.redirect(`${frontendUrl}/test-signin?error=google_auth_failed`);
    }
  }
);

  // Ruta para obtener información del usuario autenticado con Google
  app.get('/api/auth/google/user', (req, res) => {
    if (req.isAuthenticated()) {
      res.json({
        success: true,
        data: {
          id: req.user._id,
          name: req.user.name,
          email: req.user.email,
          role: req.user.role,
          points: req.user.points,
          logisticsLevel: req.user.logisticsLevel,
          reputation: req.user.reputation,
          avatar: req.user.avatar
        }
      });
    } else {
      res.status(401).json({
        success: false,
        message: 'No autenticado'
      });
    }
  });
} // Fin del bloque if para Google OAuth

// Middleware de autenticación
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
          message: 'Error de autenticación'
        });
      });
  } else {
    // Para otros usuarios, extraer el ID del token
    // El token tiene formato: mongodb-user-token-{userId}
    if (token.startsWith('mongodb-user-token-')) {
      const userId = token.replace('mongodb-user-token-', '');
      User.findById(userId)
        .then(user => {
          if (user) {
            req.userId = user._id.toString();
            req.userRole = user.role;
            console.log('🔐 Middleware - Usuario autenticado:', {
              userId: req.userId,
              userRole: req.userRole,
              email: user.email
            });
            next();
          } else {
            res.status(401).json({
              success: false,
              message: 'Usuario no encontrado'
            });
          }
        })
        .catch(error => {
          console.error('Error en middleware de auth (usuario):', error);
          res.status(500).json({
            success: false,
            message: 'Error de autenticación'
          });
        });
    } else {
      // Token no válido
      res.status(401).json({
        success: false,
        message: 'Token no válido'
      });
    }
  }
};

// Rutas de autenticación
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
      message: 'Error en el servidor'
    });
  }
});

// Endpoint para crear/obtener usuario de Firebase en MongoDB
app.post('/api/auth/firebase-user', async (req, res) => {
  try {
    console.log('📥 Firebase user endpoint called with body:', req.body);
    
    const { uid, email, name, photoURL } = req.body;
    
    if (!uid || !email) {
      console.log('❌ Missing required fields:', { uid: !!uid, email: !!email });
      return res.status(400).json({
        success: false,
        message: 'UID y email son requeridos'
      });
    }
    
    console.log('🔍 Searching for user with googleId:', uid);
    
    // Buscar si el usuario ya existe por Firebase UID
    let user = await User.findOne({ googleId: uid });
    
    if (user) {
      console.log('✅ Usuario encontrado:', user.email);
      // Usuario ya existe, devolverlo
      const token = user.role === 'admin' 
        ? 'mongodb-admin-token-' + Date.now()
        : 'mongodb-user-token-' + user._id.toString();
      
      const response = {
        success: true,
        message: 'Usuario encontrado',
        data: {
          token: token,
          user: {
            id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
            points: user.points,
            logisticsLevel: user.logisticsLevel,
            reputation: user.reputation,
            avatar: user.avatar
          }
        }
      };
      
      console.log('📤 Sending existing user response');
      res.json(response);
    } else {
      console.log('🆕 Creating new user for:', email);
      // Crear nuevo usuario
      const newUser = new User({
        googleId: uid,
        name: name || email.split('@')[0],
        email: email,
        password: '', // Sin password para usuarios de Firebase
        role: 'user', // Por defecto
        points: 0,
        logisticsLevel: 1,
        reputation: 0,
        avatar: photoURL || '',
        createdAt: new Date(),
        updatedAt: new Date()
      });
      
      await newUser.save();
      
      const token = 'mongodb-user-token-' + newUser._id.toString();
      
      console.log('✅ Nuevo usuario de Firebase creado:', {
        uid: uid,
        email: email,
        name: name,
        mongoId: newUser._id
      });
      
      const response = {
        success: true,
        message: 'Usuario de Firebase creado exitosamente',
        data: {
          token: token,
          user: {
            id: newUser._id,
            name: newUser.name,
            email: newUser.email,
            role: newUser.role,
            points: newUser.points,
            logisticsLevel: newUser.logisticsLevel,
            reputation: newUser.reputation,
            avatar: newUser.avatar
          }
        }
      };
      
      console.log('📤 Sending new user response');
      res.json(response);
    }
  } catch (error) {
    console.error('❌ Error en firebase-user endpoint:', error);
    res.status(500).json({
      success: false,
      message: 'Error en el servidor',
      error: error.message
    });
  }
});

// Endpoint para obtener información de tipos de paquetes
app.get('/api/package-types', (req, res) => {
  try {
    const packageTypes = {
      CAJA_PEQUEÑA: {
        name: 'Caja Pequeña',
        description: 'Para artículos pequeños como libros, accesorios',
        dimensions: {
          horizontal: 24,  // cm (largo)
          vertical: 17,    // cm (ancho)  
          fondo: 8.7       // cm (alto)
        },
        maxWeight: 2, // kg
        shippingCost: 3.50, // €
        image: '/images/boxes/caja-pequena.svg',
        examples: ['Libros', 'Accesorios', 'Productos electrónicos pequeños', 'Joyería']
      },
      CAJA_MEDIANA: {
        name: 'Caja Mediana',
        description: 'Ideal para ropa, utensilios de cocina, productos electrónicos medianos',
        dimensions: {
          horizontal: 31.7, // cm (largo)
          vertical: 21.5,   // cm (ancho)
          fondo: 12.5       // cm (alto)
        },
        maxWeight: 5, // kg
        shippingCost: 4.50, // €
        image: '/images/boxes/caja-mediana.svg',
        examples: ['Ropa', 'Utensilios de cocina', 'Tablets', 'Zapatos']
      },
      CAJA_GRANDE: {
        name: 'Caja Grande',
        description: 'Para artículos más grandes como zapatos, decoraciones, pequeños electrodomésticos',
        dimensions: {
          horizontal: 39,   // cm (largo)
          vertical: 28,     // cm (ancho)
          fondo: 19         // cm (alto)
        },
        maxWeight: 10, // kg
        shippingCost: 6.50, // €
        image: '/images/boxes/caja-grande.svg',
        examples: ['Zapatos', 'Decoraciones', 'Pequeños electrodomésticos', 'Laptops']
      },
      CAJA_EXTRA_GRANDE: {
        name: 'Caja Extra Grande',
        description: 'Para artículos voluminosos como almohadas, mantas, equipos deportivos',
        dimensions: {
          horizontal: 50,   // cm (largo)
          vertical: 40,     // cm (ancho)
          fondo: 30         // cm (alto)
        },
        maxWeight: 20, // kg
        shippingCost: 12.00, // €
        image: '/images/boxes/caja-extra-grande.svg',
        examples: ['Almohadas', 'Mantas', 'Equipos deportivos', 'TV 32-43"']
      },
      CAJA_ESTRECHA: {
        name: 'Caja Estrecha',
        description: 'Para productos largos y estrechos como pósters, paraguas, componentes alargados',
        dimensions: {
          horizontal: 60,   // cm (largo)
          vertical: 15,     // cm (ancho)
          fondo: 15         // cm (alto)
        },
        maxWeight: 8, // kg
        shippingCost: 8.50, // €
        image: '/images/boxes/caja-estrecha.svg',
        examples: ['Pósters', 'Paraguas', 'Componentes electrónicos alargados', 'Raquetas']
      },
      CAJA_CUBICA: {
        name: 'Caja Cúbica',
        description: 'Para artículos que requieren espacio uniforme como lámparas, electrodomésticos cúbicos',
        dimensions: {
          horizontal: 30,   // cm (largo)
          vertical: 30,     // cm (ancho)
          fondo: 30         // cm (alto)
        },
        maxWeight: 15, // kg
        shippingCost: 10.00, // €
        image: '/images/boxes/caja-cubica.svg',
        examples: ['Lámparas de mesa', 'Electrodomésticos cúbicos', 'Cajas de herramientas', 'Monitores']
      }
    };

    res.json({
      success: true,
      data: packageTypes
    });
  } catch (error) {
    console.error('Error obteniendo tipos de paquetes:', error);
    res.status(500).json({
      success: false,
      message: 'Error obteniendo tipos de paquetes'
    });
  }
});

app.get('/api/auth/me', authMiddleware, async (req, res) => {
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
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        points: user.points,
        logisticsLevel: user.logisticsLevel,
        reputation: user.reputation
      }
    });
  } catch (error) {
    console.error('Error obteniendo usuario:', error);
    res.status(500).json({
      success: false,
      message: 'Error al obtener usuario'
    });
  }
});

// Rutas de artículos
app.get('/api/articles', async (req, res) => {
  try {
    const { adminStatus } = req.query;
    let query = {};
    
    // Si se especifica adminStatus, filtrar por ese campo
    if (adminStatus) {
      query.adminStatus = adminStatus;
    } else {
      // Si no hay filtro de adminStatus, mostrar artículos disponibles o sin status específico
      query.$or = [
        { status: 'disponible' },
        { status: { $exists: false } },
        { status: null }
      ];
    }
    
    const articles = await Article.find(query)
      .populate('seller', 'name email points logisticsLevel reputation')
      .populate('id_vendedor', 'name email points logisticsLevel reputation')
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

app.post('/api/articles', authMiddleware, async (req, res) => {
  try {
    const {
      // Nuevos campos según el guion
      nombre,
      descripcion,
      categoria,
      precio_propuesto_vendedor,
      condicion,
      ubicacion,
      modo_venta,
      opciones_logisticas,
      acepta_descuento_admin,
      estado_articulo,
      id_vendedor,
      
      // Campos de compatibilidad
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
    let initialAdminStatus = 'pending'; // SIEMPRE pendiente por defecto
    let initialEstadoArticulo = 'DRAFT';
    
    // NUEVA LÓGICA: Solo 2 casos se aprueban automáticamente
    // 1. Venta directa desde casa (sin centro logístico)
    if (modo_venta === 'venta_desde_casa' || saleMode === 'direct_from_home') {
      initialStatus = 'disponible';
      initialAdminStatus = 'approved_money'; // Aprobado automáticamente
      initialEstadoArticulo = 'EN_VENTA';
    }
    // 2. Solo gestión de venta en centro logístico (sin compra por Trastalia)
    else if ((modo_venta === 'venta_desde_centro_logistico' || saleMode === 'logistics_center') && 
             !trastaliaPurchase?.enabled && !pointsExchange?.enabled) {
      initialStatus = 'disponible';
      initialAdminStatus = 'approved_money'; // Aprobado automáticamente
      initialEstadoArticulo = 'EN_LOGISTICA';
    }
    // TODOS LOS DEMÁS CASOS quedan PENDIENTES de revisión del admin
    else {
      initialStatus = 'disponible';
      initialAdminStatus = 'pending'; // SIEMPRE pendiente
      initialEstadoArticulo = 'PENDIENTE_APROBACION_ADMIN';
    }

    // Asignar nave logística si es necesario
    let logisticsShipInfo = null;
    if (useLogisticsCenter || saleMode === 'logistics_center') {
      logisticsShipInfo = assignClosestLogisticsShip(location);
    }

    // Limpiar logisticsCenterSale si no tiene un centro válido
    let cleanLogisticsCenterSale = logisticsCenterSale;
    if (logisticsCenterSale && (!logisticsCenterSale.logisticsCenter || logisticsCenterSale.logisticsCenter === '')) {
      cleanLogisticsCenterSale = {
        ...logisticsCenterSale,
        logisticsCenter: undefined
      };
    }

    // Crear el artículo
    const article = new Article({
      // Nuevos campos según el guion
      nombre: nombre || title,
      descripcion: descripcion || description,
      categoria: categoria || category,
      precio_propuesto_vendedor: precio_propuesto_vendedor || price,
      condicion: condicion || condition,
      ubicacion: ubicacion || location,
      modo_venta: modo_venta || saleMode,
      opciones_logisticas: opciones_logisticas || [],
      acepta_descuento_admin: acepta_descuento_admin || false,
      estado_articulo: estado_articulo || initialEstadoArticulo,
      id_vendedor: id_vendedor || req.userId,
      
      // Campos de paquete
      tipo_paquete: req.body.tipo_paquete,
      dimensiones_paquete: req.body.dimensiones_paquete,
      
      // Campos de compatibilidad
      title: nombre || title,
      description: descripcion || description,
      price: precio_propuesto_vendedor || price,
      pointsPrice,
      category: categoria || category,
      condition: condicion || condition,
      images: images || [],
      seller: req.userId,
      status: initialStatus,
      isForSale,
      isForExchange,
      exchangeFor,
      location: ubicacion || location,
      tags: tags || [],
      views: 0,
      saleMode: modo_venta || saleMode,
      directFromHome,
      logisticsCenterSale: cleanLogisticsCenterSale,
      trastaliaPurchase,
      pointsExchange,
      useLogisticsCenter,
      adminStatus: initialAdminStatus,
      sellerAccepted: false,
      sellerRejected: false,
      logisticsShip: logisticsShipInfo?.ship || null,
      logisticsShipLocation: logisticsShipInfo?.location || null
    });

    const savedArticle = await article.save();
    await savedArticle.populate('seller', 'name email points logisticsLevel reputation');

    res.status(201).json({
      success: true,
      message: 'Artículo creado exitosamente',
      data: savedArticle
    });
  } catch (error) {
    console.error('Error creando artículo:', error);
    res.status(500).json({
      success: false,
      message: 'Error al crear el artículo'
    });
  }
});

// Endpoint para subir fotos (temporalmente sin autenticación para testing)
app.post('/api/upload-photo', async (req, res) => {
  try {
    // Por ahora, simulamos la subida de fotos
    // En un entorno real, aquí subirías a un servicio como AWS S3, Cloudinary, etc.
    const photoUrl = `https://via.placeholder.com/400x300/cccccc/666666?text=Foto+${Date.now()}`;
    
    res.json({
      success: true,
      url: photoUrl,
      message: 'Foto subida exitosamente'
    });
  } catch (error) {
    console.error('Error subiendo foto:', error);
    res.status(500).json({
      success: false,
      message: 'Error al subir la foto'
    });
  }
});

// Ruta para obtener los artículos del usuario
app.get('/api/articles/my-articles', authMiddleware, async (req, res) => {
  try {
    const articles = await Article.find({ 
      'seller': req.userId
    }).populate('seller', 'name email');
    
    res.json({
      success: true,
      data: articles
    });
  } catch (error) {
    console.error('Error obteniendo artículos del usuario:', error);
    res.status(500).json({
      success: false,
      message: 'Error al obtener los artículos del usuario'
    });
  }
});

// Ruta específica para solicitudes de compra (debe ir antes de la ruta genérica)
app.get('/api/articles/my-purchase-requests', authMiddleware, async (req, res) => {
  try {
    const articles = await Article.find({ 
      $and: [
        { 'id_vendedor': req.userId },
        { sellerAccepted: { $ne: true } },
        { sellerRejected: { $ne: true } },
        {
          $or: [
            // Artículos con ofertas del administrador pendientes
            {
              'oferta_admin.estado_oferta': 'pendiente'
            },
            // Artículos con adminDecision pendientes (compatibilidad)
            {
              'adminDecision.reject': false,
              'adminDecision.money': true,
              'adminDecision.selectedOption': { $exists: false }
            }
          ]
        }
      ]
    })
      .populate('id_vendedor', 'name email points logisticsLevel reputation')
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

// Ruta para aceptar oferta de compra
app.post('/api/articles/accept-offer', authMiddleware, async (req, res) => {
  try {
    const { articleId, selectedOption } = req.body; // selectedOption: 'money' o 'points'
    
    if (!articleId) {
      return res.status(400).json({
        success: false,
        message: 'ID del artículo es requerido'
      });
    }

    if (!selectedOption) {
      return res.status(400).json({
        success: false,
        message: 'Debes seleccionar una opción de compra (dinero o puntos)'
      });
    }

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

    // Verificar que la opción seleccionada está disponible
    if (!article.adminDecision) {
      return res.status(400).json({
        success: false,
        message: 'No hay decisión del administrador disponible'
      });
    }

    if (selectedOption === 'money' && !article.adminDecision.money) {
      return res.status(400).json({
        success: false,
        message: 'La opción de dinero no está disponible en esta oferta'
      });
    }

    if (selectedOption === 'points' && !article.adminDecision.points) {
      return res.status(400).json({
        success: false,
        message: 'La opción de puntos no está disponible en esta oferta'
      });
    }

    // Obtener el vendedor para actualizar sus puntos si selecciona puntos
    const seller = await User.findById(req.userId);
    if (!seller) {
      return res.status(404).json({
        success: false,
        message: 'Vendedor no encontrado'
      });
    }

    // Actualizar puntos del vendedor si selecciona puntos
    if (selectedOption === 'points' && article.adminDecision.points) {
      // SUMAR puntos porque el usuario está VENDIENDO el artículo a Trastalia
      seller.points = (seller.points || 0) + article.adminDecision.pointsAmount;
      await seller.save();
    }

    // Obtener el ID del administrador
    const adminUser = await User.findOne({ role: 'admin' });
    if (!adminUser) {
      return res.status(500).json({
        success: false,
        message: 'Error: Usuario administrador no encontrado'
      });
    }

    // Determinar el estado según la opción seleccionada
    let estadoArticulo;
    if (selectedOption === 'money') {
      estadoArticulo = 'TRASPASADO_A_TRASTALIA_POR_DINERO';
    } else {
      estadoArticulo = 'TRASPASADO_A_TRASTALIA_POR_PUNTOS';
    }
    
    // Después de transferir, el artículo debe pasar a estado pendiente de valoración
    const estadoFinal = 'PENDIENTE_VALORACION_PRECIO_TIENDA';

    // Actualizar el artículo - Transferir a Trastalia y marcar como pendiente de valoración
    const updatedArticle = await Article.findByIdAndUpdate(
      articleId,
      {
        sellerAccepted: true,
        sellerAcceptedDate: new Date(),
        status: 'comprado_por_trastalia',
        estado_articulo: estadoFinal, // Usar el estado final pendiente de valoración
        // Transferir propiedad al administrador
        id_vendedor: adminUser._id,
        seller: adminUser._id,
        'adminDecision.selectedOption': selectedOption,
        'adminDecision.finalPrice': selectedOption === 'money' ? article.adminDecision.moneyPrice : 0,
        'adminDecision.finalPoints': selectedOption === 'points' ? article.adminDecision.pointsAmount : 0,
        // Marcar como transferido a Trastalia
        transferido_a_trastalia: true,
        fecha_transferencia: new Date(),
        // Agregar campos para identificar el comprador (Trastalia)
        comprador: adminUser._id,
        comprador_tipo: 'admin',
        // Agregar información de la transferencia original
        transferencia_original: {
          tipo: selectedOption,
          precio: selectedOption === 'money' ? article.adminDecision.moneyPrice : 0,
          puntos: selectedOption === 'points' ? article.adminDecision.pointsAmount : 0,
          fecha: new Date()
        }
      },
      { new: true }
    ).populate('seller', 'name email points logisticsLevel reputation');

    res.json({
      success: true,
      message: selectedOption === 'money' 
        ? `Oferta aceptada exitosamente. Procedemos a efectuarle el ingreso de ${article.adminDecision.moneyPrice}€ en 24 horas, lo tendrá en su cuenta. El artículo ahora es propiedad de Trastalia y estará disponible en nuestra tienda.`
        : `Oferta aceptada exitosamente. Se han acreditado ${article.adminDecision.pointsAmount} puntos a tu balance. El artículo ahora es propiedad de Trastalia y estará disponible en nuestra tienda.`,
      data: updatedArticle
    });
  } catch (error) {
    console.error('Error aceptando oferta:', error);
    res.status(500).json({
      success: false,
      message: 'Error al aceptar la oferta'
    });
  }
});

// Ruta para que el admin valore el precio de venta en tienda
app.post('/api/articles/set-store-price', authMiddleware, async (req, res) => {
  try {
    const { articleId, storePrice, storePoints } = req.body;
    
    if (req.userRole !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Solo los administradores pueden valorar precios de tienda'
      });
    }
    
    if (!articleId) {
      return res.status(400).json({
        success: false,
        message: 'ID del artículo es requerido'
      });
    }
    
    if (!storePrice && !storePoints) {
      return res.status(400).json({
        success: false,
        message: 'Debe especificar al menos un precio de venta (dinero o puntos)'
      });
    }
    
    const article = await Article.findById(articleId);
    if (!article) {
      return res.status(404).json({
        success: false,
        message: 'Artículo no encontrado'
      });
    }
    
    if (article.estado_articulo !== 'PENDIENTE_VALORACION_PRECIO_TIENDA') {
      return res.status(400).json({
        success: false,
        message: 'Este artículo no está pendiente de valoración de precio'
      });
    }
    
    // Actualizar el artículo con los precios de tienda
    const updatedArticle = await Article.findByIdAndUpdate(
      articleId,
      {
        estado_articulo: 'COMPRADO_POR_ADMIN', // Volver al estado de disponible en tienda
        // Precios de venta en tienda
        precio_venta_tienda: storePrice || 0,
        puntos_venta_tienda: storePoints || 0,
        // Fecha de valoración
        fecha_valoracion_tienda: new Date(),
        // Actualizar adminDecision con precios finales de tienda
        'adminDecision.storePrice': storePrice || 0,
        'adminDecision.storePoints': storePoints || 0,
        'adminDecision.storePriceSet': true,
        'adminDecision.storePriceDate': new Date()
      },
      { new: true }
    ).populate('seller', 'name email points logisticsLevel reputation');
    
    res.json({
      success: true,
      message: 'Precio de tienda establecido correctamente. El artículo ya está disponible para la venta.',
      data: updatedArticle
    });
  } catch (error) {
    console.error('Error estableciendo precio de tienda:', error);
    res.status(500).json({
      success: false,
      message: 'Error al establecer el precio de tienda'
    });
  }
});

// Ruta para rechazar oferta de compra
app.post('/api/articles/reject-offer', authMiddleware, async (req, res) => {
  try {
    const { articleId, reason } = req.body;
    
    if (!articleId) {
      return res.status(400).json({
        success: false,
        message: 'ID del artículo es requerido'
      });
    }

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
        adminStatus: 'rejected_by_seller',
        'adminDecision.rejectReason': reason || 'Rechazado por el vendedor'
      },
      { new: true }
    ).populate('seller', 'name email points logisticsLevel reputation');

    res.json({
      success: true,
      message: 'Oferta rechazada exitosamente',
      data: updatedArticle
    });
  } catch (error) {
    console.error('Error rechazando oferta:', error);
    res.status(500).json({
      success: false,
      message: 'Error al rechazar la oferta'
    });
  }
});

// Ruta para artículos vendidos por dinero
app.get('/api/articles/sold-articles', authMiddleware, async (req, res) => {
  try {
    // Buscar artículos vendidos por el usuario (tanto por dinero como por puntos)
    const userId = req.query.userId || req.userId; // Permitir userId como parámetro de consulta para testing
    
    console.log('🔍 Buscando artículos vendidos para userId:', userId);
    
    const query = { 
      'id_vendedor': new mongoose.Types.ObjectId(userId), // Convertir a ObjectId
      'estado_articulo': { 
        $in: ['TRASPASADO_A_TRASTALIA_POR_DINERO', 'TRASPASADO_A_TRASTALIA_POR_PUNTOS', 'COMPRADO_POR_ADMIN'] 
      },
      $or: [
        { 'sellerAccepted': true },
        { 'estado_articulo': 'COMPRADO_POR_ADMIN' }
      ]
    };
    
    console.log('🔍 Query:', JSON.stringify(query, null, 2));
    
    const articles = await Article.find(query)
    .populate('seller', 'name email points logisticsLevel reputation')
    .sort({ 'sellerAcceptedDate': -1 });

    // Transformar datos para el frontend
    const soldArticles = articles.map(article => {
      const isMoneySale = article.estado_articulo === 'TRASPASADO_A_TRASTALIA_POR_DINERO' || article.estado_articulo === 'COMPRADO_POR_ADMIN';
      
      return {
        id: article._id,
        article: {
          title: article.nombre || article.title,
          description: article.descripcion || article.description,
          images: article.fotos || article.images || ['/images/placeholder.jpg']
        },
        buyer: {
          name: 'Trastalia'
        },
        price: isMoneySale 
          ? (article.adminDecision?.finalPrice || article.adminDecision?.moneyPrice || 0)
          : (article.adminDecision?.finalPoints || article.adminDecision?.pointsAmount || 0),
        status: 'entregado',
        paymentMethod: isMoneySale ? 'dinero' : 'puntos',
        soldDate: article.sellerAcceptedDate || new Date(),
        deliveryDate: article.sellerAcceptedDate || new Date(),
        rating: 5,
        review: isMoneySale 
          ? `Vendido a Trastalia por ${article.adminDecision?.finalPrice || article.adminDecision?.moneyPrice || 0}€`
          : `Vendido a Trastalia por ${article.adminDecision?.finalPoints || article.adminDecision?.pointsAmount || 0} puntos`
      };
    });

    res.json({
      success: true,
      articles: soldArticles
    });
  } catch (error) {
    console.error('Error obteniendo artículos vendidos:', error);
    res.status(500).json({
      success: false,
      message: 'Error al obtener los artículos vendidos'
    });
  }
});

// Ruta para canjes por puntos
app.get('/api/articles/point-exchanges', authMiddleware, async (req, res) => {
  try {
    const articles = await Article.find({ 
      'seller': req.userId,
      'estado_articulo': 'COMPRADO_POR_ADMIN',
      'adminDecision.selectedOption': 'points'
    })
    .populate('seller', 'name email points logisticsLevel reputation')
    .sort({ 'adminDecision.date': -1 });

    // Transformar datos para el frontend
    const pointExchanges = articles.map(article => ({
      id: article._id,
      article: {
        title: article.nombre || article.title,
        description: article.descripcion || article.description,
        images: article.fotos || article.images || ['/images/placeholder.jpg']
      },
      points: article.adminDecision?.finalPoints || article.adminDecision?.pointsAmount || 0,
      status: 'canjeado',
      exchangeDate: article.adminDecision?.date || article.sellerAcceptedDate || new Date(),
      review: 'Canjeado por puntos con Trastalia'
    }));

    res.json({
      success: true,
      exchanges: pointExchanges
    });
  } catch (error) {
    console.error('Error obteniendo canjes por puntos:', error);
    res.status(500).json({
      success: false,
      message: 'Error al obtener los canjes por puntos'
    });
  }
});


// Ruta para solicitudes de compra de Trastalia (para usuarios)
app.get('/api/articles/trastalia-purchase-requests', authMiddleware, async (req, res) => {
  try {
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
    const { articleId, reason } = req.body;

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
        sellerRejectReason: reason,
        adminStatus: 'rejected_by_seller'
      },
      { new: true }
    ).populate('seller', 'name email points logisticsLevel reputation');

    res.json({
      success: true,
      message: 'Oferta rechazada exitosamente',
      data: updatedArticle
    });
  } catch (error) {
    console.error('Error rechazando oferta:', error);
    res.status(500).json({
      success: false,
      message: 'Error al rechazar la oferta'
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

// Endpoint para crear ofertas del administrador
app.post('/api/ofertas-admin', authMiddleware, async (req, res) => {
  try {
    const { articulo_id, tipo_oferta, precio_ofertado, puntos_ofertados, comentarios } = req.body;

    if (!articulo_id || !tipo_oferta) {
      return res.status(400).json({
        success: false,
        message: 'ID del artículo y tipo de oferta son requeridos'
      });
    }

    // Buscar el artículo
    const article = await Article.findById(articulo_id);
    if (!article) {
      return res.status(404).json({
        success: false,
        message: 'Artículo no encontrado'
      });
    }

    // Crear la oferta del administrador
    const ofertaAdmin = {
      precio_ofertado: precio_ofertado || 0,
      puntos_ofertados: puntos_ofertados || 0,
      tipo_oferta: tipo_oferta,
      fecha_oferta: new Date(),
      estado_oferta: 'pendiente',
      comentarios: comentarios || ''
    };

    // Actualizar el artículo con la oferta
    article.oferta_admin = ofertaAdmin;
    
    // Actualizar adminDecision para compatibilidad
    article.adminDecision = {
      money: tipo_oferta === 'dinero' || tipo_oferta === 'ambos',
      points: tipo_oferta === 'puntos' || tipo_oferta === 'ambos',
      moneyPrice: precio_ofertado || 0,
      pointsAmount: puntos_ofertados || 0,
      reject: false,
      finalPrice: 0,
      finalPoints: 0
    };
    
    // Actualizar el estado según el tipo de oferta
    if (tipo_oferta === 'dinero') {
      article.adminStatus = 'approved_money';
    } else if (tipo_oferta === 'puntos') {
      article.adminStatus = 'approved_points';
    } else if (tipo_oferta === 'ambos') {
      article.adminStatus = 'approved_both';
    }

    await article.save();

    res.json({
      success: true,
      message: 'Oferta creada exitosamente',
      data: article
    });
  } catch (error) {
    console.error('Error creando oferta:', error);
    res.status(500).json({
      success: false,
      message: 'Error al crear la oferta'
    });
  }
});

app.put('/api/articles/admin/:id/approve', authMiddleware, async (req, res) => {
  try {
    const { money, points, moneyPrice, pointsAmount } = req.body;
    const articleId = req.params.id;

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

    // Verificar si debe aceptarse automáticamente
    let autoAccepted = false;
    let autoAcceptReason = '';

    if (money && article.trastaliaPurchase?.autoAcceptMoney) {
      // Verificar si el precio ofrecido es al menos 20% menor al precio original
      const discountPercentage = ((article.price - moneyPrice) / article.price) * 100;
      if (discountPercentage >= 20) {
        autoAccepted = true;
        autoAcceptReason += `Aceptado automáticamente por dinero (${discountPercentage.toFixed(1)}% descuento). `;
      }
    }

    if (points && article.trastaliaPurchase?.autoAcceptPoints) {
      // Verificar si los puntos ofrecidos son al menos 20% menores al precio original en puntos
      const originalPointsPrice = article.pointsPrice || (article.price * 100);
      const discountPercentage = ((originalPointsPrice - pointsAmount) / originalPointsPrice) * 100;
      if (discountPercentage >= 20) {
        autoAccepted = true;
        autoAcceptReason += `Aceptado automáticamente por puntos (${discountPercentage.toFixed(1)}% descuento). `;
      }
    }

    // Si se acepta automáticamente, actualizar el estado del vendedor
    const updateData = {
      adminStatus: newAdminStatus,
      adminDecision: adminDecision
    };

    if (autoAccepted) {
      updateData.sellerAccepted = true;
      updateData.sellerAcceptedDate = new Date();
      updateData.status = 'comprado_por_trastalia';
      updateData.autoAcceptReason = autoAcceptReason.trim();
    }

    const updatedArticle = await Article.findByIdAndUpdate(
      articleId,
      updateData,
      { new: true }
    ).populate('seller', 'name email points logisticsLevel reputation');

    let message = 'Artículo aprobado exitosamente';
    if (autoAccepted) {
      message += ` y aceptado automáticamente por el vendedor (${autoAcceptReason.trim()})`;
    }

    res.json({
      success: true,
      message: message,
      data: updatedArticle,
      autoAccepted: autoAccepted
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
    const { reason } = req.body;
    const articleId = req.params.id;

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
      rejectReason: reason || 'No especificado',
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
        rejected: rejectedArticles
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

// Rutas de centros logísticos
app.get('/api/logistics-centers', async (req, res) => {
  try {
    const centers = await LogisticsCenter.find({ status: 'active' });
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

// Ruta para obtener balance de puntos del usuario
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
        logisticsLevel: user.logisticsLevel || 'bronze',
        reputation: user.reputation || 0
      }
    });
  } catch (error) {
    console.error('Error obteniendo balance de puntos:', error);
    res.status(500).json({
      success: false,
      message: 'Error al obtener balance de puntos'
    });
  }
});

// Ruta para obtener transacciones de puntos del usuario
app.get('/api/user/points-transactions', authMiddleware, async (req, res) => {
  try {
    // Obtener artículos canjeados por puntos del usuario
    const pointExchanges = await Article.find({ 
      'seller': req.userId,
      'estado_articulo': 'COMPRADO_POR_ADMIN',
      'adminDecision.selectedOption': 'points'
    })
    .populate('seller', 'name email points logisticsLevel reputation')
    .sort({ 'adminDecision.date': -1 });

    // Transformar canjes por puntos en transacciones
    const exchangeTransactions = pointExchanges.map(article => ({
      id: `exchange_${article._id}`,
      type: 'earned',
      amount: article.adminDecision?.finalPoints || article.adminDecision?.pointsAmount || 0,
      description: `Canje por puntos: ${article.nombre || article.title}`,
      date: article.adminDecision?.date || article.sellerAcceptedDate || new Date(),
      status: 'completed',
      category: 'exchange'
    }));

    // Combinar con transacciones simuladas para otros tipos
    const simulatedTransactions = [
      {
        id: '1',
        type: 'earned',
        amount: 200,
        description: 'Compra de artículo iPhone 13 Pro Max',
        date: new Date('2024-01-15T11:30:00Z'),
        status: 'completed',
        category: 'purchase'
      },
      {
        id: '2',
        type: 'spent',
        amount: -50,
        description: 'Intercambio por auriculares',
        date: new Date('2024-01-10T14:20:00Z'),
        status: 'completed',
        category: 'exchange'
      },
      {
        id: '3',
        type: 'earned',
        amount: 100,
        description: 'Venta de artículo MacBook Air',
        date: new Date('2024-01-05T09:15:00Z'),
        status: 'completed',
        category: 'sale'
      }
    ];

    // Combinar todas las transacciones y ordenar por fecha
    const allTransactions = [...exchangeTransactions, ...simulatedTransactions]
      .sort((a, b) => new Date(b.date) - new Date(a.date));

    res.json({
      success: true,
      data: {
        data: {
          transactions: allTransactions,
          pagination: {
            page: 1,
            limit: 20,
            total: allTransactions.length,
            pages: Math.ceil(allTransactions.length / 20)
          }
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

// Ruta de salud
app.get('/api/health', (req, res) => {
  res.json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    environment: 'development',
    database: 'MongoDB Atlas'
  });
});

// Ruta para actualizar balance de usuario (solo para desarrollo)
app.post('/api/user/update-balance', authMiddleware, async (req, res) => {
  try {
    const { points, logisticsLevel, reputation } = req.body;
    
    const updatedUser = await User.findByIdAndUpdate(
      req.userId,
      { 
        points: points || 0,
        logisticsLevel: logisticsLevel || 'novato',
        reputation: reputation || 0
      },
      { new: true }
    );

    if (!updatedUser) {
      return res.status(404).json({
        success: false,
        message: 'Usuario no encontrado'
      });
    }

    res.json({
      success: true,
      message: 'Balance actualizado exitosamente',
      data: {
        name: updatedUser.name,
        email: updatedUser.email,
        points: updatedUser.points,
        logisticsLevel: updatedUser.logisticsLevel,
        reputation: updatedUser.reputation
      }
    });
  } catch (error) {
    console.error('Error actualizando balance:', error);
    res.status(500).json({
      success: false,
      message: 'Error al actualizar balance'
    });
  }
});

// Ruta para actualizar artículo
app.put('/api/articles/:id', authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;
    
    const article = await Article.findByIdAndUpdate(
      id,
      updateData,
      { new: true }
    ).populate('seller', 'name email points logisticsLevel reputation');

    if (!article) {
      return res.status(404).json({
        success: false,
        message: 'Artículo no encontrado'
      });
    }
    
    res.json({
      success: true,
      message: 'Artículo actualizado exitosamente',
      data: article
    });
  } catch (error) {
    console.error('Error actualizando artículo:', error);
    res.status(500).json({
      success: false,
      message: 'Error al actualizar el artículo'
    });
  }
});

// Endpoint para obtener artículos pendientes de valoración de precio
app.get('/api/articles/pending-price-valuation', authMiddleware, async (req, res) => {
  try {
    if (req.userRole !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Solo los administradores pueden acceder a esta información'
      });
    }
    
    console.log('🔍 Buscando artículos pendientes de valoración de precio...');
    
    // Buscar artículos pendientes de valoración
    const articles = await Article.find({ 
      estado_articulo: 'PENDIENTE_VALORACION_PRECIO_TIENDA'
    })
      .populate('seller', 'name email points logisticsLevel reputation')
      .populate('id_vendedor', 'name email points logisticsLevel reputation')
      .sort({ fecha_transferencia: -1 });

    console.log(`📦 Encontrados ${articles.length} artículos pendientes de valoración`);
    
    res.json({
      success: true,
      data: articles
    });
  } catch (error) {
    console.error('Error obteniendo artículos pendientes de valoración:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor'
    });
  }
});

// Endpoint para obtener artículos que son propiedad del admin (disponibles para compra)
app.get('/api/articles/admin-owned', async (req, res) => {
  try {
    console.log('🔍 Buscando artículos disponibles para compra...');
    
    // Buscar artículos que son propiedad del admin y están disponibles para compra
    const articles = await Article.find({ 
      estado_articulo: { 
        $in: [
          'COMPRADO_POR_ADMIN',
          'TRASPASADO_A_TRASTALIA_POR_PUNTOS',
          'TRASPASADO_A_TRASTALIA_POR_DINERO',
          'PENDIENTE_VALORACION_PRECIO_TIENDA'
        ]
      },
      comprador: { $exists: false } // Excluir artículos ya vendidos
    })
      .populate('seller', 'name email points logisticsLevel reputation')
      .populate('id_vendedor', 'name email points logisticsLevel reputation')
      .sort({ createdAt: -1 });

    console.log(`📦 Encontrados ${articles.length} artículos disponibles para compra`);
    console.log('📋 Artículos:', articles.map(a => ({ id: a._id, title: a.title || a.nombre, estado: a.estado_articulo, comprador: a.comprador })));

    res.json({
      success: true,
      data: articles
    });
  } catch (error) {
    console.error('Error obteniendo artículos del admin:', error);
    res.status(500).json({
      success: false,
      message: 'Error al obtener artículos del administrador'
    });
  }
});

// Ruta pública para obtener artículos disponibles para compra (sin autenticación)
app.get('/api/articles/public', async (req, res) => {
  try {
    // Obtener artículos que son propiedad del admin y están disponibles para compra
    const articles = await Article.find({
      estado_articulo: { 
        $in: [
          'COMPRADO_POR_ADMIN',
          'TRASPASADO_A_TRASTALIA_POR_PUNTOS',
          'TRASPASADO_A_TRASTALIA_POR_DINERO'
        ]
      },
      // Solo artículos con precio válido
      $or: [
        { precio_propuesto_vendedor: { $gt: 0 } },
        { price: { $gt: 0 } }
      ]
    })
    .populate('id_vendedor', 'name email')
    .sort({ createdAt: -1 })
    .limit(50); // Limitar a 50 artículos para rendimiento

    res.json({
      success: true,
      data: articles
    });

  } catch (error) {
    console.error('Error obteniendo artículos públicos:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor'
    });
  }
});

// Ruta para obtener los canjes del usuario (compras con puntos) - DEBE IR ANTES DE LA RUTA GENÉRICA
app.get('/api/articles/my-exchanges', authMiddleware, async (req, res) => {
  try {
    console.log('🔍 Obteniendo canjes del usuario:', req.userId);
    
    // Buscar artículos comprados por el usuario con puntos
    const exchanges = await Article.find({
      comprador: new mongoose.Types.ObjectId(req.userId),
      comprador_tipo: 'usuario',
      estado_articulo: { 
        $in: ['VENDIDO_PUNTOS', 'ENVIADO', 'ENTREGADO', 'RECHAZADO_ENVIO'] 
      }
    }).populate('id_vendedor', 'name email')
      .sort({ updatedAt: -1 });

    console.log('✅ Canjes encontrados:', exchanges.length);
    
    // Formatear datos para el historial de canjes
    const history = exchanges.map(exchange => ({
      id: exchange._id,
      title: exchange.title || exchange.nombre,
      description: exchange.description || exchange.descripcion,
      category: exchange.category || exchange.categoria,
      condition: exchange.condition || exchange.condicion,
      images: exchange.images || exchange.fotos,
      // Información del canje
      exchangeDate: exchange.updatedAt,
      pointsUsed: exchange.adminDecision?.finalPoints || exchange.adminDecision?.pointsAmount || 0,
      paymentMethod: 'Puntos',
      // Información del vendedor
      seller: {
        id: exchange.id_vendedor._id,
        name: exchange.id_vendedor.name,
        email: exchange.id_vendedor.email
      },
      // Estado actual
      currentStatus: exchange.estado_articulo,
      // Información adicional
      location: exchange.location || exchange.ubicacion,
      logisticsShip: exchange.logisticsShip,
      logisticsShipLocation: exchange.logisticsShipLocation,
      // Mantener adminDecision para compatibilidad con el frontend
      adminDecision: exchange.adminDecision
    }));
    
    res.json({
      success: true,
      data: {
        exchanges: history,
        totalExchanges: history.length,
        totalPointsSpent: history.reduce((sum, exchange) => sum + (exchange.pointsUsed || 0), 0)
      }
    });
  } catch (error) {
    console.error('Error obteniendo canjes del usuario:', error);
    res.status(500).json({
      success: false,
      message: 'Error al obtener los canjes del usuario'
    });
  }
});

// Ruta genérica para obtener artículo por ID (debe ir al final)
app.get('/api/articles/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    // Verificar que el ID sea un ObjectId válido de MongoDB
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

// Ruta para comprar artículo con puntos
app.post('/api/articles/purchase-with-points', authMiddleware, async (req, res) => {
  console.log('🚀 Ruta purchase-with-points ejecutándose');
  console.log('🔑 req.userId:', req.userId);
  console.log('🔑 req.userRole:', req.userRole);
  console.log('📦 req.body:', req.body);
  
  try {
    const { articleId, pointsAmount } = req.body;
    
    if (!articleId || !pointsAmount) {
      console.log('❌ Faltan datos requeridos:', { articleId, pointsAmount });
      return res.status(400).json({
        success: false,
        message: 'Faltan datos requeridos'
      });
    }

    // Buscar el artículo
    const article = await Article.findById(articleId);
    if (!article) {
      return res.status(404).json({
        success: false,
        message: 'Artículo no encontrado'
      });
    }

    // Verificar que el artículo esté disponible para compra con puntos
    console.log('🔍 Validando artículo para compra con puntos:', {
      articleId: article._id,
      adminDecisionPoints: article.adminDecision?.points,
      pointsExchangeEnabled: article.pointsExchange?.enabled,
      adminDecision: article.adminDecision,
      pointsExchange: article.pointsExchange
    });
    
    // Verificar que el artículo esté disponible para compra con puntos
    // Si adminDecision.points es true, permitir la compra independientemente de pointsExchange
    if (!article.adminDecision?.points) {
      console.log('❌ Artículo no disponible para compra con puntos - adminDecision.points es false');
      return res.status(400).json({
        success: false,
        message: 'Este artículo no está disponible para compra con puntos'
      });
    }

    // Verificar que el usuario tenga suficientes puntos
    const user = await User.findById(req.userId);
    if (!user || user.points < pointsAmount) {
      return res.status(400).json({
        success: false,
        message: 'No tienes suficientes puntos para esta compra'
      });
    }

    // Actualizar el artículo - marcar como vendido por puntos (desaparece de tienda)
    console.log('🔄 Actualizando artículo:', {
      articleId: article._id,
      userId: req.userId,
      userRole: req.userRole,
      pointsAmount: pointsAmount
    });
    
    article.estado_articulo = 'VENDIDO_PUNTOS';
    article.comprador = req.userId;
    article.comprador_tipo = 'usuario';
    article.adminDecision.selectedOption = 'points';
    article.adminDecision.finalPoints = pointsAmount;
    article.sellerAccepted = true;
    
    console.log('📝 Datos antes de guardar:', {
      estado: article.estado_articulo,
      comprador: article.comprador,
      comprador_tipo: article.comprador_tipo
    });
    article.sellerAcceptedDate = new Date();
    article.updatedAt = new Date();

    // Restar puntos al usuario
    user.points -= pointsAmount;
    user.updatedAt = new Date();

    // Guardar cambios
    await article.save();
    await user.save();
    
    console.log('💾 Artículo guardado. Verificando datos guardados...');
    const savedArticle = await Article.findById(articleId);
    console.log('✅ Datos después de guardar:', {
      estado: savedArticle.estado_articulo,
      comprador: savedArticle.comprador,
      comprador_tipo: savedArticle.comprador_tipo
    });

    console.log('✅ Artículo comprado con puntos:', {
      articleId: article._id,
      userId: req.userId,
      pointsUsed: pointsAmount,
      newStatus: article.estado_articulo
    });

    res.json({
      success: true,
      message: 'Compra realizada con éxito',
      data: {
        articleId: article._id,
        pointsUsed: pointsAmount,
        remainingPoints: user.points
      }
    });
  } catch (error) {
    console.error('❌ Error comprando artículo con puntos:', error);
    console.error('❌ Stack trace:', error.stack);
    res.status(500).json({
      success: false,
      message: 'Error al procesar la compra con puntos',
      error: error.message
    });
  }
});


// Ruta para agregar puntos a un usuario (solo para testing)
app.post('/api/users/add-points', authMiddleware, async (req, res) => {
  try {
    const { userId, points } = req.body;

    // Solo permitir a admins o al propio usuario
    if (req.userRole !== 'admin' && req.userId !== userId) {
      return res.status(403).json({
        success: false,
        message: 'No tienes permisos para modificar estos puntos'
      });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'Usuario no encontrado'
      });
    }

    user.points = (user.points || 0) + points;
    await user.save();

    res.json({
      success: true,
      message: 'Puntos agregados correctamente',
      data: {
        userId: user._id,
        newPoints: user.points
      }
    });

  } catch (error) {
    console.error('Error agregando puntos:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor'
    });
  }
});

// Ruta para actualizar estado de envío de un artículo
app.put('/api/articles/:id/shipping-status', authMiddleware, async (req, res) => {
  try {
    const { id } = req.params
    const { status } = req.body

    // Validar que el usuario sea admin
    if (req.userRole !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Solo los administradores pueden actualizar el estado de envío'
      })
    }

    // Validar estado
    const validStatuses = ['ENVIADO', 'ENTREGADO', 'RECHAZADO_ENVIO']
    if (!validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Estado de envío no válido'
      })
    }

    // Buscar el artículo
    const article = await Article.findById(id)
    if (!article) {
      return res.status(404).json({
        success: false,
        message: 'Artículo no encontrado'
      })
    }

    // Actualizar estado
    article.estado_articulo = status
    await article.save()

    res.json({
      success: true,
      message: 'Estado de envío actualizado correctamente',
      data: {
        articleId: id,
        newStatus: status
      }
    })

  } catch (error) {
    console.error('Error actualizando estado de envío:', error)
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor'
    })
  }
})

// Ruta para obtener el historial de compras con dinero del usuario
app.get('/api/articles/my-purchases', authMiddleware, async (req, res) => {
  try {
    console.log('🔍 Obteniendo historial de compras con dinero del usuario:', req.userId);
    
    // Buscar artículos comprados por el usuario con dinero
    const purchases = await Article.find({
      comprador: new mongoose.Types.ObjectId(req.userId),
      comprador_tipo: 'usuario',
      estado_articulo: 'VENDIDO_DINERO'
    }).populate('id_vendedor', 'name email')
      .sort({ updatedAt: -1 });

    console.log('✅ Compras con dinero encontradas:', purchases.length);
    
    // Formatear datos para el historial
    const history = purchases.map(purchase => ({
      id: purchase._id,
      title: purchase.title || purchase.nombre,
      description: purchase.description || purchase.descripcion,
      category: purchase.category || purchase.categoria,
      condition: purchase.condition || purchase.condicion,
      images: purchase.images || purchase.fotos,
      // Información de la compra
      purchaseDate: purchase.updatedAt,
      purchasePrice: purchase.adminDecision?.finalPrice || purchase.price || purchase.precio_propuesto_vendedor,
      paymentMethod: 'Dinero',
      // Información del vendedor
      seller: {
        id: purchase.id_vendedor._id,
        name: purchase.id_vendedor.name,
        email: purchase.id_vendedor.email
      },
      // Estado actual
      currentStatus: purchase.estado_articulo,
      // Información adicional
      location: purchase.location || purchase.ubicacion,
      logisticsShip: purchase.logisticsShip,
      logisticsShipLocation: purchase.logisticsShipLocation
    }));
    
    res.json({
      success: true,
      data: {
        purchases: history,
        totalPurchases: history.length,
        totalSpent: history.reduce((sum, purchase) => sum + (purchase.purchasePrice || 0), 0)
      }
    });

  } catch (error) {
    console.error('Error obteniendo historial de compras:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor'
    });
  }
});

// Ruta para que el admin edite cualquier artículo
app.put('/api/articles/admin/:id', authMiddleware, async (req, res) => {
  try {
    // Verificar que el usuario sea admin
    if (req.userRole !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Solo los administradores pueden editar artículos'
      });
    }

    const { id } = req.params;
    const updateData = req.body;

    // Buscar el artículo
    const article = await Article.findById(id);
    if (!article) {
      return res.status(404).json({
        success: false,
        message: 'Artículo no encontrado'
      });
    }

    // Actualizar el artículo
    const updatedArticle = await Article.findByIdAndUpdate(
      id,
      { ...updateData, updatedAt: new Date() },
      { new: true, runValidators: true }
    ).populate('id_vendedor', 'name email');

    res.json({
      success: true,
      message: 'Artículo actualizado exitosamente',
      data: updatedArticle
    });

  } catch (error) {
    console.error('Error actualizando artículo:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor'
    });
  }
});

// Ruta para obtener estadísticas del dashboard
app.get('/api/admin/dashboard-stats', authMiddleware, async (req, res) => {
  try {
    // Verificar que el usuario sea admin
    if (req.userRole !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Solo los administradores pueden acceder a las estadísticas'
      });
    }

    // Obtener estadísticas de artículos
    const totalArticles = await Article.countDocuments();
    const articlesEnVenta = await Article.countDocuments({ 
      estado_articulo: { $in: ['EN_VENTA', 'EN_LOGISTICA'] } 
    });
    const articlesCanjeados = await Article.countDocuments({ 
      estado_articulo: { $in: ['VENDIDO_PUNTOS', 'VENDIDO_DINERO'] } 
    });
    const articlesPendientes = await Article.countDocuments({ 
      estado_articulo: 'PENDIENTE_APROBACION_ADMIN' 
    });

    // Obtener estadísticas de usuarios
    const totalUsers = await User.countDocuments();
    const activeUsers = await User.countDocuments({ isActive: true });
    const adminUsers = await User.countDocuments({ role: 'admin' });
    const regularUsers = await User.countDocuments({ role: 'user' });

    // Obtener estadísticas de puntos
    const totalPoints = await User.aggregate([
      { $group: { _id: null, total: { $sum: '$points' } } }
    ]);
    const totalPointsValue = totalPoints.length > 0 ? totalPoints[0].total : 0;

    // Obtener transacciones del último mes
    const lastMonth = new Date();
    lastMonth.setMonth(lastMonth.getMonth() - 1);
    
    const monthlyTransactions = await Article.aggregate([
      {
        $match: {
          updatedAt: { $gte: lastMonth },
          estado_articulo: { $in: ['VENDIDO_PUNTOS', 'VENDIDO_DINERO'] }
        }
      },
      {
        $group: {
          _id: {
            year: { $year: '$updatedAt' },
            month: { $month: '$updatedAt' }
          },
          count: { $sum: 1 },
          totalValue: { $sum: '$precio_propuesto_vendedor' }
        }
      },
      { $sort: { '_id.year': -1, '_id.month': -1 } }
    ]);

    // Obtener artículos más populares por categoría
    const popularCategories = await Article.aggregate([
      { $group: { _id: '$categoria', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 5 }
    ]);

    // Obtener usuarios con más puntos
    const topUsers = await User.find({ role: 'user' })
      .sort({ points: -1 })
      .limit(5)
      .select('name email points');

    res.json({
      success: true,
      data: {
        articles: {
          total: totalArticles,
          enVenta: articlesEnVenta,
          canjeados: articlesCanjeados,
          pendientes: articlesPendientes
        },
        users: {
          total: totalUsers,
          active: activeUsers,
          admins: adminUsers,
          regular: regularUsers
        },
        points: {
          total: totalPointsValue,
          topUsers: topUsers
        },
        transactions: {
          monthly: monthlyTransactions
        },
        categories: {
          popular: popularCategories
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

// Ruta para transferir propiedad del artículo al admin cuando se aprueba
app.put('/api/articles/transfer-ownership/:id', authMiddleware, async (req, res) => {
  try {
    // Verificar que el usuario sea admin
    if (req.userRole !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Solo los administradores pueden transferir propiedad'
      });
    }

    const { id } = req.params;
    const { transferToAdmin } = req.body;

    // Buscar el artículo
    const article = await Article.findById(id);
    if (!article) {
      return res.status(404).json({
        success: false,
        message: 'Artículo no encontrado'
      });
    }

    if (transferToAdmin) {
      // Buscar el usuario admin
      const adminUser = await User.findOne({ role: 'admin' });
      if (!adminUser) {
        return res.status(404).json({
          success: false,
          message: 'Usuario administrador no encontrado'
        });
      }

      // Transferir propiedad al admin
      article.id_vendedor = adminUser._id;
      article.estado_articulo = 'VENDIDO_A_TRASTALIA_DINERO'; // o VENDIDO_A_TRASTALIA_PUNTOS según corresponda
      article.updatedAt = new Date();
      
      await article.save();

      res.json({
        success: true,
        message: 'Propiedad transferida al administrador exitosamente',
        data: {
          articleId: article._id,
          newOwner: adminUser.email,
          status: article.estado_articulo
        }
      });
    } else {
      res.json({
        success: true,
        message: 'No se realizó transferencia de propiedad'
      });
    }

  } catch (error) {
    console.error('Error transfiriendo propiedad:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor'
    });
  }
});

// PUT /api/articles/:id - Actualizar artículo (solo admin)
app.put('/api/articles/:id', authMiddleware, async (req, res) => {
  try {
    // Verificar que el usuario sea admin
    if (req.userRole !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Solo los administradores pueden editar artículos'
      });
    }

    const { id } = req.params;
    const updateData = req.body;

    // Buscar el artículo
    const article = await Article.findById(id);
    if (!article) {
      return res.status(404).json({
        success: false,
        message: 'Artículo no encontrado'
      });
    }

    // Actualizar campos permitidos
    const allowedFields = [
      'nombre', 'title', 'descripcion', 'description', 'categoria', 'category',
      'precio_propuesto_vendedor', 'price', 'precio_puntos', 'points',
      'condicion', 'condition', 'ubicacion', 'location', 'modo_venta', 'saleMode',
      'opciones_logisticas', 'logisticsOptions', 'acepta_descuento_admin',
      'estado_articulo', 'status', 'adminStatus', 'images', 'fotos',
      'tags', 'exchangeFor', 'directFromHome', 'logisticsCenterSale',
      'trastaliaPurchase', 'pointsExchange', 'useLogisticsCenter'
    ];

    // Actualizar solo los campos permitidos
    allowedFields.forEach(field => {
      if (updateData[field] !== undefined) {
        article[field] = updateData[field];
      }
    });

    // Actualizar timestamp
    article.updatedAt = new Date();

    // Guardar cambios
    await article.save();

    // Poblar información del vendedor para la respuesta
    await article.populate('id_vendedor', 'name email');

    res.json({
      success: true,
      message: 'Artículo actualizado exitosamente',
      data: article
    });

  } catch (error) {
    console.error('Error actualizando artículo:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor'
    });
  }
});

// Conectar a MongoDB
mongoose.connect(process.env.MONGODB_URI)
  .then(() => {
    console.log('✅ Conectado a MongoDB Atlas');
  })
  .catch((error) => {
    console.error('❌ Error conectando a MongoDB:', error);
  });

// Iniciar servidor
app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Servidor backend ejecutándose en puerto ${PORT}`);
  console.log(`🔗 API: http://localhost:${PORT}/api`);
  console.log(`💾 Almacenamiento: MongoDB Atlas`);
  console.log(`🔑 Login: admin@trastalia.com / admin123456`);
  console.log(`✅ Servidor iniciado correctamente`);
});
