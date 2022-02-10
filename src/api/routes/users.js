const express = require("express");
const router = express.Router();

const auth = require("../middlewares/auth");
const usersController = require("./controllers/users.controller");

router.get("/", (req, res, next) => {});
router.post("/", usersController.create);
router.get("/goals", auth.authenticateUser, usersController.getGoals);
router.get("/todos", auth.authenticateUser, usersController.getTodos);

module.exports = router;
