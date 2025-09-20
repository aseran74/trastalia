import express from 'express';
import { SignJWT, jwtVerify } from 'jose';
import bcrypt from 'bcryptjs';
import User from '../models/User';
import { authMiddleware } from '../middleware/auth';

const router = express.Router();

// Clave secreta para JWT
const JWT_SECRET = new TextEncoder().encode(process.env.JWT_SECRET || 'your-super-secret-key-change-in-production');

// Generar token JWT
const generateToken = async (userId: string, email: string, role: string) => {
  return await new SignJWT({ userId, email, role })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('24h')
    .sign(JWT_SECRET);
};

// Verificar token JWT
const verifyToken = async (token: string) => {
  try {
    const { payload } = await jwtVerify(token, JWT_SECRET);
    return payload;
  } catch (error) {
    throw new Error('Token inválido');
  }
};

// @route   POST /api/auth/register
// @desc    Registrar nuevo usuario
// @access  Public
router.post('/register', async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Validaciones básicas
    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Todos los campos son obligatorios'
      });
    }

    if (password.length < 8) {
      return res.status(400).json({
        success: false,
        message: 'La contraseña debe tener al menos 8 caracteres'
      });
    }

    // Verificar si el usuario ya existe
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'Este email ya está registrado'
      });
    }

    // Crear nuevo usuario (la contraseña se encripta automáticamente en el pre-save hook)
    const user = new User({
      name,
      email,
      password,
      role: 'user',
      avatar: '',
      isActive: true
    });

    await user.save();

    // Generar token
    const token = await generateToken(user._id.toString(), user.email, user.role);

    res.status(201).json({
      success: true,
      message: 'Usuario registrado exitosamente',
      data: {
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
          avatar: user.avatar
        },
        token
      }
    });

  } catch (error) {
    console.error('Error en registro:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor'
    });
  }
});

// @route   POST /api/auth/login
// @desc    Iniciar sesión
// @access  Public
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validaciones básicas
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Email y contraseña son obligatorios'
      });
    }

    // Buscar usuario por email (incluyendo la contraseña para comparar)
    const user = await User.findOne({ email }).select('+password');
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Credenciales inválidas'
      });
    }

    // Verificar si el usuario está activo
    if (!user.isActive) {
      return res.status(401).json({
        success: false,
        message: 'Cuenta desactivada'
      });
    }

    // Comparar contraseñas usando el método del modelo
    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: 'Credenciales inválidas'
      });
    }

    // Actualizar último login
    user.lastLogin = new Date();
    await user.save();

    // Generar token
    const token = await generateToken(user._id.toString(), user.email, user.role);

    res.json({
      success: true,
      message: 'Inicio de sesión exitoso',
      data: {
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
          avatar: user.avatar,
          lastLogin: new Date()
        },
        token
      }
    });

  } catch (error) {
    console.error('Error en login:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor'
    });
  }
});

// @route   GET /api/auth/me
// @desc    Obtener información del usuario actual
// @access  Private
router.get('/me', authMiddleware, async (req: any, res) => {
  try {
    const user = await User.findById(req.userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'Usuario no encontrado'
      });
    }

    res.json({
      success: true,
      data: {
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
          avatar: user.avatar,
          lastLogin: user.lastLogin,
          createdAt: user.createdAt
        }
      }
    });

  } catch (error) {
    console.error('Error al obtener usuario:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor'
    });
  }
});

// @route   POST /api/auth/logout
// @desc    Cerrar sesión (opcional, ya que JWT es stateless)
// @access  Private
router.post('/logout', authMiddleware, (req, res) => {
  res.json({
    success: true,
    message: 'Sesión cerrada exitosamente'
  });
});

export default router;
