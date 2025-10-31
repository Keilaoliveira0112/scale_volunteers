module.exports = function authorizeAdmin(req, res, next) {
  try {
    const user = req.usuario || {};
    const role = (user.role || user.tipo || '').toString().toLowerCase();
    if (role === 'admin') return next();
    return res.status(403).json({ message: 'Acesso negado: Apenas administradores podem acessar esta rota.' });
  } catch (error) {
    console.error('Erro no middleware de autorização:', error);
    return res.status(500).json({ message: 'Erro interno no servidor' });
  }
};
