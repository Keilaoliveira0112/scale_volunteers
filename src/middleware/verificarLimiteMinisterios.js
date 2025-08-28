const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const verificarLimiteMinisterios = async (req, res, next) => {
  try {
    const { voluntarioId } = req.body;

    if (!voluntarioId) {
      return res.status(400).json({ mensagem: "voluntarioId é obrigatório" });
    }

    // Contar quantos ministérios esse voluntário já participa
    const ministeriosDoVoluntario = await prisma.ministerioVoluntario.count({
      where: { voluntarioId },
    });

    if (ministeriosDoVoluntario >= 2) {
      return res.status(400).json({
        mensagem: "Este voluntário já está em 2 ministérios e não pode ser adicionado a mais.",
      });
    }

    next(); // segue para a próxima função (controller)
  } catch (error) {
    console.error(error);
    res.status(500).json({ mensagem: "Erro no servidor" });
  }
};

module.exports = verificarLimiteMinisterios;
