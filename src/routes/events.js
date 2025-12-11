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

const { authenticate, optionalAuthenticate, authorizeOrganizer, requireOrganizerOrAdmin } = require('../middleware/auth');

// Públicas con auth opcional
router.get('/', optionalAuthenticate, getAllEvents);

// Mis eventos (organizer o admin)
router.get('/mine/list', authenticate, requireOrganizerOrAdmin, getMyEvents);

// Crear/editar/eliminar - Solo organizadores y admin
router.post('/', authenticate, requireOrganizerOrAdmin, createEvent);
router.put('/:id', authenticate, requireOrganizerOrAdmin, updateEvent);
router.delete('/:id', authenticate, requireOrganizerOrAdmin, deleteEvent);

// Módulo operativo - Cualquier usuario autenticado (admins no pueden unirse)
router.post('/:id/join', authenticate, joinEvent);
router.post('/:id/leave', authenticate, leaveEvent);

// Marcar asistencia (organizer o admin propietario)
router.patch('/:id/participants/:participantId/attendance', authenticate, requireOrganizerOrAdmin, markAttendance);

// Detalle (debe ir al final para no colisionar con rutas más específicas)
router.get('/:id', optionalAuthenticate, getEventById);

module.exports = router;