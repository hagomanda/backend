const express = require("express");

const auth = require("./routes/auth");
const chats = require("./routes/chats");
const goals = require("./routes/goals");
const users = require("./routes/users");
const todos = require("./routes/todos");

const api = express.Router();

api.use("/auth", auth);
api.use("/chats", chats);
api.use("/goals", goals);
api.use("/users", users);
api.use("/todos", todos);

module.exports = api;
