module.exports = function authorizeAdmin(req, res, next) {
  try {
    if (req.usuario && req.usuario.tipo === 'admin') {
      return next();
    }
    return res.status(403).json({ message: 'Acesso negado: Apenas administradores podem acessar esta rota.' });
  } catch (error) {
    console.error('Erro no middleware de autorização:', error);
    return res.status(500).json({ message: 'Erro interno no servidor' });
  }
};
