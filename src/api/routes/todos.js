const express = require("express");
const router = express.Router();

const todosController = require("./controllers/todos.controllers");
const auth = require("../middlewares/auth");

router.get("/", auth.authenticateUser, todosController.getUsersTodos);

module.exports = router;
