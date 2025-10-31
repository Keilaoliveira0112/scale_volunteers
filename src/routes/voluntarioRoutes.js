const express = require('express');
const router = express.Router();
const { verificarToken } = require('../middleware/authMiddleware');
const ministerioController = require('../controllers/ministerioController');
const escalaController = require('../controllers/escalaController');

// Voluntário: solicitar ingresso em ministério
router.post('/solicitar-ministerio', verificarToken, ministerioController.solicitarIngresso);

// Voluntário: confirmar presença em uma escala
router.post('/escalas/:escalaId/presenca', verificarToken, escalaController.confirmarPresenca);

module.exports = router;