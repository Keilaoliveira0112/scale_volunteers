// src/routes/authRoutes.js
const express = require('express');
const router = express.Router();
const { verificarToken } = require('../middleware/authMiddleware');
const usuarioController = require('../controllers/usuarioController');
const {
  validateRegister,
  validateLogin,
  validateUpdateProfile
} = require('../middleware/validators');

// Rotas públicas (sem autenticação)
router.post('/register', validateRegister, usuarioController.register);
router.post('/login', validateLogin, usuarioController.login);

// Rotas protegidas (apenas autenticado)
router.get('/perfil', verificarToken, usuarioController.obterPerfil);
router.put('/perfil', verificarToken, validateUpdateProfile, usuarioController.atualizarPerfil);

module.exports = router;