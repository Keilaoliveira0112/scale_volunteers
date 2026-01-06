const bcrypt = require('bcrypt');
const usuarioRepository = require('../repositories/usuarioRepository');

class UsuarioService {
  /**
   * Registrar novo usuário
   */
  async registrar(nome, email, senha, tipo = 'voluntario') {
    // Validar entrada
    if (!nome || !email || !senha) {
      throw new Error('Nome, email e senha são obrigatórios.');
    }

    // Verificar se email já existe
    const usuarioExistente = await usuarioRepository.buscarPorEmail(email);
    if (usuarioExistente) {
      throw new Error('Email já cadastrado.');
    }

    // Hash da senha
    const senhaHash = await bcrypt.hash(senha, 10);

    // Criar usuário
    return usuarioRepository.criar({
      nome,
      email,
      senhaHash,
      tipo
    });
  }

  /**
   * Autenticar usuário
   */
  async autenticar(email, senha) {
    if (!email || !senha) {
      throw new Error('Email e senha são obrigatórios.');
    }

    const usuario = await usuarioRepository.buscarPorEmail(email);
    if (!usuario) {
      throw new Error('Email ou senha inválidos.');
    }

    const senhaValida = await bcrypt.compare(senha, usuario.senhaHash);
    if (!senhaValida) {
      throw new Error('Email ou senha inválidos.');
    }

    return usuario;
  }

  /**
   * Obter usuário por ID
   */
  async obterPorId(id) {
    const usuario = await usuarioRepository.buscarPorId(id);
    if (!usuario) {
      throw new Error('Usuário não encontrado.');
    }
    return usuario;
  }

  /**
   * Listar todos os usuários
   */
  async listarTodos() {
    return usuarioRepository.listarTodos();
  }

  /**
   * Atualizar usuário
   */
  async atualizar(id, nome, email) {
    const usuarioExistente = await usuarioRepository.buscarPorId(id);
    if (!usuarioExistente) {
      throw new Error('Usuário não encontrado.');
    }

    const dados = {};
    if (nome) dados.nome = nome;
    if (email) dados.email = email;

    return usuarioRepository.atualizar(id, dados);
  }

  /**
   * Deletar usuário
   */
  async deletar(id) {
    const usuarioExistente = await usuarioRepository.buscarPorId(id);
    if (!usuarioExistente) {
      throw new Error('Usuário não encontrado.');
    }

    return usuarioRepository.deletar(id);
  }

  /**
   * Listar usuários por tipo
   */
  async listarPorTipo(tipo) {
    const tiposValidos = ['admin', 'lider', 'voluntario'];
    if (!tiposValidos.includes(tipo)) {
      throw new Error(`Tipo deve ser um de: ${tiposValidos.join(', ')}`);
    }

    return usuarioRepository.buscarPorTipo(tipo);
  }
}

module.exports = new UsuarioService();