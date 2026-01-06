const { PrismaClient } = require('@prisma/client');
const { body, validationResult, param } = require('express-validator');
const prisma = new PrismaClient();

/**
 * Middleware genérico para capturar erros de validação
 */
function checkValidationErrors(req, res, next) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ 
      mensagem: 'Erros de validação',
      erros: errors.array().map(err => ({
        campo: err.param,
        mensagem: err.msg
      }))
    });
  }
  next();
}

/**
 * Validar email
 */
function validarEmail(email) {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email);
}

// ========== VALIDAÇÕES DE USUÁRIO ==========

/**
 * Validar registro de usuário
 */
const validateRegister = [
  body('nome')
    .trim()
    .notEmpty().withMessage('Nome é obrigatório')
    .isLength({ min: 3 }).withMessage('Nome deve ter pelo menos 3 caracteres')
    .isLength({ max: 100 }).withMessage('Nome não pode exceder 100 caracteres'),
  body('email')
    .trim()
    .isEmail().withMessage('Email inválido')
    .isLength({ max: 100 }).withMessage('Email não pode exceder 100 caracteres')
    .custom(async (value) => {
      const usuario = await prisma.usuario.findUnique({ where: { email: value } });
      if (usuario) {
        throw new Error('Email já está cadastrado');
      }
    }),
  body('senha')
    .isLength({ min: 6 }).withMessage('Senha deve ter pelo menos 6 caracteres')
    .isLength({ max: 50 }).withMessage('Senha não pode exceder 50 caracteres')
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/).withMessage('Senha deve conter letras maiúsculas, minúsculas e números'),
  body('tipo')
    .optional()
    .isIn(['voluntario', 'lider', 'admin']).withMessage('Tipo inválido'),
  checkValidationErrors
];

/**
 * Validar login
 */
const validateLogin = [
  body('email')
    .trim()
    .isEmail().withMessage('Email inválido'),
  body('senha')
    .notEmpty().withMessage('Senha é obrigatória'),
  checkValidationErrors
];

/**
 * Validar atualização de perfil
 */
const validateUpdateProfile = [
  body('nome')
    .optional()
    .trim()
    .isLength({ min: 3 }).withMessage('Nome deve ter pelo menos 3 caracteres')
    .isLength({ max: 100 }).withMessage('Nome não pode exceder 100 caracteres'),
  body('email')
    .optional()
    .trim()
    .isEmail().withMessage('Email inválido')
    .custom(async (value, { req }) => {
      const usuario = await prisma.usuario.findUnique({ where: { email: value } });
      if (usuario && usuario.id !== req.usuario.id) {
        throw new Error('Email já está cadastrado');
      }
    }),
  checkValidationErrors
];

// ========== VALIDAÇÕES DE MINISTÉRIO ==========

/**
 * Validar criação de ministério
 */
const validateCreateMinisterio = [
  body('nome')
    .trim()
    .notEmpty().withMessage('Nome do ministério é obrigatório')
    .isLength({ min: 3 }).withMessage('Nome deve ter pelo menos 3 caracteres')
    .isLength({ max: 100 }).withMessage('Nome não pode exceder 100 caracteres'),
  body('descricao')
    .optional()
    .trim()
    .isLength({ max: 500 }).withMessage('Descrição não pode exceder 500 caracteres'),
  checkValidationErrors
];

/**
 * Validar edição de ministério
 */
const validateUpdateMinisterio = [
  body('nome')
    .optional()
    .trim()
    .isLength({ min: 3 }).withMessage('Nome deve ter pelo menos 3 caracteres')
    .isLength({ max: 100 }).withMessage('Nome não pode exceder 100 caracteres'),
  body('descricao')
    .optional()
    .trim()
    .isLength({ max: 500 }).withMessage('Descrição não pode exceder 500 caracteres'),
  checkValidationErrors
];

/**
 * Validar atribuição de líder
 */
const validateAtribuirLider = [
  body('liderId')
    .notEmpty().withMessage('liderId é obrigatório')
    .isInt().withMessage('liderId deve ser um número'),
  body('force')
    .optional()
    .isBoolean().withMessage('force deve ser booleano'),
  checkValidationErrors
];

/**
 * Validar adição de voluntário
 */
const validateAdicionarVoluntario = [
  body('voluntarioId')
    .notEmpty().withMessage('voluntarioId é obrigatório')
    .isInt().withMessage('voluntarioId deve ser um número'),
  checkValidationErrors
];

