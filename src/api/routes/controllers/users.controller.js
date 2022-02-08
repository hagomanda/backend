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
    const { createdGoals } = req.app.locals.authResult;
    const result = await usersService.getGoalsFromIds(createdGoals);

    res.json({ result });
  } catch (error) {
    next(error);
  }
};
