const express = require('express');
const cors = require('cors');

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

// Datos simulados
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

// Rutas de administración
app.get('/api/articles/admin/pending', authMiddleware, async (req, res) => {
  try {
    res.json({
      success: true,
      data: mockArticles
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
    const articleId = req.params.id;

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
  } catch (error) {
    console.error('Error obteniendo estadísticas:', error);
    res.status(500).json({
      success: false,
      message: 'Error al obtener estadísticas'
    });
  }
});

// Rutas de autenticación
app.post('/api/auth/login', (req, res) => {
  try {
    const { email, password } = req.body;
    
    // Simular login del admin
    if (email === 'admin@trastalia.com' && password === 'admin123456') {
      const token = 'mock-admin-token-' + Date.now();
      
      res.json({
        success: true,
        message: 'Login exitoso',
        data: {
          token: token,
          user: {
            id: 'admin-user-id',
            name: 'Administrador',
            email: 'admin@trastalia.com',
            role: 'admin',
            points: 10000,
            logisticsLevel: 'almirante',
            reputation: 1000
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

app.post('/api/auth/register', (req, res) => {
  res.status(501).json({
    success: false,
    message: 'Registro no implementado en modo mock'
  });
});

app.get('/api/auth/me', authMiddleware, (req, res) => {
  res.json({
    success: true,
    data: {
      id: 'admin-user-id',
      name: 'Administrador',
      email: 'admin@trastalia.com',
      role: 'admin',
      points: 10000,
      logisticsLevel: 'almirante',
      reputation: 1000
    }
  });
});

// Ruta de salud
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development'
  });
});

// Iniciar servidor
app.listen(PORT, () => {
  console.log(`🚀 Servidor backend MOCK ejecutándose en puerto ${PORT}`);
  console.log(`📱 Frontend: http://localhost:5174`);
  console.log(`🔗 API: http://localhost:${PORT}/api`);
  console.log(`💾 Almacenamiento: Datos simulados`);
  console.log(`🎯 Panel Admin: http://localhost:5174/admin/articles`);
  console.log(`📊 Artículos simulados: ${mockArticles.length}`);
});
