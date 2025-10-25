const mongoose = require('mongoose');

const ArticlePhotoSchema = new mongoose.Schema({
  articleId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Article',
    required: true
  },
  unsplashId: {
    type: String,
    required: true,
    unique: true
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
ArticlePhotoSchema.index({ category: 1 });
ArticlePhotoSchema.index({ isPrimary: 1 });

// Middleware para actualizar updatedAt
ArticlePhotoSchema.pre('save', function(next) {
  this.updatedAt = new Date();
  next();
});

module.exports = mongoose.model('ArticlePhoto', ArticlePhotoSchema);
