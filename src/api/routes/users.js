const express = require("express");
const router = express.Router();

const usersController = require("./controllers/users.controller");
const auth = require("../middlewares/auth");

router.get("/", (req, res, next) => {});
router.post("/", usersController.create);
router.get("/goals", auth.authenticateUser, usersController.getGoals);

module.exports = router;
