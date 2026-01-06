// src/routes/ministerioRoutes.js
const express = require('express');
const router = express.Router();
const { verificarToken } = require('../middleware/authMiddleware');
const authorizeAdmin = require('../middleware/authorizeAdmin');
const ministerioController = require('../controllers/ministerioController');
const {
  validateCreateMinisterio,
  validateUpdateMinisterio,
  validateAtribuirLider,
  validateAdicionarVoluntario,
  validateAprovarVoluntario,
  validateParamId,
  validarMaximoMinisterios,
  validarMinisterioSemEscalasAtivas,
  validarVoluntarioExiste
} = require('../middleware/validators');

// ===== CRUD BÁSICO =====

// CREATE - Criar novo ministério (admin)
router.post('/', verificarToken, authorizeAdmin, validateCreateMinisterio, ministerioController.criarMinisterio);

// READ - Listar todos os ministérios (autenticado)
router.get('/', verificarToken, ministerioController.listarMinisterios);

// READ - Obter ministério por ID (autenticado)
router.get('/:id', verificarToken, validateParamId, ministerioController.obterMinisterio);

// UPDATE - Editar ministério (admin ou líder)
router.put('/:id', verificarToken, validateParamId, validateUpdateMinisterio, ministerioController.editarMinisterio);

// DELETE - Deletar ministério (admin)
router.delete('/:id', verificarToken, authorizeAdmin, validateParamId, validarMinisterioSemEscalasAtivas, ministerioController.removerMinisterio);

// ===== OPERAÇÕES ESPECIAIS =====

// Atribuir líder ao ministério (admin)
router.post('/:id/atribuir-lider', verificarToken, authorizeAdmin, validateParamId, validateAtribuirLider, ministerioController.atribuirLider);

// Adicionar voluntário ao ministério (líder)
router.post('/:id/voluntarios', verificarToken, validateParamId, validateAdicionarVoluntario, validarVoluntarioExiste, validarMaximoMinisterios, ministerioController.adicionarVoluntario);

// Listar voluntários do ministério (autenticado)
router.get('/:id/voluntarios', verificarToken, validateParamId, ministerioController.listarVoluntarios);

// Aprovar voluntário (líder)
router.post('/:id/aprovar-voluntario', verificarToken, validateParamId, validateAprovarVoluntario, ministerioController.aprovarVoluntario);

// Rejeitar voluntário (líder)
router.post('/:id/rejeitar-voluntario', verificarToken, validateParamId, validateAprovarVoluntario, ministerioController.rejeitarVoluntario);

module.exports = router;
