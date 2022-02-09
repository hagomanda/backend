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
    const user = req.app.locals.user;
    const { _id } = user;
    const createdGoals = await User.findById(_id, "createdGoals -_id");
    const result = await usersService.getGoalsFromIds(createdGoals);

    res.json({ result });
  } catch (error) {
    next(error);
  }
};
