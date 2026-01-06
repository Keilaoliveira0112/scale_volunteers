const router = require("express").Router();
const usuarioController = require("../controllers/usuario.controller");

router.post("/usuarios", usuarioController.register);
router.get("/usuarios", usuarioController.getAll);

module.exports = router;
