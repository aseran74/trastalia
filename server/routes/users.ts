import express from 'express';
import User from '../models/User';
import { authMiddleware, requireRole } from '../middleware/auth';

const router = express.Router();

// @route   GET /api/users
// @desc    Obtener todos los usuarios (solo admin)
// @access  Private (Admin)
router.get('/', authMiddleware, requireRole(['admin']), async (req, res) => {
  try {
    const allUsers = await User.find().select('-password');
    res.json({
      success: true,
      data: allUsers
    });
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({
      success: false,
      message: 'Error al obtener usuarios'
    });
  }
});

// @route   GET /api/users/:id
// @desc    Obtener un usuario por ID
// @access  Private
router.get('/:id', authMiddleware, async (req: any, res) => {
  try {
    const { id } = req.params;
    
    // Verificar que el usuario solo pueda ver su propio perfil o sea admin
    if (req.userRole !== 'admin' && req.userId !== id) {
      return res.status(403).json({
        success: false,
        message: 'No tienes permisos para ver este perfil'
      });
    }

    const user = await User.findById(id).select('-password');
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'Usuario no encontrado'
      });
    }

    res.json({
      success: true,
      data: user
    });
  } catch (error) {
    console.error('Error fetching user:', error);
    res.status(500).json({
      success: false,
      message: 'Error al obtener el usuario'
    });
  }
});

// @route   PUT /api/users/:id
// @desc    Actualizar un usuario
// @access  Private
router.put('/:id', authMiddleware, async (req: any, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    // Verificar que el usuario solo pueda actualizar su propio perfil o sea admin
    if (req.userRole !== 'admin' && req.userId !== id) {
      return res.status(403).json({
        success: false,
        message: 'No tienes permisos para actualizar este perfil'
      });
    }

    // No permitir actualizar la contraseña desde aquí
    if (updateData.password) {
      delete updateData.password;
    }

    const user = await User.findByIdAndUpdate(
      id, 
      updateData, 
      { new: true, runValidators: true }
    ).select('-password');

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'Usuario no encontrado'
      });
    }

    res.json({
      success: true,
      message: 'Usuario actualizado exitosamente',
      data: user
    });
  } catch (error) {
    console.error('Error updating user:', error);
    res.status(500).json({
      success: false,
      message: 'Error al actualizar el usuario'
    });
  }
});

// @route   DELETE /api/users/:id
// @desc    Eliminar un usuario (solo admin)
// @access  Private (Admin)
router.delete('/:id', authMiddleware, requireRole(['admin']), async (req, res) => {
  try {
    const { id } = req.params;

    const user = await User.findByIdAndDelete(id);
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'Usuario no encontrado'
      });
    }

    res.json({
      success: true,
      message: 'Usuario eliminado exitosamente'
    });
  } catch (error) {
    console.error('Error deleting user:', error);
    res.status(500).json({
      success: false,
      message: 'Error al eliminar el usuario'
    });
  }
});

// @route   PUT /api/users/:id/toggle-status
// @desc    Activar/desactivar usuario (solo admin)
// @access  Private (Admin)
router.put('/:id/toggle-status', authMiddleware, requireRole(['admin']), async (req, res) => {
  try {
    const { id } = req.params;

    const user = await User.findById(id);
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'Usuario no encontrado'
      });
    }

    user.isActive = !user.isActive;
    await user.save();

    res.json({
      success: true,
      message: `Usuario ${user.isActive ? 'activado' : 'desactivado'} exitosamente`,
      data: {
        id: user._id,
        isActive: user.isActive
      }
    });
  } catch (error) {
    console.error('Error toggling user status:', error);
    res.status(500).json({
      success: false,
      message: 'Error al cambiar el estado del usuario'
    });
  }
});

export default router;