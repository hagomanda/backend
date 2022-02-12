const express = require("express");
const router = express.Router();

const auth = require("../middlewares/auth");
const todosController = require("./controllers/todos.controller");
const validator = require("../middlewares/validator");

router.post(
  "/:id",
  auth.authenticateUser,
  validator.verifyParams,
  validator.verifyDateRepetition,
  todosController.addTodo,
);

router.put(
  "/:id",
  auth.authenticateUser,
  validator.verifyParams,
  todosController.modifyTodo,
);

router.post(
  "/memo/:id",
  // auth.authenticateUser,
  validator.verifyParams,
  validator.verifyTodoMemo,
  todosController.saveTodoMemo,
);

router.delete(
  "/:id",
  auth.authenticateUser,
  validator.verifyParams,
  todosController.deleteTodo,
);

module.exports = router;
