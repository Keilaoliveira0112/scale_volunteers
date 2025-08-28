const jwt = require('jsonwebtoken');
require('dotenv').config();

const verificarToken = (req, res, next) => {
  const authHeader = req.headers['authorization']; 
  const token = authHeader && authHeader.split(' ')[1]; 

  if (!token) {
    return res.status(401).json({ mensagem: 'Acesso negado! Token não fornecido.' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.usuario = decoded; // { id, email, nome, tipo }
    next();
  } catch (error) {
    return res.status(401).json({ mensagem: 'Token inválido ou expirado.' });
  }
};

// 🔥 AQUI estava errado, estava checando role. Vamos usar tipo.
function verificarAdmin(req, res, next) {
  if (req.usuario?.role !== 'admin') {
    return res.status(403).json({ message: 'Acesso negado. Apenas administradores.' });
  }
  next();
}

module.exports = { verificarToken, verificarAdmin };
