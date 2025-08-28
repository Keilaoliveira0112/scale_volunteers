const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const adicionarVoluntario = async (req, res) => {
  try {
    const { voluntarioId, ministerioId } = req.body;

    const novoVinculo = await prisma.ministerioVoluntario.create({
      data: {
        voluntarioId,
        ministerioId,
      },
    });

    res.status(201).json({
      mensagem: "Voluntário adicionado ao ministério com sucesso!",
      vinculo: novoVinculo,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ mensagem: "Erro ao adicionar voluntário" });
  }
};

module.exports = { adicionarVoluntario };
