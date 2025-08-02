// src/app.js
const express = require('express');
const cors = require('cors');
const app = express();

const authRoutes = require('./routes/authRoutes');
const usuarioRoutes = require('./routes/usuarioRoutes');

app.use(cors());
app.use(express.json());

app.use('/auth', authRoutes);
app.use('/usuarios', usuarioRoutes); 
// app.use('/api/usuarios', usuarioRoutes); prefixado para uma organização futura

app.get('/', (req, res) => {
  res.send('API Scale Volunteers rodando!');
});


module.exports = app;
