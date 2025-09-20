import mongoose, { Document, Schema } from 'mongoose';

export interface IPointsTransaction extends Document {
  user: mongoose.Types.ObjectId;
  type: 'earn' | 'spend' | 'refund' | 'admin_adjustment';
  amount: number;
  description: string;
  reference?: string; // Referencia al artículo o transacción relacionada
  article?: mongoose.Types.ObjectId; // Artículo relacionado si aplica
  status: 'pending' | 'completed' | 'cancelled';
  metadata?: {
    conversionRate?: number; // Tasa de conversión puntos/euro
    originalPrice?: number; // Precio original en euros
    adminId?: mongoose.Types.ObjectId; // Admin que hizo el ajuste
  };
  createdAt: Date;
  updatedAt: Date;
}

const PointsTransactionSchema = new Schema<IPointsTransaction>({
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  type: {
    type: String,
    enum: ['earn', 'spend', 'refund', 'admin_adjustment'],
    required: true
  },
  amount: {
    type: Number,
    required: true,
    min: [0, 'La cantidad de puntos no puede ser negativa']
  },
  description: {
    type: String,
    required: true,
    trim: true,
    maxlength: [200, 'La descripción no puede exceder 200 caracteres']
  },
  reference: {
    type: String,
    trim: true,
    maxlength: [100, 'La referencia no puede exceder 100 caracteres']
  },
  article: {
    type: Schema.Types.ObjectId,
    ref: 'Article'
  },
  status: {
    type: String,
    enum: ['pending', 'completed', 'cancelled'],
    default: 'pending'
  },
  metadata: {
    conversionRate: {
      type: Number,
      min: [1, 'La tasa de conversión debe ser al menos 1']
    },
    originalPrice: {
      type: Number,
      min: [0, 'El precio original no puede ser negativo']
    },
    adminId: {
      type: Schema.Types.ObjectId,
      ref: 'User'
    }
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

// Índices
PointsTransactionSchema.index({ user: 1, createdAt: -1 });
PointsTransactionSchema.index({ type: 1 });
PointsTransactionSchema.index({ status: 1 });
PointsTransactionSchema.index({ article: 1 });

export default mongoose.model<IPointsTransaction>('PointsTransaction', PointsTransactionSchema);

