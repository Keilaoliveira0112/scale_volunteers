// src/middleware/validarVoluntarioMinisterios.js
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const validarVoluntarioMinisterios = async (req, res, next) => {
  try {
    const { voluntarioId } = req.body; // ou req.params dependendo da rota

    if (!voluntarioId) {
      return res.status(400).json({ message: "ID do voluntário é obrigatório." });
    }

    // Busca quantos ministérios o voluntário já participa
    const ministerios = await prisma.ministerioVoluntario.findMany({
      where: { voluntarioId },
    });

    if (ministerios.length >= 2) {
      return res.status(400).json({
        message: "Este voluntário já está inscrito em dois ministérios.",
      });
    }

    next();
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Erro ao validar voluntário." });
  }
};

module.exports = validarVoluntarioMinisterios;
