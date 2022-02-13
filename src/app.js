require("dotenv").config();

const createError = require("http-errors");
const express = require("express");

const initialLoader = require("./loader");
const api = require("./api");

const app = express();

initialLoader(app);

app.use("/api", api);

app.use((req, res, next) => {
  next(createError(404));
});

app.use((err, req, res, next) => {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = res.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);

  res.json({
    result: "error",
    error: err.message,
  });
});

module.exports = app;
