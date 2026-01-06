const express = require('express');
const router = express.Router();
const { verificarToken } = require('../middleware/authMiddleware');
const voluntarioController = require('../controllers/voluntarioController');
const {
  validateAdicionarVoluntario,
  validateConfirmarPresenca,
  validateParamEscalaId,
  validateParamMinisterioId,
  validarMaximoMinisterios,
  validarVoluntarioExiste,
  validarVoluntarioNoMinisterio
} = require('../middleware/validators');

// ===== SOLICITAÇÕES DE INGRESSO =====

// Solicitar ingresso em um ministério
router.post('/solicitar-ministerio', verificarToken, validateAdicionarVoluntario, validarMaximoMinisterios, validarVoluntarioExiste, voluntarioController.solicitarMinisterio);

// Listar solicitações pendentes
router.get('/minhas-solicitacoes', verificarToken, voluntarioController.minhasSolicitacoes);

// ===== ESCALAS DO VOLUNTÁRIO =====

// Listar escalas do voluntário
router.get('/minhas-escalas', verificarToken, voluntarioController.minhasEscalas);

// Confirmar presença em escala
router.post('/escalas/:escalaId/confirmar-presenca', verificarToken, validateParamEscalaId, validateConfirmarPresenca, voluntarioController.confirmarPresenca);

// ===== MINISTÉRIOS DO VOLUNTÁRIO =====

// Listar ministérios em que está aprovado
router.get('/meus-ministerios', verificarToken, voluntarioController.meusMinisterios);

// Sair de um ministério
router.post('/sair-ministerio/:ministerioId', verificarToken, validateParamMinisterioId, voluntarioController.sairMinisterio);

module.exports = router;