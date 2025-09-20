import mongoose, { Document, Schema } from 'mongoose';

export interface ITransaction extends Document {
  type: 'purchase' | 'sale' | 'exchange' | 'points_earned' | 'points_spent' | 'logistics_service';
  user: mongoose.Types.ObjectId;
  article?: mongoose.Types.ObjectId;
  logisticsCenter?: mongoose.Types.ObjectId;
  amount: number;
  currency: 'money' | 'points';
  pointsEarned?: number;
  pointsSpent?: number;
  description: string;
  status: 'pending' | 'completed' | 'cancelled' | 'refunded';
  metadata?: {
    exchangeRate?: number;
    logisticsFee?: number;
    reputationBonus?: number;
    experienceGained?: number;
  };
  createdAt: Date;
  updatedAt: Date;
}

const TransactionSchema = new Schema<ITransaction>({
  type: {
    type: String,
    enum: ['purchase', 'sale', 'exchange', 'points_earned', 'points_spent', 'logistics_service'],
    required: [true, 'El tipo de transacción es obligatorio']
  },
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'El usuario es obligatorio']
  },
  article: {
    type: Schema.Types.ObjectId,
    ref: 'Article'
  },
  logisticsCenter: {
    type: Schema.Types.ObjectId,
    ref: 'LogisticsCenter'
  },
  amount: {
    type: Number,
    required: [true, 'El monto es obligatorio'],
    min: [0, 'El monto no puede ser negativo']
  },
  currency: {
    type: String,
    enum: ['money', 'points'],
    required: [true, 'La moneda es obligatoria']
  },
  pointsEarned: {
    type: Number,
    min: [0, 'Los puntos ganados no pueden ser negativos']
  },
  pointsSpent: {
    type: Number,
    min: [0, 'Los puntos gastados no pueden ser negativos']
  },
  description: {
    type: String,
    required: [true, 'La descripción es obligatoria'],
    trim: true,
    maxlength: [500, 'La descripción no puede exceder 500 caracteres']
  },
  status: {
    type: String,
    enum: ['pending', 'completed', 'cancelled', 'refunded'],
    default: 'pending'
  },
  metadata: {
    exchangeRate: {
      type: Number,
      min: [0, 'La tasa de cambio no puede ser negativa']
    },
    logisticsFee: {
      type: Number,
      min: [0, 'La tarifa logística no puede ser negativa']
    },
    reputationBonus: {
      type: Number,
      min: [0, 'El bonus de reputación no puede ser negativo']
    },
    experienceGained: {
      type: Number,
      min: [0, 'La experiencia ganada no puede ser negativa']
    }
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
TransactionSchema.index({ user: 1 });
TransactionSchema.index({ type: 1 });
TransactionSchema.index({ status: 1 });
TransactionSchema.index({ currency: 1 });
TransactionSchema.index({ createdAt: -1 });

export default mongoose.model<ITransaction>('Transaction', TransactionSchema);






