const jwt = require('jsonwebtoken');
require('dotenv').config();

function verificarToken(req, res, next) {
  const authHeader = req.headers['authorization'] || req.headers['Authorization'];
  let token = authHeader && authHeader.split(' ')[1];

  // remover aspas acidentais
  if (typeof token === 'string') token = token.replace(/^"|"$/g, '');

  if (!token) return res.status(401).json({ mensagem: 'Token ausente.' });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // garantir campos disponíveis no req
    const tipo = (decoded.tipo || decoded.role || '').toString().toLowerCase();
    req.usuario = {
      id: decoded.id,
      email: decoded.email,
      tipo,
      role: tipo
    };

    return next();
  } catch (err) {
    console.error('JWT verify error:', err.message);
    return res.status(401).json({ mensagem: 'Token inválido ou expirado.' });
  }
}

module.exports = { verificarToken };
