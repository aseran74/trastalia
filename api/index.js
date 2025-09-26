// Vercel Serverless Function
const express = require('express');
const cors = require('cors');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Rutas principales
app.get('/api/health', (req, res) => {
  res.json({ 
    success: true, 
    message: 'API funcionando correctamente',
    timestamp: new Date().toISOString()
  });
});

// Ruta de login simplificada
app.post('/api/auth/login', (req, res) => {
  try {
    const { email, password } = req.body;

    // Login de admin
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

    // Login de usuario de prueba
    if (email === 'carlos@example.com' && password === 'carlos123') {
      return res.json({
        success: true,
        data: {
          user: {
            id: 'carlos-user-id',
            name: 'Carlos López',
            email: 'carlos@example.com',
            role: 'user',
            points: 3200,
            logisticsLevel: 'basic',
            reputation: 50
          },
          token: 'mongodb-user-token-carlos-user-id'
        }
      });
    }

    res.status(401).json({
      success: false,
      message: 'Credenciales inválidas'
    });
  } catch (error) {
    console.error('Error en login:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor'
    });
  }
});

// Ruta para obtener artículos (datos simulados)
app.get('/api/articles', (req, res) => {
  try {
    const articles = [
      {
        _id: '1',
        nombre: 'iPhone 12 Pro',
        descripcion: 'iPhone 12 Pro en excelente estado',
        categoria: 'tecnologia',
        precio_propuesto_vendedor: 800,
        estado_articulo: 'EN_VENTA',
        modo_venta: 'compra_directa',
        ubicacion: 'Madrid, España',
        condicion: 'excelente',
        views: 25,
        seller: {
          name: 'Carlos López',
          email: 'carlos@example.com'
        }
      },
      {
        _id: '2',
        nombre: 'Nintendo Switch OLED',
        descripcion: 'Consola Nintendo Switch OLED con 2 mandos',
        categoria: 'gaming',
        precio_propuesto_vendedor: 350,
        estado_articulo: 'OFERTA_COMPRA_ENVIADA',
        modo_venta: 'centro_logistico',
        ubicacion: 'Barcelona, España',
        condicion: 'nuevo',
        views: 15,
        adminDecision: {
          selectedOption: 'points',
          finalPoints: 300
        },
        sellerAccepted: false,
        sellerRejected: false,
        seller: {
          name: 'Carlos López',
          email: 'carlos@example.com'
        }
      }
    ];
    
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

// Ruta pública para obtener artículos disponibles para compra (sin autenticación)
app.get('/api/articles/public', (req, res) => {
  try {
    const articles = [
      {
        _id: '1',
        nombre: 'iPhone 12 Pro',
        descripcion: 'iPhone 12 Pro en excelente estado, 128GB, color azul',
        categoria: 'tecnologia',
        precio_propuesto_vendedor: 800,
        estado_articulo: 'COMPRADO_POR_ADMIN',
        modo_venta: 'compra_directa',
        ubicacion: 'Madrid, España',
        condicion: 'excelente',
        views: 25,
        price: 800,
        title: 'iPhone 12 Pro',
        description: 'iPhone 12 Pro en excelente estado, 128GB, color azul',
        category: 'tecnologia',
        condition: 'excelente',
        location: 'Madrid, España',
        images: ['https://via.placeholder.com/400x300/cccccc/666666?text=iPhone+12+Pro'],
        seller: {
          name: 'Carlos López',
          email: 'carlos@example.com'
        }
      },
      {
        _id: '2',
        nombre: 'Nintendo Switch OLED',
        descripcion: 'Consola Nintendo Switch OLED con 2 mandos Joy-Con',
        categoria: 'gaming',
        precio_propuesto_vendedor: 350,
        estado_articulo: 'TRASPASADO_A_TRASTALIA_POR_PUNTOS',
        modo_venta: 'centro_logistico',
        ubicacion: 'Barcelona, España',
        condicion: 'nuevo',
        views: 15,
        price: 350,
        title: 'Nintendo Switch OLED',
        description: 'Consola Nintendo Switch OLED con 2 mandos Joy-Con',
        category: 'gaming',
        condition: 'nuevo',
        location: 'Barcelona, España',
        images: ['https://via.placeholder.com/400x300/cccccc/666666?text=Nintendo+Switch'],
        adminDecision: {
          selectedOption: 'points',
          finalPoints: 300
        },
        seller: {
          name: 'Carlos López',
          email: 'carlos@example.com'
        }
      },
      {
        _id: '3',
        nombre: 'MacBook Pro 13"',
        descripcion: 'MacBook Pro 13 pulgadas, M1, 8GB RAM, 256GB SSD',
        categoria: 'tecnologia',
        precio_propuesto_vendedor: 1200,
        estado_articulo: 'TRASPASADO_A_TRASTALIA_POR_DINERO',
        modo_venta: 'centro_logistico',
        ubicacion: 'Valencia, España',
        condicion: 'excelente',
        views: 8,
        price: 1200,
        title: 'MacBook Pro 13"',
        description: 'MacBook Pro 13 pulgadas, M1, 8GB RAM, 256GB SSD',
        category: 'tecnologia',
        condition: 'excelente',
        location: 'Valencia, España',
        images: ['https://via.placeholder.com/400x300/cccccc/666666?text=MacBook+Pro'],
        seller: {
          name: 'Ana García',
          email: 'ana@example.com'
        }
      },
      {
        _id: '4',
        nombre: 'Samsung Galaxy S21',
        descripcion: 'Samsung Galaxy S21, 128GB, color negro, con funda',
        categoria: 'tecnologia',
        precio_propuesto_vendedor: 600,
        estado_articulo: 'COMPRADO_POR_ADMIN',
        modo_venta: 'compra_directa',
        ubicacion: 'Sevilla, España',
        condicion: 'bueno',
        views: 12,
        price: 600,
        title: 'Samsung Galaxy S21',
        description: 'Samsung Galaxy S21, 128GB, color negro, con funda',
        category: 'tecnologia',
        condition: 'bueno',
        location: 'Sevilla, España',
        images: ['https://via.placeholder.com/400x300/cccccc/666666?text=Galaxy+S21'],
        seller: {
          name: 'Miguel Torres',
          email: 'miguel@example.com'
        }
      },
      {
        _id: '5',
        nombre: 'Bicicleta de Montaña',
        descripcion: 'Bicicleta de montaña Trek, 21 velocidades, talla M',
        categoria: 'deportes',
        precio_propuesto_vendedor: 450,
        estado_articulo: 'PENDIENTE_VALORACION_PRECIO_TIENDA',
        modo_venta: 'centro_logistico',
        ubicacion: 'Bilbao, España',
        condicion: 'bueno',
        views: 18,
        price: 450,
        title: 'Bicicleta de Montaña',
        description: 'Bicicleta de montaña Trek, 21 velocidades, talla M',
        category: 'deportes',
        condition: 'bueno',
        location: 'Bilbao, España',
        images: ['https://via.placeholder.com/400x300/cccccc/666666?text=Bicicleta'],
        seller: {
          name: 'Laura Martín',
          email: 'laura@example.com'
        }
      }
    ];
    
    res.json({
      success: true,
      data: articles
    });
  } catch (error) {
    console.error('Error obteniendo artículos públicos:', error);
    res.status(500).json({
      success: false,
      message: 'Error al obtener artículos públicos'
    });
  }
});

// Ruta para obtener solicitudes de compra
app.get('/api/articles/my-purchase-requests', (req, res) => {
  try {
    const articles = [
      {
        _id: '2',
        nombre: 'Nintendo Switch OLED',
        descripcion: 'Consola Nintendo Switch OLED con 2 mandos',
        categoria: 'gaming',
        precio_propuesto_vendedor: 350,
        estado_articulo: 'OFERTA_COMPRA_ENVIADA',
        modo_venta: 'centro_logistico',
        ubicacion: 'Barcelona, España',
        condicion: 'nuevo',
        views: 15,
        adminDecision: {
          selectedOption: 'points',
          finalPoints: 300
        },
        sellerAccepted: false,
        sellerRejected: false,
        seller: {
          name: 'Carlos López',
          email: 'carlos@example.com'
        }
      }
    ];

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
app.post('/api/articles/accept-offer', (req, res) => {
  try {
    const { articleId, selectedOption } = req.body;

    res.json({
      success: true,
      message: selectedOption === 'points' 
        ? 'Oferta aceptada. Se han acreditado 300 puntos a tu cuenta.'
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
app.get('/api/user/points-balance', (req, res) => {
  try {
    res.json({
      success: true,
      data: {
        points: 3200,
        availablePoints: 3200
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
app.get('/api/articles/point-exchanges', (req, res) => {
  try {
    const articles = [
      {
        _id: '3',
        nombre: 'MacBook Pro 13"',
        descripcion: 'MacBook Pro 13 pulgadas, M1, 8GB RAM',
        categoria: 'tecnologia',
        precio_propuesto_vendedor: 1200,
        estado_articulo: 'COMPRADO_POR_ADMIN',
        modo_venta: 'centro_logistico',
        ubicacion: 'Valencia, España',
        condicion: 'excelente',
        adminDecision: {
          selectedOption: 'points',
          finalPoints: 1000
        },
        comprador_tipo: 'trastalia',
        seller: {
          name: 'Carlos López',
          email: 'carlos@example.com'
        }
      }
    ];

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
app.get('/api/articles/sold-articles', (req, res) => {
  try {
    const articles = [
      {
        _id: '4',
        nombre: 'Samsung Galaxy S21',
        descripcion: 'Samsung Galaxy S21, 128GB, color negro',
        categoria: 'tecnologia',
        precio_propuesto_vendedor: 600,
        estado_articulo: 'COMPRADO_POR_ADMIN',
        modo_venta: 'centro_logistico',
        ubicacion: 'Sevilla, España',
        condicion: 'bueno',
        adminDecision: {
          selectedOption: 'money',
          finalPrice: 500
        },
        comprador_tipo: 'trastalia',
        seller: {
          name: 'Carlos López',
          email: 'carlos@example.com'
        }
      }
    ];

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
app.get('/api/user/points-transactions', (req, res) => {
  try {
    const transactions = [
      {
        id: '1',
        type: 'credit',
        amount: 1000,
        description: 'Canje por MacBook Pro',
        date: new Date().toISOString(),
        status: 'completed'
      },
      {
        id: '2',
        type: 'debit',
        amount: -50,
        description: 'Compra de puntos',
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

// Ruta para crear artículo
app.post('/api/articles', (req, res) => {
  try {
    const articleData = req.body;
    
    res.status(201).json({
      success: true,
      message: 'Artículo creado exitosamente',
      data: {
        _id: 'new-article-id',
        ...articleData,
        estado_articulo: 'DRAFT'
      }
    });
  } catch (error) {
    console.error('Error creando artículo:', error);
    res.status(500).json({
      success: false,
      message: 'Error al crear artículo'
    });
  }
});

// Ruta genérica para artículos por ID
app.get('/api/articles/:id', (req, res) => {
  try {
    const { id } = req.params;
    
    const article = {
      _id: id,
      nombre: 'Artículo de ejemplo',
      descripcion: 'Descripción del artículo',
      categoria: 'general',
      precio_propuesto_vendedor: 100,
      estado_articulo: 'EN_VENTA',
      ubicacion: 'Madrid, España',
      condicion: 'bueno',
      seller: {
        name: 'Usuario Ejemplo',
        email: 'usuario@example.com'
      }
    };
    
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