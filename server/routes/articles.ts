import express from 'express';
import Article from '../models/Article';
import { authMiddleware, requireRole } from '../middleware/auth';

const router = express.Router();

// @route   PUT /api/articles/update-logic
// @desc    Actualizar lógica de compra/intercambio de artículos
// @access  Public (para testing)
router.put('/update-logic', async (req, res) => {
  try {
    // Artículos que solo se venden por dinero
    const articlesOnlyMoney = [
      'iPhone 13 Pro Max 256GB - Azul Sierra',
      'MacBook Air M1 13" - Gris Espacial', 
      'Nintendo Switch OLED - Blanco',
      'Samsung Galaxy S22 Ultra 512GB - Negro',
      'iPad Pro 12.9" M2 - Gris Espacial',
      'PlayStation 5 + 3 Juegos',
      'Apple Watch Series 8 45mm - Azul Medianoche',
      'Cámara Canon EOS R6 Mark II + Objetivo 24-70mm',
      'Bicicleta Eléctrica Trek Powerfly 7',
      'Sofá Chesterfield de Cuero Genuino',
      'Guitarra Fender Stratocaster American Professional II',
      'Kit de Herramientas Profesionales Bosch'
    ];

    // Artículos que se venden por dinero Y por intercambio
    const articlesWithExchange = [
      'Sony PlayStation 5 + 2 Mandos DualSense',
      'DJI Mavic 3 Pro + 3 Baterías',
      'Colección Completa de Cómics Marvel (2015-2020)',
      'Reloj Rolex Submariner Date 116610LN'
    ];

    // Actualizar artículos que solo se venden por dinero
    const updateOnlyMoney = await Article.updateMany(
      { title: { $in: articlesOnlyMoney } },
      { 
        $set: { 
          isForSale: true, 
          isForExchange: false, 
          wantsPoints: false, 
          wantsDirectExchange: false 
        } 
      }
    );

    // Actualizar artículos que se venden por dinero Y por intercambio
    const updateWithExchange = await Article.updateMany(
      { title: { $in: articlesWithExchange } },
      { 
        $set: { 
          isForSale: true, 
          isForExchange: true, 
          wantsPoints: true, 
          wantsDirectExchange: true 
        } 
      }
    );

    res.json({
      success: true,
      message: 'Lógica de artículos actualizada exitosamente',
      data: {
        onlyMoney: updateOnlyMoney.modifiedCount,
        withExchange: updateWithExchange.modifiedCount
      }
    });
  } catch (error) {
    console.error('Error updating articles logic:', error);
    res.status(500).json({
      success: false,
      message: 'Error al actualizar la lógica de artículos'
    });
  }
});

// @route   PUT /api/articles/:id/sale-mode
// @desc    Actualizar modalidad de venta de un artículo
// @access  Private
router.put('/:id/sale-mode', authMiddleware, async (req: any, res) => {
  try {
    const { saleMode, directFromHome, logisticsCenterSale, trastaliaPurchase, pointsExchange } = req.body;
    
    const article = await Article.findById(req.params.id);
    if (!article) {
      return res.status(404).json({
        success: false,
        message: 'Artículo no encontrado'
      });
    }

    // Verificar que el usuario sea el propietario del artículo
    if (article.seller.toString() !== req.userId) {
      return res.status(403).json({
        success: false,
        message: 'No tienes permisos para modificar este artículo'
      });
    }

    // Actualizar modalidad de venta
    const updateData: any = { saleMode };
    
    if (directFromHome) updateData.directFromHome = directFromHome;
    if (logisticsCenterSale) updateData.logisticsCenterSale = logisticsCenterSale;
    if (trastaliaPurchase) updateData.trastaliaPurchase = trastaliaPurchase;
    if (pointsExchange) updateData.pointsExchange = pointsExchange;

    const updatedArticle = await Article.findByIdAndUpdate(
      req.params.id,
      { $set: updateData },
      { new: true }
    ).populate('seller', 'name email');

    res.json({
      success: true,
      message: 'Modalidad de venta actualizada exitosamente',
      data: updatedArticle
    });
  } catch (error) {
    console.error('Error updating sale mode:', error);
    res.status(500).json({
      success: false,
      message: 'Error al actualizar la modalidad de venta'
    });
  }
});

