const User = require("../../../models/User");
const usersService = require("../../services/users.service");

exports.create = async (req, res, next) => {
  try {
    await usersService.signup(req.body.user);

    res.json({
      result: "ok",
    });
  } catch (error) {
    next(error);
  }
};

exports.getGoals = async (req, res, next) => {
  try {
    const user = res.locals.user;
    const { _id } = user;
    const { createdGoals } = await User.findById(_id, "createdGoals -_id");
    const result = await usersService.getGoalsFromIds(createdGoals);

    res.json({ result });
  } catch (error) {
    next(error);
  }
};

exports.getTodos = async (req, res, next) => {
  try {
    const requestDate = new Date(req.headers.currentdate);
    const days = req.headers.days;
    const user = res.locals.user;
    const { _id } = user;
    const todos = await usersService.getTodosFromId(_id, requestDate, days);

    res.json({
      result: todos,
    });
  } catch (error) {
    next(error);
  }
};

exports.findUserByEmail = async (req, res, next) => {
  try {
    const user = await usersService.findUserByEmail(req.headers.otheruser);

    if (!user) {
      res.status(400);
      return res.json({
        result: "false",
        message: "해당하는 유저가 없습니다.",
      });
    }

    res.json({
      result: "ok",
      user,
    });
  } catch (error) {
    next(error);
  }
};
