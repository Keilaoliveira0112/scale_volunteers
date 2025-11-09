// src/app.js
const express = require('express');
const cors = require('cors');
const app = express();

require('dotenv').config();

const protectedRoutes = require('./routes/protectedRoutes');
const authRoutes = require('./routes/authRoutes');
const usuarioRoutes = require('./routes/usuarioRoutes');
const ministerioRoutes = require('./routes/ministerioRoutes');
const voluntarioRoutes = require('./routes/voluntarioRoutes');
const adminRoutes = require('./routes/adminRoutes'); // << adicionar se faltar
const liderRoutes = require('./routes/liderRoutes');
const escalaRoutes = require('./routes/escalaRoutes');

app.use(express.json());
app.use(cors());

// debug: log de requisições (remova depois)
app.use((req, res, next) => {
  console.log('REQ', req.method, req.path);
  next();
});

// montar rotas
app.use('/auth', authRoutes);
app.use('/admin', adminRoutes);               // << aqui
app.use('/ministerios', ministerioRoutes);
app.use('/voluntario', voluntarioRoutes);
app.use('/usuarios', usuarioRoutes);
app.use('/protected', protectedRoutes);
app.use('/lider', liderRoutes);
app.use('/escala', escalaRoutes);

module.exports = app;
