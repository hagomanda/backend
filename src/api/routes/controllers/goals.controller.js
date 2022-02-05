const goalsService = require("../../services/goals.service");

exports.getOne = async (req, res, next) => {
  const { id } = req.params;
  const result = await goalsService.getDetail(id);

  if (!result || result.error) {
    return res.json({
      result: "error",
      error: {
        message: "Invalid Goal Id",
        code: 400,
      },
    });
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
