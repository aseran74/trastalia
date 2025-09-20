import mongoose, { Document, Schema } from 'mongoose';

export interface IMetric extends Document {
  name: string;
  value: number;
  previousValue?: number;
  change: number; // Porcentaje de cambio
  trend: 'up' | 'down' | 'stable';
  category: 'sales' | 'users' | 'revenue' | 'orders' | 'other';
  period: 'daily' | 'weekly' | 'monthly' | 'yearly';
  date: Date;
  metadata?: Record<string, any>;
  createdAt: Date;
  updatedAt: Date;
}

const MetricSchema = new Schema<IMetric>({
  name: {
    type: String,
    required: [true, 'El nombre de la métrica es requerido'],
    trim: true
  },
  value: {
    type: Number,
    required: [true, 'El valor es requerido'],
    min: [0, 'El valor no puede ser negativo']
  },
  previousValue: {
    type: Number,
    min: [0, 'El valor anterior no puede ser negativo']
  },
  change: {
    type: Number,
    required: [true, 'El cambio es requerido']
  },
  trend: {
    type: String,
    enum: ['up', 'down', 'stable'],
    required: [true, 'La tendencia es requerida']
  },
  category: {
    type: String,
    enum: ['sales', 'users', 'revenue', 'orders', 'other'],
    required: [true, 'La categoría es requerida']
  },
  period: {
    type: String,
    enum: ['daily', 'weekly', 'monthly', 'yearly'],
    required: [true, 'El período es requerido']
  },
  date: {
    type: Date,
    required: [true, 'La fecha es requerida']
  },
  metadata: {
    type: Schema.Types.Mixed,
    default: {}
  }
}, {
  timestamps: true
});

// Índices para consultas eficientes
MetricSchema.index({ category: 1, period: 1, date: -1 });
MetricSchema.index({ name: 1, date: -1 });
MetricSchema.index({ date: -1 });

export default mongoose.model<IMetric>('Metric', MetricSchema);
