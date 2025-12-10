const jwt = require('jsonwebtoken');
const User = require('../models/User');

const JWT_SECRET = process.env.JWT_SECRET || 'tu_secreto_jwt_super_seguro';

// Middleware para verificar token
const authenticate = async (req, res, next) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    
    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'Acceso no autorizado. Token requerido.'
      });
    }

    const decoded = jwt.verify(token, JWT_SECRET);
    const user = await User.findById(decoded.userId);

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Usuario no encontrado'
      });
    }

    if (user.active === false) {
      return res.status(403).json({
        success: false,
        message: 'Usuario desactivado. Contacta al administrador.'
      });
    }

    req.user = user;
    req.token = token;
    next();
  } catch (error) {
    res.status(401).json({
      success: false,
      message: 'Token inválido o expirado'
    });
  }
};

// Middleware opcional: si viene token lo valida y setea req.user, si no sigue
const optionalAuthenticate = async (req, res, next) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    if (!token) return next();

    const decoded = jwt.verify(token, JWT_SECRET);
    const user = await User.findById(decoded.userId);
    if (!user) return next();
    if (user.active === false) return next();

    req.user = user;
    req.token = token;
    return next();
  } catch (error) {
    return next();
  }
};

// Middleware para verificar rol admin
const authorizeAdmin = (req, res, next) => {
  if (!req.user || req.user.role !== 'admin') {
    return res.status(403).json({
      success: false,
      message: 'Acceso denegado. Se requiere rol de administrador.'
    });
  }
  next();
};

const authorizeOrganizer = (req, res, next) => {
  if (!req.user || req.user.role !== 'organizer') {
    return res.status(403).json({
      success: false,
      message: 'Acceso denegado. Se requiere rol de organizador.'
    });
  }
  next();
};

// Generar token JWT
const generateToken = (userId) => {
  return jwt.sign({ userId }, JWT_SECRET, { expiresIn: '7d' });
};

module.exports = { authenticate, optionalAuthenticate, authorizeAdmin, authorizeOrganizer, generateToken };