/**
 * Validar aprovação de voluntário
 */
const validateAprovarVoluntario = [
  body('usuarioId')
    .notEmpty().withMessage('usuarioId é obrigatório')
    .isInt().withMessage('usuarioId deve ser um número'),
  checkValidationErrors
];

// ========== VALIDAÇÕES DE ESCALA ==========

/**
 * Validar criação de escala
 */
const validateCreateEscala = [
  body('ministerioId')
    .notEmpty().withMessage('ministerioId é obrigatório')
    .isInt().withMessage('ministerioId deve ser um número'),
  body('dataHora')
    .notEmpty().withMessage('dataHora é obrigatória')
    .isISO8601().withMessage('dataHora deve ser uma data ISO 8601 válida')
    .custom((value) => {
      const data = new Date(value);
      if (data < new Date()) {
        throw new Error('Data/hora não pode ser no passado');
      }
      return true;
    }),
  body('voluntarios')
    .optional()
    .isArray().withMessage('voluntarios deve ser um array'),
  checkValidationErrors
];

/**
 * Validar edição de escala
 */
const validateUpdateEscala = [
  body('dataHora')
    .optional()
    .isISO8601().withMessage('dataHora deve ser uma data ISO 8601 válida')
    .custom((value) => {
      const data = new Date(value);
      if (data < new Date()) {
        throw new Error('Data/hora não pode ser no passado');
      }
      return true;
    }),
  checkValidationErrors
];

/**
 * Validar confirmação de presença
 */
const validateConfirmarPresenca = [
  body('voluntarioId')
    .optional()
    .isInt().withMessage('voluntarioId deve ser um número'),
  body('presenteConfirmado')
    .notEmpty().withMessage('presenteConfirmado é obrigatório')
    .isBoolean().withMessage('presenteConfirmado deve ser booleano'),
  checkValidationErrors
];

/**
 * Validar adição de voluntário à escala
 */
const validateAdicionarVoluntarioEscala = [
  body('voluntarioId')
    .notEmpty().withMessage('voluntarioId é obrigatório')
    .isInt().withMessage('voluntarioId deve ser um número'),
  checkValidationErrors
];

// ========== VALIDAÇÕES DE PARÂMETROS ==========

/**
 * Validar ID em parâmetros
 */
const validateParamId = [
  param('id')
    .isInt().withMessage('ID deve ser um número inteiro'),
  checkValidationErrors
];

/**
 * Validar ID da escala
 */
const validateParamEscalaId = [
  param('id')
    .isInt().withMessage('ID da escala deve ser um número inteiro'),
  checkValidationErrors
];

/**
 * Validar IDs de escala e voluntário
 */
const validateParamEscalaVoluntario = [
  param('id')
    .isInt().withMessage('ID da escala deve ser um número inteiro'),
  param('voluntarioId')
    .isInt().withMessage('ID do voluntário deve ser um número inteiro'),
  checkValidationErrors
];

/**
 * Validar ID do ministério
 */
const validateParamMinisterioId = [
  param('ministerioId')
    .isInt().withMessage('ID do ministério deve ser um número inteiro'),
  checkValidationErrors
];

// ========== VALIDAÇÕES DE NEGÓCIO ==========

/**
 * Middleware: Validar limite de ministérios
 */
const validarMaximoMinisterios = async (req, res, next) => {
  try {
    const { usuarioId } = req.body;
    const ministerioId = Number(req.params.id || req.body.ministerioId);

    const ministerios = await prisma.usuarioMinisterio.count({
      where: { 
        usuarioId: Number(usuarioId),
        status: 'APROVADO'
      }
    });

    if (ministerios >= 2) {
      return res.status(400).json({
        mensagem: 'Voluntário não pode estar em mais de 2 ministérios aprovados.'
      });
    }

    next();
  } catch (error) {
    console.error('validarMaximoMinisterios - erro:', error);
    res.status(500).json({ mensagem: 'Erro na validação.' });
  }
};

/**
 * Middleware: Validar conflito de escala (48h)
 */
