const express = require('express');
const router = express.Router();
const { verificarToken } = require('../middleware/authMiddleware');
const verificarLiderDoMinisterio = require('../middleware/verificarLiderDoMinisterio');
const ministerioController = require('../controllers/ministerioController');
const escalaController = require('../controllers/escalaController');

// Aprovar solicitação (ex.: body { voluntarioId } ou requestId)
router.post('/ministerios/:id/aprovar-voluntario', verificarToken, verificarLiderDoMinisterio, ministerioController.aprovarVoluntario);

// Criar escala apenas no ministério que lidera
router.post('/ministerios/:id/escalas', verificarToken, verificarLiderDoMinisterio, escalaController.criarEscalaPorLider);

// Validar presença de voluntário (marcar presença)
router.post('/escalas/:escalaId/presenca', verificarToken, escalaController.validarPresenca);

module.exports = router;