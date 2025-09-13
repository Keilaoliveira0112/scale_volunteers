const jwt = require('jsonwebtoken');
require('dotenv').config();

const verificarToken = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1]; // pega depois do "Bearer"

  if (!token) {
    return res.status(401).json({ mensagem: "Acesso negado! Token não fornecido." });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.usuario = decoded; // salva no req para usar depois
    next();
  } catch (error) {
    console.error("Erro JWT:", error.message);
    return res.status(401).json({ mensagem: "Token inválido ou expirado." });
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
