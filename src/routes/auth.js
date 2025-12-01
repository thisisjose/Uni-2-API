const express = require('express');
const router = express.Router();
const { register, login, getProfile } = require('../controllers/authController');
const { authenticate } = require('../middleware/auth');

// Rutas públicas
router.post('/register', register);
router.post('/login', login);

// Ruta protegida
router.get('/profile', authenticate, getProfile);

module.exports = router;