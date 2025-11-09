const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

exports.getDashboard = async (req, res) => {
  try {
    const [totalUsuarios, totalMinisterios, escalasAtuais, voluntariosAtivos] = await Promise.all([
      prisma.usuario.count(),
      prisma.ministerio.count(),
      prisma.escala.count({ where: { dataHora: { gte: new Date() } } }),
      prisma.usuarioMinisterio.count({ where: { status: 'APROVADO' } })
    ]);

    return res.json({
      totalUsuarios,
      totalMinisterios,
      escalasAtuais,
      voluntariosAtivos
    });
  } catch (error) {
    console.error('getDashboard:', error);
    return res.status(500).json({ mensagem: 'Erro ao carregar dashboard.' });
  }
};

exports.listarUsuarios = async (req, res) => {
  try {
    const usuarios = await prisma.usuario.findMany({
      select: {
        id: true,
        nome: true,
        email: true,
        tipo: true,
        createdAt: true
      }
    });
    return res.json(usuarios);
  } catch (error) {
    console.error('listarUsuarios:', error);
    return res.status(500).json({ mensagem: 'Erro ao listar usuários.' });
  }
};

/**
 * Criar escala (admin)
 */
exports.criarEscala = async (req, res) => {
  try {
    const { ministerioId, dataHora, voluntarios } = req.body;

    if (!ministerioId || !dataHora) {
      return res.status(400).json({ 
        mensagem: 'ministerioId e dataHora são obrigatórios.' 
      });
    }

    // Verificar se o ministério existe
    const ministerio = await prisma.ministerio.findUnique({
      where: { id: Number(ministerioId) }
    });

    if (!ministerio) {
      return res.status(404).json({ mensagem: 'Ministério não encontrado.' });
    }

    // Validar data/hora
    const dt = new Date(dataHora);
    if (isNaN(dt)) {
      return res.status(400).json({ mensagem: 'dataHora inválida.' });
    }

    // Validar voluntários
    if (voluntarios && voluntarios.length > 0) {
      for (const vid of voluntarios) {
        const pertence = await prisma.usuarioMinisterio.findFirst({
          where: {
            usuarioId: Number(vid),
            ministerioId: Number(ministerioId),
            status: 'APROVADO'
          }
        });

        if (!pertence) {
          return res.status(400).json({
            mensagem: `Voluntário ${vid} não está aprovado neste ministério.`
          });
        }

        // Verificar conflito de escala
        const conflito = await prisma.escalaVoluntario.findFirst({
          where: {
            voluntarioId: Number(vid),
            escala: {
              dataHora: dt
            }
          }
        });

        if (conflito) {
          return res.status(400).json({
            mensagem: `Voluntário ${vid} já possui escala neste horário.`
          });
        }
      }
    }

    // Criar escala com voluntários
    const escala = await prisma.$transaction(async (tx) => {
      const novaEscala = await tx.escala.create({
        data: {
          ministerioId: Number(ministerioId),
          dataHora: dt
        }
      });

      if (voluntarios && voluntarios.length > 0) {
        const designacoes = voluntarios.map(vid => ({
          escalaId: novaEscala.id,
          voluntarioId: Number(vid)
        }));

        await tx.escalaVoluntario.createMany({
          data: designacoes
        });
      }

      return tx.escala.findUnique({
        where: { id: novaEscala.id },
        include: {
          ministerio: true,
          voluntarios: {
            include: {
              voluntario: {
                select: {
                  id: true,
                  nome: true,
                  email: true
                }
              }
            }
          }
        }
      });
    });

    return res.status(201).json({
      mensagem: 'Escala criada com sucesso!',
      escala
    });
  } catch (error) {
    console.error('criarEscala - erro:', error);
    return res.status(500).json({ 
      mensagem: 'Erro ao criar escala.',
      detalhe: error.message 
    });
  }
};

/**
 * Listar todas as escalas (admin)
 */
exports.listarEscalas = async (req, res) => {
  try {
    const escalas = await prisma.escala.findMany({
      include: {
        ministerio: {
          select: {
            id: true,
            nome: true
          }
        },
        voluntarios: {
          include: {
            voluntario: {
              select: {
                id: true,
                nome: true,
                email: true
              }
            }
          }
        }
      },
      orderBy: { dataHora: 'asc' }
    });

    return res.json(escalas);
  } catch (error) {
    console.error('listarEscalas - erro:', error);
    return res.status(500).json({ mensagem: 'Erro ao listar escalas.' });
  }
};