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
    const ministerioId = Number(req.params.id || req.body.ministerioId);
    const { dataHora, voluntarios } = req.body || {};
    if (!ministerioId || !dataHora) return res.status(400).json({ mensagem: 'ministerioId e dataHora são obrigatórios.' });

    const dt = new Date(dataHora);
    if (isNaN(dt)) return res.status(400).json({ mensagem: 'dataHora inválida.' });

    const ministerio = await prisma.ministerio.findUnique({ where: { id: ministerioId } });
    if (!ministerio) return res.status(404).json({ mensagem: 'Ministério não encontrado.' });

    // validar voluntários pertencem ao ministério e não possuem conflito
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

    const created = await prisma.$transaction(async (tx) => {
      const escala = await tx.escala.create({
        data: { ministerioId, dataHora: dt }
      });

      if (voluntarios && voluntarios.length) {
        const inserts = voluntarios.map(v => ({ escalaId: escala.id, voluntarioId: Number(v) }));
        await tx.escalaVoluntario.createMany({ data: inserts, skipDuplicates: true });
      }

      return tx.escala.findUnique({ where: { id: escala.id }, include: { voluntarios: true } });
    });

    // notificar voluntários
    if (created?.voluntarios && created.voluntarios.length) {
      for (const ev of created.voluntarios) {
        const u = await prisma.usuario.findUnique({ where: { id: ev.voluntarioId } });
        if (u?.email) {
          sendNotification(u.email, 'Nova escala atribuída', `Você foi escalado para ${ministerio?.nome} em ${dt.toISOString()}`);
        }
      }
    }

    return res.status(201).json(created);
  } catch (error) {
    console.error('criarEscalaPorLider:', error);
    return res.status(500).json({ mensagem: 'Erro ao criar escala.', detalhe: error.message });
  }
};

/**
 * Confirmar presença na escala (voluntário)
 */
exports.confirmarPresenca = async (req, res) => {
  try {
    const escalaId = Number(req.params.id);
    const voluntarioId = req.usuario?.id;

    if (!escalaId || !voluntarioId) {
      return res.status(400).json({ mensagem: 'escalaId e voluntarioId são obrigatórios.' });
    }

    // Verificar se a escala existe
    const escala = await prisma.escala.findUnique({
      where: { id: escalaId }
    });

    if (!escala) {
      return res.status(404).json({ mensagem: 'Escala não encontrada.' });
    }

    // Verificar se o voluntário está designado nesta escala
    const escalaVoluntario = await prisma.escalaVoluntario.findFirst({
      where: { escalaId, voluntarioId }
    });

    if (!escalaVoluntario) {
      return res.status(403).json({ 
        mensagem: 'Você não está designado nesta escala.' 
      });
    }

    // Verificar se ainda é possível confirmar (48h de antecedência)
    const agora = new Date();
    const diffHoras = (escala.dataHora - agora) / (1000 * 60 * 60);

    if (diffHoras < 48) {
      return res.status(400).json({ 
        mensagem: 'Confirmação encerrada. Faltam menos de 48 horas para a escala.' 
      });
    }

    // Atualizar confirmação de presença
    const atualizado = await prisma.escalaVoluntario.update({
      where: { id: escalaVoluntario.id },
      data: { presenteConfirmado: true }
    });

    return res.status(200).json({ 
      mensagem: 'Presença confirmada com sucesso.',
      confirmacao: atualizado
    });
  } catch (error) {
    console.error('confirmarPresenca - erro:', error);
    return res.status(500).json({ 
      mensagem: 'Erro ao confirmar presença.',
      detalhe: error.message 
    });
  }
};

exports.listarEscalas = async (req, res) => {
  try {
    const escalas = await prisma.escala.findMany({
      include: { ministerio: true, voluntarios: { include: { voluntario: true } } }
    });
    return res.json(escalas);
  } catch (error) {
    console.error('listarEscalas:', error);
    return res.status(500).json({ mensagem: 'Erro ao listar escalas.' });
  }
};

/**
 * Obter escala por ID
 */
