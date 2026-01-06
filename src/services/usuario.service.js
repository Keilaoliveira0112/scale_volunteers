const usuarioRepository = require("../repositories/usuario.repository");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const usuarioService = {
  register: async (nome, email, senha, tipo) => {
    const existe = await usuarioRepository.findByEmail(email);
    if (existe) throw new Error("Email já cadastrado");

    const senhaHash = await bcrypt.hash(senha, 10);

    return usuarioRepository.create({
      nome,
      email,
      senhaHash,
      tipo
    });
  },

  autenticar: async (email, senha) => {
    const usuario = await usuarioRepository.findByEmail(email);
    if (!usuario) throw new Error("Usuário não encontrado");

    const senhaValida = await bcrypt.compare(senha, usuario.senhaHash);
    if (!senhaValida) throw new Error("Senha incorreta");

    const token = jwt.sign(
      { id: usuario.id, email: usuario.email, tipo: usuario.tipo },
      process.env.JWT_SECRET || "seu_secret_aqui",
      { expiresIn: "1h" }
    );

    return { usuario, token };
  },

  obterPorId: async (id) => {
    const usuario = await usuarioRepository.findById(id);
    if (!usuario) throw new Error("Usuário não encontrado");
    return usuario;
  },

  listarTodos: () => {
    return usuarioRepository.findAll();
  },

  listarPorTipo: (tipo) => {
    return usuarioRepository.findByType(tipo);
  },

  atualizar: async (id, dados) => {
    const usuario = await usuarioRepository.findById(id);
    if (!usuario) throw new Error("Usuário não encontrado");

    if (dados.senha) {
      dados.senhaHash = await bcrypt.hash(dados.senha, 10);
      delete dados.senha;
    }

    return usuarioRepository.update(id, dados);
  },

  deletar: async (id) => {
    const usuario = await usuarioRepository.findById(id);
    if (!usuario) throw new Error("Usuário não encontrado");
    return usuarioRepository.delete(id);
  }
};

module.exports = usuarioService;
