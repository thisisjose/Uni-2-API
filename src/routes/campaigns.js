const express = require('express');
const router = express.Router();
const {
  getAllCampaigns,
  getCampaignById,
  createCampaign,
  updateCampaign,
  deleteCampaign,
  joinCampaign
} = require('../controllers/campaignsController');

// CRUD Completo
router.get('/', getAllCampaigns);           // GET todas las campañas
router.get('/:id', getCampaignById);        // GET campaña por ID
router.post('/', createCampaign);           // POST crear campaña
router.put('/:id', updateCampaign);         // PUT actualizar campaña
router.delete('/:id', deleteCampaign);      // DELETE eliminar campaña

// MÓDULO OPERATIVO - Unirse a campaña
router.post('/:id/join', joinCampaign);     // POST unirse a campaña

module.exports = router;