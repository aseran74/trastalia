import mongoose, { Document, Schema } from 'mongoose';

export interface IPurchase extends Document {
  buyer: mongoose.Types.ObjectId;
  article: mongoose.Types.ObjectId;
  seller: mongoose.Types.ObjectId;
  price: number;
  status: 'pendiente' | 'confirmado' | 'enviado' | 'entregado' | 'cancelado';
  paymentMethod: 'efectivo' | 'transferencia' | 'paypal' | 'otro';
  shippingAddress?: string;
  notes?: string;
  purchaseDate: Date;
  deliveryDate?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const PurchaseSchema = new Schema<IPurchase>({
  buyer: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'El comprador es obligatorio']
  },
  article: {
    type: Schema.Types.ObjectId,
    ref: 'Article',
    required: [true, 'El artículo es obligatorio']
  },
  seller: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'El vendedor es obligatorio']
  },
  price: {
    type: Number,
    required: [true, 'El precio es obligatorio'],
    min: [0, 'El precio no puede ser negativo']
  },
  status: {
    type: String,
    enum: ['pendiente', 'confirmado', 'enviado', 'entregado', 'cancelado'],
    default: 'pendiente'
  },
  paymentMethod: {
    type: String,
    enum: ['efectivo', 'transferencia', 'paypal', 'otro'],
    required: [true, 'El método de pago es obligatorio']
  },
  shippingAddress: {
    type: String,
    trim: true,
    maxlength: [200, 'La dirección no puede exceder 200 caracteres']
  },
  notes: {
    type: String,
    trim: true,
    maxlength: [500, 'Las notas no pueden exceder 500 caracteres']
  },
  purchaseDate: {
    type: Date,
    default: Date.now
  },
  deliveryDate: {
    type: Date
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
PurchaseSchema.index({ buyer: 1 });
PurchaseSchema.index({ seller: 1 });
PurchaseSchema.index({ article: 1 });
PurchaseSchema.index({ status: 1 });
PurchaseSchema.index({ purchaseDate: -1 });

export default mongoose.model<IPurchase>('Purchase', PurchaseSchema);






