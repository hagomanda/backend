const { add, format } = require("date-fns");

const Todo = require("../../models/Todo");

exports.addDateToTodo = async (id, date) => {
  const todo = await Todo.findById(id).exec();

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

exports.repeatTodo = async (id, date, type, week) => {
  switch (type) {
    case "EVERY_DAY":
      for (let i = 0; i < 7 * week; i++) {
        const currentDate = format(
          add(new Date(date), { days: i }),
          "yyyy-MM-dd",
        );
        const result = await exports.addDateToTodo(id, currentDate);

        if (!result.isSuccess) {
          return result;
        }
      }

      break;

    case "EVERY_WEEK":
      for (let i = 0; i < week; i++) {
        const currentDate = format(
          add(new Date(date), { days: i * 7 }),
          "yyyy-MM-dd",
        );
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
  const todo = await Todo.findById(id);

  todo.addedInCalendar.set(date, { memo });
  return await todo.save();
};
