import mongoose, { Document, Schema } from 'mongoose';

export interface IArticle extends Document {
  title: string;
  description: string;
  price: number;
  pointsPrice?: number; // Precio en puntos Trastalia
  category: string;
  condition: 'nuevo' | 'usado' | 'excelente' | 'bueno' | 'regular';
  images: string[];
  seller: mongoose.Types.ObjectId;
  status: 'disponible' | 'vendido' | 'reservado' | 'intercambiado' | 'en_centro_logistico' | 'comprado_por_trastalia';
  isForSale: boolean;
  isForExchange: boolean;
  exchangeFor?: string; // Qué busca a cambio
  location: string;
  tags: string[];
  views: number;
  
  // Modalidades de venta
  saleMode: 'direct_from_home' | 'logistics_center' | 'trastalia_purchase' | 'points_exchange';
  
  // Opción 1: Venta directa desde casa
  directFromHome: {
    enabled: boolean;
    price: number;
    shippingCost: number; // Costo de envío que paga el comprador
  };
  
  // Opción 2: Venta desde centro logístico
  logisticsCenterSale: {
    enabled: boolean;
    price: number;
    commission: number; // Comisión que se queda Trastalia
    storageCost: number; // Costo de almacenamiento
    logisticsCenter?: mongoose.Types.ObjectId;
  };
  
  // Opción 3: Compra directa por Trastalia
  trastaliaPurchase: {
    enabled: boolean;
    adminPrice: number; // Precio que decide el administrador
    demandLevel: 'low' | 'medium' | 'high'; // Nivel de demanda
    adminApproved: boolean; // Si el admin aprueba la compra
  };
  
  // Opción 4: Venta por puntos
  pointsExchange: {
    enabled: boolean;
    pointsPrice: number; // Precio en puntos
    pointsPerEuro: number; // Conversión puntos por euro (ej: 100 puntos = 1€)
  };
  
  // Campos de administración
  useLogisticsCenter: boolean; // Si el artículo está en centro logístico
  adminStatus: 'pending' | 'approved_money' | 'approved_points' | 'approved_both' | 'rejected' | 'rejected_by_seller';
  adminDecision?: {
    money: boolean;
    points: boolean;
    moneyPrice?: number;
    pointsAmount?: number;
    reject: boolean;
    rejectReason?: string;
    date: Date;
  };
  sellerAccepted?: boolean; // Si el vendedor aceptó la oferta
  sellerAcceptedDate?: Date; // Fecha de aceptación del vendedor
  sellerRejected?: boolean; // Si el vendedor rechazó la oferta
  sellerRejectedDate?: Date; // Fecha de rechazo del vendedor
  
  createdAt: Date;
  updatedAt: Date;
}

