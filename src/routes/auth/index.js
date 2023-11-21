const express = require("express");
const router = express.Router();
const accessController = require("../../controller/access.controller");


router.post('/login', accessController.login)
router.post('/register', accessController.signUp)
router.post("/refresh-token", accessController.refreshToken);


module.exports = router;