const User = require('../models/User');

// GET - Listado de usuarios (ADMIN)
const getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select('name email role active certified createdAt');
    res.json({ success: true, count: users.length, data: users });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error obteniendo usuarios', error: error.message });
  }
};

// PATCH - Cambiar rol (ADMIN)
const changeRole = async (req, res) => {
  try {
    const { role } = req.body; // 'organizer' or 'user'
    if (!['organizer', 'user'].includes(role)) return res.status(400).json({ success: false, message: 'Rol inválido' });

    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ success: false, message: 'Usuario no encontrado' });

    user.role = role;
    await user.save();

    res.json({ success: true, message: 'Rol actualizado', data: { id: user._id, role: user.role } });
  } catch (error) {
    res.status(400).json({ success: false, message: 'Error actualizando rol', error: error.message });
  }
};

// PATCH - Activar / desactivar usuario (ADMIN)
const toggleActive = async (req, res) => {
  try {
    const { active } = req.body; // boolean
    if (typeof active !== 'boolean') return res.status(400).json({ success: false, message: 'Se requiere campo booleano active' });

    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ success: false, message: 'Usuario no encontrado' });

    user.active = active;
    await user.save();

    res.json({ success: true, message: 'Estado actualizado', data: { id: user._id, active: user.active } });
  } catch (error) {
    res.status(400).json({ success: false, message: 'Error actualizando estado', error: error.message });
  }
};

module.exports = { getAllUsers, changeRole, toggleActive };