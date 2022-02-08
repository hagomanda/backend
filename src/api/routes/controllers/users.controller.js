const usersService = require("../../services/users.service");

exports.create = async (req, res, next) => {
  const result = await usersService.signup(req.body.user);

  if (result?.error) {
    return next(result.error);
  }

  res.json({
    result: "ok",
  });
};

exports.getGoals = async (req, res, next) => {
  const { createdGoals } = req.app.locals.authResult;
  const result = await usersService.getGoalsFromIds(createdGoals);

  if (result?.error) {
    return next(result.error);
  }

  res.json({ result });
};
