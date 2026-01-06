const express = require('express');
const router = express.Router();
const { verificarToken } = require('../middleware/authMiddleware');
const authorizeAdmin = require('../middleware/authorizeAdmin');
const escalaController = require('../controllers/escalaController');
const {
  validateCreateEscala,
  validateUpdateEscala,
  validateConfirmarPresenca,
  validateAdicionarVoluntarioEscala,
  validateParamEscalaId,
  validateParamEscalaVoluntario,
  validarConflitoEscala
} = require('../middleware/validators');

// ===== CRUD BÁSICO =====

// CREATE - Criar nova escala (admin)
router.post('/', verificarToken, authorizeAdmin, validateCreateEscala, validarConflitoEscala, escalaController.criarEscala);

// READ - Listar todas as escalas (autenticado)
router.get('/', verificarToken, escalaController.listarEscalas);

// READ - Obter escala por ID (autenticado)
router.get('/:id', verificarToken, validateParamEscalaId, escalaController.obterEscala);

// UPDATE - Editar escala (admin)
router.put('/:id', verificarToken, authorizeAdmin, validateParamEscalaId, validateUpdateEscala, escalaController.editarEscala);

// DELETE - Deletar escala (admin)
router.delete('/:id', verificarToken, authorizeAdmin, validateParamEscalaId, escalaController.deletarEscala);

// ===== OPERAÇÕES ESPECIAIS =====

// Confirmar presença na escala (voluntário)
router.post('/:id/confirmar-presenca', verificarToken, validateParamEscalaId, validateConfirmarPresenca, escalaController.confirmarPresenca);

// Adicionar voluntário à escala (admin)
router.post('/:id/adicionar-voluntario', verificarToken, authorizeAdmin, validateParamEscalaId, validateAdicionarVoluntarioEscala, escalaController.adicionarVoluntarioEscala);

// Remover voluntário da escala (admin)
router.delete('/:id/voluntarios/:voluntarioId', verificarToken, authorizeAdmin, validateParamEscalaVoluntario, escalaController.removerVoluntarioEscala);

module.exports = router;