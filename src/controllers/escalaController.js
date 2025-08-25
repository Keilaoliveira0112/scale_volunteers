const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// Criar escala - Regra: apenas admin ou líder podem criar
const criarEscala = async (req, res) => {
  const { usuarioId, ministerioId, data } = req.body;

  if (req.user.role !== "ADMIN" && req.user.role !== "LIDER") {
    return res.status(403).json({ error: "Apenas admin ou líder podem criar escala." });
  }

  // Checar se o voluntário está disponível na data
  const disponibilidade = await prisma.disponibilidade.findFirst({
    where: {
      voluntarioId: usuarioId,
      data: new Date(data),
      disponivel: true,
    },
  });

  if (!disponibilidade) {
    return res.status(400).json({
      error: "Voluntário não está disponível nesta data.",
    });
  }

  const escala = await prisma.escala.create({
    data: { usuarioId, ministerioId, data: new Date(data) },
  });

  res.json(escala);
};

module.exports = { criarEscala };
