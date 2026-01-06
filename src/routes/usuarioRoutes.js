const express = require('express');
const router = express.Router();
const { verificarToken } = require('../middleware/authMiddleware');
const authorizeAdmin = require('../middleware/authorizeAdmin');
const usuarioController = require('../controllers/usuarioController');
const {
  validateRegister,
  validateLogin,
  validateUpdateProfile,
  validateParamId
} = require('../middleware/validators');

// ===== ROTAS PÚBLICAS =====

// Register - Criar novo usuário
router.post('/register', validateRegister, usuarioController.register);

// Login - Autenticar usuário
router.post('/login', validateLogin, usuarioController.login);

// ===== ROTAS PROTEGIDAS (Autenticado) =====

// Obter perfil do usuário autenticado
router.get('/perfil', verificarToken, usuarioController.obterPerfil);

// Atualizar perfil do usuário autenticado
router.put('/perfil', verificarToken, validateUpdateProfile, usuarioController.atualizarPerfil);

// Obter usuário por ID (apenas o próprio ou admin)
router.get('/:id', verificarToken, validateParamId, usuarioController.obterUsuarioPorId);

// ===== ROTAS PROTEGIDAS (Admin) =====

// Listar todos os usuários (admin)
router.get('/', verificarToken, authorizeAdmin, usuarioController.listarUsuarios);

// Deletar usuário (apenas o próprio ou admin)
router.delete('/:id', verificarToken, validateParamId, usuarioController.deletarUsuario);

module.exports = router;