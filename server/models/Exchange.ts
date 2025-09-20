import mongoose, { Document, Schema } from 'mongoose';

export interface IExchange extends Document {
  requester: mongoose.Types.ObjectId;
  requestedArticle: mongoose.Types.ObjectId;
  offeredArticle: mongoose.Types.ObjectId;
  owner: mongoose.Types.ObjectId; // Dueño del artículo solicitado
  status: 'pendiente' | 'aceptado' | 'rechazado' | 'completado' | 'cancelado';
  message?: string;
  exchangeDate?: Date;
  location?: string;
  createdAt: Date;
  updatedAt: Date;
}

const ExchangeSchema = new Schema<IExchange>({
  requester: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'El solicitante es obligatorio']
  },
  requestedArticle: {
    type: Schema.Types.ObjectId,
    ref: 'Article',
    required: [true, 'El artículo solicitado es obligatorio']
  },
  offeredArticle: {
    type: Schema.Types.ObjectId,
    ref: 'Article',
    required: [true, 'El artículo ofrecido es obligatorio']
  },
  owner: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'El propietario es obligatorio']
  },
  status: {
    type: String,
    enum: ['pendiente', 'aceptado', 'rechazado', 'completado', 'cancelado'],
    default: 'pendiente'
  },
  message: {
    type: String,
    trim: true,
    maxlength: [500, 'El mensaje no puede exceder 500 caracteres']
  },
  exchangeDate: {
    type: Date
  },
  location: {
    type: String,
    trim: true,
    maxlength: [200, 'La ubicación no puede exceder 200 caracteres']
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
ExchangeSchema.index({ requester: 1 });
ExchangeSchema.index({ owner: 1 });
ExchangeSchema.index({ requestedArticle: 1 });
ExchangeSchema.index({ offeredArticle: 1 });
ExchangeSchema.index({ status: 1 });
ExchangeSchema.index({ createdAt: -1 });

export default mongoose.model<IExchange>('Exchange', ExchangeSchema);






