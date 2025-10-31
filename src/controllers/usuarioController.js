const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const bcrypt = require('bcrypt');

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

const getPerfil = async (req, res) => {
  try {
    // Aqui você acessa o ID do usuário que veio do token
    const userId = req.userId;
    res.json({ message: `Bem-vindo ao seu perfil! Seu ID é ${userId}` });
  } catch (error) {
    res.status(500).json({ message: 'Erro ao carregar o perfil.' });
  }
};

// Após a função getUsuarios, adicione um alias
const listarUsuarios = getUsuarios;

module.exports = {
  createUsuario,
  getUsuarios,
  listarUsuarios, // <- exporta o alias
  getUsuarioById,
  updateUsuario,
  deleteUsuario,
  getPerfil,
};