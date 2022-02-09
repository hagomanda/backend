const mongoose = require("mongoose");
const MainGoal = require("../../models/MainGoal");
const User = require("../../models/User");
const Todo = require("../../models/Todo");

exports.getDetail = async id => {
  const result = await MainGoal.findById(id).lean();
  return result;
};

exports.create = async userId => {
  const mainGoalId = mongoose.Types.ObjectId();

  const mainGoal = await MainGoal.create({
    _id: mainGoalId,
    createdBy: userId,
    users: [userId],
  });

  const todosArray = [];

  mainGoal.subGoals.forEach(subGoal => {
    for (let i = 0; i < 8; i++) {
      const todoId = mongoose.Types.ObjectId();

      Todo.create({ _id: todoId });
      subGoal.todos.push(todoId);
      todosArray.push(todoId);
    }
  });

  await mainGoal.save();

  await User.findByIdAndUpdate(userId, {

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

exports.modifyMainGoal = async (mainGoalId, title) => {
  return await MainGoal.findByIdAndUpdate(mainGoalId, {
    $set: { title },
  }).exec();
};

exports.modifySubGoal = async (subGoal, subGoalId, mainGoalId) => {
  const { title, todos } = subGoal;
  const mainGoal = await MainGoal.findById(mainGoalId).lean();

  mainGoal.subGoals.forEach(subGoal => {
    if (subGoalId === String(subGoal._id)) {
      subGoal.title = title;
      subGoal.todos = todos;
    }
  });

  return await mainGoal.save();
};
