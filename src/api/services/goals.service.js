const mongoose = require("mongoose");

const MainGoal = require("../../models/MainGoal");
const User = require("../../models/User");
const Todo = require("../../models/Todo");

exports.getDetail = async id => {
  const result = await MainGoal.findById(id)
    .lean()
    .populate("subGoals.todos", "title");
  return result;
};

exports.create = async user => {
  const mainGoalId = mongoose.Types.ObjectId();
  const { _id } = user;

  const mainGoal = await MainGoal.create({
    _id: mainGoalId,
    createdBy: _id,
    users: [_id],
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

  await User.findByIdAndUpdate(_id, {
    $push: {
      createdGoals: mainGoalId,
      createdTodos: { $each: todosArray },
    },
    $concatArrays: {},
  }).exec();

  return mainGoalId;
};

exports.getSharedUsers = async goalId => {
  const res = await MainGoal.findById(goalId, "createdBy users").lean();
  return res;
};

exports.delete = async (goalId, userId) => {
  await MainGoal.findByIdAndDelete(goalId).exec();
  await User.findByIdAndUpdate(userId, {
    $pull: { createdGoals: goalId },
  }).exec();
};

exports.deleteShared = async (goalId, userId) => {
  await MainGoal.findByIdAndUpdate(goalId, {
    $pull: { users: userId },
  }).exec();

  await User.findByIdAndUpdate(userId, {
    $pull: { createdGoals: goalId },
  }).exec();
};

exports.deleteAll = async (goalId, users) => {
  const { subGoals } = await MainGoal.findById(goalId, "subGoals.todos");

  const todos = [];
  subGoals.forEach(subGoal => {
    todos.push(...subGoal.todos);
  });

  await Todo.deleteMany({ _id: { $in: todos } }).exec();
  await User.updateMany(
    {
      _id: { $in: users },
    },
    {
      $pull: { createdGoals: goalId },
    },
  ).exec();
  await MainGoal.findByIdAndDelete(goalId).exec();
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

exports.share = async (goalId, email) => {
  const user = await User.findOne({ email });
  const mainGoal = await MainGoal.findById(goalId);
  const isShareUser = mainGoal.users.includes(user._id);

  if (!user) {
    return {
      isSuccess: false,
      type: "INVAILD_USER",
    };
  }

  if (!mainGoal) {
    return {
      isSuccess: false,
      type: "INVAILD_GOAL",
    };
  }

  if (isShareUser) {
    return {
      isSuccess: false,
      type: "DUPLICATE_USER",
    };
  }

  user.createdGoals.push(mainGoal._id);
  mainGoal.users.push(user._id);
  await user.save();
  await mainGoal.save();

  return { isSuccess: true };
};
