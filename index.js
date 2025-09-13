require('dotenv').config();
const express = require('express');
const app = require('./src/app'); 
const authRoutes = require('./src/routes/authRoutes'); 
const protectedRoutes = require('./src/routes/protectedRoutes');
const ministerioRoutes = require('./src/routes/ministerioRoutes');
const PORT = process.env.PORT || 3000;


app.use(express.json());

// Rotas
app.use('/api/usuarios', authRoutes);

// Rotas protegidas
app.use('/api', protectedRoutes);

const adminRoutes = require('./src/routes/adminRoutes');
app.use('/admin', adminRoutes);

// Monta as rotas de ministérios
app.use('/ministerios', ministerioRoutes);

// const usuarioRoutes = require('./src/routes/usuarioRoutes');
// app.use('/usuarios', usuarioRoutes);

app.listen(PORT, () => console.log(`Servidor rodando na porta ${PORT}`));
