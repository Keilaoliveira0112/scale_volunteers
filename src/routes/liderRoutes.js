const express = require('express');
const router = express.Router();
const { verificarToken } = require('../middleware/authMiddleware');
const liderController = require('../controllers/liderController');
const escalaController = require('../controllers/escalaController');
const {
  validateCreateEscala,
  validateParamMinisterioId,
  validateAdicionarVoluntario,
  validateParamId,
  validarMaximoMinisterios,
  validarVoluntarioExiste,
  validarConflitoEscala
} = require('../middleware/validators');

// ===== ESCALAS DO MINISTÉRIO =====

// Criar escala no ministério que lidera
router.post('/escalas', verificarToken, validateCreateEscala, validarConflitoEscala, liderController.criarEscala);

// Listar escalas do ministério que lidera
router.get('/escalas', verificarToken, liderController.listarEscalas);

// Listar escalas de um ministério específico
router.get('/escalas/:ministerioId', verificarToken, validateParamMinisterioId, liderController.listarEscalas);

// ===== GERENCIAMENTO DE VOLUNTÁRIOS =====

// Adicionar voluntário ao ministério
router.post('/ministerios/:ministerioId/voluntarios', verificarToken, validateParamMinisterioId, validateAdicionarVoluntario, validarMaximoMinisterios, validarVoluntarioExiste, liderController.adicionarVoluntario);

// Listar voluntários do ministério
router.get('/ministerios/:ministerioId/voluntarios', verificarToken, validateParamMinisterioId, liderController.listarVoluntarios);

// Aprovar voluntário
router.post('/ministerios/:ministerioId/aprovar-voluntario/:usuarioId', verificarToken, validateParamMinisterioId, validateParamId, validarVoluntarioExiste, liderController.aprovarVoluntario);

// Rejeitar voluntário
router.post('/ministerios/:ministerioId/rejeitar-voluntario/:usuarioId', verificarToken, validateParamMinisterioId, validateParamId, validarVoluntarioExiste, liderController.rejeitarVoluntario);

module.exports = router;