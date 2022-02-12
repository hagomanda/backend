const express = require("express");
const router = express.Router();
const usersController = require("./controllers/users.controller");
const auth = require("../middlewares/auth");

router.get("/", auth.authenticateUser, usersController.findUserByEmail);
router.post("/", usersController.create);
router.get("/goals", auth.authenticateUser, usersController.getGoals);
router.get("/todos", auth.authenticateUser, usersController.getTodos);

module.exports = router;
