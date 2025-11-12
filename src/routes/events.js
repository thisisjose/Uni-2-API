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

// CRUD Completo para Eventos
router.get('/', getAllEvents);           // GET todos los eventos
router.get('/:id', getEventById);        // GET evento por ID
router.post('/', createEvent);           // POST crear evento
router.put('/:id', updateEvent);         // PUT actualizar evento
router.delete('/:id', deleteEvent);      // DELETE eliminar evento

// MÓDULO OPERATIVO - Unirse a evento
router.post('/:id/join', joinEvent);     // POST unirse a evento

module.exports = router;