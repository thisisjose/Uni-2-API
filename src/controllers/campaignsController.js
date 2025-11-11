const Campaign = require('../models/Campaign');

// GET - Obtener todas las campañas
const getAllCampaigns = async (req, res) => {
  try {
    const campaigns = await Campaign.find();
    res.json({
      success: true,
      count: campaigns.length,
      data: campaigns
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error obteniendo campañas',
      error: error.message
    });
  }
};

// GET - Obtener campaña por ID
const getCampaignById = async (req, res) => {
  try {
    const campaign = await Campaign.findById(req.params.id);
    if (!campaign) {
      return res.status(404).json({
        success: false,
        message: 'Campaña no encontrada'
      });
    }
    res.json({
      success: true,
      data: campaign
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error obteniendo campaña',
      error: error.message
    });
  }
};

// POST - Crear nueva campaña
const createCampaign = async (req, res) => {
  try {
    const campaign = new Campaign(req.body);
    const savedCampaign = await campaign.save();
    
    res.status(201).json({
      success: true,
      message: 'Campaña creada exitosamente',
      data: savedCampaign
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: 'Error creando campaña',
      error: error.message
    });
  }
};

// PUT - Actualizar campaña completa
const updateCampaign = async (req, res) => {
  try {
    const campaign = await Campaign.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    
    if (!campaign) {
      return res.status(404).json({
        success: false,
        message: 'Campaña no encontrada'
      });
    }
    
    res.json({
      success: true,
      message: 'Campaña actualizada exitosamente',
      data: campaign
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: 'Error actualizando campaña',
      error: error.message
    });
  }
};

// DELETE - Eliminar campaña
const deleteCampaign = async (req, res) => {
  try {
    const campaign = await Campaign.findByIdAndDelete(req.params.id);
    
    if (!campaign) {
      return res.status(404).json({
        success: false,
        message: 'Campaña no encontrada'
      });
    }
    
    res.json({
      success: true,
      message: 'Campaña eliminada exitosamente'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error eliminando campaña',
      error: error.message
    });
  }
};

// POST - Unirse a campaña (MÓDULO OPERATIVO)
const joinCampaign = async (req, res) => {
  try {
    const { userId, userName } = req.body;
    
    const campaign = await Campaign.findByIdAndUpdate(
      req.params.id,
      {
        $push: {
          participants: {
            userId,
            userName,
            joinedAt: new Date()
          }
        },
        $inc: { currentProgress: 1 }
      },
      { new: true }
    );
    
    if (!campaign) {
      return res.status(404).json({
        success: false,
        message: 'Campaña no encontrada'
      });
    }
    
    res.json({
      success: true,
      message: 'Te has unido exitosamente a la campaña',
      data: campaign
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: 'Error uniéndose a la campaña',
      error: error.message
    });
  }
};

module.exports = {
  getAllCampaigns,
  getCampaignById,
  createCampaign,
  updateCampaign,
  deleteCampaign,
  joinCampaign
};