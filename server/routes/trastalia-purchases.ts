import express from 'express';
import { authMiddleware } from '../middleware/auth';
import TrastaliaPurchase from '../models/TrastaliaPurchase';
import Article from '../models/Article';
import User from '../models/User';

const router = express.Router();

// @route   GET /api/trastalia-purchases
// @desc    Obtener todas las compras directas (Admin)
// @access  Private (Admin)
router.get('/', authMiddleware, async (req: any, res) => {
  try {
    const { status, demandLevel, page = 1, limit = 20 } = req.query;
    const skip = (page - 1) * limit;

    const filter: any = {};
    if (status) filter.status = status;
    if (demandLevel) filter.demandLevel = demandLevel;

    const purchases = await TrastaliaPurchase.find(filter)
      .populate('article', 'title description price condition images')
      .populate('seller', 'name email')
      .populate('adminApprovedBy', 'name email')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await TrastaliaPurchase.countDocuments(filter);

    res.json({
      success: true,
      data: {
        purchases,
        pagination: {
          current: parseInt(page),
          total: Math.ceil(total / limit),
          count: total
        }
      }
    });
  } catch (error) {
    console.error('Error getting trastalia purchases:', error);
    res.status(500).json({
      success: false,
      message: 'Error al obtener las compras directas'
    });
  }
});

// @route   GET /api/trastalia-purchases/my-requests
// @desc    Obtener solicitudes de compra del usuario
// @access  Private
router.get('/my-requests', authMiddleware, async (req: any, res) => {
  try {
    const purchases = await TrastaliaPurchase.find({ seller: req.userId })
      .populate('article', 'title description price condition images')
      .populate('adminApprovedBy', 'name email')
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      data: purchases
    });
  } catch (error) {
    console.error('Error getting user purchase requests:', error);
    res.status(500).json({
      success: false,
      message: 'Error al obtener las solicitudes de compra'
    });
  }
});

// @route   POST /api/trastalia-purchases/request
// @desc    Solicitar compra directa por Trastalia
// @access  Private
router.post('/request', authMiddleware, async (req: any, res) => {
  try {
    const { articleId, adminPrice, demandLevel } = req.body;

    if (!articleId || !adminPrice) {
      return res.status(400).json({
        success: false,
        message: 'Faltan datos requeridos'
      });
    }

    // Verificar que el artículo existe y pertenece al usuario
    const article = await Article.findById(articleId);
    if (!article) {
      return res.status(404).json({
        success: false,
        message: 'Artículo no encontrado'
      });
    }

    if (article.seller.toString() !== req.userId) {
      return res.status(403).json({
        success: false,
        message: 'No tienes permisos para solicitar la compra de este artículo'
      });
    }

    // Verificar que no existe ya una solicitud pendiente
    const existingRequest = await TrastaliaPurchase.findOne({
      article: articleId,
      status: { $in: ['pending', 'approved'] }
    });

    if (existingRequest) {
      return res.status(400).json({
        success: false,
        message: 'Ya existe una solicitud pendiente para este artículo'
      });
    }

    // Crear solicitud de compra
    const purchaseRequest = new TrastaliaPurchase({
      article: articleId,
      seller: req.userId,
      adminPrice,
      demandLevel: demandLevel || 'low',
      status: 'pending'
    });

    await purchaseRequest.save();

    // Actualizar estado del artículo
    article.status = 'reservado';
    await article.save();

    const populatedRequest = await TrastaliaPurchase.findById(purchaseRequest._id)
      .populate('article', 'title description price condition images')
      .populate('seller', 'name email');

    res.status(201).json({
      success: true,
      message: 'Solicitud de compra creada exitosamente',
      data: populatedRequest
    });
  } catch (error) {
    console.error('Error creating purchase request:', error);
    res.status(500).json({
      success: false,
      message: 'Error al crear la solicitud de compra'
    });
  }
});

