// src/routes/protectedRoutes.js
const express = require('express');
const router = express.Router();
const verificarToken = require('../middleware/authMiddleware');

// Exemplo de rota protegida
router.get('/dashboard', verificarToken, (req, res) => {
  res.json({ message: `Bem-vindo, ${req.usuario.nome || 'usuário'}!` });
});

module.exports = router;
