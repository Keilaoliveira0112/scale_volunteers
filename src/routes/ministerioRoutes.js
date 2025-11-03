// src/routes/ministerioRoutes.js
const express = require('express');
const router = express.Router();
const { verificarToken } = require('../middleware/authMiddleware');
const authorizeAdmin = require('../middleware/authorizeAdmin');
const verificarLiderDoMinisterio = require('../middleware/verificarLiderDoMinisterio');

const ministerioController = require('../controllers/ministerioController');
const escalaController = require('../controllers/escalaController');

// Criar ministério
router.post('/', verificarToken, authorizeAdmin, ministerioController.criarMinisterio);
router.put('/:id', verificarToken, authorizeAdmin, ministerioController.editarMinisterio);
router.delete('/:id', verificarToken, authorizeAdmin, ministerioController.removerMinisterio);

// Atribuir líder (aceita body ou query ?liderId=)
router.post('/:id/atribuir-lider', verificarToken, authorizeAdmin, ministerioController.atribuirLider);

// Adicionar / aprovar voluntário
router.post('/:id/adicionar-voluntario', verificarToken, authorizeAdmin, ministerioController.adicionarVoluntario);
router.post('/:id/aprovar-voluntario', verificarToken, ministerioController.aprovarVoluntario);

// Rota para voluntário solicitar ingresso (usa verificarToken)
router.post('/solicitar', verificarToken, ministerioController.solicitarIngresso);

// criar escala (LIDER do ministério ou ADMIN)
router.post('/:id/escalas', verificarToken, verificarLiderDoMinisterio, escalaController.criarEscalaPorLider);

// rota para confirmar presença (voluntário)
router.post('/:ministerioId/escalas/:escalaId/presenca', verificarToken, escalaController.confirmarPresenca);

module.exports = router;
