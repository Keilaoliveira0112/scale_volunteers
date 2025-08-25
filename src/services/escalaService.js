
// services/escalaService.js
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

async function criarEscala(data, usuario) {
  // Regra 1: só admin ou líder pode criar
  if (usuario.role !== "ADMIN" && usuario.role !== "LIDER") {
    throw new Error("Apenas admin ou líder podem criar escalas");
  }

  // Regra 2: voluntário só pode estar em até 2 ministérios
  if (data.voluntarioId) {
    const ministerios = await prisma.ministerioVoluntario.count({
      where: { voluntarioId: data.voluntarioId },
    });

    if (ministerios >= 2) {
      throw new Error("Voluntário já pertence a 2 ministérios");
    }
  }

  // Criar escala
  return await prisma.escala.create({ data });
}

module.exports = { criarEscala };
