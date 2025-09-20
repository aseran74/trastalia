import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

// Cargar variables de entorno
dotenv.config();

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

// Datos de prueba
const testArticles = [
  {
    _id: '507f1f77bcf86cd799439011',
    title: 'iPhone 13 Pro',
    description: 'iPhone 13 Pro en excelente estado, poco uso',
    price: 800,
    category: 'Electrónicos',
    condition: 'Usado',
    location: 'Madrid, España',
    images: ['https://via.placeholder.com/300x200'],
    seller: {
      _id: '507f1f77bcf86cd799439011',
      name: 'Juan Pérez',
      email: 'juan@example.com'
    },
    status: 'disponible',
    views: 0,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    _id: '507f1f77bcf86cd799439012',
    title: 'Sofá de Cuero',
    description: 'Sofá de cuero genuino, muy cómodo',
    price: 450,
    category: 'Hogar',
    condition: 'Usado',
    location: 'Barcelona, España',
    images: ['https://via.placeholder.com/300x200'],
    seller: {
      _id: '507f1f77bcf86cd799439011',
      name: 'Juan Pérez',
      email: 'juan@example.com'
    },
    status: 'disponible',
    views: 0,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    _id: '507f1f77bcf86cd799439013',
    title: 'Smart TV Samsung 55"',
    description: 'Smart TV Samsung 55 pulgadas, 4K',
    price: 600,
    category: 'Electrónicos',
    condition: 'Usado',
    location: 'Valencia, España',
    images: ['https://via.placeholder.com/300x200'],
    seller: {
      _id: '507f1f77bcf86cd799439011',
      name: 'Juan Pérez',
      email: 'juan@example.com'
    },
    status: 'disponible',
    views: 0,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    _id: '507f1f77bcf86cd799439014',
    title: 'Libro de García Márquez',
    description: 'Cien años de soledad, edición especial',
    price: 25,
    category: 'Libros',
    condition: 'Nuevo',
    location: 'Sevilla, España',
    images: ['https://via.placeholder.com/300x200'],
    seller: {
      _id: '507f1f77bcf86cd799439011',
      name: 'Juan Pérez',
      email: 'juan@example.com'
    },
    status: 'disponible',
    views: 0,
    createdAt: new Date(),
    updatedAt: new Date()
  }
];

// Rutas
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    timestamp: new Date().toISOString(),
    environment: 'development',
    mode: 'simulado'
  });
});

// GET /api/articles - Obtener todos los artículos
app.get('/api/articles', (req, res) => {
  try {
    const { category, condition, minPrice, maxPrice, location, search } = req.query;
    
    let filteredArticles = [...testArticles];
    
    // Aplicar filtros
    if (category) {
      filteredArticles = filteredArticles.filter(article => 
        article.category.toLowerCase() === category.toString().toLowerCase()
      );
    }
    
    if (condition) {
      filteredArticles = filteredArticles.filter(article => 
        article.condition.toLowerCase() === condition.toString().toLowerCase()
      );
    }
    
    if (minPrice) {
      filteredArticles = filteredArticles.filter(article => 
        article.price >= Number(minPrice)
      );
    }
    
    if (maxPrice) {
      filteredArticles = filteredArticles.filter(article => 
        article.price <= Number(maxPrice)
      );
    }
    
    if (location) {
      filteredArticles = filteredArticles.filter(article => 
        article.location.toLowerCase().includes(location.toString().toLowerCase())
      );
    }
    
    if (search) {
      const searchTerm = search.toString().toLowerCase();
      filteredArticles = filteredArticles.filter(article => 
        article.title.toLowerCase().includes(searchTerm) ||
        article.description.toLowerCase().includes(searchTerm)
      );
    }
    
    res.json({
      success: true,
      data: filteredArticles
    });
  } catch (error) {
    console.error('Error fetching articles:', error);
    res.status(500).json({
      success: false,
      message: 'Error al obtener artículos'
    });
  }
});

// GET /api/articles/:id - Obtener un artículo por ID
app.get('/api/articles/:id', (req, res) => {
  try {
    const article = testArticles.find(a => a._id === req.params.id);

    if (!article) {
      return res.status(404).json({
        success: false,
        message: 'Artículo no encontrado'
      });
    }
    
    // Incrementar vistas
    article.views += 1;

    res.json({
      success: true,
      data: article
    });
  } catch (error) {
    console.error('Error fetching article:', error);
    res.status(500).json({
      success: false,
      message: 'Error al obtener el artículo'
    });
  }
});

// POST /api/articles - Crear un nuevo artículo (simulado)
app.post('/api/articles', (req, res) => {
  try {
    const newArticle = {
      _id: `507f1f77bcf86cd7994390${Date.now().toString().slice(-3)}`,
      ...req.body,
      seller: {
        _id: '507f1f77bcf86cd799439011',
        name: 'Usuario Test',
        email: 'test@example.com'
      },
      status: 'disponible',
      views: 0,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    
    testArticles.push(newArticle);
    
    res.status(201).json({
      success: true,
      message: 'Artículo creado exitosamente',
      data: newArticle
    });
  } catch (error) {
    console.error('Error creating article:', error);
    res.status(500).json({
      success: false,
      message: 'Error al crear el artículo'
    });
  }
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
  console.log(`🚀 Servidor backend SIMULADO ejecutándose en puerto ${PORT}`);
  console.log(`📱 Frontend: ${process.env.FRONTEND_URL || 'http://localhost:5174'}`);
      console.log(`🔗 API: http://localhost:${PORT}/api`);
  console.log(`💾 Almacenamiento: Modo simulado (sin MongoDB)`);
  console.log(`📋 Artículos de prueba: ${testArticles.length}`);
});