// src/app.js
const express = require('express');
const cors = require('cors');
const app = express();

require('dotenv').config();

const protectedRoutes = require('./routes/protectedRoutes');
const authRoutes = require('./routes/authRoutes');
const usuarioRoutes = require('./routes/usuarioRoutes');
const ministerioRoutes = require('./routes/ministerioRoutes');

app.use(cors());
app.use(express.json());

app.use('/auth', authRoutes);
app.use('/usuarios', usuarioRoutes); 
// app.use('/api/usuarios', usuarioRoutes); prefixado para uma organização futura

app.get('/', (req, res) => {
  res.send('API Scale Volunteers rodando!');
});

// Rotas protegidas
app.use('/api', protectedRoutes);

app.use('/ministerios', ministerioRoutes);


module.exports = app;
