const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const sendNotification = require('../utils/notification');

exports.criarEscala = async (req, res) => {
  try {
    const { ministerioId, dataHora, voluntarios } = req.body; // voluntarios: array de ids
    // validar permissões: ADMIN já garantido via rota; se LIDER for permitido, checar req.usuario.tipo

    // validar que cada voluntario pertence ao ministério
    for (const vid of voluntarios || []) {
      const pertence = await prisma.usuarioMinisterio.findUnique({
        where: { usuarioId_ministerioId: { usuarioId: Number(vid), ministerioId: Number(ministerioId) } }
      });
      if (!pertence) return res.status(400).json({ mensagem: `Voluntário ${vid} não pertence ao ministério.` });
    }

    // checar conflitos de data/horário (ex.: voluntario já escalado)
    // implementar lógica de conflito conforme suas regras

    const escala = await prisma.escala.create({
      data: {
        ministerioId: Number(ministerioId),
        dataHora: new Date(dataHora),
        voluntarios: { create: (voluntarios || []).map(id => ({ voluntarioId: Number(id) })) }
      },
      include: { voluntarios: true }
    });

    return res.status(201).json(escala);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ mensagem: 'Erro ao criar escala.' });
  }
};

exports.criarEscalaPorLider = async (req, res) => {
  try {
    const ministerioId = Number(req.params.id);
    const { dataHora, voluntarios } = req.body || {};
    if (!ministerioId || !dataHora) return res.status(400).json({ mensagem: 'ministerioId e dataHora são obrigatórios.' });

    // checagem de role (defensiva)
    const tipo = (req.usuario?.tipo || req.usuario?.role || '').toString().toLowerCase();
    if (!['admin', 'lider'].includes(tipo)) return res.status(403).json({ mensagem: 'Apenas ADMIN ou LIDER podem criar escalas.' });

    const dt = new Date(dataHora);
    if (isNaN(dt)) return res.status(400).json({ mensagem: 'dataHora inválida.' });

    const ministerio = await prisma.ministerio.findUnique({ where: { id: ministerioId } });
    if (!ministerio) return res.status(404).json({ mensagem: 'Ministério não encontrado.' });

    // validar voluntários pertencem ao ministério e não possuem conflito no mesmo date/time
    for (const vid of (voluntarios || [])) {
      const pertence = await prisma.usuarioMinisterio.findFirst({
        where: { usuarioId: Number(vid), ministerioId }
      });
      if (!pertence) return res.status(400).json({ mensagem: `Voluntário ${vid} não pertence ao ministério.` });

      const conflito = await prisma.escala.findFirst({
        where: {
          dataHora: dt,
          voluntarios: { some: { voluntarioId: Number(vid) } }
        }
      });
      if (conflito) return res.status(400).json({ mensagem: `Conflito: voluntário ${vid} já está escalado neste horário.` });
    }

    // criar escala em transação e adicionar voluntários
    const created = await prisma.$transaction(async (tx) => {
      const escala = await tx.escala.create({
        data: { ministerioId, dataHora: dt }
      });

      if (voluntarios && voluntarios.length) {
        const inserts = voluntarios.map(v => ({ escalaId: escala.id, voluntarioId: Number(v) }));
        // use createMany se tiver tabela escalaVoluntario; se model for diferente ajuste
        await tx.escalaVoluntario.createMany({ data: inserts, skipDuplicates: true });
      }

      return tx.escala.findUnique({ where: { id: escala.id }, include: { voluntarios: true } });
    });

    // notificar voluntários (stub)
    if (created?.voluntarios && created.voluntarios.length) {
      for (const ev of created.voluntarios) {
        // busca email do voluntário (silencioso se falhar)
        const u = await prisma.usuario.findUnique({ where: { id: ev.voluntarioId } });
        if (u?.email) {
          sendNotification(u.email, 'Nova escala atribuída', `Você foi escalado para ${ministerio?.nome ?? 'um ministério'} em ${dt.toISOString()}`);
        }
      }
    }

    return res.status(201).json(created);
  } catch (error) {
    console.error('criarEscalaPorLider:', error);
    return res.status(500).json({ mensagem: 'Erro ao criar escala.', detalhe: error.message });
  }
};

exports.confirmarPresenca = async (req, res) => {
  try {
    const escalaId = Number(req.params.escalaId);
    const voluntarioId = Number(req.usuario?.id);
    if (!escalaId || !voluntarioId) return res.status(400).json({ mensagem: 'IDs obrigatórios.' });

    const escala = await prisma.escala.findUnique({ where: { id: escalaId } });
    if (!escala) return res.status(404).json({ mensagem: 'Escala não encontrada.' });

    const ev = await prisma.escalaVoluntario.findFirst({ where: { escalaId, voluntarioId } });
    if (!ev) return res.status(403).json({ mensagem: 'Você não está designado nesta escala.' });

    const agora = new Date();
    const diffHoras = (new Date(escala.dataHora) - agora) / (1000 * 60 * 60);
    if (diffHoras < 48) return res.status(400).json({ mensagem: 'Confirmação encerrada (faltam < 48h).' });

    await prisma.escalaVoluntario.update({ where: { id: ev.id }, data: { presenteConfirmado: true } });
    return res.status(200).json({ mensagem: 'Presença confirmada.' });
  } catch (error) {
    console.error('confirmarPresenca:', error);
    return res.status(500).json({ mensagem: 'Erro ao confirmar presença.', detalhe: error.message });
  }
};