// @route   GET /api/articles/my-articles
// @desc    Obtener artículos del usuario autenticado
// @access  Private
router.get('/my-articles', authMiddleware, async (req: any, res) => {
  try {
    const articles = await Article.find({ seller: req.user.id })
      .populate('seller', 'name email')
      .populate('logisticsCenter', 'name location')
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      data: articles
    });
  } catch (error) {
    console.error('Error obteniendo mis artículos:', error);
    res.status(500).json({
      success: false,
      message: 'Error al obtener mis artículos'
    });
  }
});

// @route   GET /api/articles/:id
// @desc    Obtener un artículo por ID
// @access  Public
router.get('/:id', async (req, res) => {
  try {
    const article = await Article.findById(req.params.id)
      .populate('seller', 'name email points logisticsLevel reputation')
      .exec();

    if (!article) {
      return res.status(404).json({
        success: false,
        message: 'Artículo no encontrado'
      });
    }

    res.json({
      success: true,
      data: article
    });
  } catch (error) {
    console.error('Error obteniendo artículo:', error);
    res.status(500).json({
      success: false,
      message: 'Error del servidor'
    });
  }
});

// @route   GET /api/articles
// @desc    Obtener todos los artículos
// @access  Public
router.get('/', async (req, res) => {
  try {
    const { category, condition, minPrice, maxPrice, location, search } = req.query;
    
    // Construir filtros
    const filters: any = { status: 'disponible' };
    
    if (category) filters.category = category;
    if (condition) filters.condition = condition;
    if (minPrice || maxPrice) {
      filters.price = {};
      if (minPrice) filters.price.$gte = Number(minPrice);
      if (maxPrice) filters.price.$lte = Number(maxPrice);
    }
    if (location) {
      filters.location = { $regex: location, $options: 'i' };
    }
    if (search) {
      filters.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { tags: { $in: [new RegExp(search as string, 'i')] } }
      ];
    }

    const articles = await Article.find(filters)
      .populate('seller', 'name email')
      .populate('logisticsCenter', 'name location')
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      data: articles
    });
  } catch (error) {
    console.error('Error fetching articles:', error);
    res.status(500).json({
      success: false,
      message: 'Error al obtener artículos'
    });
  }
});

// @route   GET /api/articles/:id
// @desc    Obtener un artículo por ID
// @access  Public
router.get('/:id', async (req, res) => {
  try {
    const article = await Article.findById(req.params.id)
      .populate('seller', 'name email')
      .populate('logisticsCenter', 'name location');

    if (!article) {
      return res.status(404).json({
        success: false,
        message: 'Artículo no encontrado'
      });
    }

    // Incrementar vistas
    article.views += 1;
    await article.save();

    res.json({
      success: true,
      data: article
    });
  } catch (error) {
    console.error('Error fetching article:', error);
    res.status(500).json({
      success: false,
      message: 'Error al obtener el artículo'
    });
  }
});

// @route   POST /api/articles
// @desc    Crear un nuevo artículo
// @access  Private
router.post('/', authMiddleware, async (req: any, res) => {
  try {
    const articleData = {
      ...req.body,
      seller: req.userId
    };

    const article = new Article(articleData);
    await article.save();

    const populatedArticle = await Article.findById(article._id)
      .populate('seller', 'name email')
      .populate('logisticsCenter', 'name location');

    res.status(201).json({
      success: true,
      message: 'Artículo creado exitosamente',
      data: populatedArticle
    });
  } catch (error) {
    console.error('Error creating article:', error);
    
    // Si es un error de validación de Mongoose, devolver detalles específicos
    if ((error as any).name === 'ValidationError') {
      const validationErrors = Object.values((error as any).errors).map((err: any) => err.message);
      return res.status(400).json({
        success: false,
        message: 'Error de validación',
        errors: validationErrors
      });
    }
    
    // Si es un error de duplicado
    if ((error as any).code === 11000) {
      return res.status(400).json({
        success: false,
        message: 'Ya existe un artículo con este título'
      });
    }
    
    res.status(500).json({
      success: false,
      message: 'Error al crear el artículo',
      error: process.env.NODE_ENV === 'development' ? (error as any).message : 'Error interno del servidor'
    });
  }
});

