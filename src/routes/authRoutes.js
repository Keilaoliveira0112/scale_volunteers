const express = require('express');
const router = express.Router();

const authController = require('../controllers/authController');
const verificarToken = require('../middleware/authMiddleware');



router.post('/register', authController.register);
router.post('/login', authController.login);
router.get('/me', verificarToken, authController.getUsuarioAutenticado);



module.exports = router;