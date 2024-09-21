const express = require("express");
const authController = require("../Controllers/authController"); //write the name path
const router = express.Router();
router.get("/alltoken", authController.allToken);
router.post("/createtoken", authController.addToken);
module.exports = router;