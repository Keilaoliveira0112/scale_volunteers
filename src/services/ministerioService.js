// src/services/ministerioService.js
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

/**
 * Criar um novo ministério
 */
exports.criarMinisterio = async (dados) => {
  const { nome, descricao, liderId } = dados;

  if (!nome) throw new Error('Nome é obrigatório');

  // usar findFirst em vez de findUnique
  const ministerioExistente = await prisma.ministerio.findFirst({
    where: { nome },
  });
  if (ministerioExistente) {
    throw new Error('Já existe um ministério com este nome.');
  }

  if (liderId) {
    const lider = await prisma.usuario.findUnique({ where: { id: liderId } });
    if (!lider) throw new Error('Líder não encontrado.');
  }

  return prisma.ministerio.create({
    data: { nome, descricao, liderId },
    include: { lider: true },
  });
};

/**
 * Editar um ministério
 */
exports.editarMinisterio = async (id, dados) => {
  const ministerio = await prisma.ministerio.findUnique({ where: { id } });
  if (!ministerio) throw new Error('Ministério não encontrado.');

  return prisma.ministerio.update({
    where: { id },
    data: {
      nome: dados.nome ?? ministerio.nome,
      descricao: dados.descricao ?? ministerio.descricao,
      atualizadoEm: new Date(),
    },
  });
};

/**
 * Remover um ministério
 */
exports.removerMinisterio = async (id) => {
  const ministerio = await prisma.ministerio.findUnique({ where: { id } });
  if (!ministerio) throw new Error('Ministério não encontrado.');

  const now = new Date();
  const escalasAtivas = await prisma.escala.count({
    where: { ministerioId: id, dataHora: { gte: now } },
  });
  if (escalasAtivas > 0)
    throw new Error('Não é possível excluir: existem escalas ativas.');

  await prisma.usuarioMinisterio.deleteMany({ where: { ministerioId: id } });
  return prisma.ministerio.delete({ where: { id } });
};

/**
 * Atribuir líder a um ministério
 */
exports.atribuirLider = async (ministerioId, liderId, force = false) => {
  const ministerio = await prisma.ministerio.findUnique({ where: { id: ministerioId } });
  if (!ministerio) throw new Error('Ministério não encontrado.');

  const lider = await prisma.usuario.findUnique({ where: { id: liderId } });
  if (!lider) throw new Error('Líder não encontrado.');

  if (ministerio.liderId && !force) {
    throw new Error('Este ministério já possui um líder. Use "force: true" para substituir.');
  }

  return prisma.ministerio.update({
    where: { id: ministerioId },
    data: { liderId },
    include: { lider: true },
  });
};

/**
 * Adicionar voluntário ao ministério
 */
exports.adicionarVoluntario = async (usuarioId, ministerioId) => {
  const ministerio = await prisma.ministerio.findUnique({ where: { id: ministerioId } });
  if (!ministerio) throw new Error('Ministério não encontrado.');

  const usuario = await prisma.usuario.findUnique({ where: { id: usuarioId } });
  if (!usuario) throw new Error('Usuário não encontrado.');

  let totalAprovados = 0;
  try {
    totalAprovados = await prisma.usuarioMinisterio.count({
      where: { usuarioId, status: 'APROVADO' },
    });
  } catch (e) {
    totalAprovados = await prisma.usuarioMinisterio.count({ where: { usuarioId } });
  }
  if (totalAprovados >= 2) throw new Error('Limite de 2 ministérios já atingido.');

  const vinculoExistente = await prisma.usuarioMinisterio.findFirst({
    where: { usuarioId, ministerioId },
  });
  if (vinculoExistente) throw new Error('Usuário já faz parte deste ministério.');

  return prisma.usuarioMinisterio.create({
    data: { usuarioId, ministerioId, status: 'PENDENTE' },
    include: { usuario: true, ministerio: true },
  });
};

/**
 * Aprovar voluntário no ministério
 */
exports.aprovarVoluntario = async (usuarioId, ministerioId) => {
  const vinculo = await prisma.usuarioMinisterio.findFirst({
    where: { usuarioId, ministerioId },
  });
  if (!vinculo) throw new Error('Solicitação não encontrada.');

  if (vinculo.status === 'APROVADO') throw new Error('Voluntário já foi aprovado.');

  return prisma.usuarioMinisterio.update({
    where: { id: vinculo.id },
    data: { status: 'APROVADO' },
  });
};

/**
 * Solicitar ingresso em um ministério
 */
exports.solicitarIngresso = async (usuarioId, ministerioId) => {
  if (!usuarioId || !ministerioId) {
    throw new Error('Usuário e ministério são obrigatórios.');
  }

  const usuario = await prisma.usuario.findUnique({ where: { id: usuarioId } });
  if (!usuario) throw new Error('Usuário não encontrado.');

  const ministerio = await prisma.ministerio.findUnique({ where: { id: ministerioId } });
  if (!ministerio) throw new Error('Ministério não encontrado.');

  const existente = await prisma.usuarioMinisterio.findFirst({
    where: { usuarioId, ministerioId },
  });
  if (existente) throw new Error('Você já enviou uma solicitação para este ministério.');

  return prisma.usuarioMinisterio.create({
    data: { usuarioId, ministerioId, status: 'PENDENTE' },
    include: { ministerio: true },
  });
};
