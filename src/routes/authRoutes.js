// src/routes/authRoutes.js
const express = require('express');
const router = express.Router();

const authController = require('../controllers/authController');
const usuarioController = require('../controllers/usuarioController');
const verificarToken = require('../middleware/authMiddleware');

// Rotas de autenticação
router.post('/register', authController.register);
router.post('/login', authController.login);
router.get('/me', verificarToken, authController.getUsuarioAutenticado);

// Rotas de usuários (protegidas)
router.get('/', verificarToken, usuarioController.getUsuarios);
router.get('/:id', verificarToken, usuarioController.getUsuarioById);
router.put('/:id', verificarToken, usuarioController.updateUsuario);
router.delete('/:id', verificarToken, usuarioController.deleteUsuario);

module.exports = router;