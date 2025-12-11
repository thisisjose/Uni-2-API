const User = require('../models/User');

// Actualizar rol de un usuario (solo admin)
const updateRole = async (req, res) => {
  try {
    const { id } = req.params;
    const { role } = req.body;

    // Validar que el role sea válido
    if (!['user', 'organizer', 'admin'].includes(role)) {
      return res.status(400).json({
        success: false,
        message: 'Rol inválido. Debe ser: user, organizer o admin'
      });
    }

    // Verificar que solo un admin pueda cambiar roles
    if (!req.user || req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Acceso denegado. Solo administradores pueden cambiar roles.'
      });
    }

    const user = await User.findByIdAndUpdate(
      id,
      { role },
      { new: true }
    );

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'Usuario no encontrado'
      });
    }

    res.json({
      success: true,
      message: 'Rol actualizado exitosamente',
      data: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error actualizando rol',
      error: error.message
    });
  }
};

// Obtener todos los usuarios (solo admin)
const getAllUsers = async (req, res) => {
  try {
    // Verificar que solo un admin pueda acceder
    if (!req.user || req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Acceso denegado. Solo administradores pueden ver la lista de usuarios.'
      });
    }

    const users = await User.find().select('-password');

    res.json({
      success: true,
      count: users.length,
      data: users
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error obteniendo usuarios',
      error: error.message
    });
  }
};

// Obtener usuario por ID (solo admin o el mismo usuario)
const getUserById = async (req, res) => {
  try {
    const { id } = req.params;

    // Verificar acceso: solo admin o el mismo usuario
    if (req.user.role !== 'admin' && req.user._id.toString() !== id) {
      return res.status(403).json({
        success: false,
        message: 'Acceso denegado.'
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
    res.status(500).json({
      success: false,
      message: 'Error obteniendo usuario',
      error: error.message
    });
  }
};

module.exports = { updateRole, getAllUsers, getUserById };
