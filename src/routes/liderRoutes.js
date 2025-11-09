const express = require('express');
const router = express.Router();
const { verificarToken } = require('../middleware/authMiddleware');
const liderController = require('../controllers/liderController');

// Criar escala (líder)
router.post('/escala', verificarToken, liderController.criarEscala);

// Listar escalas do ministério (líder)
router.get('/escalas/:ministerioId', verificarToken, liderController.listarEscalas);

module.exports = router;