const User = require("../../../models/User");
const Todo = require("../../../models/Todo");
const { format, add } = require("date-fns");
const mongoose = require("mongoose");

exports.getUsersTodos = async (req, res, next) => {
  const currentSunday = new Date(req.headers.currentdate);
  const todos = {};

  for (let i = 0; i < 8; i++) {
    const date = format(add(currentSunday, { days: i }), "yyyy-MM-dd");
    const { createdTodos } = await User.findById(
      req.app.locals.authResult["_id"],
      "createdTodos -_id",
    ).populate("createdTodos");
    const todosInDate = createdTodos.filter(todo => {
      return todo.addedInCalender?.has(date);
    });

    if (todosInDate.length === 0) {
      continue;
    }

    todos[date] = todosInDate;
  }

  res.json({
    result: todos,
  });
};

// 추후 사용 예정. (test용)
// await Todo.findByIdAndUpdate(mongoose.Types.ObjectId("620350260a5bfbc71c12773f"), {
//   $set: {
//     addedInCalender : {
//       "2022-02-09": {},
//     },
//   },
// });
