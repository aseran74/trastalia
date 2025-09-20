import { Request, Response, NextFunction } from 'express';
import { jwtVerify } from 'jose';

// Clave secreta para JWT
const JWT_SECRET = new TextEncoder().encode(process.env.JWT_SECRET || 'your-super-secret-key-change-in-production');

// Extender la interfaz Request para incluir userId
declare global {
  namespace Express {
    interface Request {
      userId?: string;
      userRole?: string;
    }
  }
}

export const authMiddleware = async (req: Request, res: Response, next: NextFunction) => {
  try {
    // Obtener token del header Authorization
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        success: false,
        message: 'Token de acceso requerido'
      });
    }

    // Extraer token
    const token = authHeader.substring(7); // Remover 'Bearer '

    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'Token de acceso requerido'
      });
    }

    // Verificar token
    let payload;
    try {
      const result = await jwtVerify(token, JWT_SECRET);
      payload = result.payload;
      
      // Verificar que el token no haya expirado
      if (payload.exp && payload.exp < Date.now() / 1000) {
        return res.status(401).json({
          success: false,
          message: 'Token expirado'
        });
      }
    } catch (error) {
      console.error('Error verificando token:', error);
      return res.status(401).json({
        success: false,
        message: 'Token inválido'
      });
    }

    // Agregar información del usuario a la request
    req.userId = payload.userId as string;
    req.userRole = payload.role as string;

    next();

  } catch (error) {
    console.error('Error en middleware de autenticación:', error);
    return res.status(401).json({
      success: false,
      message: 'Token inválido'
    });
  }
};

// Middleware para verificar roles específicos
export const requireRole = (roles: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.userRole) {
      return res.status(401).json({
        success: false,
        message: 'No autorizado'
      });
    }

    if (!roles.includes(req.userRole)) {
      return res.status(403).json({
        success: false,
        message: 'Permisos insuficientes'
      });
    }

    next();
  };
};
