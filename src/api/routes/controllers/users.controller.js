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
    const userId = req.app.locals.userId;
    const user = await User.findById(userId);
    const { createdGoals } = user;
    const result = await usersService.getGoalsFromIds(createdGoals);

    res.json({ result });
  } catch (error) {
    next(error);
  }
};
