const Event = require('../models/Event');

// GET - Todos los eventos
const getAllEvents = async (req, res) => {
  try {
    const events = await Event.find().populate('createdBy', 'name email');
    res.json({
      success: true,
      count: events.length,
      data: events
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
    const event = await Event.findById(req.params.id)
      .populate('createdBy', 'name email')
      .populate('participants.userId', 'name');
    
    if (!event) {
      return res.status(404).json({
        success: false,
        message: 'Evento no encontrado'
      });
    }
    res.json({ success: true, data: event });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error obteniendo evento',
      error: error.message
    });
  }
};

// POST - Crear evento (SOLO ADMIN)
const createEvent = async (req, res) => {
  try {
    const eventData = {
      ...req.body,
      createdBy: req.user._id
    };
    
    const event = new Event(eventData);
    const savedEvent = await event.save();
    const populatedEvent = await Event.findById(savedEvent._id)
      .populate('createdBy', 'name email');
    
    res.status(201).json({
      success: true,
      message: 'Evento creado exitosamente',
      data: savedEvent
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: 'Error creando evento',
      error: error.message
    });
  }
};

// PUT - Actualizar evento (SOLO ADMIN)
const updateEvent = async (req, res) => {
  try {
    const event = await Event.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    ).populate('createdBy', 'name email');
    
    if (!event) {
      return res.status(404).json({
        success: false,
        message: 'Evento no encontrado'
      });
    }
    
    res.json({
      success: true,
      message: 'Evento actualizado exitosamente',
      data: event
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: 'Error actualizando evento',
      error: error.message
    });
  }
};

// DELETE - Eliminar evento (SOLO ADMIN)
const deleteEvent = async (req, res) => {
  try {
    const event = await Event.findByIdAndDelete(req.params.id);
    
    if (!event) {
      return res.status(404).json({
        success: false,
        message: 'Evento no encontrado'
      });
    }
    
    res.json({
      success: true,
      message: 'Evento eliminado exitosamente'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error eliminando evento',
      error: error.message
    });
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

    // AGREGAR AL USUARIO
    event.participants.push({
      userId: req.user._id,
      userName: req.user.name
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

    const populatedEvent = await Event.findById(event._id)
      .populate('participants.userId', 'name');

    res.json({
      success: true,
      message: 'Te has salido del evento exitosamente',
      data: populatedEvent
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: 'Error saliéndose del evento',
      error: error.message
    });
  }
};


module.exports = {
  getAllEvents,
  getEventById,
  createEvent,
  updateEvent,
  deleteEvent,
  joinEvent,
  leaveEvent
};