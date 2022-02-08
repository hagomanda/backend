const usersService = require("../../services/users.service");

exports.create = async (req, res, next) => {
  try {
    const result = await usersService.signup(req.body.user);

    res.json({
      result: "ok",
    });
  } catch (error) {
    next(error);
  }
};

exports.getGoals = async (req, res, next) => {
  const { createdGoals } = req.app.locals.authResult;
  const result = await usersService.getGoalsFromIds(createdGoals);

  if (result?.error) {
    return next(result.error);
  }

  res.json({ result });
};
