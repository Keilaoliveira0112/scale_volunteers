const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const JWT_SECRET = process.env.JWT_SECRET;
require('dotenv').config();

// Função de registro
const register = async (req, res) => {
  const { nome, email, senha, tipo } = req.body;
  try {
    const senhaHash = await bcrypt.hash(senha, 10);
    const novoUsuario = await prisma.usuario.create({
      data: { nome, email, senhaHash, tipo }
    });
    res.status(201).json(novoUsuario);
  } catch (error) {
    res.status(500).json({ mensagem: 'Erro ao registrar usuário', erro: error.message });
  }
};

// Função de login
const login = async (req, res) => {
  const { email, senha } = req.body;
  try {
    const usuario = await prisma.usuario.findUnique({ where: { email } });
    if (!usuario) return res.status(401).json({ mensagem: 'Usuário não encontrado' });

    const senhaValida = await bcrypt.compare(senha, usuario.senhaHash);
    if (!senhaValida) return res.status(401).json({ mensagem: 'Senha inválida' });

    const token = jwt.sign({ id: usuario.id, email: usuario.email, nome: usuario.nome, tipo: usuario.tipo  }, JWT_SECRET, { expiresIn: '1h' });
    res.json({ token });
  } catch (error) {
    res.status(500).json({ mensagem: 'Erro ao fazer login', erro: error.message });
  }
};

// Função para retornar usuário autenticado
const getUsuarioAutenticado = async (req, res) => {
  try {
    const usuario = await prisma.usuario.findUnique({ where: { id: req.usuario.id } });
    if (!usuario) return res.status(404).json({ mensagem: 'Usuário não encontrado' });
    res.json(usuario);
  } catch (error) {
    res.status(500).json({ mensagem: 'Erro ao buscar usuário autenticado', erro: error.message });
  }
};


// ✅ CREATE
const createUsuario = async (req, res) => {
  
    const { nome, email, senha, tipo } = req.body;

  try {
    const senhaHash = await bcrypt.hash(senha, 10); // 🔒 criptografa a senha

    const novoUsuario = await prisma.usuario.create({
      data: {
        nome,
        email,
        senhaHash, // salva já criptografado
        tipo
      }
    });

    return res.status(201).json(novoUsuario);
  } catch (error) {
    return res.status(500).json({ mensagem: 'Erro ao cadastrar usuário', erro: error.message });
  }
};


// ✅ GET ALL
async function getUsuarios(req, res) {
    try {
        const usuarios = await prisma.usuario.findMany();
        return res.status(200).json(usuarios);
    } catch (error) {
        return res.status(500).json({ error: 'Erro ao buscar usuários.', details: error.message });
    }
}

// ✅ GET ONE BY ID
const getUsuarioById = async (req, res) => {
  try {
    console.log('ID recebido:', req.params.id);

    const id = parseInt(req.params.id);
    if (isNaN(id)) return res.status(400).json({ error: 'ID inválido.' });

    const usuario = await prisma.usuario.findUnique({
      where: { id },
    });

    if (!usuario) return res.status(404).json({ error: 'Usuário não encontrado.' });

    return res.status(200).json(usuario);
  } catch (error) {
    return res.status(500).json({ error: 'Erro ao buscar usuário.', details: error.message });
  }
};

// ✅ UPDATE
const updateUsuario = async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const { nome, email, senhaHash, tipo } = req.body;

    if (isNaN(id)) return res.status(400).json({ error: 'ID inválido.' });

    const usuarioAtualizado = await prisma.usuario.update({
      where: { id },
      data: { nome, email, senhaHash, tipo },
    });

    return res.status(200).json(usuarioAtualizado);
  } catch (error) {
    if (error.code === 'P2025') {
      return res.status(404).json({ error: 'Usuário não encontrado.' });
    }
    return res.status(500).json({ error: 'Erro ao atualizar usuário.', details: error.message });
  }
};

// ✅ DELETE
const deleteUsuario = async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    if (isNaN(id)) return res.status(400).json({ error: 'ID inválido.' });

    await prisma.usuario.delete({
      where: { id },
    });

    return res.status(204).send();
  } catch (error) {
    if (error.code === 'P2025') {
      return res.status(404).json({ error: 'Usuário não encontrado.' });
    }
    return res.status(500).json({ error: 'Erro ao excluir usuário.', details: error.message });
  }
};

module.exports = {
  register,
  login,
  getUsuarioAutenticado,  
  createUsuario,
  getUsuarios,
  getUsuarioById,
  updateUsuario,
  deleteUsuario,
};