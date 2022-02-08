const express = require("express");
const router = express.Router();

const { verifyParams } = require("../middlewares/validator");
const goalsController = require("./controllers/goals.controller");
const auth = require("../middlewares/auth");

router.get("/", (req, res, next) => {});
router.post("/mainGoal", auth.authenticateUser, goalsController.create);
router.get(
  "/mainGoal/:id",
  auth.authenticateUser,
  verifyParams,
  goalsController.getOne,
);

module.exports = router;
