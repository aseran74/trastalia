import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import compression from 'compression';

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
    environment: 'development'
  });
});

// Rutas de autenticación
app.post('/api/auth/login', (req, res) => {
  try {
    console.log('🔐 Intento de login:', req.body);
    
    const { email, password } = req.body;
    
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Email y contraseña son obligatorios'
      });
    }
    
    // Simular autenticación
    if (email === 'admin@trastalia.com' && password === 'admin123') {
      const token = 'mock-jwt-token-' + Date.now();
      
      res.json({
        success: true,
        message: 'Login exitoso',
        data: {
          token,
          user: {
            id: '1',
            name: 'Administrador',
            email: 'admin@trastalia.com',
            role: 'admin'
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
    console.error('❌ Error en login:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor'
    });
  }
});

app.get('/api/auth/me', (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        success: false,
        message: 'Token de autorización requerido'
      });
    }
    
    // Simular verificación de token
    const token = authHeader.substring(7);
    
    if (token.startsWith('mock-jwt-token-')) {
      res.json({
        success: true,
        data: {
          id: '1',
          name: 'Administrador',
          email: 'admin@trastalia.com',
          role: 'admin'
        }
      });
    } else {
      res.status(401).json({
        success: false,
        message: 'Token inválido'
      });
    }
  } catch (error) {
    console.error('❌ Error verificando usuario:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor'
    });
  }
});

app.post('/api/auth/register', (req, res) => {
  try {
    console.log('📝 Intento de registro:', req.body);
    
    const { name, email, password } = req.body;
    
    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Nombre, email y contraseña son obligatorios'
      });
    }
    
    // Simular registro exitoso
    const token = 'mock-jwt-token-' + Date.now();
    
    res.status(201).json({
      success: true,
      message: 'Usuario registrado exitosamente',
      data: {
        token,
        user: {
          id: Date.now().toString(),
          name,
          email,
          role: 'user'
        }
      }
    });
  } catch (error) {
    console.error('❌ Error en registro:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor'
    });
  }
});

// Ruta para obtener artículos (simulada)
app.get('/api/articles', (req, res) => {
  res.json({
    success: true,
    data: []
  });
});

// Ruta para crear artículos (simulada)
app.post('/api/articles', (req, res) => {
  try {
    console.log('📝 Datos recibidos del frontend:', req.body);
    
    // Simular creación de artículo
    const article = {
      id: Date.now().toString(),
      ...req.body,
      createdAt: new Date().toISOString()
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
      message: 'Error al crear el artículo',
      error: error.message
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
app.listen(PORT, () => {
  console.log(`🚀 Servidor MCP ejecutándose en puerto ${PORT}`);
  console.log(`📱 Frontend: http://localhost:5173`);
  console.log(`🔗 API: http://localhost:${PORT}/api`);
  console.log(`💾 Almacenamiento: Simulado (para testing)`);
});

