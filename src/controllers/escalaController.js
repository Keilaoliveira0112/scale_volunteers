const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

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

exports.confirmarPresenca = async (req, res) => {
  try {
    const escalaId = Number(req.params.escalaId);
    const voluntarioId = Number(req.usuario?.id);
    if (!escalaId || !voluntarioId) return res.status(400).json({ mensagem: 'IDs obrigatórios.' });

    const escala = await prisma.escala.findUnique({ where: { id: escalaId } });
    if (!escala) return res.status(404).json({ mensagem: 'Escala não encontrada.' });

    // verificar vínculo do voluntário com a escala
    const ev = await prisma.escalaVoluntario.findUnique({
      where: { escalaId_voluntarioId: { escalaId, voluntarioId } }
    });
    if (!ev) return res.status(403).json({ mensagem: 'Você não está nessa escala.' });

    // checar prazo (confirmar até 48h antes)
    const agora = new Date();
    const diffMs = new Date(escala.dataHora) - agora;
    const diffHoras = diffMs / (1000 * 60 * 60);
    if (diffHoras < 48) return res.status(400).json({ mensagem: 'Confirmação encerrada (faltam < 48h).' });

    await prisma.escalaVoluntario.update({
      where: { id: ev.id },
      data: { presenteConfirmado: true }
    });

    return res.status(200).json({ mensagem: 'Presença confirmada.' });
  } catch (error) {
    console.error('confirmarPresenca:', error);
    return res.status(500).json({ mensagem: 'Erro ao confirmar presença.' });
  }
};

exports.criarEscalaPorLider = async (req, res) => {
  try {
    const ministerioId = Number(req.params.id);
    const { dataHora, voluntarios } = req.body;
    if (!ministerioId || !dataHora) return res.status(400).json({ mensagem: 'ministerioId e dataHora são obrigatórios.' });

    // valida que o usuário é líder do ministério (middleware deve garantir)
    // validar que cada voluntário pertence ao ministério
    for (const vid of voluntarios || []) {
      const pertence = await prisma.usuarioMinisterio.findFirst({
        where: { usuarioId: Number(vid), ministerioId }
      });
      if (!pertence) return res.status(400).json({ mensagem: `Voluntário ${vid} não pertence ao ministério.` });
    }

    // checar conflitos simples: mesmo dataHora para qualquer voluntário
    const dt = new Date(dataHora);
    for (const vid of voluntarios || []) {
      const conflito = await prisma.escala.findFirst({
        where: {
          voluntarios: { some: { voluntarioId: Number(vid) } },
          dataHora: dt
        }
      });
      if (conflito) return res.status(400).json({ mensagem: `Voluntário ${vid} já está escalado neste horário.` });
    }

    const escala = await prisma.escala.create({
      data: {
        ministerioId,
        dataHora: dt,
        voluntarios: { create: (voluntarios || []).map(id => ({ voluntarioId: Number(id) })) }
      },
      include: { voluntarios: true }
    });

    return res.status(201).json(escala);
  } catch (error) {
    console.error('criarEscalaPorLider:', error);
    return res.status(500).json({ mensagem: 'Erro ao criar escala.', detalhe: error.message });
  }
};
