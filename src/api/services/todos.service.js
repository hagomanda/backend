const { add, format } = require("date-fns");
const { getDetail } = require("./goals.service");
const Todo = require("../../models/Todo");

exports.addDateToTodo = async (id, dateObject) => {
  const todo = await Todo.findById(id).exec();
  const date = format(dateObject, "yyyy-MM-dd");

  if (todo.addedInCalendar.has(date)) {
    return {
      isSuccess: false,
      date,
    };
  }

  todo.addedInCalendar.set(date, {});
  await todo.save();
  return { isSuccess: true };
};

exports.repeatTodo = async (id, date, type, duration) => {
  switch (type) {
    case "EVERY_DAY":
      for (let i = 0; i < 7 * duration; i++) {
        const currentDate = add(date, { days: i });
        const result = await exports.addDateToTodo(id, currentDate);

        if (!result.isSuccess) {
          return result;
        }
      }

      break;

    case "EVERY_WEEK":
      for (let i = 0; i < duration; i++) {
        const currentDate = add(date, { days: i * 7 });
        const result = await exports.addDateToTodo(id, currentDate);

        if (!result.isSuccess) {
          return result;
        }
      }

      break;
  }

  return { isSuccess: true };
};

exports.saveTodoMemo = async (id, date, memo) => {
  const todo = await Todo.findById(id).exec();

  todo.addedInCalendar.set(date, { memo });
  return await todo.save();
};

exports.deleteCalendarTodo = async (todoId, dateObject) => {
  const todo = await Todo.findById(todoId);
  const date = format(dateObject, "yyyy-MM-dd");

  todo.addedInCalendar.delete(date);
  await todo.save();
};

exports.modifyTodoCheckButton = async (id, isComplete, date) => {
  const todo = await Todo.findById(id).exec();

  if (!todo || !todo.addedInCalendar.has(date)) {
    return {
      isSuccess: false,
    };
  }

  todo.addedInCalendar.get(date).isComplete = isComplete;

  if (isComplete) {
    todo.experiencePoint++;
    todo.experiencePoint >= todo.level ** 1.2 && todo.level++;
  } else {
    todo.experiencePoint--;
    todo.experiencePoint < (todo.level - 1) ** 1.2 && todo.level--;
    todo.experiencePoint === 0 && todo.level--;
  }

  await todo.save();
  return { isSuccess: true };
};

exports.modifyTodo = async (todoId, title, mainGoalId) => {
  await Todo.findByIdAndUpdate(todoId, {
    $set: { title },
  }).exec();

  return await getDetail(mainGoalId);
};