// @route   PUT /api/articles/:id/images
// @desc    Actualizar imágenes de un artículo
// @access  Public (para testing)
router.put('/:id/images', async (req: any, res) => {
  try {
    const { image, images } = req.body;
    
    const article = await Article.findById(req.params.id);
    if (!article) {
      return res.status(404).json({
        success: false,
        message: 'Artículo no encontrado'
      });
    }
    
    // Para testing, no verificamos permisos
    
    if (image) article.images.push(image);
    if (images) article.images = images;
    
    await article.save();
    
    res.json({
      success: true,
      data: article
    });
  } catch (error) {
    console.error('Error actualizando imágenes:', error);
    res.status(500).json({
      success: false,
      message: 'Error del servidor'
    });
  }
});

// @route   PUT /api/articles/:id
// @desc    Actualizar un artículo
// @access  Private (solo el propietario)
router.put('/:id', authMiddleware, async (req: any, res) => {
  try {
    const article = await Article.findById(req.params.id);

    if (!article) {
      return res.status(404).json({
        success: false,
        message: 'Artículo no encontrado'
      });
    }

    // Verificar que el usuario sea el propietario
    if (article.seller.toString() !== req.userId) {
      return res.status(403).json({
        success: false,
        message: 'No tienes permisos para editar este artículo'
      });
    }

    const updatedArticle = await Article.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    ).populate('seller', 'name email')
     .populate('logisticsCenter', 'name location');

    res.json({
      success: true,
      message: 'Artículo actualizado exitosamente',
      data: updatedArticle
    });
  } catch (error) {
    console.error('Error updating article:', error);
    res.status(500).json({
      success: false,
      message: 'Error al actualizar el artículo'
    });
  }
});

// @route   DELETE /api/articles/:id
// @desc    Eliminar un artículo
// @access  Private (solo el propietario)
router.delete('/:id', authMiddleware, async (req: any, res) => {
  try {
    const article = await Article.findById(req.params.id);

    if (!article) {
      return res.status(404).json({
        success: false,
        message: 'Artículo no encontrado'
      });
    }

    // Verificar que el usuario sea el propietario
    if (article.seller.toString() !== req.userId) {
      return res.status(403).json({
        success: false,
        message: 'No tienes permisos para eliminar este artículo'
      });
    }

    await Article.findByIdAndDelete(req.params.id);

    res.json({
      success: true,
      message: 'Artículo eliminado exitosamente'
    });
  } catch (error) {
    console.error('Error deleting article:', error);
    res.status(500).json({
      success: false,
      message: 'Error al eliminar el artículo'
    });
  }
});

// @route   GET /api/articles/user/:userId
// @desc    Obtener artículos de un usuario específico
// @access  Public
router.get('/user/:userId', async (req, res) => {
  try {
    const articles = await Article.find({ seller: req.params.userId })
      .populate('seller', 'name email')
      .populate('logisticsCenter', 'name location')
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      data: articles
    });
  } catch (error) {
    console.error('Error fetching user articles:', error);
    res.status(500).json({
      success: false,
      message: 'Error al obtener los artículos del usuario'
    });
  }
});

// @route   GET /api/articles/admin/pending
// @desc    Obtener artículos pendientes de aprobación (solo admin)
// @access  Private (solo admin)
router.get('/admin/pending', authMiddleware, requireRole(['admin']), async (req: any, res) => {
  try {

    const articles = await Article.find({ adminStatus: 'pending' })
      .populate('seller', 'name email points logisticsLevel reputation')
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      data: articles
    });
  } catch (error) {
    console.error('Error obteniendo artículos pendientes:', error);
    res.status(500).json({
      success: false,
      message: 'Error al obtener artículos pendientes'
    });
  }
});

