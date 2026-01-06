const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

class UsuarioRepository {
  /**
   * Criar novo usuário
   */
  async criar(dados) {
    return prisma.usuario.create({
      data: dados,
      select: {
        id: true,
        nome: true,
        email: true,
        tipo: true,
        createdAt: true
      }
    });
  }

  /**
   * Buscar usuário por email
   */
  async buscarPorEmail(email) {
    return prisma.usuario.findUnique({
      where: { email }
    });
  }

  /**
   * Buscar usuário por ID
   */
  async buscarPorId(id) {
    return prisma.usuario.findUnique({
      where: { id },
      select: {
        id: true,
        nome: true,
        email: true,
        tipo: true,
        createdAt: true,
        updatedAt: true
      }
    });
  }

  /**
   * Listar todos os usuários
   */
  async listarTodos() {
    return prisma.usuario.findMany({
      select: {
        id: true,
        nome: true,
        email: true,
        tipo: true,
        createdAt: true
      }
    });
  }

  /**
   * Atualizar usuário
   */
  async atualizar(id, dados) {
    return prisma.usuario.update({
      where: { id },
      data: dados,
      select: {
        id: true,
        nome: true,
        email: true,
        tipo: true
      }
    });
  }

  /**
   * Deletar usuário
   */
  async deletar(id) {
    return prisma.usuario.delete({
      where: { id }
    });
  }

  /**
   * Buscar usuários por tipo
   */
  async buscarPorTipo(tipo) {
    return prisma.usuario.findMany({
      where: { tipo },
      select: {
        id: true,
        nome: true,
        email: true,
        tipo: true,
        createdAt: true
      }
    });
  }
}

module.exports = new UsuarioRepository();