const jwt = require('jsonwebtoken');

const token = jwt.sign(
  { id: '2' }, // coloque aqui um ID válido de usuário
  'JWT_SECRET=projeto_t0ken_@utent1cada!', // substitua por seu process.env.JWT_SECRET
  { expiresIn: '1d' }
);

console.log(token);
