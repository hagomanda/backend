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
    const result = await goalsService.create(req.app.locals.user);
    const mainGoalId = result;

    if (!result) {
      res.status(404);
      return res.json({
        result: "error",
        message: "Not Found",
      });
    }

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
    const userId = req.app.locals.userId;
    const result = await goalsService.delete(goalId, userId);

    if (!result) {
      res.status(404);
      return res.json({
        result: "error",
        message: "Not Found",
      });
    }

    res.json({
      result: "ok",
    });
  } catch (error) {
    next(error);
  }
};

exports.modifyMainGoal = async (req, res, next) => {
  try {
    const mainGoalId = req.params.id;
    const { title } = req.body;
    const result = await goalsService.modifyMainGoal(mainGoalId, title);

    if (!result) {
      res.status(404);
      return res.json({
        result: "error",
        message: "Not Found",
      });
    }

    res.json({
      result: "ok",
    });
  } catch (error) {
    next(error);
  }
};

exports.modifySubGoal = async (req, res, next) => {
  try {
    const subGoalId = req.params.id;
    const { mainGoalId, subGoal } = req.body;
    const result = await goalsService.modifySubGoal(
      subGoal,
      subGoalId,
      mainGoalId,
    );

    if (!result) {
      res.status(404);
      return res.json({
        result: "error",
        message: "Not Found",
      });
    }

    res.json({
      result: "ok",
    });
  } catch (error) {
    next(error);
  }
};
