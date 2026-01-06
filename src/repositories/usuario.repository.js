const prisma = require("../prisma/client");

const usuarioRepository = {
  create: (data) => {
    return prisma.usuario.create({ data });
  },

  findByEmail: (email) => {
    return prisma.usuario.findUnique({ where: { email } });
  },

  findById: (id) => {
    return prisma.usuario.findUnique({
      where: { id },
      include: { ministerios: true }
    });
  },

  findAll: () => {
    return prisma.usuario.findMany();
  },

  findByType: (tipo) => {
    return prisma.usuario.findMany({ where: { tipo } });
  },

  update: (id, data) => {
    return prisma.usuario.update({
      where: { id },
      data
    });
  },

  delete: (id) => {
    return prisma.usuario.delete({ where: { id } });
  }
};

module.exports = usuarioRepository;
