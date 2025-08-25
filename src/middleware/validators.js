// src/middlewares/validators.js
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// Regra: Voluntário só pode estar em até 2 ministérios
const validarNumeroDeMinisterios = async (req, res, next) => {
  const { usuarioId } = req.body;

  const ministeriosDoUsuario = await prisma.voluntario.findMany({
    where: { usuarioId },
  });

  if (ministeriosDoUsuario.length >= 2) {
    return res.status(400).json({
      error: "Um voluntário não pode estar vinculado a mais de 2 ministérios.",
    });
  }

  next();
};


/**
 * Validação: Não permitir que um voluntário seja escalado em dois ministérios no mesmo dia/horário.
 */
async function validarConflitoEscala(voluntarioId, cultoId) {
  const conflito = await prisma.escala.findFirst({
    where: {
      voluntarioId,
      cultoId
    }
  });

  if (conflito) {
    throw new Error("Voluntário já está escalado para outro ministério neste culto.");
  }
}

/**
 * Validação: Somente líder do ministério ou admin pode substituir voluntário na escala.
 */
function validarPermissaoSubstituicao(usuario) {
  if (usuario.role !== "ADMIN" && usuario.role !== "LIDER") {
    throw new Error("Apenas líderes de ministério ou admin podem gerenciar substituições.");
  }
}

/**
 * Validação: Somente admin pode cadastrar ministérios.
 */
function validarPermissaoCriarMinisterio(usuario) {
  if (usuario.role !== "ADMIN") {
    throw new Error("Apenas administradores podem criar ministérios.");
  }
}

module.exports = {
  validarMaximoMinisterios,
  validarConflitoEscala,
  validarPermissaoSubstituicao,
  validarPermissaoCriarMinisterio
};
