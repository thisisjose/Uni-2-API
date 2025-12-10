// // En la función createCampaign, modificar:
// const createCampaign = async (req, res) => {
//   try {
//     const campaignData = {
//       ...req.body,
//       createdBy: req.user._id  // Agregar el usuario autenticado
//     };
    
//     const campaign = new Campaign(campaignData);
//     const savedCampaign = await campaign.save();
    
//     res.status(201).json({
//       success: true,
//       message: 'Campaña creada exitosamente',
//       data: savedCampaign
//     });
//   } catch (error) {
//     res.status(400).json({
//       success: false,
//       message: 'Error creando campaña',
//       error: error.message
//     });
//   }
// };