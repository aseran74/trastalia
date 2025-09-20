const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const compression = require('compression');

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

// Middleware para parsear JSON
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Ruta de salud
app.get('/api/health', (req, res) => {
  res.json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development'
  });
});

// Ruta para crear artículos (simulada)
app.post('/api/articles', (req, res) => {
  try {
    console.log('📝 Datos recibidos del frontend:', JSON.stringify(req.body, null, 2));
    
    // Simular validación básica
    const { title, description, price, category, condition, location } = req.body;
    
    if (!title || title.length < 5) {
      return res.status(400).json({
        success: false,
        message: 'El título debe tener al menos 5 caracteres'
      });
    }
    
    if (!description || description.length < 10) {
      return res.status(400).json({
        success: false,
        message: 'La descripción debe tener al menos 10 caracteres'
      });
    }
    
    if (!price || price <= 0) {
      return res.status(400).json({
        success: false,
        message: 'El precio debe ser mayor a 0'
      });
    }
    
    if (!category) {
      return res.status(400).json({
        success: false,
        message: 'La categoría es obligatoria'
      });
    }
    
    if (!condition) {
      return res.status(400).json({
        success: false,
        message: 'El estado es obligatorio'
      });
    }
    
    if (!location) {
      return res.status(400).json({
        success: false,
        message: 'La ubicación es obligatoria'
      });
    }
    
    // Simular creación exitosa
    const article = {
      id: Date.now().toString(),
      ...req.body,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    console.log('✅ Artículo creado exitosamente:', article.title);
    
    res.status(201).json({
      success: true,
      message: 'Artículo creado exitosamente',
      data: article
    });
    
  } catch (error) {
    console.error('❌ Error creando artículo:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor',
      error: error.message
    });
  }
});

// Ruta para obtener artículos
app.get('/api/articles', (req, res) => {
  res.json({
    success: true,
    data: []
  });
});

// Middleware de manejo de errores
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(500).json({
    error: 'Error interno del servidor',
    message: process.env.NODE_ENV === 'development' ? err.message : 'Algo salió mal'
  });
});

// Ruta 404 - debe ir al final
app.use((req, res) => {
  res.status(404).json({
    success: false,
    error: 'Ruta no encontrada',
    message: `La ruta ${req.originalUrl} no existe`
  });
});

// Iniciar servidor
app.listen(PORT, () => {
  console.log(`🚀 Servidor MCP ejecutándose en puerto ${PORT}`);
  console.log(`📱 Frontend: http://localhost:5173`);
  console.log(`🔗 API: http://localhost:${PORT}/api`);
  console.log(`💾 Almacenamiento: Simulado (para testing)`);
});

