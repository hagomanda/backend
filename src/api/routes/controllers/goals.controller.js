const {
  INVAILD_USER,
  INVAILD_GOAL,
  DUPLICATE_USER,
} = require("../../../utils/constants");
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
    const { title } = req.body;
    const result = await goalsService.create(res.locals.user, title);
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
    const { _id: userId } = res.locals.user;
    const result = await goalsService.getSharedUsers(goalId);

    if (!result) {
      res.status(404);
      return res.json({
        result: "error",
        message: "Not Found",
      });
    }

    if (userId.toString() === result.createdBy.toString()) {
      await goalsService.deleteAll(goalId, result.users);
    } else {
      await goalsService.deleteShared(goalId, userId);
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

    const { _id, subGoals, level, users, messages } = result;

    res.json({
      result: "ok",
      data: {
        _id,
        title,
        subGoals,
        level,
        users,
        messages,
      },
    });
  } catch (error) {
    next(error);
  }
};

exports.modifySubGoal = async (req, res, next) => {
  try {
    const subGoalId = req.params.id;
    const { mainGoalId, title: modifiedTitle } = req.body;
    const result = await goalsService.modifySubGoal(
      modifiedTitle,
      mainGoalId,
      subGoalId,
    );

    const { _id, subGoals, level, users, messages, title } = result;

    if (!result) {
      res.status(404);
      return res.json({
        result: "error",
        message: "Not Found",
      });
    }

    res.json({
      result: "ok",
      data: {
        _id,
        title,
        subGoals,
        level,
        users,
        messages,
      },
    });
  } catch (error) {
    next(error);
  }
};

exports.share = async (req, res, next) => {
  try {
    const goalId = req.params.id;
    const { email } = req.body;
    const result = await goalsService.share(goalId, email);

    if (result.isSuccess) {
      return res.json({
        result: "ok",
      });
    }

    switch (result.type) {
      case "INVAILD_USER":
        res.status(404);
        return res.json({
          result: "false",
          message: INVAILD_USER,
        });

      case "INVAILD_GOAL":
        res.status(404);
        return res.json({
          result: "false",
          message: INVAILD_GOAL,
        });

      case "DUPLICATE_USER":
        res.status(400);
        return res.json({
          result: "false",
          message: DUPLICATE_USER,
        });
    }
  } catch (error) {
    next(error);
  }
};
