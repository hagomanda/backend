const todosService = require("../../services/todos.service");

exports.addTodo = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { date, repetition } = req.body;
    let addResult = null;

    if (repetition.isRepeat) {
      const { type, duration } = repetition;

      addResult = await todosService.repeatTodo(
        id,
        new Date(date),
        type,
        duration,
      );
    } else {
      addResult = await todosService.addDateToTodo(id, new Date(date));
    }

    if (!addResult.isSuccess) {
      res.status(400);
      return res.json({
        result: "false",
        message: `${addResult.date}에 이미 같은 Todo가 있습니다.`,
      });
    }

    res.json({
      result: "ok",
    });
  } catch (error) {
    next(error);
  }
};

exports.saveTodoMemo = async (req, res, next) => {
  const { date, memo } = req.body;
  const { id } = req.params;

  try {
    const result = await todosService.saveTodoMemo(id, date, memo);

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

exports.deleteCalendarTodo = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { date } = req.body;

    await todosService.deleteCalendarTodo(id, new Date(date));

    res.json({
      result: "ok",
    });
  } catch (error) {
    next(error);
  }
};

exports.modifyTodoCheckButton = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { isComplete, date } = req.body;

    const result = await todosService.modifyTodoCheckButton(
      id,
      isComplete,
      date,
    );

    if (!result.isSuccess) {
      res.status(404);
      return res.json({
        result: "error",
        message: "존재하지 않는 Todo 입니다",
      });
    }

    res.json({
      result: "ok",
    });
  } catch (error) {
    next(error);
  }
};

exports.modifyTodo = async (req, res, next) => {
  try {
    const todoId = req.params.id;
    const { mainGoalId, title: modifiedTitle } = req.body;
    const result = await todosService.modifyTodo(
      todoId,
      modifiedTitle,
      mainGoalId,
    );

    if (!result) {
      res.status(404);
      return res.json({
        result: "error",
        message: "Not Found",
      });
    }

    const { _id, title, subGoals, level, users, messages } = result;

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
