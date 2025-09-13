// src/routes/ministerioRoutes.js
const express = require('express');
const router = express.Router();
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const ministerioController = require('../controllers/ministerioController');
const verificarLimiteMinisterios = require('../middleware/verificarLimiteMinisterios');

// Criar ministério
router.post('/', async (req, res) => {
  try {
    const { nome, descricao, liderId } = req.body;
    const novoMinisterio = await prisma.ministerio.create({
      data: { nome, descricao, liderId },
    });
    res.status(201).json(novoMinisterio);
  } catch (error) {
    console.error(error);
    res.status(500).json({ mensagem: "Erro ao criar ministério." });
  }
});

// Adicionar voluntário a ministério
router.post(
  '/adicionar-voluntario',
  verificarLimiteMinisterios,
  ministerioController.adicionarVoluntario
);

module.exports = router;
