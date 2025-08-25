require('dotenv').config();
const express = require('express');
const app = require('./src/app'); 
const authRoutes = require('./src/routes/authRoutes'); 
const PORT = process.env.PORT || 3000;

app.use(express.json());

// Rotas
app.use('/api/usuarios', authRoutes);

// const usuarioRoutes = require('./src/routes/usuarioRoutes');
// app.use('/usuarios', usuarioRoutes);

app.listen(PORT, () => console.log(`Servidor rodando na porta ${PORT}`));
