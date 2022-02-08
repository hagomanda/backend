const mongoose = require("mongoose");
const MainGoal = require("../../models/MainGoal");
const User = require("../../models/User");
const Todo = require("../../models/Todo");

exports.getDetail = async id => {
  const result = await MainGoal.findById(id).lean();
  return result;
};

exports.create = async user => {
  const { _id } = user;
  const mainGoalId = mongoose.Types.ObjectId();

  const mainGoal = await MainGoal.create({
    _id: mainGoalId,
    createdBy: _id,
    users: [_id],
  });

  const todosArray = [];

  mainGoal.subGoals.forEach(async subGoal => {
    for (let i = 0; i < 8; i++) {
      const todoId = mongoose.Types.ObjectId();
      Todo.create({ _id: todoId });
      subGoal.todos.push(todoId);
      todosArray.push(todoId);
    }
  });

  await mainGoal.save();

  await User.findByIdAndUpdate(_id, {
    $push: {
      createdGoals: mainGoalId,
      createdTodos: { $each: todosArray },
    },
    $concatArrays: {},
  }).exec();

  return mainGoalId;
};

exports.delete = async (goalId, userId) => {
  await MainGoal.findByIdAndDelete(goalId).exec();
  await User.findByIdAndUpdate(userId, {
    $pull: { createdGoals: goalId },
  }).exec();
};
