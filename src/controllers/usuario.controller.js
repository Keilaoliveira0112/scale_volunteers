const usuarioService = require("../services/usuario.service");

const usuarioController = {
  register: async (req, res) => {
    try {
      const { nome, email, senha, tipo } = req.body;
      const usuario = await usuarioService.register(nome, email, senha, tipo);
      return res.status(201).json(usuario);
    } catch (err) {
      return res.status(400).json({ error: err.message });
    }
  },

  getAll: async (req, res) => {
    const usuarios = await usuarioService.listUsers();
    return res.json(usuarios);
  }
};

module.exports = usuarioController;
