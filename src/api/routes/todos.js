const express = require("express");
const router = express.Router();

const validator = require("../middlewares/validator");
const auth = require("../middlewares/auth");
const todosController = require("./controllers/todos.controller");

router.post(
  "/:id",
  auth.authenticateUser,
  validator.verifyParams,
  validator.verifyDateRepetition,
  todosController.addTodo,
);

router.post(
  "/memo/:id",
  auth.authenticateUser,
  validator.verifyParams,
  validator.verifyTodoMemo,
  todosController.saveTodoMemo,
);

router.delete(
  "/:id",
  auth.authenticateUser,
  validator.verifyParams,
  todosController.deleteCalendarTodo,
);

router.put(
  "/calendar/:id",
  auth.authenticateUser,
  validator.verifyParams,
  todosController.modifyTodoCheckButton,
);

module.exports = router;
