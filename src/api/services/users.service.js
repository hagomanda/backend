const { add, format } = require("date-fns");

const User = require("../../models/User");
const MainGoal = require("../../models/MainGoal");

exports.signup = async userData => {
  const { email, displayName, profile } = userData;

  await User.create({
    email,
    displayName,
    profile,
    createdGoals: [],
    createdTodoIds: [],
    token: null,
  });
};

exports.getGoalsFromIds = async ids => {
  try {
    const results = await MainGoal.find(
      {
        _id: {
          $in: ids,
        },
      },
      {
        title: 1,
      },
    ).exec();
    return results;
  } catch (error) {
    return error;
  }
};

exports.getTodosFromIds = async (id, date, days) => {
  const todos = {};

  const { createdTodos } = await User.findById(
    "6205d6229f17beadd1cdec65",
    "createdTodos -_id",
  ).populate("createdTodos");

  for (let i = 0; i <= days; i++) {
    const currentDate = format(add(date, { days: i }), "yyyy-MM-dd");
    const todosInDate = createdTodos.filter(todo => {
      return todo.addedInCalendar.has(currentDate);
    });

    if (todosInDate.length === 0) {
      continue;
    }

    todos[currentDate] = todosInDate;
  }
  console.log(todos);
  return todos;
};
