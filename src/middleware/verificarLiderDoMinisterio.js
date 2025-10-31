const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

module.exports = async function verificarLiderDoMinisterio(req, res, next) {
  try {
    const userId = req.usuario?.id;
    if (!userId) return res.status(401).json({ mensagem: 'Usuário não autenticado.' });

    // permite admin também
    const role = (req.usuario.role || req.usuario.tipo || '').toString().toLowerCase();
    if (role === 'admin') return next();

    const ministerioId = Number(req.params.id ?? req.body.ministerioId ?? req.body.ministerio?.id);
    if (!ministerioId || Number.isNaN(ministerioId)) {
      return res.status(400).json({ mensagem: 'ministerioId inválido.' });
    }

    const ministerio = await prisma.ministerio.findUnique({ where: { id: ministerioId } });
    if (!ministerio) return res.status(404).json({ mensagem: 'Ministério não encontrado.' });

    if (ministerio.liderId !== Number(userId)) {
      return res.status(403).json({ mensagem: 'Acesso negado: você não é líder deste ministério.' });
    }

    next();
  } catch (error) {
    console.error('verificarLiderDoMinisterio:', error);
    return res.status(500).json({ mensagem: 'Erro interno.' });
  }
};