const goalsService = require("../../services/goals.service");

exports.getOne = async (req, res, next) => {
  const { id } = req.params;
  const result = await goalsService.getDetail(id);

  if (!result) {
    return res.json({
      result: "error",
      error: {
        message: "Not Found",
        code: 404,
      },
    });
  }

  if (result.error) {
    return next(result.error);
  }

  const { title, subGoals, level, users, messages } = result;

  res.json({
    result: {
      mainGoal: {
        title,
        subGoals,
        level,
        users,
        messages,
      },
    },
  });
};
