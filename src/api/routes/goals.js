const express = require("express");
const router = express.Router();

const validator = require("../middlewares/validator");
const auth = require("../middlewares/auth");
const goalsController = require("./controllers/goals.controller");

router.get("/", (req, res, next) => {});
router.post("/mainGoal", auth.authenticateUser, goalsController.create);
router.get(
  "/mainGoal/:id",
  auth.authenticateUser,
  validator.verifyParams,
  goalsController.getOne,
);
router.delete(
  "/mainGoal/:id",
  auth.authenticateUser,
  validator.verifyParams,
  goalsController.delete,
);
router.put(
  "/mainGoal/:id",
  auth.authenticateUser,
  validator.verifyParams,
  goalsController.modifyMainGoal,
);
router.post(
  "/mainGoal/:id/users",
  auth.authenticateUser,
  validator.verifyParams,
  validator.verifyEmail,
  goalsController.share,
);
router.put(
  "/subGoal/:id",
  auth.authenticateUser,
  validator.verifyParams,
  goalsController.modifySubGoal,
);

module.exports = router;
