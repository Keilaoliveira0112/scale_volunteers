const express = require('express');
const router = express.Router();
const { verificarToken } = require('../middleware/authMiddleware');
const authorizeAdmin = require("../middleware/authorizeAdmin");

router.get('/dashboard', verificarToken, authorizeAdmin, (req, res) => {
  res.json({ message: `Bem-vindo, admin ${req.usuario.email}!` });
});

module.exports = router;
