const express = require("express");
const authController = require("../Controllers/authController"); //write the name path
const router = express.Router();
router.post("/signup", authController.signUp);
router.post("/login", authController.login);
module.exports = router;