// Configuración de paquetes temáticos con subcategorías
export const THEME_PACKAGES = {
  'recien-nacido': {
    id: 'recien-nacido',
    name: 'Recién Nacido',
    emoji: '👶',
    description: 'Todo lo que necesitas para tu bebé recién nacido',
    color: 'from-pink-500 to-purple-500',
    items: [
      { name: 'Carrito', emoji: '🛒', essential: true },
      { name: 'Cuna', emoji: '🛏️', essential: true },
      { name: 'Sillita de coche', emoji: '🚗', essential: true },
      { name: 'Bañera', emoji: '🛁', essential: true },
      { name: 'Cambiador', emoji: '🧸', essential: false },
      { name: 'Hamaca', emoji: '🪑', essential: false },
      { name: 'Portabebé', emoji: '👶', essential: false },
      { name: 'Ropa de bebé', emoji: '👕', essential: false },
      { name: 'Biberones', emoji: '🍼', essential: false },
      { name: 'Pañales', emoji: '🧻', essential: false }
    ],
    benefits: [
      'Ahorro del 40% vs comprar por separado',
      'Productos verificados y seguros',
      'Entrega coordinada en una sola vez',
      'Garantía de calidad en todos los productos'
    ]
  },
  
  'esqui': {
    id: 'esqui',
    name: 'Pack Esquí',
    emoji: '⛷️',
    description: 'Equipo completo para disfrutar de la nieve',
    color: 'from-blue-500 to-cyan-500',
    items: [
      { name: 'Esquís', emoji: '🎿', essential: true },
      { name: 'Botas de esquí', emoji: '🥾', essential: true },
      { name: 'Anorak', emoji: '🧥', essential: true },
      { name: 'Guantes', emoji: '🧤', essential: true },
      { name: 'Pantalones', emoji: '👖', essential: true },
      { name: 'Casco', emoji: '🪖', essential: true },
      { name: 'Gafas', emoji: '🥽', essential: false },
      { name: 'Bastones', emoji: '🎯', essential: false },
      { name: 'Ropa térmica', emoji: '👕', essential: false }
    ],
    benefits: [
      'Ahorro del 35% vs alquiler diario',
      'Equipo profesional verificado',
      'Mantenimiento incluido',
      'Asesoramiento técnico incluido'
    ]
  },

  'boxeo': {
    id: 'boxeo',
    name: 'Pack Boxeo',
    emoji: '🥊',
    description: 'Equipo completo para entrenar boxeo',
    color: 'from-red-500 to-orange-500',
    items: [
      { name: 'Guantes de boxeo', emoji: '🥊', essential: true },
      { name: 'Protector bucal', emoji: '🦷', essential: true },
      { name: 'Casco', emoji: '🪖', essential: true },
      { name: 'Vendas', emoji: '🩹', essential: true },
      { name: 'Saco de boxeo', emoji: '🎯', essential: false },
      { name: 'Pads de entrenamiento', emoji: '👋', essential: false },
      { name: 'Ropa deportiva', emoji: '👕', essential: false },
      { name: 'Cuerda de saltar', emoji: '🪢', essential: false }
    ],
    benefits: [
      'Ahorro del 30% vs comprar individual',
      'Equipo de calidad profesional',
      'Tallas ajustadas a tu medida',
      'Guía de entrenamiento incluida'
    ]
  },

  'musica': {
    id: 'musica',
    name: 'Pack Musical',
    emoji: '🎵',
    description: 'Todo para empezar en la música',
    color: 'from-purple-500 to-indigo-500',
    items: [
      { name: 'Bajo', emoji: '🎸', essential: true },
      { name: 'Amplificador', emoji: '🔊', essential: true },
      { name: 'Cable', emoji: '🔌', essential: true },
      { name: 'Libro de aprendizaje', emoji: '📚', essential: true },
      { name: 'Afinador', emoji: '🎼', essential: false },
      { name: 'Correa', emoji: '🎒', essential: false },
      { name: 'Púas', emoji: '🎯', essential: false },
      { name: 'Metrónomo', emoji: '⏰', essential: false }
    ],
    benefits: [
      'Ahorro del 25% vs comprar por separado',
      'Instrumentos verificados y calibrados',
      'Lecciones básicas incluidas',
      'Garantía extendida en todos los productos'
    ]
  },

  'cocina': {
    id: 'cocina',
    name: 'Pack Cocina',
    emoji: '👨‍🍳',
    description: 'Equipamiento completo para cocinar como un chef',
    color: 'from-orange-500 to-red-500',
    items: [
      { name: 'Cuchillos profesionales', emoji: '🔪', essential: true },
      { name: 'Tabla de cortar', emoji: '🥩', essential: true },
      { name: 'Sartén antiadherente', emoji: '🍳', essential: true },
      { name: 'Olla grande', emoji: '🍲', essential: true },
      { name: 'Báscula digital', emoji: '⚖️', essential: false },
      { name: 'Batidora', emoji: '🥤', essential: false },
      { name: 'Rallador', emoji: '🧀', essential: false },
      { name: 'Colador', emoji: '🍝', essential: false }
    ],
    benefits: [
      'Ahorro del 30% vs comprar individual',
      'Materiales de calidad profesional',
      'Kit de mantenimiento incluido',
      'Recetario exclusivo incluido'
    ]
  },

  'jardineria': {
    id: 'jardineria',
    name: 'Pack Jardinería',
    emoji: '🌱',
    description: 'Herramientas completas para tu jardín',
    color: 'from-green-500 to-emerald-500',
    items: [
      { name: 'Palas', emoji: '🪣', essential: true },
      { name: 'Rastrillo', emoji: '🌾', essential: true },
      { name: 'Tijeras de podar', emoji: '✂️', essential: true },
      { name: 'Regadera', emoji: '💧', essential: true },
      { name: 'Guantes', emoji: '🧤', essential: false },
      { name: 'Semillas', emoji: '🌰', essential: false },
      { name: 'Macetas', emoji: '🪴', essential: false },
      { name: 'Fertilizante', emoji: '🧪', essential: false }
    ],
    benefits: [
      'Ahorro del 35% vs comprar individual',
      'Herramientas ergonómicas',
      'Guía de jardinería incluida',
      'Garantía en todas las herramientas'
    ]
  }
}

// Función para obtener todos los paquetes
export const getAllPackages = () => {
  return Object.values(THEME_PACKAGES)
}

// Función para obtener un paquete por ID
export const getPackageById = (id) => {
  return THEME_PACKAGES[id] || null
}

// Función para buscar paquetes por nombre
export const searchPackages = (query) => {
  const packages = getAllPackages()
  const lowercaseQuery = query.toLowerCase()
  
  return packages.filter(pkg => 
    pkg.name.toLowerCase().includes(lowercaseQuery) ||
    pkg.description.toLowerCase().includes(lowercaseQuery) ||
    pkg.items.some(item => item.name.toLowerCase().includes(lowercaseQuery))
  )
}

// Función para obtener paquetes por categoría relacionada
export const getPackagesByCategory = (category) => {
  const categoryMapping = {
    'deportes': ['esqui', 'boxeo'],
    'musica': ['musica'],
    'hogar': ['cocina', 'jardineria'],
    'bebe': ['recien-nacido'],
    'libros': ['musica'] // Los libros de música están en el pack musical
  }
  
  const packageIds = categoryMapping[category] || []
  return packageIds.map(id => getPackageById(id)).filter(Boolean)
}

export default THEME_PACKAGES
