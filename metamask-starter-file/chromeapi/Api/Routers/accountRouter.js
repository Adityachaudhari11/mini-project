const express = require("express");
const authController = require("../Controllers/authController"); //write the name path
const router = express.Router();
router.get("/allaccount", authController.allAccount);
router.post("/createaccount",authController.createAccount);

module.exports = router;