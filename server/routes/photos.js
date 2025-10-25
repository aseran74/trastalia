const express = require('express');
const router = express.Router();
const ArticlePhoto = require('../models/ArticlePhoto');
const unsplashService = require('../services/unsplashService');
const { authMiddleware } = require('../middleware/auth');

// Buscar fotos en Unsplash por categoría
router.get('/search/:category', async (req, res) => {
  try {
    const { category } = req.params;
    const { page = 1, perPage = 10, orientation = 'all', color = 'all' } = req.query;

    const result = await unsplashService.searchPhotos(category, {
      page: parseInt(page),
      perPage: parseInt(perPage),
      orientation,
      color
    });

    if (!result.success) {
      return res.status(400).json({
        success: false,
        message: 'Error buscando fotos',
        error: result.error
      });
    }

    res.json({
      success: true,
      data: result.data,
      pagination: {
        page: parseInt(page),
        perPage: parseInt(perPage),
        total: result.total,
        totalPages: result.totalPages
      }
    });
  } catch (error) {
    console.error('Error in photo search:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor'
    });
  }
});

// Obtener fotos aleatorias por categoría
router.get('/random/:category', async (req, res) => {
  try {
    const { category } = req.params;
    const { count = 5 } = req.query;

    const result = await unsplashService.getRandomPhotos(category, parseInt(count));

    if (!result.success) {
      return res.status(400).json({
        success: false,
        message: 'Error obteniendo fotos aleatorias',
        error: result.error
      });
    }

    res.json({
      success: true,
      data: result.data
    });
  } catch (error) {
    console.error('Error getting random photos:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor'
    });
  }
});

// Guardar foto en la base de datos
router.post('/save', authMiddleware, async (req, res) => {
  try {
    const {
      articleId,
      unsplashId,
      url,
      thumbUrl,
      altDescription,
      photographer,
      dimensions,
      color,
      category,
      tags,
      isPrimary = false
    } = req.body;

    // Verificar que no existe ya esta foto
    const existingPhoto = await ArticlePhoto.findOne({ unsplashId });
    if (existingPhoto) {
      return res.status(400).json({
        success: false,
        message: 'Esta foto ya está guardada'
      });
    }

    // Si es la foto principal, marcar las otras como no principales
    if (isPrimary) {
      await ArticlePhoto.updateMany(
        { articleId, isPrimary: true },
        { isPrimary: false }
      );
    }

    const photo = new ArticlePhoto({
      articleId,
      unsplashId,
      url,
      thumbUrl,
      altDescription,
      photographer,
      dimensions,
      color,
      category,
      tags,
      isPrimary
    });

    await photo.save();

    res.status(201).json({
      success: true,
      message: 'Foto guardada correctamente',
      data: photo
    });
  } catch (error) {
    console.error('Error saving photo:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor'
    });
  }
});

// Obtener fotos de un artículo
router.get('/article/:articleId', async (req, res) => {
  try {
    const { articleId } = req.params;

    const photos = await ArticlePhoto.find({ articleId })
      .sort({ isPrimary: -1, createdAt: -1 });

    res.json({
      success: true,
      data: photos
    });
  } catch (error) {
    console.error('Error getting article photos:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor'
    });
  }
});

// Marcar foto como principal
router.put('/:photoId/primary', authMiddleware, async (req, res) => {
  try {
    const { photoId } = req.params;

    const photo = await ArticlePhoto.findById(photoId);
    if (!photo) {
      return res.status(404).json({
        success: false,
        message: 'Foto no encontrada'
      });
    }

    // Marcar todas las fotos del artículo como no principales
    await ArticlePhoto.updateMany(
      { articleId: photo.articleId, isPrimary: true },
      { isPrimary: false }
    );

    // Marcar esta foto como principal
    photo.isPrimary = true;
    await photo.save();

    res.json({
      success: true,
      message: 'Foto marcada como principal',
      data: photo
    });
  } catch (error) {
    console.error('Error setting primary photo:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor'
    });
  }
});

// Eliminar foto
router.delete('/:photoId', authMiddleware, async (req, res) => {
  try {
    const { photoId } = req.params;

    const photo = await ArticlePhoto.findByIdAndDelete(photoId);
    if (!photo) {
      return res.status(404).json({
        success: false,
        message: 'Foto no encontrada'
      });
    }

    res.json({
      success: true,
      message: 'Foto eliminada correctamente'
    });
  } catch (error) {
    console.error('Error deleting photo:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor'
    });
  }
});

// Obtener categorías disponibles
router.get('/categories', async (req, res) => {
  try {
    const categories = [
      'electronica', 'ropa', 'hogar', 'deportes', 'libros', 'juegos',
      'musica', 'arte', 'coches', 'muebles', 'herramientas', 'jardineria'
    ];

    res.json({
      success: true,
      data: categories
    });
  } catch (error) {
    console.error('Error getting categories:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor'
    });
  }
});

module.exports = router;
