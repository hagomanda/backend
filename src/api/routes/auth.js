const express = require("express");
const router = express.Router();

const loginController = require("./controllers/login.controller");
const authController = require("../routes/controllers/auth.controller");
const auth = require("../middlewares/auth");

router.post("/login", loginController.login);
router.post("/refresh", loginController.refreshLogin);
router.get("/logout", auth.authenticateUser, authController.logout);

module.exports = router;
