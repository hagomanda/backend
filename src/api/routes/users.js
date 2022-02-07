const express = require("express");
const router = express.Router();

const usersController = require("./controllers/users.controller");
const auth = require("../middlewares/auth");

router.get("/", (req, res, next) => {});
router.post("/", auth.authenticateUser, usersController.create);

module.exports = router;
