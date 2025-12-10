const express = require('express');
const router = express.Router();
const {
  getAllEvents,
  getEventById,
  createEvent,
  updateEvent,
  deleteEvent,
  joinEvent,
  leaveEvent,
  getMyEvents,
  markAttendance
} = require('../controllers/eventsController');

const { authenticate, optionalAuthenticate, authorizeOrganizer } = require('../middleware/auth');

// Públicas con auth opcional
router.get('/', optionalAuthenticate, getAllEvents);

// Mis eventos (organizer)
router.get('/mine/list', authenticate, authorizeOrganizer, getMyEvents);

// Crear/editar/eliminar - Solo organizadores propietarios
router.post('/', authenticate, authorizeOrganizer, createEvent);
router.put('/:id', authenticate, authorizeOrganizer, updateEvent);
router.delete('/:id', authenticate, authorizeOrganizer, deleteEvent);

// Módulo operativo - Cualquier usuario autenticado (admins no pueden unirse)
router.post('/:id/join', authenticate, joinEvent);
router.post('/:id/leave', authenticate, leaveEvent);

// Marcar asistencia (organizer propietario)
router.patch('/:id/participants/:participantId/attendance', authenticate, authorizeOrganizer, markAttendance);

// Detalle (debe ir al final para no colisionar con rutas más específicas)
router.get('/:id', optionalAuthenticate, getEventById);

module.exports = router;