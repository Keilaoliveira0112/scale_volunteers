const usuarioService = require('../services/usuario.service');

/**
 * Registrar novo usuário
 */
exports.register = async (req, res) => {
  try {
    const { nome, email, senha, tipo } = req.body;

    if (!nome || !email || !senha) {
      return res.status(400).json({ mensagem: 'Nome, email e senha são obrigatórios.' });
    }

    const usuario = await usuarioService.register(nome, email, senha, tipo || 'voluntario');

    return res.status(201).json({
      mensagem: 'Usuário registrado com sucesso!',
      usuario: {
        id: usuario.id,
        nome: usuario.nome,
        email: usuario.email,
        tipo: usuario.tipo
      }
    });
  } catch (error) {
    console.error('register - erro:', error.message);
    return res.status(400).json({ mensagem: error.message });
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

    const { usuario, token } = await usuarioService.autenticar(email, senha);

    return res.json({
      mensagem: 'Login realizado com sucesso!',
      token,
      usuario: {
        id: usuario.id,
        nome: usuario.nome,
        email: usuario.email,
        tipo: usuario.tipo
      }
    });
  } catch (error) {
    console.error('login - erro:', error.message);
    return res.status(401).json({ mensagem: error.message });
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

    const usuario = await usuarioService.obterPorId(usuarioId);

    return res.json({
      id: usuario.id,
      nome: usuario.nome,
      email: usuario.email,
      tipo: usuario.tipo
    });
  } catch (error) {
    console.error('obterPerfil - erro:', error.message);
    return res.status(404).json({ mensagem: error.message });
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

    const usuarioAtualizado = await usuarioService.atualizar(usuarioId, { nome, email });

    return res.json({
      mensagem: 'Perfil atualizado com sucesso!',
      usuario: {
        id: usuarioAtualizado.id,
        nome: usuarioAtualizado.nome,
        email: usuarioAtualizado.email,
        tipo: usuarioAtualizado.tipo
      }
    });
  } catch (error) {
    console.error('atualizarPerfil - erro:', error.message);
    return res.status(400).json({ mensagem: error.message });
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

    const usuario = await usuarioService.obterPorId(idSolicitado);

    return res.json({
      id: usuario.id,
      nome: usuario.nome,
      email: usuario.email,
      tipo: usuario.tipo
    });
  } catch (error) {
    console.error('obterUsuarioPorId - erro:', error.message);
    return res.status(404).json({ mensagem: error.message });
  }
};

/**
 * Listar todos os usuários (apenas admin)
 */
exports.listarUsuarios = async (req, res) => {
  try {
    const usuarios = await usuarioService.listarTodos();
    return res.json(usuarios.map(u => ({
      id: u.id,
      nome: u.nome,
      email: u.email,
      tipo: u.tipo
    })));
  } catch (error) {
    console.error('listarUsuarios - erro:', error.message);
    return res.status(500).json({ mensagem: 'Erro ao listar usuários.' });
  }
};

/**
 * Deletar usuário (apenas admin ou o próprio usuário)
 */
exports.deletarUsuario = async (req, res) => {
  try {
    const usuarioId = req.usuario?.id;
    const usuarioType = req.usuario?.tipo;
    const idDeletar = Number(req.params.id);

    if (!usuarioId) {
      return res.status(401).json({ mensagem: 'Usuário não autenticado.' });
    }

    // Apenas o próprio usuário ou admin pode deletar
    if (usuarioId !== idDeletar && usuarioType !== 'admin') {
      return res.status(403).json({ mensagem: 'Sem permissão para deletar este usuário.' });
    }

    await usuarioService.deletar(idDeletar);

    return res.json({ mensagem: 'Usuário deletado com sucesso!' });
  } catch (error) {
    console.error('deletarUsuario - erro:', error.message);
    return res.status(400).json({ mensagem: error.message });
  }
};