const ArticleSchema = new Schema<IArticle>({
  title: {
    type: String,
    required: [true, 'El título es obligatorio'],
    trim: true,
    minlength: [5, 'El título debe tener al menos 5 caracteres'],
    maxlength: [100, 'El título no puede exceder 100 caracteres']
  },
  description: {
    type: String,
    required: [true, 'La descripción es obligatoria'],
    trim: true,
    minlength: [10, 'La descripción debe tener al menos 10 caracteres'],
    maxlength: [1000, 'La descripción no puede exceder 1000 caracteres']
  },
  price: {
    type: Number,
    required: [true, 'El precio es obligatorio'],
    min: [0, 'El precio no puede ser negativo']
  },
  pointsPrice: {
    type: Number,
    min: [0, 'El precio en puntos no puede ser negativo']
  },
  category: {
    type: String,
    required: [true, 'La categoría es obligatoria'],
    enum: [
      'electrónica', 'ropa', 'hogar', 'deportes', 'libros', 
      'música', 'juegos', 'coches', 'motos', 'bicicletas',
      'herramientas', 'jardín', 'mascotas', 'arte', 'antigüedades',
      'otros'
    ]
  },
  condition: {
    type: String,
    required: [true, 'El estado es obligatorio'],
    enum: ['nuevo', 'usado', 'excelente', 'bueno', 'regular'],
    default: 'usado'
  },
  images: [{
    type: String
  }],
  seller: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'El vendedor es obligatorio']
  },
  status: {
    type: String,
    enum: ['disponible', 'vendido', 'reservado', 'intercambiado', 'en_centro_logistico', 'comprado_por_trastalia'],
    default: 'disponible'
  },
  isForSale: {
    type: Boolean,
    default: true
  },
  isForExchange: {
    type: Boolean,
    default: false
  },
  exchangeFor: {
    type: String,
    trim: true,
    maxlength: [200, 'La descripción del intercambio no puede exceder 200 caracteres']
  },
  location: {
    type: String,
    required: [true, 'La ubicación es obligatoria'],
    trim: true
  },
  tags: [{
    type: String,
    trim: true,
    maxlength: [20, 'Cada etiqueta no puede exceder 20 caracteres']
  }],
  views: {
    type: Number,
    default: 0
  },
  
  // Modalidades de venta
  saleMode: {
    type: String,
    enum: ['direct_from_home', 'logistics_center', 'trastalia_purchase', 'points_exchange'],
    default: 'direct_from_home'
  },
  
  // Opción 1: Venta directa desde casa
  directFromHome: {
    enabled: {
      type: Boolean,
      default: true
    },
    price: {
      type: Number,
      min: [0, 'El precio no puede ser negativo']
    },
    shippingCost: {
      type: Number,
      min: [0, 'El costo de envío no puede ser negativo'],
      default: 0
    }
  },
  
  // Opción 2: Venta desde centro logístico
  logisticsCenterSale: {
    enabled: {
      type: Boolean,
      default: false
    },
    price: {
      type: Number,
      min: [0, 'El precio no puede ser negativo']
    },
    commission: {
      type: Number,
      min: [0, 'La comisión no puede ser negativa'],
      max: [100, 'La comisión no puede ser mayor al 100%'],
      default: 10 // 10% por defecto
    },
    storageCost: {
      type: Number,
      min: [0, 'El costo de almacenamiento no puede ser negativo'],
      default: 0
    },
    logisticsCenter: {
      type: Schema.Types.ObjectId,
      ref: 'LogisticsCenter'
    }
  },
  
  // Opción 3: Compra directa por Trastalia
  trastaliaPurchase: {
    enabled: {
      type: Boolean,
      default: false
    },
    adminPrice: {
      type: Number,
      min: [0, 'El precio del admin no puede ser negativo']
    },
    demandLevel: {
      type: String,
      enum: ['low', 'medium', 'high'],
      default: 'low'
    },
    adminApproved: {
      type: Boolean,
      default: false
    }
  },
  
  // Opción 4: Venta por puntos
  pointsExchange: {
    enabled: {
      type: Boolean,
      default: false
    },
    pointsPrice: {
      type: Number,
      min: [0, 'El precio en puntos no puede ser negativo']
    },
    pointsPerEuro: {
      type: Number,
      min: [1, 'Debe haber al menos 1 punto por euro'],
      default: 100 // 100 puntos = 1€ por defecto
    }
  },
  
  // Campos de administración
  useLogisticsCenter: {
    type: Boolean,
    default: false
  },
  adminStatus: {
    type: String,
    enum: ['pending', 'approved_money', 'approved_points', 'approved_both', 'rejected', 'rejected_by_seller'],
    default: 'pending'
  },
  adminDecision: {
    money: {
      type: Boolean,
      default: false
    },
    points: {
      type: Boolean,
      default: false
    },
    moneyPrice: {
      type: Number,
      min: [0, 'El precio en dinero no puede ser negativo']
    },
    pointsAmount: {
      type: Number,
      min: [0, 'La cantidad de puntos no puede ser negativa']
    },
    reject: {
      type: Boolean,
      default: false
    },
    rejectReason: {
      type: String,
      trim: true,
      maxlength: [500, 'El motivo del rechazo no puede exceder 500 caracteres']
    },
    date: {
      type: Date,
      default: Date.now
    }
  },
  sellerAccepted: {
    type: Boolean,
    default: false
  },
  sellerAcceptedDate: {
    type: Date
  },
  sellerRejected: {
    type: Boolean,
    default: false
  },
  sellerRejectedDate: {
    type: Date
  }
}, {
  timestamps: true,
  toJSON: {
    transform: function(doc: any, ret: any) {
      ret.id = ret._id;
      delete ret._id;
      delete ret.__v;
      return ret;
    }
  }
});

// Índices para mejorar rendimiento
ArticleSchema.index({ title: 'text', description: 'text', tags: 'text' });
ArticleSchema.index({ category: 1 });
ArticleSchema.index({ condition: 1 });
ArticleSchema.index({ status: 1 });
ArticleSchema.index({ seller: 1 });
ArticleSchema.index({ price: 1 });
ArticleSchema.index({ location: 1 });
ArticleSchema.index({ createdAt: -1 });

export default mongoose.model<IArticle>('Article', ArticleSchema);
