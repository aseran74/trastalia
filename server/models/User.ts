import mongoose, { Document, Schema } from 'mongoose';
import bcrypt from 'bcryptjs';

export interface IUser extends Document {
  name: string;
  email: string;
  password: string;
  role: 'admin' | 'user' | 'moderator';
  avatar?: string;
  isActive: boolean;
  lastLogin?: Date;
  points?: number;
  logisticsLevel?: string;
  reputation?: number;
  createdAt: Date;
  updatedAt: Date;
  comparePassword(candidatePassword: string): Promise<boolean>;
}

const UserSchema = new Schema<IUser>({
  name: {
    type: String,
    required: [true, 'El nombre es obligatorio'],
    trim: true,
    minlength: [2, 'El nombre debe tener al menos 2 caracteres'],
    maxlength: [50, 'El nombre no puede exceder 50 caracteres']
  },
  email: {
    type: String,
    required: [true, 'El email es obligatorio'],
    unique: true,
    lowercase: true,
    trim: true,
    match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Email inválido']
  },
  password: {
    type: String,
    required: [true, 'La contraseña es obligatoria'],
    minlength: [8, 'La contraseña debe tener al menos 8 caracteres'],
    select: false // No incluir por defecto en las consultas
  },
  role: {
    type: String,
    enum: ['admin', 'user', 'moderator'],
    default: 'user'
  },
  avatar: {
    type: String,
    default: ''
  },
  isActive: {
    type: Boolean,
    default: true
  },
  lastLogin: {
    type: Date
  },
  points: {
    type: Number,
    default: 0,
    min: [0, 'Los puntos no pueden ser negativos']
  },
  logisticsLevel: {
    type: String,
    enum: ['civil', 'comerciante', 'transportista', 'capitán', 'almirante'],
    default: 'civil'
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
    transform: function(doc: any, ret: any) {
      delete ret.password;
      return ret;
    }
  }
});

// Middleware para encriptar contraseña antes de guardar
UserSchema.pre('save', async function(next) {
  // Solo encriptar si la contraseña ha sido modificada
  if (!this.isModified('password')) return next();
  
  try {
    // Encriptar contraseña con salt de 12 rondas
    const salt = await bcrypt.genSalt(12);
    (this as any).password = await bcrypt.hash((this as any).password, salt);
    next();
  } catch (error) {
    next(error as Error);
  }
});

// Método para comparar contraseñas
UserSchema.methods.comparePassword = async function(candidatePassword: string): Promise<boolean> {
  try {
    return await bcrypt.compare(candidatePassword, (this as any).password);
  } catch (error) {
    throw new Error('Error al comparar contraseñas');
  }
};

// Índices para mejorar rendimiento
UserSchema.index({ email: 1 });
UserSchema.index({ role: 1 });
UserSchema.index({ isActive: 1 });

export default mongoose.model<IUser>('User', UserSchema);