exports.obterEscala = async (req, res) => {
  try {
    const escalaId = Number(req.params.id);
    
    if (!escalaId) {
      return res.status(400).json({ mensagem: 'ID da escala é obrigatório.' });
    }

    const escala = await prisma.escala.findUnique({
      where: { id: escalaId },
      include: { ministerio: true, voluntarios: { include: { voluntario: true } } }
    });

    if (!escala) {
      return res.status(404).json({ mensagem: 'Escala não encontrada.' });
    }

    return res.json(escala);
  } catch (error) {
    console.error('obterEscala - erro:', error);
    return res.status(500).json({ mensagem: 'Erro ao obter escala.' });
  }
};

/**
 * Editar escala
 */
exports.editarEscala = async (req, res) => {
  try {
    const escalaId = Number(req.params.id);
    const { dataHora } = req.body;

    if (!escalaId) {
      return res.status(400).json({ mensagem: 'ID da escala é obrigatório.' });
    }

    const escala = await prisma.escala.findUnique({ where: { id: escalaId } });
    if (!escala) {
      return res.status(404).json({ mensagem: 'Escala não encontrada.' });
    }

    const atualizada = await prisma.escala.update({
      where: { id: escalaId },
      data: {
        ...(dataHora && { dataHora: new Date(dataHora) })
      },
      include: { ministerio: true, voluntarios: true }
    });

    return res.json({
      mensagem: 'Escala atualizada com sucesso!',
      escala: atualizada
    });
  } catch (error) {
    console.error('editarEscala - erro:', error);
    return res.status(400).json({ mensagem: error.message });
  }
};

/**
 * Deletar escala
 */
exports.deletarEscala = async (req, res) => {
  try {
    const escalaId = Number(req.params.id);

    if (!escalaId) {
      return res.status(400).json({ mensagem: 'ID da escala é obrigatório.' });
    }

    const escala = await prisma.escala.findUnique({ where: { id: escalaId } });
    if (!escala) {
      return res.status(404).json({ mensagem: 'Escala não encontrada.' });
    }

    await prisma.escalaVoluntario.deleteMany({ where: { escalaId } });
    await prisma.escala.delete({ where: { id: escalaId } });

    return res.json({ mensagem: 'Escala deletada com sucesso!' });
  } catch (error) {
    console.error('deletarEscala - erro:', error);
    return res.status(400).json({ mensagem: error.message });
  }
};

/**
 * Adicionar voluntário à escala
 */
exports.adicionarVoluntarioEscala = async (req, res) => {
  try {
    const escalaId = Number(req.params.id);
    const { voluntarioId } = req.body;

    if (!escalaId || !voluntarioId) {
      return res.status(400).json({ mensagem: 'escalaId e voluntarioId são obrigatórios.' });
    }

    const escala = await prisma.escala.findUnique({ where: { id: escalaId } });
    if (!escala) {
      return res.status(404).json({ mensagem: 'Escala não encontrada.' });
    }

    const voluntario = await prisma.usuario.findUnique({ where: { id: Number(voluntarioId) } });
    if (!voluntario) {
      return res.status(404).json({ mensagem: 'Voluntário não encontrado.' });
    }

    const adicionado = await prisma.escalaVoluntario.create({
      data: {
        escalaId,
        voluntarioId: Number(voluntarioId)
      },
      include: { voluntario: true }
    });

    return res.status(201).json({
      mensagem: 'Voluntário adicionado à escala!',
      escalaVoluntario: adicionado
    });
  } catch (error) {
    console.error('adicionarVoluntarioEscala - erro:', error);
    return res.status(400).json({ mensagem: error.message });
  }
};

/**
 * Remover voluntário da escala
 */
exports.removerVoluntarioEscala = async (req, res) => {
  try {
    const escalaId = Number(req.params.id);
    const voluntarioId = Number(req.params.voluntarioId);

    if (!escalaId || !voluntarioId) {
      return res.status(400).json({ mensagem: 'escalaId e voluntarioId são obrigatórios.' });
    }

    const escalaVoluntario = await prisma.escalaVoluntario.findFirst({
      where: { escalaId, voluntarioId }
    });

    if (!escalaVoluntario) {
      return res.status(404).json({ mensagem: 'Voluntário não está nesta escala.' });
    }

    await prisma.escalaVoluntario.delete({ where: { id: escalaVoluntario.id } });

    return res.json({ mensagem: 'Voluntário removido da escala com sucesso!' });
  } catch (error) {
    console.error('removerVoluntarioEscala - erro:', error);
    return res.status(400).json({ mensagem: error.message });
  }
};
