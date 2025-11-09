// src/routes/ministerioRoutes.js
const express = require('express');
const router = express.Router();
const { verificarToken } = require('../middleware/authMiddleware');
const ministerioController = require('../controllers/ministerioController');

// Listar todos os ministérios (autenticado)
router.get('/', verificarToken, ministerioController.listarMinisterios);

// Obter ministério por ID
router.get('/:id', verificarToken, ministerioController.obterMinisterio);

// Listar voluntários do ministério
router.get('/:id/voluntarios', verificarToken, ministerioController.listarVoluntarios);

// Aprovar voluntário
router.post('/:id/aprovar-voluntario', verificarToken, ministerioController.aprovarVoluntario);

module.exports = router;
