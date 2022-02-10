const todosService = require("../../services/todos.service");

exports.addTodo = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { date, repetition } = req.body;
    let addResult = null;

    if (repetition.isRepeat) {
      const { type, week } = repetition;
      addResult = await todosService.repeatTodo(id, date, type, week);
    } else {
      addResult = await todosService.addDateToTodo(id, date);
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
