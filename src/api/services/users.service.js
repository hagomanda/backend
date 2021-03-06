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

exports.getGoalsFromGoalIds = async ids => {
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

exports.getTodosFromUserId = async (id, date, days) => {
  const todos = {};
  const { createdTodos } = await User.findById(
    id,
    "createdTodos -_id",
  ).populate("createdTodos");

  for (let i = 0; i < days; i++) {
    const currentDate = format(add(date, { days: i }), "yyyy-MM-dd");
    const todosInDate = createdTodos.filter(todo => {
      return todo.addedInCalendar.has(currentDate);
    });

    if (todosInDate.length === 0) {
      continue;
    }
    const revisedTodosInDate = todosInDate.map(todo => {
      const { _id, title, addedInCalendar, level } = todo;
      const { isComplete, memo } = addedInCalendar.get(currentDate);
      return {
        _id,
        title,
        isComplete,
        memo,
        level,
      };
    });

    todos[currentDate] = revisedTodosInDate;
  }

  return todos;
};

exports.findUserByEmail = async userEmail => {
  const user = await User.findOne({ email: userEmail }).lean();

  if (!user) {
    return false;
  }

  const { email, displayName, profile } = user;
  return { email, displayName, profile };
};
