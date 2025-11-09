// src/controllers/ministerioController.js
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const ministerioService = require('../services/ministerioService');

/**
 * Criar um novo ministério
 */
exports.criarMinisterio = async (req, res) => {
  try {
    const novo = await ministerioService.criarMinisterio(req.body);
    res.status(201).json({ mensagem: 'Ministério criado com sucesso!', ministerio: novo });
  } catch (error) {
    console.error('criarMinisterio - erro:', error);
    res.status(400).json({ mensagem: error.message });
  }
};

/**
 * Editar ministério
 */
exports.editarMinisterio = async (req, res) => {
  try {
    const id = Number(req.params.id);
    const ministerio = await ministerioService.editarMinisterio(id, req.body);
    res.status(200).json(ministerio);
  } catch (error) {
    console.error('editarMinisterio - erro:', error);
    res.status(400).json({ mensagem: error.message });
  }
};

/**
 * Remover ministério
 */
exports.removerMinisterio = async (req, res) => {
  try {
    const id = Number(req.params.id);
    await ministerioService.removerMinisterio(id);
    res.status(200).json({ mensagem: 'Ministério removido com sucesso.' });
  } catch (error) {
    console.error('removerMinisterio - erro:', error);
    res.status(400).json({ mensagem: error.message });
  }
};

/**
 * Atribuir líder a um ministério
 */
exports.atribuirLider = async (req, res) => {
  try {
    const id = Number(req.params.id);
    const { liderId, force } = req.body;
    const ministerio = await ministerioService.atribuirLider(id, liderId, force);
    res.status(200).json(ministerio);
  } catch (error) {
    console.error('atribuirLider - erro:', error);
    res.status(400).json({ mensagem: error.message });
  }
};

/**
 * Adicionar voluntário ao ministério
 */
exports.adicionarVoluntario = async (req, res) => {
  try {
    const ministerioId = Number(req.params.id);
    const voluntarioId = Number(req.body.voluntarioId);
    const vinculo = await ministerioService.adicionarVoluntario(voluntarioId, ministerioId);
    res.status(201).json({ mensagem: 'Voluntário adicionado com sucesso.', vinculo });
  } catch (error) {
    console.error('adicionarVoluntario - erro:', error);
    res.status(400).json({ mensagem: error.message });
  }
};

/**
 * Aprovar solicitação de ingresso de voluntário
 */
exports.aprovarVoluntario = async (req, res) => {
  try {
    const ministerioId = Number(req.params.id);
    const { voluntarioId } = req.body;

    console.log('DEBUG aprovar:', { ministerioId, voluntarioId });

    if (!ministerioId || !voluntarioId) {
      return res.status(400).json({
        mensagem: 'ministerioId e voluntarioId são obrigatórios.',
        recebido: { ministerioId, voluntarioId }
      });
    }

    // Buscar o vínculo para debug
    const vinculoExistente = await prisma.usuarioMinisterio.findFirst({
      where: { usuarioId: voluntarioId, ministerioId }
    });
    console.log('Vínculo encontrado:', vinculoExistente);

    if (!vinculoExistente) {
      return res.status(400).json({ 
        mensagem: 'Solicitação não encontrada.' 
      });
    }

    const atualizado = await ministerioService.aprovarVoluntario(voluntarioId, ministerioId);
    res.status(200).json({ mensagem: 'Voluntário aprovado com sucesso.', atualizado });
  } catch (error) {
    console.error('aprovarVoluntario - erro:', error.message);
    res.status(400).json({ mensagem: error.message });
  }
};

/**
 * Solicitar ingresso em um ministério
 */
exports.solicitarIngresso = async (req, res) => {
  try {
    const usuarioId = req.usuario?.id;
    const { ministerioId } = req.body;
    const solicitacao = await ministerioService.solicitarIngresso(usuarioId, ministerioId);
    res.status(201).json({ mensagem: 'Solicitação enviada com sucesso.', solicitacao });
  } catch (error) {
    console.error('solicitarIngresso - erro:', error);
    res.status(400).json({ mensagem: error.message });
  }
};

/**
 * Listar todos os ministérios
 */
exports.listarMinisterios = async (req, res) => {
  try {
    const ministerios = await prisma.ministerio.findMany({
      include: {
        lider: {
          select: {
            id: true,
            nome: true,
            email: true
          }
        },
        usuarios: true,
        escalas: true
      }
    });

    return res.json(ministerios);
  } catch (error) {
    console.error('listarMinisterios - erro:', error);
    return res.status(500).json({ mensagem: 'Erro ao listar ministérios.' });
  }
};

/**
 * Obter ministério por ID
 */
exports.obterMinisterio = async (req, res) => {
  try {
    const id = Number(req.params.id);

    if (!id) {
      return res.status(400).json({ mensagem: 'ID do ministério é obrigatório.' });
    }

    const ministerio = await prisma.ministerio.findUnique({
      where: { id },
      include: {
        lider: {
          select: {
            id: true,
            nome: true,
            email: true
          }
        },
        usuarios: {
          include: {
            usuario: {
              select: {
                id: true,
                nome: true,
                email: true,
                tipo: true
              }
            }
          }
        },
        escalas: true
      }
    });

    if (!ministerio) {
      return res.status(404).json({ mensagem: 'Ministério não encontrado.' });
    }

    return res.json(ministerio);
  } catch (error) {
    console.error('obterMinisterio - erro:', error);
    return res.status(500).json({ mensagem: 'Erro ao obter ministério.' });
  }
};

/**
 * Listar voluntários de um ministério
 */
exports.listarVoluntarios = async (req, res) => {
  try {
    const ministerioId = Number(req.params.id);

    if (!ministerioId) {
      return res.status(400).json({ mensagem: 'ID do ministério é obrigatório.' });
    }

    const ministerio = await prisma.ministerio.findUnique({
      where: { id: ministerioId }
    });

    if (!ministerio) {
      return res.status(404).json({ mensagem: 'Ministério não encontrado.' });
    }

    const voluntarios = await prisma.usuarioMinisterio.findMany({
      where: { ministerioId },
      include: {
        usuario: {
          select: {
            id: true,
            nome: true,
            email: true,
            tipo: true
          }
        }
      }
    });

    return res.json(voluntarios);
  } catch (error) {
    console.error('listarVoluntarios - erro:', error);
    return res.status(500).json({ mensagem: 'Erro ao listar voluntários.' });
  }
};
