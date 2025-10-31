const express = require('express');
const router = express.Router();
const { verificarToken } = require('../middleware/authMiddleware');
const authorizeAdmin = require('../middleware/authorizeAdmin');
const ministerioController = require('../controllers/ministerioController');
const escalaController = require('../controllers/escalaController');

// Ministérios
router.post('/ministerios', verificarToken, authorizeAdmin, ministerioController.criarMinisterio);
router.put('/ministerios/:id', verificarToken, authorizeAdmin, ministerioController.editarMinisterio);
router.delete('/ministerios/:id', verificarToken, authorizeAdmin, ministerioController.removerMinisterio);

// Atribuições
router.post('/ministerios/:id/atribuir-lider', verificarToken, authorizeAdmin, ministerioController.atribuirLider);
router.post('/ministerios/:id/atribuir-voluntario', verificarToken, authorizeAdmin, ministerioController.adicionarVoluntario);

// Escalas (ADMIN pode criar em qualquer ministério)
router.post('/escalas', verificarToken, authorizeAdmin, escalaController.criarEscala);

module.exports = router;
