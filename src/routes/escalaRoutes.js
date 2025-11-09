const express = require('express');
const router = express.Router();
const { verificarToken } = require('../middleware/authMiddleware');
const escalaController = require('../controllers/escalaController');

// Confirmar presença na escala (voluntário)
router.post('/:id/confirmar-presenca', verificarToken, escalaController.confirmarPresenca);

module.exports = router;