import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import compression from 'compression';
import mongoose from 'mongoose';

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
    
    // Simular autenticación (en producción usarías una base de datos real)
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
const startServer = async () => {
  try {
    // Conectar a MongoDB Atlas
    await connectDatabase();
    
    app.listen(PORT, () => {
      console.log(`🚀 Servidor MCP ejecutándose en puerto ${PORT}`);
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
