const express = require("express");
const router = express.Router();

const auth = require("../middlewares/auth");
const validator = require("../middlewares/validator");
const chatsController = require("./controllers/chats.controller");

router.get(
  "/:id",
  auth.authenticateUser,
  validator.verifyParams,
  validator.verifyChatToken,
  chatsController.getChat,
);

module.exports = router;
