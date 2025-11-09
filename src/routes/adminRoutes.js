const express = require('express');
const router = express.Router();
const { verificarToken } = require('../middleware/authMiddleware');
const authorizeAdmin = require('../middleware/authorizeAdmin');
const adminController = require('../controllers/adminController');
const ministerioController = require('../controllers/ministerioController');
const escalaController = require('../controllers/escalaController');

// Dashboard
router.get('/dashboard', verificarToken, authorizeAdmin, adminController.getDashboard);

// Usuários
router.get('/listar-usuarios', verificarToken, authorizeAdmin, adminController.listarUsuarios);

// Ministérios
router.post('/ministerios', verificarToken, authorizeAdmin, ministerioController.criarMinisterio);
router.put('/ministerios/:id', verificarToken, authorizeAdmin, ministerioController.editarMinisterio);
router.delete('/ministerios/:id', verificarToken, authorizeAdmin, ministerioController.removerMinisterio);

// Escalas (NOVA ROTA)
router.post('/escalas', verificarToken, authorizeAdmin, adminController.criarEscala);
router.get('/escalas', verificarToken, authorizeAdmin, adminController.listarEscalas);

module.exports = router;
