const express = require('express');
const router = express.Router();
const { verificarToken } = require('../middleware/authMiddleware');
const authorizeAdmin = require('../middleware/authorizeAdmin');
const adminController = require('../controllers/adminController');

// ===== DASHBOARD =====

// Dashboard com estatísticas
router.get('/dashboard', verificarToken, authorizeAdmin, adminController.getDashboard);

// ===== USUÁRIOS (ADMIN) =====

// Listar todos os usuários
router.get('/usuarios', verificarToken, authorizeAdmin, adminController.listarUsuarios);

module.exports = router;
