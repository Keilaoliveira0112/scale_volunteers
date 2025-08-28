const { PrismaClient } = require('@prisma/client');
const { body, validationResult } = require('express-validator');
const prisma = new PrismaClient();

/**
 * Middleware genérico para capturar erros de validação
 */
function checkValidationErrors(req, res, next) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
}

//validar email
function validarEmail(email) {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email);
}

/**
 * Regras de validação de usuário com express-validator
 */
const validateUser = [
  body('nome')
    .notEmpty().withMessage('Nome é obrigatório'),
  body('email')
    .isEmail().withMessage('E-mail inválido'),
  body('senha')
    .isLength({ min: 8 }).withMessage('A senha deve ter pelo menos 8 caracteres'),
];


// Regra: Voluntário só pode estar em até 2 ministérios
const validarMaximoMinisterios = async (req, res, next) => {
  const { usuarioId } = req.body;

  const ministeriosDoUsuario = await prisma.voluntario.findMany({
    where: { usuarioId },
  });

  if (ministeriosDoUsuario.length >= 2) {
    return res.status(400).json({
      error: 'Um voluntário não pode estar vinculado a mais de 2 ministérios.',
    });
  }

  next();
};


/**
 * Middleware: Impedir voluntário em dois cultos no mesmo dia/horário
 */
const validarConflitoEscala = async (req, res, next) => {
  const { voluntarioId, cultoId } = req.body;

  const conflito = await prisma.escala.findFirst({
    where: { voluntarioId, cultoId },
  });

  if (conflito) {
    return res.status(400).json({
      error: 'Voluntário já está escalado para outro ministério neste culto.',
    });
  }

  next();
};

/**
 * Middleware: Apenas ADMIN ou LIDER podem substituir voluntário na escala
 */
const validarPermissaoSubstituicao = (req, res, next) => {
  const { usuario } = req; // supondo que vem do token JWT
  if (usuario.role !== 'ADMIN' && usuario.role !== 'LIDER') {
    return res.status(403).json({
      error: 'Apenas líderes ou administradores podem gerenciar substituições.',
    });
  }
  next();
};

/**
 * Middleware: Apenas ADMIN pode criar ministério
 */
const validarPermissaoCriarMinisterio = (req, res, next) => {
  const { usuario } = req; // vem do JWT
  if (usuario.role !== 'ADMIN') {
    return res.status(403).json({
      error: 'Apenas administradores podem criar ministérios.',
    });
  }
  next();
};

module.exports = {
  validateUser,
  checkValidationErrors,
  validarMaximoMinisterios,
  validarConflitoEscala,
  validarPermissaoSubstituicao,
  validarPermissaoCriarMinisterio,
};
