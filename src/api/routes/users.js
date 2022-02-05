const express = require("express");
const router = express.Router();

const usersController = require("./controllers/users.controller");

router.get("/", (req, res, next) => {});
router.post("/", usersController.create);

module.exports = router;
