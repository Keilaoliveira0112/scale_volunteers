const express = require('express');
const router = express.Router();
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const ministerioController = require('../controllers/ministerioController');
const verificarLimiteMinisterios = require('../middleware/verificarLimiteMinisterios');
const validarVoluntarioMinisterios = require("../middleware/validarVoluntarioMinisterios");

// Rota para criar um novo ministério
router.post('/', async (req, res) => {
  try {
    const { nome, descricao, liderId } = req.body;
    const novoMinisterio = await prisma.ministerio.create({
      data: { nome, descricao, liderId }
    });
    res.status(201).json(novoMinisterio);
  } catch (error) {
    console.error(error);
    res.status(500).json({ mensagem: "Erro ao criar ministério." });
  }
});

// Rota para adicionar voluntário em um ministério
router.post('/adicionar-voluntario', verificarLimiteMinisterios, ministerioController.adicionarVoluntario);


router.post("/:ministerioId/voluntarios", validarVoluntarioMinisterios, async (req, res) => {
  try {
    const { ministerioId } = req.params;
    const { voluntarioId } = req.body;

    const novoVinculo = await prisma.ministerioVoluntario.create({
      data: {
        ministerioId: Number(ministerioId),
        voluntarioId: Number(voluntarioId),
      },
    });

    res.status(201).json(novoVinculo);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Erro ao adicionar voluntário ao ministério." });
  }
});



module.exports = router;
