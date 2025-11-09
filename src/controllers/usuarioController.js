const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const prisma = new PrismaClient();

const JWT_SECRET = process.env.JWT_SECRET || 'seu_secret_key';

/**
 * Registrar novo usuário
 */
exports.register = async (req, res) => {
  try {
    const { nome, email, senha, tipo } = req.body;

    if (!nome || !email || !senha) {
      return res.status(400).json({ mensagem: 'Nome, email e senha são obrigatórios.' });
    }

    const usuarioExistente = await prisma.usuario.findUnique({ where: { email } });
    if (usuarioExistente) {
      return res.status(400).json({ mensagem: 'Email já cadastrado.' });
    }

    const senhaHash = await bcrypt.hash(senha, 10);
    const novoUsuario = await prisma.usuario.create({
      data: {
        nome,
        email,
        senhaHash,
        tipo: tipo || 'voluntario'
      },
      select: { id: true, nome: true, email: true, tipo: true }
    });

    return res.status(201).json({
      mensagem: 'Usuário registrado com sucesso!',
      usuario: novoUsuario
    });
  } catch (error) {
    console.error('register - erro:', error);
    return res.status(500).json({ mensagem: 'Erro ao registrar usuário.' });
  }
};

/**
 * Fazer login
 */
exports.login = async (req, res) => {
  try {
    const { email, senha } = req.body;

    if (!email || !senha) {
      return res.status(400).json({ mensagem: 'Email e senha são obrigatórios.' });
    }

    const usuario = await prisma.usuario.findUnique({ where: { email } });
    if (!usuario) {
      return res.status(401).json({ mensagem: 'Email ou senha inválidos.' });
    }

    const senhaValida = await bcrypt.compare(senha, usuario.senhaHash);
    if (!senhaValida) {
      return res.status(401).json({ mensagem: 'Email ou senha inválidos.' });
    }

    const token = jwt.sign(
      { id: usuario.id, email: usuario.email, tipo: usuario.tipo },
      JWT_SECRET,
      { expiresIn: '1h' }
    );

    return res.json({
      token,
      usuario: {
        id: usuario.id,
        nome: usuario.nome,
        email: usuario.email,
        tipo: usuario.tipo
      }
    });
  } catch (error) {
    console.error('login - erro:', error);
    return res.status(500).json({ mensagem: 'Erro ao fazer login.' });
  }
};

/**
 * Obter perfil do usuário autenticado
 */
exports.obterPerfil = async (req, res) => {
  try {
    const usuarioId = req.usuario?.id;
    if (!usuarioId) {
      return res.status(401).json({ mensagem: 'Usuário não autenticado.' });
    }

    const usuario = await prisma.usuario.findUnique({
      where: { id: usuarioId },
      select: { id: true, nome: true, email: true, tipo: true, createdAt: true }
    });

    if (!usuario) {
      return res.status(404).json({ mensagem: 'Usuário não encontrado.' });
    }

    return res.json(usuario);
  } catch (error) {
    console.error('obterPerfil - erro:', error);
    return res.status(500).json({ mensagem: 'Erro ao obter perfil.' });
  }
};

/**
 * Atualizar perfil do usuário
 */
exports.atualizarPerfil = async (req, res) => {
  try {
    const usuarioId = req.usuario?.id;
    const { nome, email } = req.body;

    if (!usuarioId) {
      return res.status(401).json({ mensagem: 'Usuário não autenticado.' });
    }

    const usuarioAtualizado = await prisma.usuario.update({
      where: { id: usuarioId },
      data: {
        ...(nome && { nome }),
        ...(email && { email })
      },
      select: { id: true, nome: true, email: true, tipo: true }
    });

    return res.json({
      mensagem: 'Perfil atualizado com sucesso!',
      usuario: usuarioAtualizado
    });
  } catch (error) {
    console.error('atualizarPerfil - erro:', error);
    return res.status(500).json({ mensagem: 'Erro ao atualizar perfil.' });
  }
};

/**
 * Obter usuário por ID (apenas o próprio usuário ou admin)
 */
exports.obterUsuarioPorId = async (req, res) => {
  try {
    const usuarioId = req.usuario?.id;
    const usuarioType = req.usuario?.tipo;
    const idSolicitado = Number(req.params.id);

    if (!usuarioId) {
      return res.status(401).json({ mensagem: 'Usuário não autenticado.' });
    }

    // Apenas o próprio usuário ou admin pode ver
    if (usuarioId !== idSolicitado && usuarioType !== 'admin') {
      return res.status(403).json({ mensagem: 'Sem permissão para acessar este usuário.' });
    }

    const usuario = await prisma.usuario.findUnique({
      where: { id: idSolicitado },
      select: {
        id: true,
        nome: true,
        email: true,
        tipo: true,
        createdAt: true,
        updatedAt: true
      }
    });

    if (!usuario) {
      return res.status(404).json({ mensagem: 'Usuário não encontrado.' });
    }

    return res.json(usuario);
  } catch (error) {
    console.error('obterUsuarioPorId - erro:', error);
    return res.status(500).json({ mensagem: 'Erro ao obter usuário.' });
  }
};