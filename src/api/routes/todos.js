const express = require("express");
const router = express.Router();

const auth = require("../middlewares/auth");
const todosController = require("./controllers/todos.controller");
const {
  verifyParams,
  verifyDateRepetition,
  verifyTodoMemo,
} = require("../middlewares/validator");

router.post(
  "/:id",
  // auth.authenticateUser,
  verifyParams,
  verifyDaterepetition,
  todosController.addTodo,
);

router.post(
  "/memo/:id",
  // auth.authenticateUser,
  verifyParams,
  verifyTodoMemo,
  todosController.saveTodoMemo,
);

module.exports = router;
