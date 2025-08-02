const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// ✅ CREATE
const createUsuario = async (req, res) => {
  try {
    const { nome, email, senhaHash, tipo } = req.body;

    // Validação simples
    if (!nome || !email || !senhaHash || !tipo) {
      return res.status(400).json({ error: 'Todos os campos são obrigatórios.' });
    }

    const novoUsuario = await prisma.usuario.create({
      data: { nome, email, senhaHash, tipo },
    });

    return res.status(201).json(novoUsuario);
  } catch (error) {
    if (error.code === 'P2002') {
      return res.status(409).json({ error: 'E-mail já está em uso.' });
    }
    return res.status(500).json({ error: 'Erro ao criar usuário.', details: error.message });
  }
};

// ✅ GET ALL
const getUsuarios = async (req, res) => {
  try {
    const usuarios = await prisma.usuario.findMany();
    return res.status(200).json(usuarios);
  } catch (error) {
    return res.status(500).json({ error: 'Erro ao buscar usuários.', details: error.message });
  }
};

// ✅ GET ONE BY ID
const getUsuarioById = async (req, res) => {
  try {
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
  createUsuario,
  getUsuarios,
  getUsuarioById,
  updateUsuario,
  deleteUsuario,
};
