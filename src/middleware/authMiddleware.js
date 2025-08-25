/*require('dotenv').config();
const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET;

function verificarToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  
  if (!authHeader) {
    return res.status(401).json({ mensagem: 'Token não fornecido' });
  }

  if (!authHeader.startsWith('Bearer ')) {
    return res.status(400).json({ mensagem: 'Formato do token inválido' });
  }

  const token = authHeader.split(' ')[1];
  
  jwt.verify(token, JWT_SECRET, (err, usuario) => {
    if (err) {
      return res.status(403).json({ mensagem: 'Acesso negado' });
    }

    req.usuario = usuario;
    next();
  });
}

module.exports = verificarToken;*/

// src/middleware/authMiddleware.js
// src/middleware/authMiddleware.js
const jwt = require('jsonwebtoken');
require('dotenv').config();

const verificarToken = (req, res, next) => {
  const authHeader = req.headers['authorization']; // Pega o header Authorization
  const token = authHeader && authHeader.split(' ')[1]; // Espera formato: Bearer TOKEN

  if (!token) {
    return res.status(401).json({ mensagem: 'Acesso negado! Token não fornecido.' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET); // Valida token
    req.usuario = decoded; // Salva dados do token (id, email, etc.)
    next();
  } catch (error) {
    return res.status(401).json({ mensagem: 'Token inválido ou expirado.' });
  }
};

module.exports = verificarToken;
