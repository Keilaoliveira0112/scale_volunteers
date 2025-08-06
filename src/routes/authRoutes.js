const express = require('express');
const router = express.Router();

const authController = require('../controllers/authController');
const verificarToken = require('../middleware/authMiddleware');
const usuarioController = require('../controllers/usuarioController');


router.post('/register', authController.register);
router.post('/login', authController.login);
router.get('/me', verificarToken, authController.getUsuarioAutenticado);
router.get('/', usuarioController.getUsuarios);
router.get('/:id', usuarioController.getUsuarioById);
router.put('/:id', usuarioController.updateUsuario);
router.delete('/:id', usuarioController.deleteUsuario);



module.exports = router;