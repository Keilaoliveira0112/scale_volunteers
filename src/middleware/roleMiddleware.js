const verificarPermissao = (rolesPermitidos) => {
  return (req, res, next) => {
    const usuario = req.usuario; // vem do authMiddleware
    if (!usuario) {
      return res.status(401).json({ mensagem: 'Usuário não autenticado' });
    }

    if (!rolesPermitidos.includes(usuario.role)) {
      return res.status(403).json({ mensagem: 'Acesso negado' });
    }

    next();
  };
};

module.exports = verificarPermissao;
