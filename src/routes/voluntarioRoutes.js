const express = require('express');
const router = express.Router();
const { verificarToken } = require('../middleware/authMiddleware');
const voluntarioController = require('../controllers/voluntarioController');

// Solicitar ingresso em ministério
router.post('/solicitar-ministerio', verificarToken, voluntarioController.solicitarMinisterio);

module.exports = router;