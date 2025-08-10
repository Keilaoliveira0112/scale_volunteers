// src/controllers/authController.js
require('dotenv').config();
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();
const JWT_SECRET = process.env.JWT_SECRET;

// Buscar dados do usuário autenticado
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

// Login
const login = async (req, res) => {
  const { email, senha } = req.body;
   
  try {
    const usuario = await prisma.usuario.findUnique({ where: { email } });

    if (!usuario) {
      return res.status(404).json({ mensagem: 'Usuário não encontrado' });
    }

    const senhaCorreta = await bcrypt.compare(senha, usuario.senhaHash);
    console.log(senhaCorreta);
    if (!senhaCorreta) {
        console.log(senhaCorreta);
    return res.status(401).json({ mensagem: 'Senha incorreta' });
    }
    
    const token = jwt.sign(
      { id: usuario.id, email: usuario.email },
      JWT_SECRET,
      { expiresIn: '1d' }
    );

    res.status(200).json({
      mensagem: 'Login realizado com sucesso!',
      token
    });
  } catch (erro) {
    res.status(500).json({ mensagem: 'Erro ao fazer login', erro });
  }
};

// Registro
const register = async (req, res) => {
  const { nome, email, senha, tipo } = req.body;

  try {
    const usuarioExistente = await prisma.usuario.findUnique({ where: { email } });
    if (usuarioExistente) {
      return res.status(400).json({ mensagem: 'E-mail já cadastrado' });
    }

    const senhaHash = await bcrypt.hash(senha, 10);
    const novoUsuario = await prisma.usuario.create({
      data: { nome, email, senhaHash, tipo }
    });

    res.status(201).json({
      mensagem: 'Usuário registrado com sucesso!',
      usuario: {
        id: novoUsuario.id,
        nome: novoUsuario.nome,
        email: novoUsuario.email,
        tipo: novoUsuario.tipo
      }
    });
  } catch (erro) {
    res.status(500).json({ mensagem: 'Erro ao registrar usuário', erro });
  }
};

module.exports = {
  getUsuarioAutenticado,
  login,
  register
};
