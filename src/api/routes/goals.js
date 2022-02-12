const express = require("express");
const router = express.Router();

const { verifyParams, verifyEmail } = require("../middlewares/validator");
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
router.delete(
  "/mainGoal/:id",
  auth.authenticateUser,
  verifyParams,
  goalsController.delete,
);
router.put(
  "/mainGoal/:id",
  auth.authenticateUser,
  verifyParams,
  goalsController.modifyMainGoal,
);
router.post(
  "/mainGoal/:id/users",
  auth.authenticateUser,
  verifyParams,
  verifyEmail,
  goalsController.share,
);
router.put(
  "/subGoal/:id",
  auth.authenticateUser,
  verifyParams,
  goalsController.modifySubGoal,
);

module.exports = router;
