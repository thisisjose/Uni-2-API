const express = require('express');
const router = express.Router();
const {
  getAllEvents,
  getEventById,
  createEvent,
  updateEvent,
  deleteEvent,
  joinEvent
} = require('../controllers/eventsController');

const { authenticate, authorizeAdmin } = require('../middleware/auth');

// Públicas
router.get('/', getAllEvents);
router.get('/:id', getEventById);

// Protegidas - Solo admin
router.post('/', authenticate, authorizeAdmin, createEvent);
router.put('/:id', authenticate, authorizeAdmin, updateEvent);
router.delete('/:id', authenticate, authorizeAdmin, deleteEvent);

// Módulo operativo - Cualquier usuario autenticado
router.post('/:id/join', authenticate, joinEvent);

module.exports = router;