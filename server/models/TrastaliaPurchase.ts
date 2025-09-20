import mongoose, { Document, Schema } from 'mongoose';

export interface ITrastaliaPurchase extends Document {
  article: mongoose.Types.ObjectId;
  seller: mongoose.Types.ObjectId;
  adminPrice: number;
  demandLevel: 'low' | 'medium' | 'high';
  status: 'pending' | 'approved' | 'rejected' | 'completed' | 'cancelled';
  adminApprovedBy?: mongoose.Types.ObjectId;
  adminApprovedAt?: Date;
  rejectionReason?: string;
  verificationStatus: 'pending' | 'verified' | 'failed';
  verificationNotes?: string;
  paymentStatus: 'pending' | 'paid' | 'failed';
  paymentDate?: Date;
  paymentMethod?: string;
  paymentReference?: string;
  createdAt: Date;
  updatedAt: Date;
}

const TrastaliaPurchaseSchema = new Schema<ITrastaliaPurchase>({
  article: {
    type: Schema.Types.ObjectId,
    ref: 'Article',
    required: true
  },
  seller: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  adminPrice: {
    type: Number,
    required: true,
    min: [0, 'El precio del admin no puede ser negativo']
  },
  demandLevel: {
    type: String,
    enum: ['low', 'medium', 'high'],
    required: true
  },
  status: {
    type: String,
    enum: ['pending', 'approved', 'rejected', 'completed', 'cancelled'],
    default: 'pending'
  },
  adminApprovedBy: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  },
  adminApprovedAt: {
    type: Date
  },
  rejectionReason: {
    type: String,
    trim: true,
    maxlength: [500, 'La razón de rechazo no puede exceder 500 caracteres']
  },
  verificationStatus: {
    type: String,
    enum: ['pending', 'verified', 'failed'],
    default: 'pending'
  },
  verificationNotes: {
    type: String,
    trim: true,
    maxlength: [1000, 'Las notas de verificación no pueden exceder 1000 caracteres']
  },
  paymentStatus: {
    type: String,
    enum: ['pending', 'paid', 'failed'],
    default: 'pending'
  },
  paymentDate: {
    type: Date
  },
  paymentMethod: {
    type: String,
    trim: true
  },
  paymentReference: {
    type: String,
    trim: true
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
TrastaliaPurchaseSchema.index({ article: 1 });
TrastaliaPurchaseSchema.index({ seller: 1 });
TrastaliaPurchaseSchema.index({ status: 1 });
TrastaliaPurchaseSchema.index({ demandLevel: 1 });
TrastaliaPurchaseSchema.index({ adminApprovedBy: 1 });
TrastaliaPurchaseSchema.index({ createdAt: -1 });

export default mongoose.model<ITrastaliaPurchase>('TrastaliaPurchase', TrastaliaPurchaseSchema);

