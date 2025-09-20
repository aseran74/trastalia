import mongoose, { Document, Schema } from 'mongoose';

export interface IUserPoints extends Document {
  user: mongoose.Types.ObjectId;
  totalPoints: number;
  availablePoints: number;
  usedPoints: number;
  transactions: mongoose.Types.ObjectId[];
  createdAt: Date;
  updatedAt: Date;
}

const UserPointsSchema = new Schema<IUserPoints>({
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true
  },
  totalPoints: {
    type: Number,
    default: 0,
    min: [0, 'Los puntos totales no pueden ser negativos']
  },
  availablePoints: {
    type: Number,
    default: 0,
    min: [0, 'Los puntos disponibles no pueden ser negativos']
  },
  usedPoints: {
    type: Number,
    default: 0,
    min: [0, 'Los puntos usados no pueden ser negativos']
  },
  transactions: [{
    type: Schema.Types.ObjectId,
    ref: 'PointsTransaction'
  }]
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
UserPointsSchema.index({ user: 1 });
UserPointsSchema.index({ totalPoints: -1 });
UserPointsSchema.index({ availablePoints: -1 });

export default mongoose.model<IUserPoints>('UserPoints', UserPointsSchema);

