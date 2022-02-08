const goalsService = require("../../services/goals.service");

exports.getOne = async (req, res, next) => {
  try {
    const { id } = req.params;
    const result = await goalsService.getDetail(id);

    if (!result) {
      res.status(404);
      return res.json({
        result: "error",
        message: "Not Found",
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
  } catch (error) {
    next(error);
  }
};

exports.create = async (req, res, next) => {
  try {
    const result = await goalsService.create(req.app.locals.authResult);
    const mainGoalId = result;

    res.json({
      result: {
        mainGoalId,
      },
    });
  } catch (error) {
    next(error);
  }
};

exports.delete = async (req, res, next) => {
  try {
    const goalId = req.params.id;
    const userId = req.app.locals.authResult["_id"];
    const result = await goalsService.delete(goalId, userId);

    if (!result) {
      return res.json({
        result: "error",
        error: {
          message: "Not Found",
          code: 404,
        },
      });
    }

    res.json({
      result: "ok",
    });
  } catch (error) {
    next(error);
  }
};