// @route   PUT /api/trastalia-purchases/:id/approve
// @desc    Aprobar solicitud de compra (Admin)
// @access  Private (Admin)
router.put('/:id/approve', authMiddleware, async (req: any, res) => {
  try {
    const { adminPrice, verificationNotes } = req.body;

    const purchase = await TrastaliaPurchase.findById(req.params.id);
    if (!purchase) {
      return res.status(404).json({
        success: false,
        message: 'Solicitud de compra no encontrada'
      });
    }

    if (purchase.status !== 'pending') {
      return res.status(400).json({
        success: false,
        message: 'Esta solicitud ya ha sido procesada'
      });
    }

    // Actualizar solicitud
    purchase.status = 'approved';
    purchase.adminApprovedBy = req.userId;
    purchase.adminApprovedAt = new Date();
    if (adminPrice) purchase.adminPrice = adminPrice;
    if (verificationNotes) purchase.verificationNotes = verificationNotes;

    await purchase.save();

    // Actualizar estado del artículo
    await Article.findByIdAndUpdate(purchase.article, {
      status: 'comprado_por_trastalia'
    });

    const populatedPurchase = await TrastaliaPurchase.findById(purchase._id)
      .populate('article', 'title description price condition images')
      .populate('seller', 'name email')
      .populate('adminApprovedBy', 'name email');

    res.json({
      success: true,
      message: 'Solicitud aprobada exitosamente',
      data: populatedPurchase
    });
  } catch (error) {
    console.error('Error approving purchase:', error);
    res.status(500).json({
      success: false,
      message: 'Error al aprobar la solicitud de compra'
    });
  }
});

// @route   PUT /api/trastalia-purchases/:id/reject
// @desc    Rechazar solicitud de compra (Admin)
// @access  Private (Admin)
router.put('/:id/reject', authMiddleware, async (req: any, res) => {
  try {
    const { rejectionReason } = req.body;

    const purchase = await TrastaliaPurchase.findById(req.params.id);
    if (!purchase) {
      return res.status(404).json({
        success: false,
        message: 'Solicitud de compra no encontrada'
      });
    }

    if (purchase.status !== 'pending') {
      return res.status(400).json({
        success: false,
        message: 'Esta solicitud ya ha sido procesada'
      });
    }

    // Actualizar solicitud
    purchase.status = 'rejected';
    purchase.rejectionReason = rejectionReason;
    await purchase.save();

    // Actualizar estado del artículo
    await Article.findByIdAndUpdate(purchase.article, {
      status: 'disponible'
    });

    res.json({
      success: true,
      message: 'Solicitud rechazada exitosamente'
    });
  } catch (error) {
    console.error('Error rejecting purchase:', error);
    res.status(500).json({
      success: false,
      message: 'Error al rechazar la solicitud de compra'
    });
  }
});

// @route   PUT /api/trastalia-purchases/:id/verify
// @desc    Verificar artículo recibido (Admin)
// @access  Private (Admin)
router.put('/:id/verify', authMiddleware, async (req: any, res) => {
  try {
    const { verificationStatus, verificationNotes } = req.body;

    if (!verificationStatus || !['verified', 'failed'].includes(verificationStatus)) {
      return res.status(400).json({
        success: false,
        message: 'Estado de verificación inválido'
      });
    }

    const purchase = await TrastaliaPurchase.findById(req.params.id);
    if (!purchase) {
      return res.status(404).json({
        success: false,
        message: 'Solicitud de compra no encontrada'
      });
    }

    if (purchase.status !== 'approved') {
      return res.status(400).json({
        success: false,
        message: 'Esta solicitud debe estar aprobada para ser verificada'
      });
    }

    // Actualizar verificación
    purchase.verificationStatus = verificationStatus;
    if (verificationNotes) purchase.verificationNotes = verificationNotes;

    if (verificationStatus === 'verified') {
      purchase.paymentStatus = 'paid';
      purchase.paymentDate = new Date();
      purchase.status = 'completed';
    } else {
      purchase.status = 'cancelled';
    }

    await purchase.save();

    res.json({
      success: true,
      message: 'Verificación actualizada exitosamente',
      data: purchase
    });
  } catch (error) {
    console.error('Error verifying purchase:', error);
    res.status(500).json({
      success: false,
      message: 'Error al verificar la compra'
    });
  }
});

// @route   GET /api/trastalia-purchases/stats
// @desc    Obtener estadísticas de compras directas (Admin)
// @access  Private (Admin)
router.get('/stats', authMiddleware, async (req: any, res) => {
  try {
    const stats = await TrastaliaPurchase.aggregate([
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 },
          totalAmount: { $sum: '$adminPrice' }
        }
      }
    ]);

    const demandStats = await TrastaliaPurchase.aggregate([
      {
        $group: {
          _id: '$demandLevel',
          count: { $sum: 1 }
        }
      }
    ]);

    res.json({
      success: true,
      data: {
        byStatus: stats,
        byDemand: demandStats
      }
    });
  } catch (error) {
    console.error('Error getting purchase stats:', error);
    res.status(500).json({
      success: false,
      message: 'Error al obtener las estadísticas'
    });
  }
});

export default router;

