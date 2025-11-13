const Event = require('../models/Event');
const mockEvents = require ('../data/mockEvents');

// GET - Obtener todos los eventos
const getAllEvents = async (req, res) => {

  const useMockData = true;

  if(useMockData){
    return res.json({
      success: true,
      count: mockEvents.length,
      data: mockEvents
    })
  }

  try {
    const events = await Event.find();
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

// GET - Obtener evento por ID
const getEventById = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) {
      return res.status(404).json({
        success: false,
        message: 'Evento no encontrado'
      });
    }
    res.json({
      success: true,
      data: event
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error obteniendo evento',
      error: error.message
    });
  }
};

// POST - Crear nuevo evento
const createEvent = async (req, res) => {
  try {
    const event = new Event(req.body);
    const savedEvent = await event.save();
    
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

// PUT - Actualizar evento
const updateEvent = async (req, res) => {
  try {
    const event = await Event.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    
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

// DELETE - Eliminar evento
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
    const { userId, userName } = req.body;
    
    const event = await Event.findByIdAndUpdate(
      req.params.id,
      {
        $push: {
          participants: {
            userId,
            userName,
            joinedAt: new Date()
          }
        }
      },
      { new: true }
    );
    
    if (!event) {
      return res.status(404).json({
        success: false,
        message: 'Evento no encontrado'
      });
    }
    
    res.json({
      success: true,
      message: 'Te has unido exitosamente al evento',
      data: event
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: 'Error uniéndose al evento',
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
  joinEvent
};