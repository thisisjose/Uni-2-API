const Event = require('../models/Event');
const mongoose = require('mongoose');

// GET - Todos los eventos
const getAllEvents = async (req, res) => {
  try {
    const events = await Event.find().populate('createdBy', 'name email certified');

    // Map to remove participants list for privacy and include a count
    const payload = events.map(ev => ({
      id: ev._id,
      title: ev.title,
      description: ev.description,
      date: ev.date,
      location: ev.location,
      category: ev.category,
      status: ev.status,
      createdAt: ev.createdAt,
      participantsCount: ev.participants ? ev.participants.length : 0,
      createdBy: ev.createdBy
    }));

    res.json({
      success: true,
      count: payload.length,
      data: payload
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error obteniendo eventos',
      error: error.message
    });
  }
};

// GET - Evento por ID
const getEventById = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id).populate('createdBy', 'name email certified');

    if (!event) {
      return res.status(404).json({
        success: false,
        message: 'Evento no encontrado'
      });
    }

    // Determinar si el requester es el organizador propietario
    const requester = req.user;
    let showParticipants = false;
    if (requester && requester.role === 'organizer' && event.createdBy && event.createdBy._id.toString() === requester._id.toString()) {
      showParticipants = true;
    }

    if (showParticipants) {
      await event.populate('participants.userId', 'name email');
      return res.json({ success: true, data: event });
    }

    // Para otros roles/usuarios no mostramos la lista de participantes
    const safeEvent = {
      id: event._id,
      title: event.title,
      description: event.description,
      date: event.date,
      location: event.location,
      category: event.category,
      status: event.status,
      createdBy: event.createdBy,
      participantsCount: event.participants ? event.participants.length : 0
    };

    res.json({ success: true, data: safeEvent });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error obteniendo evento',
      error: error.message
    });
  }
};

// POST - Crear evento (SOLO ORGANIZER)
const createEvent = async (req, res) => {
  try {
    const eventData = {
      ...req.body,
      createdBy: req.user._id
    };

    const event = new Event(eventData);
    const savedEvent = await event.save();
    const populatedEvent = await Event.findById(savedEvent._id)
      .populate('createdBy', 'name email certified');

    res.status(201).json({
      success: true,
      message: 'Evento creado exitosamente',
      data: populatedEvent
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: 'Error creando evento',
      error: error.message
    });
  }
};

// PUT - Actualizar evento (SOLO ORGANIZER propietario)
const updateEvent = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) return res.status(404).json({ success: false, message: 'Evento no encontrado' });

    if (!req.user || req.user.role !== 'organizer' || event.createdBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: 'Acceso denegado. Solo el organizador propietario puede editar.' });
    }

    Object.assign(event, req.body);
    const saved = await event.save();
    await saved.populate('createdBy', 'name email certified');
    res.json({ success: true, message: 'Evento actualizado exitosamente', data: saved });
  } catch (error) {
    res.status(400).json({ success: false, message: 'Error actualizando evento', error: error.message });
  }
};

// DELETE - Eliminar evento (SOLO ORGANIZER propietario)
const deleteEvent = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) return res.status(404).json({ success: false, message: 'Evento no encontrado' });

    if (!req.user || req.user.role !== 'organizer' || event.createdBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: 'Acceso denegado. Solo el organizador propietario puede eliminar.' });
    }

    await Event.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: 'Evento eliminado exitosamente' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error eliminando evento', error: error.message });
  }
};

// POST - Unirse a evento (MÓDULO OPERATIVO)
const joinEvent = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    
    if (!event) {
      return res.status(404).json({
        success: false,
        message: 'Evento no encontrado'
      });
    }

    // VERIFICAR SI EL USUARIO YA ESTÁ PARTICIPANDO
    const alreadyParticipating = event.participants.some(
      participant => participant.userId.toString() === req.user._id.toString()
    );

    if (alreadyParticipating) {
      return res.status(400).json({
        success: false,
        message: 'Ya estás participando en este evento'
      });
    }

    // No permitir admin unirse a eventos
    if (req.user.role === 'admin') {
      return res.status(403).json({ success: false, message: 'Administradores no pueden unirse a eventos' });
    }

    // AGREGAR AL USUARIO
    event.participants.push({
      userId: req.user._id,
      name: req.user.name,
      attended: null
    });

    event.currentProgress += 1;

    await event.save();

    const populatedEvent = await Event.findById(event._id)
      .populate('participants.userId', 'name');

    res.json({
      success: true,
      message: 'Te has unido exitosamente al evento',
      data: populatedEvent
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: 'Error uniéndose al evento',
      error: error.message
    });
  }
};

// POST - Salirse de evento
const leaveEvent = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    
    if (!event) {
      return res.status(404).json({
        success: false,
        message: 'Evento no encontrado'
      });
    }

    // Verificar si el usuario está participando
    const participantIndex = event.participants.findIndex(
      participant => participant.userId.toString() === req.user._id.toString()
    );

    if (participantIndex === -1) {
      return res.status(400).json({
        success: false,
        message: 'No estás participando en este evento'
      });
    }

    // Remover al usuario
    event.participants.splice(participantIndex, 1);
    event.currentProgress = Math.max(0, event.currentProgress - 1);

    await event.save();

    const populatedEvent = await Event.findById(event._id).populate('participants.userId', 'name');

    res.json({ success: true, message: 'Te has salido del evento exitosamente', data: populatedEvent });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: 'Error saliéndose del evento',
      error: error.message
    });
  }
};

// GET - Eventos creados por el organizador (MIS EVENTOS)
const getMyEvents = async (req, res) => {
  try {
    const events = await Event.find({ createdBy: req.user._id }).populate('createdBy', 'name email certified');
    const payload = events.map(ev => ({
      id: ev._id,
      title: ev.title,
      date: ev.date,
      status: ev.status,
      participantsCount: ev.participants ? ev.participants.length : 0
    }));
    res.json({ success: true, count: payload.length, data: payload });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error obteniendo mis eventos', error: error.message });
  }
};

// PATCH - Marcar asistencia de un participante (solo organizador propietario)
const markAttendance = async (req, res) => {
  try {
    const { id: eventId, participantId } = req.params;
    const { attended } = req.body; // boolean

    if (typeof attended !== 'boolean') return res.status(400).json({ success: false, message: 'Se requiere campo booleano attended' });

    const event = await Event.findById(eventId);
    if (!event) return res.status(404).json({ success: false, message: 'Evento no encontrado' });

    if (!req.user || req.user.role !== 'organizer' || event.createdBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: 'Acceso denegado. Solo el organizador propietario puede marcar asistencia.' });
    }

    const participant = event.participants.id(participantId);
    if (!participant) return res.status(404).json({ success: false, message: 'Participante no encontrado' });

    participant.attended = attended;
    await event.save();

    res.json({ success: true, message: 'Asistencia actualizada', data: { participant } });
  } catch (error) {
    res.status(400).json({ success: false, message: 'Error actualizando asistencia', error: error.message });
  }
};


module.exports = {
  getAllEvents,
  getEventById,
  createEvent,
  updateEvent,
  deleteEvent,
  joinEvent,
  leaveEvent,
  getMyEvents,
  markAttendance
};