// src/services/voluntarioService.js
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// Buscar voluntário pelo ID
async function getVoluntarioById(id) {
  return await prisma.voluntario.findUnique({
    where: { id }
  });
}

// Criar voluntário
async function createVoluntario(data) {
  return await prisma.voluntario.create({ data });
}

// Atualizar voluntário
async function updateVoluntario(id, data) {
  return await prisma.voluntario.update({
    where: { id },
    data
  });
}

module.exports = {
  getVoluntarioById,
  createVoluntario,
  updateVoluntario
};
