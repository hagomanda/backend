const express = require("express");
const router = express.Router();

const todosController = require("./controllers/todos.controller");
const auth = require("../middlewares/auth");
const {
  verifyParams,
  verifyDateRepetitoin,
} = require("../middlewares/validator");

router.post(
  "/:id",
  // auth.authenticateUser,
  verifyParams,
  verifyDateRepetitoin,
  todosController.addTodo,
);

module.exports = router;
