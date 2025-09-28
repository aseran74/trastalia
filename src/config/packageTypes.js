// Configuración de tipos de cajas estándar para envío
export const PACKAGE_TYPES = {
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
}

// Función para obtener el tipo de caja recomendado basado en las dimensiones
export function getRecommendedPackageType(weight, horizontal, vertical, fondo) {
  const dimensions = { weight, horizontal, vertical, fondo }
  
  for (const [type, config] of Object.entries(PACKAGE_TYPES)) {
    const dims = config.dimensions
    
    // Verificar si las dimensiones del artículo caben en la caja
    if (
      dimensions.weight <= config.maxWeight &&
      dimensions.horizontal <= dims.horizontal &&
      dimensions.vertical <= dims.vertical &&
      dimensions.fondo <= dims.fondo
    ) {
      return type
    }
  }
  
  // Si no encaja en ningún tipo, devolver el más grande
  return 'CAJA_EXTRA_GRANDE'
}

// Función para obtener el coste de envío
export function getShippingCost(packageType) {
  return PACKAGE_TYPES[packageType]?.shippingCost || 12.00
}
