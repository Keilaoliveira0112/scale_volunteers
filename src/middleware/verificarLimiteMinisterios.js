const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

module.exports = async function verificarLimiteMinisterios(req, res, next) {
  try {
    // obtém ministerioId de body ou params
    const ministerioId = Number(req.body.ministerioId ?? req.params.ministerioId);
    if (!ministerioId || Number.isNaN(ministerioId)) {
      return res.status(400).json({ mensagem: 'ministerioId inválido ou ausente.' });
    }

    // opcional: validar voluntarioId também se necessário
    const voluntarioId = Number(req.body.voluntarioId ?? req.body.usuarioId);
    if (!voluntarioId || Number.isNaN(voluntarioId)) {
      return res.status(400).json({ mensagem: 'voluntarioId inválido ou ausente.' });
    }

    // conta voluntários já vinculados ao ministério
    const total = await prisma.usuarioMinisterio.count({
      where: { ministerioId: ministerioId },
    });

    const LIMITE = Number(process.env.LIMITE_VOLUNTARIOS_POR_MINISTERIO ?? 50); // ajuste
    if (total >= LIMITE) {
      return res.status(400).json({ mensagem: 'Limite de voluntários neste ministério atingido.' });
    }

    // tudo ok
    next();
  } catch (error) {
    console.error('Erro em verificarLimiteMinisterios:', error);
    return res.status(500).json({ mensagem: 'Erro interno ao verificar limite de ministério.', detalhe: error.message });
  }
};
