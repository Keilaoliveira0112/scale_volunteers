const express = require('express');
const router = express.Router();
const verificarToken = require('../middleware/authMiddleware');
const usuarioController = require('../controllers/usuarioController');
const authController = require('../controllers/authController');


// Rota protegida
router.get('/perfil', verificarToken, authController.getUsuarioAutenticado);

// POST - Criar usuário
router.post('/', usuarioController.createUsuario);

// GET - Listar todos os usuários
router.get('/', usuarioController.getUsuarios);

// GET - Buscar usuário por ID
router.get('/:id', usuarioController.getUsuarioById);

// PUT - Atualizar usuário por ID
router.put('/:id', usuarioController.updateUsuario);

// DELETE - Excluir usuário por ID
router.delete('/:id', usuarioController.deleteUsuario);

module.exports = router;