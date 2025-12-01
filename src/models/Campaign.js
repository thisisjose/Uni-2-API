const { authenticate, authorizeAdmin } = require('../middleware/auth');

// Aplicar middleware a rutas que lo necesiten
router.post('/', authenticate, authorizeAdmin, createCampaign);
router.put('/:id', authenticate, authorizeAdmin, updateCampaign);
router.delete('/:id', authenticate, authorizeAdmin, deleteCampaign);

// Las rutas GET permanecen públicas
router.get('/', getAllCampaigns);
router.get('/:id', getCampaignById);

// Unirse requiere autenticación (pero no ser admin)
router.post('/:id/join', authenticate, joinCampaign);