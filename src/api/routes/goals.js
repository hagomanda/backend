const express = require("express");
const router = express.Router();

const { verifyParams } = require("../middlewares/validator");
const goalsController = require("./controllers/goals.controller");
const authenticateUser = require("../middlewares/auth");

router.get("/", (req, res, next) => {});
// verifyToken 필요
router.post("/mainGoal", authenticateUser, goalsController.create);
router.get("/mainGoal/:id", verifyParams, goalsController.getOne);

module.exports = router;
