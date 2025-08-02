const jwt = require('jsonwebtoken');
const JWT_SECRET = 'sua_chave_secreta'; // ideal: use process.env.JWT_SECRET

function verificarToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  if (!authHeader) return res.status(401).json({ mensagem: 'Token não fornecido' });

  if (!authHeader.startsWith('Bearer ')) {
    return res.status(400).json({ mensagem: 'Formato do token inválido' });
  }

  const token = authHeader.split(' ')[1];
  jwt.verify(token, JWT_SECRET, (err, usuario) => {
    if (err) return res.status(403).json({ mensagem: 'Token inválido' });
    req.usuario = usuario;
    next();
  });
}

module.exports = verificarToken;

