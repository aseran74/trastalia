import mongoose, { Document, Schema } from 'mongoose';

export interface ILogisticsCenter extends Document {
  name: string;
  type: 'nave' | 'estación' | 'puerto';
  location: {
    sector: string;
    coordinates: {
      x: number;
      y: number;
      z: number;
    };
  };
  capacity: {
    maxArticles: number;
    currentArticles: number;
    maxWeight: number;
    currentWeight: number;
  };
  services: string[];
  owner: mongoose.Types.ObjectId;
  status: 'activo' | 'mantenimiento' | 'inactivo';
  level: number;
  experience: number;
  reputation: number;
  createdAt: Date;
  updatedAt: Date;
}

const LogisticsCenterSchema = new Schema<ILogisticsCenter>({
  name: {
    type: String,
    required: [true, 'El nombre es obligatorio'],
    trim: true,
    minlength: [3, 'El nombre debe tener al menos 3 caracteres'],
    maxlength: [50, 'El nombre no puede exceder 50 caracteres']
  },
  type: {
    type: String,
    enum: ['nave', 'estación', 'puerto'],
    required: [true, 'El tipo es obligatorio']
  },
  location: {
    sector: {
      type: String,
      required: [true, 'El sector es obligatorio'],
      trim: true
    },
    coordinates: {
      x: { type: Number, required: true },
      y: { type: Number, required: true },
      z: { type: Number, required: true }
    }
  },
  capacity: {
    maxArticles: {
      type: Number,
      required: [true, 'La capacidad máxima de artículos es obligatoria'],
      min: [1, 'La capacidad debe ser al menos 1']
    },
    currentArticles: {
      type: Number,
      default: 0,
      min: [0, 'Los artículos actuales no pueden ser negativos']
    },
    maxWeight: {
      type: Number,
      required: [true, 'El peso máximo es obligatorio'],
      min: [1, 'El peso máximo debe ser al menos 1']
    },
    currentWeight: {
      type: Number,
      default: 0,
      min: [0, 'El peso actual no puede ser negativo']
    }
  },
  services: [{
    type: String,
    enum: [
      'almacenamiento',
      'transporte',
      'reparación',
      'comercio',
      'intercambio',
      'seguridad',
      'comunicaciones',
      'navegación'
    ]
  }],
  owner: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'El propietario es obligatorio']
  },
  status: {
    type: String,
    enum: ['activo', 'mantenimiento', 'inactivo'],
    default: 'activo'
  },
  level: {
    type: Number,
    default: 1,
    min: [1, 'El nivel mínimo es 1'],
    max: [100, 'El nivel máximo es 100']
  },
  experience: {
    type: Number,
    default: 0,
    min: [0, 'La experiencia no puede ser negativa']
  },
  reputation: {
    type: Number,
    default: 100,
    min: [0, 'La reputación no puede ser negativa'],
    max: [1000, 'La reputación máxima es 1000']
  }
}, {
  timestamps: true,
  toJSON: {
    transform: function(doc, ret) {
      ret.id = ret._id;
      delete ret._id;
      delete ret.__v;
      return ret;
    }
  }
});

// Índices para mejorar rendimiento
LogisticsCenterSchema.index({ owner: 1 });
LogisticsCenterSchema.index({ type: 1 });
LogisticsCenterSchema.index({ status: 1 });
LogisticsCenterSchema.index({ 'location.sector': 1 });
LogisticsCenterSchema.index({ level: 1 });

export default mongoose.model<ILogisticsCenter>('LogisticsCenter', LogisticsCenterSchema);






