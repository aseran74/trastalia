import express from 'express';
import { authMiddleware } from '../middleware/auth';
import UserPoints from '../models/UserPoints';
import PointsTransaction from '../models/PointsTransaction';
import User from '../models/User';

const router = express.Router();

// @route   GET /api/points/balance
// @desc    Obtener balance de puntos del usuario
// @access  Private
router.get('/balance', authMiddleware, async (req: any, res) => {
  try {
    let userPoints = await UserPoints.findOne({ user: req.userId });
    
    // Si no existe, crear registro inicial
    if (!userPoints) {
      userPoints = new UserPoints({
        user: req.userId,
        totalPoints: 0,
        availablePoints: 0,
        usedPoints: 0
      });
      await userPoints.save();
    }

    res.json({
      success: true,
      data: {
        totalPoints: userPoints.totalPoints,
        availablePoints: userPoints.availablePoints,
        usedPoints: userPoints.usedPoints
      }
    });
  } catch (error) {
    console.error('Error getting points balance:', error);
    res.status(500).json({
      success: false,
      message: 'Error al obtener el balance de puntos'
    });
  }
});

// @route   GET /api/points/transactions
// @desc    Obtener historial de transacciones de puntos
// @access  Private
router.get('/transactions', authMiddleware, async (req: any, res) => {
  try {
    const { page = 1, limit = 20 } = req.query;
    const skip = (page - 1) * limit;

    const transactions = await PointsTransaction.find({ user: req.userId })
      .populate('article', 'title price')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit as string));

    const total = await PointsTransaction.countDocuments({ user: req.userId });

    res.json({
      success: true,
      data: {
        transactions,
        pagination: {
          current: parseInt(page),
          total: Math.ceil(total / limit),
          count: total
        }
      }
    });
  } catch (error) {
    console.error('Error getting points transactions:', error);
    res.status(500).json({
      success: false,
      message: 'Error al obtener las transacciones de puntos'
    });
  }
});

// @route   POST /api/points/earn
// @desc    Agregar puntos al usuario (venta por puntos)
// @access  Private
router.post('/earn', authMiddleware, async (req: any, res) => {
  try {
    const { amount, description, articleId, conversionRate, originalPrice } = req.body;

    if (!amount || amount <= 0) {
      return res.status(400).json({
        success: false,
        message: 'La cantidad de puntos debe ser mayor a 0'
      });
    }

    // Crear transacción
    const transaction = new PointsTransaction({
      user: req.userId,
      type: 'earn',
      amount,
      description: description || 'Puntos ganados por venta',
      article: articleId,
      status: 'completed',
      metadata: {
        conversionRate,
        originalPrice
      }
    });

    await transaction.save();

    // Actualizar balance del usuario
    let userPoints = await UserPoints.findOne({ user: req.userId });
    if (!userPoints) {
      userPoints = new UserPoints({
        user: req.userId,
        totalPoints: 0,
        availablePoints: 0,
        usedPoints: 0
      });
    }

    userPoints.totalPoints += amount;
    userPoints.availablePoints += amount;
    userPoints.transactions.push(transaction._id as any);
    await userPoints.save();

    res.json({
      success: true,
      message: 'Puntos agregados exitosamente',
      data: {
        transaction,
        newBalance: userPoints.availablePoints
      }
    });
  } catch (error) {
    console.error('Error earning points:', error);
    res.status(500).json({
      success: false,
      message: 'Error al agregar puntos'
    });
  }
});

// @route   POST /api/points/spend
// @desc    Gastar puntos del usuario
// @access  Private
router.post('/spend', authMiddleware, async (req: any, res) => {
  try {
    const { amount, description, articleId } = req.body;

    if (!amount || amount <= 0) {
      return res.status(400).json({
        success: false,
        message: 'La cantidad de puntos debe ser mayor a 0'
      });
    }

    // Verificar balance suficiente
    const userPoints = await UserPoints.findOne({ user: req.userId });
    if (!userPoints || userPoints.availablePoints < amount) {
      return res.status(400).json({
        success: false,
        message: 'Puntos insuficientes'
      });
    }

    // Crear transacción
    const transaction = new PointsTransaction({
      user: req.userId,
      type: 'spend',
      amount,
      description: description || 'Puntos gastados en compra',
      article: articleId,
      status: 'completed'
    });

    await transaction.save();

    // Actualizar balance del usuario
    userPoints.availablePoints -= amount;
    userPoints.usedPoints += amount;
    userPoints.transactions.push(transaction._id as any);
    await userPoints.save();

    res.json({
      success: true,
      message: 'Puntos gastados exitosamente',
      data: {
        transaction,
        newBalance: userPoints.availablePoints
      }
    });
  } catch (error) {
    console.error('Error spending points:', error);
    res.status(500).json({
      success: false,
      message: 'Error al gastar puntos'
    });
  }
});

// @route   POST /api/points/admin-adjustment
// @desc    Ajuste de puntos por administrador
// @access  Private (Admin only)
router.post('/admin-adjustment', authMiddleware, async (req: any, res) => {
  try {
    const { userId, amount, description, reason } = req.body;

    // Verificar que el usuario sea admin (esto debería implementarse en el middleware)
    // Por ahora, asumimos que el usuario es admin

    if (!userId || !amount || !description) {
      return res.status(400).json({
        success: false,
        message: 'Faltan datos requeridos'
      });
    }

    // Crear transacción
    const transaction = new PointsTransaction({
      user: userId,
      type: 'admin_adjustment',
      amount: Math.abs(amount),
      description,
      status: 'completed',
      metadata: {
        adminId: req.userId
      }
    });

    await transaction.save();

    // Actualizar balance del usuario
    let userPoints = await UserPoints.findOne({ user: userId });
    if (!userPoints) {
      userPoints = new UserPoints({
        user: userId,
        totalPoints: 0,
        availablePoints: 0,
        usedPoints: 0
      });
    }

    if (amount > 0) {
      userPoints.totalPoints += amount;
      userPoints.availablePoints += amount;
    } else {
      userPoints.availablePoints = Math.max(0, userPoints.availablePoints + amount);
    }

    userPoints.transactions.push(transaction._id as any);
    await userPoints.save();

    res.json({
      success: true,
      message: 'Ajuste de puntos realizado exitosamente',
      data: {
        transaction,
        newBalance: userPoints.availablePoints
      }
    });
  } catch (error) {
    console.error('Error in admin adjustment:', error);
    res.status(500).json({
      success: false,
      message: 'Error al realizar el ajuste de puntos'
    });
  }
});

// @route   GET /api/points/leaderboard
// @desc    Obtener ranking de usuarios por puntos
// @access  Public
router.get('/leaderboard', async (req, res) => {
  try {
    const { limit = 10 } = req.query;

    const leaderboard = await UserPoints.find()
      .populate('user', 'name email')
      .sort({ totalPoints: -1 })
      .limit(parseInt(limit as string));

    res.json({
      success: true,
      data: leaderboard.map((userPoints, index) => ({
        rank: index + 1,
        user: userPoints.user,
        totalPoints: userPoints.totalPoints,
        availablePoints: userPoints.availablePoints
      }))
    });
  } catch (error) {
    console.error('Error getting leaderboard:', error);
    res.status(500).json({
      success: false,
      message: 'Error al obtener el ranking de puntos'
    });
  }
});

export default router;
