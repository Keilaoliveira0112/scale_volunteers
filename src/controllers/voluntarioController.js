const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

/**
 * Solicitar ingresso em um ministério
 */
exports.solicitarMinisterio = async (req, res) => {
  try {
    const usuarioId = req.usuario?.id;
    const { ministerioId } = req.body;

    if (!usuarioId || !ministerioId) {
      return res.status(400).json({ 
        mensagem: 'usuarioId e ministerioId são obrigatórios.' 
      });
    }

    // Verificar se o usuário existe
    const usuario = await prisma.usuario.findUnique({
      where: { id: usuarioId }
    });

    if (!usuario) {
      return res.status(404).json({ mensagem: 'Usuário não encontrado.' });
    }

    // Verificar se o ministério existe
    const ministerio = await prisma.ministerio.findUnique({
      where: { id: Number(ministerioId) }
    });

    if (!ministerio) {
      return res.status(404).json({ mensagem: 'Ministério não encontrado.' });
    }

    // Verificar se já existe solicitação
    const solicitacaoExistente = await prisma.usuarioMinisterio.findFirst({
      where: { usuarioId, ministerioId: Number(ministerioId) }
    });

    if (solicitacaoExistente) {
      return res.status(400).json({ 
        mensagem: 'Você já enviou uma solicitação para este ministério.' 
      });
    }

    // Verificar limite de 2 ministérios
    const totalMinisterios = await prisma.usuarioMinisterio.count({
      where: { 
        usuarioId,
        status: 'APROVADO'
      }
    });

    if (totalMinisterios >= 2) {
      return res.status(400).json({ 
        mensagem: 'Você já atingiu o limite de 2 ministérios aprovados.' 
      });
    }

    // Criar solicitação
    const solicitacao = await prisma.usuarioMinisterio.create({
      data: {
        usuarioId,
        ministerioId: Number(ministerioId),
        status: 'PENDENTE'
      },
      include: {
        ministerio: {
          select: {
            id: true,
            nome: true,
            descricao: true
          }
        }
      }
    });

    return res.status(201).json({ 
      mensagem: 'Solicitação enviada com sucesso!',
      solicitacao 
    });
  } catch (error) {
    console.error('solicitarMinisterio - erro:', error);
    return res.status(500).json({ 
      mensagem: 'Erro ao solicitar ingresso.',
      detalhe: error.message 
    });
  }
};

/**
 * Listar solicitações pendentes
 */
exports.minhasSolicitacoes = async (req, res) => {
  try {
    const usuarioId = req.usuario?.id;

    if (!usuarioId) {
      return res.status(401).json({ mensagem: 'Usuário não autenticado.' });
    }

    const solicitacoes = await prisma.usuarioMinisterio.findMany({
      where: { usuarioId },
      include: {
        ministerio: {
          select: { id: true, nome: true, descricao: true }
        }
      }
    });

    return res.json(solicitacoes);
  } catch (error) {
    console.error('minhasSolicitacoes - erro:', error);
    return res.status(500).json({ mensagem: 'Erro ao listar solicitações.' });
  }
};

/**
 * Listar escalas do voluntário
 */
exports.minhasEscalas = async (req, res) => {
  try {
    const usuarioId = req.usuario?.id;

    if (!usuarioId) {
      return res.status(401).json({ mensagem: 'Usuário não autenticado.' });
    }

    const escalas = await prisma.escalaVoluntario.findMany({
      where: { voluntarioId: usuarioId },
      include: {
        escala: {
          include: {
            ministerio: {
              select: { id: true, nome: true }
            }
          }
        }
      }
    });

    return res.json(escalas);
  } catch (error) {
    console.error('minhasEscalas - erro:', error);
    return res.status(500).json({ mensagem: 'Erro ao listar escalas.' });
  }
};

/**
 * Confirmar presença em escala
 */
exports.confirmarPresenca = async (req, res) => {
  try {
    const escalaId = Number(req.params.escalaId);
    const voluntarioId = req.usuario?.id;
    const { presenteConfirmado } = req.body;

    if (!escalaId || !voluntarioId) {
      return res.status(400).json({ mensagem: 'escalaId e voluntarioId são obrigatórios.' });
    }

    const escala = await prisma.escala.findUnique({ where: { id: escalaId } });
    if (!escala) {
      return res.status(404).json({ mensagem: 'Escala não encontrada.' });
    }

    const escalaVoluntario = await prisma.escalaVoluntario.findFirst({
      where: { escalaId, voluntarioId }
    });

    if (!escalaVoluntario) {
      return res.status(403).json({ mensagem: 'Você não está designado nesta escala.' });
    }

    const agora = new Date();
    const diffHoras = (escala.dataHora - agora) / (1000 * 60 * 60);

    if (diffHoras < 48) {
      return res.status(400).json({ 
        mensagem: 'Confirmação encerrada. Faltam menos de 48 horas para a escala.' 
      });
    }

    const atualizado = await prisma.escalaVoluntario.update({
      where: { id: escalaVoluntario.id },
      data: { presenteConfirmado }
    });

    return res.json({
      mensagem: 'Presença confirmada com sucesso!',
      confirmacao: atualizado
    });
  } catch (error) {
    console.error('confirmarPresenca - erro:', error);
    return res.status(500).json({ mensagem: 'Erro ao confirmar presença.' });
  }
};

/**
 * Listar ministérios do voluntário
 */
exports.meusMinisterios = async (req, res) => {
  try {
    const usuarioId = req.usuario?.id;

    if (!usuarioId) {
      return res.status(401).json({ mensagem: 'Usuário não autenticado.' });
    }

    const ministerios = await prisma.usuarioMinisterio.findMany({
      where: { usuarioId, status: 'APROVADO' },
      include: {
        ministerio: {
          select: { id: true, nome: true, descricao: true }
        }
      }
    });

    return res.json(ministerios);
  } catch (error) {
    console.error('meusMinisterios - erro:', error);
    return res.status(500).json({ mensagem: 'Erro ao listar ministérios.' });
  }
};

/**
 * Sair de um ministério
 */
exports.sairMinisterio = async (req, res) => {
  try {
    const ministerioId = Number(req.params.ministerioId);
    const usuarioId = req.usuario?.id;

    if (!ministerioId || !usuarioId) {
      return res.status(400).json({ mensagem: 'ministerioId é obrigatório.' });
    }

    const vinculo = await prisma.usuarioMinisterio.findFirst({
      where: { usuarioId, ministerioId }
    });

    if (!vinculo) {
      return res.status(404).json({ mensagem: 'Você não faz parte deste ministério.' });
    }

    await prisma.usuarioMinisterio.delete({ where: { id: vinculo.id } });

    return res.json({ mensagem: 'Você saiu do ministério com sucesso!' });
  } catch (error) {
    console.error('sairMinisterio - erro:', error);
    return res.status(500).json({ mensagem: 'Erro ao sair do ministério.' });
  }
};