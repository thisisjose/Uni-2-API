const express = require('express');
const router = express.Router();
const { getAllUsers, changeRole, toggleActive } = require('../controllers/usersController');
const { authenticate, authorizeAdmin } = require('../middleware/auth');

// Solo administradores
router.get('/', authenticate, authorizeAdmin, getAllUsers);
router.patch('/:id/role', authenticate, authorizeAdmin, changeRole);
router.patch('/:id/active', authenticate, authorizeAdmin, toggleActive);

module.exports = router;
