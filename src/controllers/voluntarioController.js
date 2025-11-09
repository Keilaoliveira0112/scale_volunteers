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