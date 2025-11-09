// src/routes/authRoutes.js
const express = require('express');
const router = express.Router();
const { verificarToken } = require('../middleware/authMiddleware');
const usuarioController = require('../controllers/usuarioController');

// Rotas públicas (sem autenticação)
router.post('/register', usuarioController.register);
router.post('/login', usuarioController.login);

// Rotas protegidas (apenas autenticado)
router.get('/perfil', verificarToken, usuarioController.obterPerfil);
router.put('/perfil', verificarToken, usuarioController.atualizarPerfil);

module.exports = router;