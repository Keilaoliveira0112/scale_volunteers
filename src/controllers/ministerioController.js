// src/controllers/ministerioController.js
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

exports.adicionarVoluntario = async (req, res) => {
  try {
    const { usuarioId, ministerioId } = req.body;

    // Verifica se já existe esse vínculo
    const existe = await prisma.voluntarioMinisterio.findUnique({
      where: {
        usuarioId_ministerioId: {
          usuarioId,
          ministerioId,
        },
      },
    });

    if (existe) {
      return res.status(400).json({ mensagem: 'Voluntário já está nesse ministério' });
    }

    // Cria o vínculo
    const novoVinculo = await prisma.voluntarioMinisterio.create({
      data: { usuarioId, ministerioId },
    });

    res.status(201).json({ mensagem: 'Voluntário adicionado com sucesso', novoVinculo });
  } catch (error) {
    console.error(error);
    res.status(500).json({ mensagem: 'Erro ao adicionar voluntário', erro: error.message });
  }
};
