// src/controllers/authController.js
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const { createUsuario } = require('./usuarioController');
const SECRET = process.env.JWT_SECRET;


const register = async (req, res) => {
  return createUsuario(req, res);
};

const getUsuarioAutenticado = async (req, res) => {
  try {
    const usuario = await prisma.usuario.findUnique({
      where: { id: req.usuario.id },
      select: { id: true, nome: true, email: true, tipo: true }
    });

    if (!usuario) {
      return res.status(404).json({ mensagem: 'Usuário não encontrado' });
    }

    res.json(usuario);
  } catch (error) {
    res.status(500).json({ mensagem: 'Erro ao buscar usuário autenticado' });
  }
};

const login = async (req, res) => {
  const { email, senha } = req.body;

  try {
    const usuario = await prisma.usuario.findUnique({ where: { email } });

    if (!usuario) {
      return res.status(404).json({ mensagem: 'Usuário não encontrado' });
    }

    const senhaCorreta = await bcrypt.compare(senha, usuario.senhaHash);

    if (!senhaCorreta) {
      return res.status(401).json({ mensagem: 'Senha incorreta' });
    }

    const token = jwt.sign({ id: usuario.id, email: usuario.email }, SECRET, {
      expiresIn: '1d',
    });

    res.status(200).json({
      mensagem: 'Login realizado com sucesso!',
      token,
    });
  } catch (erro) {
    res.status(500).json({ mensagem: 'Erro ao fazer login', erro });
  }
};


exports.register = (req, res) => {
  res.status(200).json({ mensagem: 'Usuário registrado com sucesso!' });
};


module.exports = {
  getUsuarioAutenticado,
  login,
  register,
};


