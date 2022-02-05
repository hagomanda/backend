const express = require("express");
const router = express.Router();

const authController = require("./controllers/auth.controller");
const loginController = require("./controllers/login.controller");

router.get("/", authController.authenticateUser);
router.post("/login", loginController.login);
router.post("/refresh", loginController.refreshLogin);

module.exports = router;
