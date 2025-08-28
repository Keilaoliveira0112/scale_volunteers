const express = require('express');
const router = express.Router();
const { verificarToken, verificarAdmin } = require('../middleware/authMiddleware');

router.get('/dashboard', verificarToken, verificarAdmin, (req, res) => {
  res.json({ message: `Bem-vindo, admin ${req.usuario.email}!` });
});

module.exports = router;
