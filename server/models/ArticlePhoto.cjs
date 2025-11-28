const mongoose = require('mongoose');

const ArticlePhotoSchema = new mongoose.Schema({
  articleId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Article',
    required: true
  },
  source: {
    type: String,
    enum: ['unsplash', 'pexels'],
    default: 'unsplash',
    required: true
  },
  unsplashId: {
    type: String,
    sparse: true // Permite null si es de Pexels
  },
  pexelsId: {
    type: Number,
    sparse: true // Permite null si es de Unsplash
  },
  photoId: {
    type: String,
    // No requerido para mantener compatibilidad con fotos antiguas
    // Se genera automáticamente en el middleware pre-save
  },
  url: {
    type: String,
    required: true
  },
  thumbUrl: {
    type: String,
    required: true
  },
  altDescription: {
    type: String,
    default: ''
  },
  photographer: {
    name: String,
    username: String,
    profileUrl: String
  },
  dimensions: {
    width: Number,
    height: Number
  },
  color: {
    type: String,
    default: '#000000'
  },
  category: {
    type: String,
    required: true
  },
  tags: [String],
  isPrimary: {
    type: Boolean,
    default: false
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Índices para optimizar consultas
ArticlePhotoSchema.index({ articleId: 1 });
ArticlePhotoSchema.index({ unsplashId: 1 });
ArticlePhotoSchema.index({ pexelsId: 1 });
ArticlePhotoSchema.index({ photoId: 1 });
ArticlePhotoSchema.index({ source: 1, photoId: 1 }, { unique: true }); // Evitar duplicados
ArticlePhotoSchema.index({ category: 1 });
ArticlePhotoSchema.index({ isPrimary: 1 });

// Middleware para generar photoId si no existe (compatibilidad)
ArticlePhotoSchema.pre('save', function(next) {
  // Generar photoId si no existe
  if (!this.photoId) {
    if (this.source === 'pexels' && this.pexelsId) {
      this.photoId = this.pexelsId.toString();
    } else if (this.source === 'unsplash' && this.unsplashId) {
      this.photoId = this.unsplashId;
    } else if (this.unsplashId) {
      // Compatibilidad con fotos antiguas (sin source)
      this.source = 'unsplash';
      this.photoId = this.unsplashId;
    }
  }
  
  // Asegurar que source tenga un valor por defecto
  if (!this.source) {
    this.source = this.unsplashId ? 'unsplash' : 'pexels';
  }
  
  this.updatedAt = new Date();
  next();
});

module.exports = mongoose.model('ArticlePhoto', ArticlePhotoSchema);