// @route   PUT /api/articles/admin/:id/approve
// @desc    Aprobar un artículo (solo admin)
// @access  Private (solo admin)
router.put('/admin/:id/approve', authMiddleware, requireRole(['admin']), async (req: any, res) => {
  try {

    const { money, points, moneyPrice, pointsAmount } = req.body;

    const article = await Article.findById(req.params.id);
    if (!article) {
      return res.status(404).json({
        success: false,
        message: 'Artículo no encontrado'
      });
    }

    // Actualizar decisión del admin
    const adminDecision = {
      money: money || false,
      points: points || false,
      moneyPrice: moneyPrice || 0,
      pointsAmount: pointsAmount || 0,
      reject: false,
      date: new Date()
    };

    // Determinar el nuevo estado del admin
    let newAdminStatus = 'pending';
    if (money && points) {
      newAdminStatus = 'approved_both';
    } else if (money) {
      newAdminStatus = 'approved_money';
    } else if (points) {
      newAdminStatus = 'approved_points';
    }

    const updatedArticle = await Article.findByIdAndUpdate(
      req.params.id,
      {
        adminStatus: newAdminStatus,
        adminDecision: adminDecision
      },
      { new: true }
    ).populate('seller', 'name email points logisticsLevel reputation');

    res.json({
      success: true,
      message: 'Artículo aprobado exitosamente',
      data: updatedArticle
    });
  } catch (error) {
    console.error('Error aprobando artículo:', error);
    res.status(500).json({
      success: false,
      message: 'Error al aprobar el artículo'
    });
  }
});

// @route   PUT /api/articles/admin/:id/reject
// @desc    Rechazar un artículo (solo admin)
// @access  Private (solo admin)
router.put('/admin/:id/reject', authMiddleware, requireRole(['admin']), async (req: any, res) => {
  try {

    const { rejectReason } = req.body;

    const article = await Article.findById(req.params.id);
    if (!article) {
      return res.status(404).json({
        success: false,
        message: 'Artículo no encontrado'
      });
    }

    // Actualizar decisión del admin
    const adminDecision = {
      money: false,
      points: false,
      moneyPrice: 0,
      pointsAmount: 0,
      reject: true,
      rejectReason: rejectReason || 'Artículo rechazado por el administrador',
      date: new Date()
    };

    const updatedArticle = await Article.findByIdAndUpdate(
      req.params.id,
      {
        adminStatus: 'rejected',
        adminDecision: adminDecision
      },
      { new: true }
    ).populate('seller', 'name email points logisticsLevel reputation');

    res.json({
      success: true,
      message: 'Artículo rechazado exitosamente',
      data: updatedArticle
    });
  } catch (error) {
    console.error('Error rechazando artículo:', error);
    res.status(500).json({
      success: false,
      message: 'Error al rechazar el artículo'
    });
  }
});

// @route   GET /api/articles/admin/stats
// @desc    Obtener estadísticas de artículos para admin
// @access  Private (solo admin)
router.get('/admin/stats', authMiddleware, requireRole(['admin']), async (req: any, res) => {
  try {

    const stats = await Article.aggregate([
      {
        $group: {
          _id: '$adminStatus',
          count: { $sum: 1 }
        }
      }
    ]);

    const totalArticles = await Article.countDocuments();
    const pendingArticles = await Article.countDocuments({ adminStatus: 'pending' });
    const approvedArticles = await Article.countDocuments({ 
      adminStatus: { $in: ['approved_money', 'approved_points', 'approved_both'] } 
    });
    const rejectedArticles = await Article.countDocuments({ adminStatus: 'rejected' });

    res.json({
      success: true,
      data: {
        total: totalArticles,
        pending: pendingArticles,
        approved: approvedArticles,
        rejected: rejectedArticles,
        byStatus: stats
      }
    });
  } catch (error) {
    console.error('Error obteniendo estadísticas:', error);
    res.status(500).json({
      success: false,
      message: 'Error al obtener estadísticas'
    });
  }
});

export default router;
