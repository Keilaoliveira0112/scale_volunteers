const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

class EscalaRepository {
  /**
   * Criar nova escala
   */
  async criar(dados) {
    return prisma.escala.create({
      data: dados,
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
  }

  /**
   * Buscar escala por ID
   */
  async buscarPorId(id) {
    return prisma.escala.findUnique({
      where: { id },
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
  }

  /**
   * Listar todas as escalas
   */
  async listarTodas() {
    return prisma.escala.findMany({
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
      },
      orderBy: { dataHora: 'asc' }
    });
  }

  /**
   * Listar escalas por ministério
   */
  async listarPorMinisterio(ministerioId) {
    return prisma.escala.findMany({
      where: { ministerioId },
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
      },
      orderBy: { dataHora: 'asc' }
    });
  }

  /**
   * Listar escalas por voluntário
   */
  async listarPorVoluntario(voluntarioId) {
    return prisma.escalaVoluntario.findMany({
      where: { voluntarioId },
      include: {
        escala: {
          include: {
            ministerio: true
          }
        },
        voluntario: {
          select: {
            id: true,
            nome: true,
            email: true
          }
        }
      },
      orderBy: {
        escala: { dataHora: 'asc' }
      }
    });
  }

  /**
   * Atualizar escala
   */
  async atualizar(id, dados) {
    return prisma.escala.update({
      where: { id },
      data: dados,
      include: {
        ministerio: true,
        voluntarios: true
      }
    });
  }

  /**
   * Deletar escala
   */
  async deletar(id) {
    return prisma.escala.delete({
      where: { id }
    });
  }

  /**
   * Adicionar voluntário à escala
   */
  async adicionarVoluntario(escalaId, voluntarioId) {
    return prisma.escalaVoluntario.create({
      data: {
        escalaId,
        voluntarioId
      }
    });
  }

  /**
   * Verificar conflito de escala
   */
  async verificarConflito(voluntarioId, dataHora) {
    return prisma.escalaVoluntario.findFirst({
      where: {
        voluntarioId,
        escala: {
          dataHora
        }
      }
    });
  }
}

module.exports = new EscalaRepository();