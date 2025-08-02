const express = require('express');
const router = express.Router();
const usuarioController = require('../controllers/usuarioController');

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
