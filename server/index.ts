import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import compression from 'compression';
import dotenv from 'dotenv';
import { connectDatabase } from './config/database';
import authRoutes from './routes/auth';
import userRoutes from './routes/users';
import articleRoutes from './routes/articles';
import pointsRoutes from './routes/points';
import trastaliaPurchaseRoutes from './routes/trastalia-purchases';

// Cargar variables de entorno
dotenv.config();

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

// Rutas
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/articles', articleRoutes);
app.use('/api/points', pointsRoutes);
app.use('/api/trastalia-purchases', trastaliaPurchaseRoutes);

// Ruta de salud
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development'
  });
});

// Ruta para actualizar lógica de artículos
app.get('/api/articles/update-logic', async (req, res) => {
  try {
    const Article = require('./models/Article').default;
    
    // Artículos que solo se venden por dinero
    const articlesOnlyMoney = [
      'iPhone 13 Pro Max 256GB - Azul Sierra',
      'MacBook Air M1 13" - Gris Espacial', 
      'Nintendo Switch OLED - Blanco',
      'Samsung Galaxy S22 Ultra 512GB - Negro',
      'iPad Pro 12.9" M2 - Gris Espacial',
      'PlayStation 5 + 3 Juegos',
      'Apple Watch Series 8 45mm - Azul Medianoche',
      'Cámara Canon EOS R6 Mark II + Objetivo 24-70mm',
      'Bicicleta Eléctrica Trek Powerfly 7',
      'Sofá Chesterfield de Cuero Genuino',
      'Guitarra Fender Stratocaster American Professional II',
      'Kit de Herramientas Profesionales Bosch'
    ];

    // Artículos que se venden por dinero Y por intercambio
    const articlesWithExchange = [
      'Sony PlayStation 5 + 2 Mandos DualSense',
      'DJI Mavic 3 Pro + 3 Baterías',
      'Colección Completa de Cómics Marvel (2015-2020)',
      'Reloj Rolex Submariner Date 116610LN'
    ];

    // Actualizar artículos que solo se venden por dinero
    const updateOnlyMoney = await Article.updateMany(
      { title: { $in: articlesOnlyMoney } },
      { 
        $set: { 
          isForSale: true, 
          isForExchange: false, 
          wantsPoints: false, 
          wantsDirectExchange: false 
        } 
      }
    );

    // Actualizar artículos que se venden por dinero Y por intercambio
    const updateWithExchange = await Article.updateMany(
      { title: { $in: articlesWithExchange } },
      { 
        $set: { 
          isForSale: true, 
          isForExchange: true, 
          wantsPoints: true, 
          wantsDirectExchange: true 
        } 
      }
    );

    res.json({
      success: true,
      message: 'Lógica de artículos actualizada exitosamente',
      data: {
        onlyMoney: updateOnlyMoney.modifiedCount,
        withExchange: updateWithExchange.modifiedCount
      }
    });
  } catch (error) {
    console.error('Error updating articles logic:', error);
    res.status(500).json({
      success: false,
      message: 'Error al actualizar la lógica de artículos'
    });
  }
});

// Middleware de manejo de errores
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
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
      console.log(`🚀 Servidor backend ejecutándose en puerto ${PORT}`);
      console.log(`📱 Frontend: ${process.env.FRONTEND_URL || 'http://localhost:5174'}`);
      console.log(`🔗 API: http://localhost:${PORT}/api`);
      console.log(`💾 Almacenamiento: MongoDB Atlas`);
    });
  } catch (error) {
    console.error('❌ Error al iniciar servidor:', error);
    process.exit(1);
  }
};

startServer();
