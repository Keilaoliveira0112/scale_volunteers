const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

class MinisterioRepository {
  /**
   * Criar novo ministério
   */
  async criar(dados) {
    return prisma.ministerio.create({
      data: dados,
      include: {
        lider: {
          select: {
            id: true,
            nome: true,
            email: true
          }
        }
      }
    });
  }

  /**
   * Buscar ministério por ID
   */
  async buscarPorId(id) {
    return prisma.ministerio.findUnique({
      where: { id },
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
  }

  /**
   * Buscar ministério por nome
   */
  async buscarPorNome(nome) {
    return prisma.ministerio.findFirst({
      where: { nome }
    });
  }

  /**
   * Listar todos os ministérios
   */
  async listarTodos() {
    return prisma.ministerio.findMany({
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
  }

  /**
   * Listar ministérios por líder
   */
  async listarPorLider(liderId) {
    return prisma.ministerio.findMany({
      where: { liderId },
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
  }

  /**
   * Atualizar ministério
   */
  async atualizar(id, dados) {
    return prisma.ministerio.update({
      where: { id },
      data: dados,
      include: {
        lider: {
          select: {
            id: true,
            nome: true,
            email: true
          }
        }
      }
    });
  }

  /**
   * Deletar ministério
   */
  async deletar(id) {
    return prisma.ministerio.delete({
      where: { id }
    });
  }

  /**
   * Buscar voluntários do ministério
   */
  async buscarVoluntarios(ministerioId) {
    return prisma.usuarioMinisterio.findMany({
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
  }
}

module.exports = new MinisterioRepository();
