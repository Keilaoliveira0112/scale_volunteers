const express = require('express');
const router = express.Router();
const { verificarToken } = require('../middleware/authMiddleware');
const usuarioController = require('../controllers/usuarioController');
const authController = require('../controllers/authController');
const authorizeAdmin = require('../middleware/authorizeAdmin');


// Rota protegida
router.get('/perfil', verificarToken, authController.getUsuarioAutenticado);

// Rota pública
router.get('/publico', (req, res) => {
  res.json({ message: 'Essa rota é pública!' });
});

// Rota protegida (precisa de JWT válido)
router.get('/perfil', verificarToken, usuarioController.getPerfil);

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

// Rota protegida apenas para ADMIN
router.get('/admin/listar-usuarios', verificarToken, authorizeAdmin, usuarioController.listarUsuarios);


module.exports = router;