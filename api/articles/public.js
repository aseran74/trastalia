// Función serverless específica para /api/articles/public
export default function handler(req, res) {
  // Configurar CORS
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, Authorization'
  );

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

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
    
    res.status(200).json({
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
}
