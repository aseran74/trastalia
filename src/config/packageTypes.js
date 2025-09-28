// Configuración de tipos de paquetes para envío
export const PACKAGE_TYPES = {
  XS: {
    name: 'XS - Muy Pequeño',
    description: 'Joyas, relojes, accesorios pequeños',
    dimensions: {
      weight: { min: 0, max: 0.5 }, // kg
      length: { min: 0, max: 20 },   // cm
      width: { min: 0, max: 15 },    // cm
      height: { min: 0, max: 10 }    // cm
    },
    shippingCost: 3.50, // €
    examples: ['Anillos', 'Pulseras', 'Relojes', 'Auriculares pequeños', 'Memorias USB']
  },
  S: {
    name: 'S - Pequeño',
    description: 'Libros, ropa, accesorios medianos',
    dimensions: {
      weight: { min: 0.5, max: 2 }, // kg
      length: { min: 15, max: 30 },  // cm
      width: { min: 10, max: 25 },   // cm
      height: { min: 5, max: 15 }    // cm
    },
    shippingCost: 4.50, // €
    examples: ['Libros', 'Camisetas', 'Zapatos', 'Mochilas pequeñas', 'Tablets']
  },
  M: {
    name: 'M - Mediano',
    description: 'Electrodomésticos pequeños, ropa en cajas',
    dimensions: {
      weight: { min: 2, max: 5 },    // kg
      length: { min: 25, max: 50 },  // cm
      width: { min: 20, max: 40 },   // cm
      height: { min: 10, max: 30 }   // cm
    },
    shippingCost: 6.50, // €
    examples: ['Laptops', 'Consolas portátiles', 'Cámaras', 'Botas', 'Maletas pequeñas']
  },
  L: {
    name: 'L - Grande',
    description: 'Electrodomésticos medianos, muebles pequeños',
    dimensions: {
      weight: { min: 5, max: 15 },   // kg
      length: { min: 40, max: 80 },  // cm
      width: { min: 30, max: 60 },   // cm
      height: { min: 20, max: 50 }   // cm
    },
    shippingCost: 12.00, // €
    examples: ['TV 32-43"', 'Microondas', 'Bicicletas plegables', 'Muebles pequeños', 'Monitores']
  },
  XL: {
    name: 'XL - Muy Grande',
    description: 'Electrodomésticos grandes, muebles medianos',
    dimensions: {
      weight: { min: 15, max: 30 },  // kg
      length: { min: 70, max: 120 }, // cm
      width: { min: 50, max: 80 },   // cm
      height: { min: 40, max: 70 }   // cm
    },
    shippingCost: 25.00, // €
    examples: ['TV 50-65"', 'Lavadoras', 'Frigoríficos', 'Sofás pequeños', 'Bicicletas']
  },
  XXL: {
    name: 'XXL - Extra Grande',
    description: 'Muebles grandes, electrodomésticos de gran tamaño',
    dimensions: {
      weight: { min: 30, max: 100 }, // kg
      length: { min: 100, max: 200 }, // cm
      width: { min: 70, max: 150 },   // cm
      height: { min: 60, max: 120 }   // cm
    },
    shippingCost: 45.00, // €
    examples: ['TV 70"+', 'Armarios', 'Mesas grandes', 'Sofás grandes', 'Electrodomésticos industriales']
  }
}

// Función para obtener el tipo de paquete recomendado basado en las dimensiones
export function getRecommendedPackageType(weight, length, width, height) {
  const dimensions = { weight, length, width, height }
  
  for (const [type, config] of Object.entries(PACKAGE_TYPES)) {
    const dims = config.dimensions
    
    if (
      dimensions.weight >= dims.weight.min && dimensions.weight <= dims.weight.max &&
      dimensions.length >= dims.length.min && dimensions.length <= dims.length.max &&
      dimensions.width >= dims.width.min && dimensions.width <= dims.width.max &&
      dimensions.height >= dims.height.min && dimensions.height <= dims.height.max
    ) {
      return type
    }
  }
  
  // Si no encaja en ningún tipo, devolver el más grande
  return 'XXL'
}

// Función para obtener el coste de envío
export function getShippingCost(packageType) {
  return PACKAGE_TYPES[packageType]?.shippingCost || 45.00
}
