const mongoose = require("mongoose");
const MainGoal = require("../../models/MainGoal");
const User = require("../../models/User");

exports.getDetail = async id => {
  const result = await MainGoal.findById(id).lean();
  return result;
};

exports.create = async userId => {
  const mainGoalId = mongoose.Types.ObjectId();

  await MainGoal.create({
    _id: mainGoalId,
    createdBy: userId,
    users: [userId],
  });

  await User.findByIdAndUpdate(userId, {
    $push: { createdGoals: mainGoalId },
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
  const mainGoal = await MainGoal.findById(mainGoalId).exec();

  mainGoal.subGoals.forEach(subGoal => {
    const subGoalObjectId = new mongoose.Types.ObjectId(subGoalId);

    if (subGoalObjectId.equals(subGoal._id)) {
      subGoal.title = title;
      subGoal.todos = todos;
    }
  });

  return await mainGoal.save();
};
