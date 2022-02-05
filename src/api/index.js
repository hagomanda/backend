const express = require("express");

const auth = require("./routes/auth");
const chats = require("./routes/chats");
const goals = require("./routes/goals");
const users = require("./routes/users");

const api = express.Router();

api.use("/auth", auth);
api.use("/chats", chats);
api.use("/goals", goals);
api.use("/users", users);

module.exports = api;
