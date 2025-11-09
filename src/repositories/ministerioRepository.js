const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

module.exports = {
  async criarMinisterio(dados) {
    return prisma.ministerio.create({ data: dados });
  },

  async buscarTodos() {
    return prisma.ministerio.findMany();
  },

  async buscarPorId(id) {
    return prisma.ministerio.findUnique({ where: { id } });
  },

  async editarMinisterio(id, dados) {
    return prisma.ministerio.update({ where: { id }, data: dados });
  },

  async deletarMinisterio(id) {
    return prisma.ministerio.delete({ where: { id } });
  },

  async verificarVinculo(usuarioId, ministerioId) {
    return prisma.usuarioMinisterio.findFirst({
      where: { usuarioId, ministerioId }
    });
  },

  async adicionarVoluntario(usuarioId, ministerioId) {
    return prisma.usuarioMinisterio.create({
      data: { usuarioId, ministerioId, status: 'APROVADO' }
    });
  },

  async aprovarVoluntario(usuarioId, ministerioId) {
    const existe = await this.verificarVinculo(usuarioId, ministerioId);
    if (existe) {
      return prisma.usuarioMinisterio.update({
        where: { id: existe.id },
        data: { status: 'APROVADO' }
      });
    }
    return this.adicionarVoluntario(usuarioId, ministerioId);
  },

  async solicitarIngresso(usuarioId, ministerioId) {
    return prisma.usuarioMinisterio.create({
      data: { usuarioId, ministerioId, status: 'PENDENTE' }
    });
  }
};
