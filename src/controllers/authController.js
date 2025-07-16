const { PrismaClient } = require('../generated/prisma');
const { hashSenha, compararSenha } = require('../utils/hash');
const jwt = require('jsonwebtoken');

const prisma = new PrismaClient();
const JWT_SECRET = 'sua_chave_secreta'; // ideal usar process.env

exports.register = async (req, res) => {
  const { nome, email, senha, tipo } = req.body;

  try {
    const usuarioExistente = await prisma.usuario.findUnique({ where: { email } });

    if (usuarioExistente) {
      return res.status(400).json({ mensagem: 'E-mail já registrado' });
    }

    const senhaHash = await hashSenha(senha);

    const novoUsuario = await prisma.usuario.create({
      data: {
        nome,
        email,
        senhaHash,
        tipo,
      },
    });

    res.status(201).json({ mensagem: 'Usuário criado com sucesso', usuario: novoUsuario });
  } catch (erro) {
    res.status(500).json({ mensagem: 'Erro ao registrar', erro: erro.message });
  }
};

exports.login = async (req, res) => {
  const { email, senha } = req.body;

  try {
    const usuario = await prisma.usuario.findUnique({ where: { email } });

    if (!usuario) {
      return res.status(401).json({ mensagem: 'Usuário não encontrado' });
    }

    const senhaCorreta = await compararSenha(senha, usuario.senhaHash);

    if (!senhaCorreta) {
      return res.status(401).json({ mensagem: 'Senha incorreta' });
    }

    const token = jwt.sign({ id: usuario.id, email: usuario.email }, JWT_SECRET, { expiresIn: '1d' });

    res.status(200).json({ mensagem: 'Login bem-sucedido', token });
  } catch (erro) {
    res.status(500).json({ mensagem: 'Erro ao fazer login', erro: erro.message });
}}

exports.getUsuarioAutenticado = async (req, res) => {
  try {
    res.status(200).json({ usuario: req.usuario });
  } catch (erro) {
    res.status(500).json({ mensagem: 'Erro ao buscar usuário', erro: erro.message });
  }
};


