const express = require('express');
const router = express.Router();
const { updateRole, getAllUsers, getUserById } = require('../controllers/usersController');
const { authenticate, authorizeAdmin } = require('../middleware/auth');

// Ruta para obtener todos los usuarios (solo admin)
router.get('/', authenticate, authorizeAdmin, getAllUsers);

// Ruta para obtener un usuario por ID (solo admin o el mismo usuario)
router.get('/:id', authenticate, getUserById);

// Ruta para actualizar el rol de un usuario (solo admin)
router.put('/:id/role', authenticate, authorizeAdmin, updateRole);

module.exports = router;