const validarConflitoEscala = async (req, res, next) => {
  try {
    const { ministerioId, dataHora, voluntarios } = req.body;

    if (!dataHora || !voluntarios || voluntarios.length === 0) {
      return next();
    }

    const data = new Date(dataHora);

    for (const voluntarioId of voluntarios) {
      const conflito = await prisma.escalaVoluntario.findFirst({
        where: {
          voluntarioId: Number(voluntarioId),
          escala: {
            dataHora: {
              gte: new Date(data.getTime() - 48 * 60 * 60 * 1000),
              lte: new Date(data.getTime() + 48 * 60 * 60 * 1000)
            }
          }
        },
        include: { escala: true }
      });

      if (conflito) {
        return res.status(400).json({
          mensagem: `Conflito detectado: voluntário ${voluntarioId} já está escalado em outro ministério dentro de 48 horas.`,
          conflito: conflito.escala
        });
      }
    }

    next();
  } catch (error) {
    console.error('validarConflitoEscala - erro:', error);
    res.status(500).json({ mensagem: 'Erro na validação de conflito.' });
  }
};

/**
 * Middleware: Validar que voluntário pertence ao ministério
 */
const validarVoluntarioNoMinisterio = async (req, res, next) => {
  try {
    const { voluntarioId } = req.body;
    const ministerioId = Number(req.params.id || req.params.ministerioId || req.body.ministerioId);

    if (!voluntarioId || !ministerioId) {
      return next();
    }

    const vinculo = await prisma.usuarioMinisterio.findFirst({
      where: {
        usuarioId: Number(voluntarioId),
        ministerioId,
        status: 'APROVADO'
      }
    });

    if (!vinculo) {
      return res.status(400).json({
        mensagem: 'Voluntário não está aprovado neste ministério.'
      });
    }

    next();
  } catch (error) {
    console.error('validarVoluntarioNoMinisterio - erro:', error);
    res.status(500).json({ mensagem: 'Erro na validação.' });
  }
};

/**
 * Middleware: Validar que ministério não tem escalas ativas
 */
const validarMinisterioSemEscalasAtivas = async (req, res, next) => {
  try {
    const ministerioId = Number(req.params.id);
    const agora = new Date();

    const escalasAtivas = await prisma.escala.count({
      where: {
        ministerioId,
        dataHora: { gte: agora }
      }
    });

    if (escalasAtivas > 0) {
      return res.status(400).json({
        mensagem: 'Não é possível deletar ministério com escalas ativas.'
      });
    }

    next();
  } catch (error) {
    console.error('validarMinisterioSemEscalasAtivas - erro:', error);
    res.status(500).json({ mensagem: 'Erro na validação.' });
  }
};

/**
 * Middleware: Validar que voluntário existe
 */
const validarVoluntarioExiste = async (req, res, next) => {
  try {
    const { voluntarioId } = req.body;
    
    if (!voluntarioId) {
      return next();
    }

    const usuario = await prisma.usuario.findUnique({
      where: { id: Number(voluntarioId) }
    });

    if (!usuario) {
      return res.status(404).json({
        mensagem: 'Voluntário não encontrado.'
      });
    }

    next();
  } catch (error) {
    console.error('validarVoluntarioExiste - erro:', error);
    res.status(500).json({ mensagem: 'Erro na validação.' });
  }
};

/**
 * Middleware: Validar que ministério existe
 */
const validarMinisterioExiste = async (req, res, next) => {
  try {
    const ministerioId = Number(req.params.id || req.params.ministerioId || req.body.ministerioId);
    
    if (!ministerioId) {
      return next();
    }

    const ministerio = await prisma.ministerio.findUnique({
      where: { id: ministerioId }
    });

    if (!ministerio) {
      return res.status(404).json({
        mensagem: 'Ministério não encontrado.'
      });
    }

    next();
  } catch (error) {
    console.error('validarMinisterioExiste - erro:', error);
    res.status(500).json({ mensagem: 'Erro na validação.' });
  }
};

module.exports = {
  checkValidationErrors,
  validarEmail,
  
  // Validações de usuário
  validateRegister,
  validateLogin,
  validateUpdateProfile,
  
  // Validações de ministério
  validateCreateMinisterio,
  validateUpdateMinisterio,
  validateAtribuirLider,
  validateAdicionarVoluntario,
  validateAprovarVoluntario,
  
  // Validações de escala
  validateCreateEscala,
  validateUpdateEscala,
  validateConfirmarPresenca,
  validateAdicionarVoluntarioEscala,
  
  // Validações de parâmetros
  validateParamId,
  validateParamEscalaId,
  validateParamEscalaVoluntario,
  validateParamMinisterioId,
  
  // Validações de negócio
  validarMaximoMinisterios,
  validarConflitoEscala,
  validarVoluntarioNoMinisterio,
  validarMinisterioSemEscalasAtivas,
  validarVoluntarioExiste,
  validarMinisterioExiste
};
