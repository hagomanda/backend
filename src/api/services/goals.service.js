const mongoose = require("mongoose");
const MainGoal = require("../../models/MainGoal");
const User = require("../../models/User");

exports.getDetail = async id => {
  const result = await MainGoal.findById(id).lean();
  return result;
};

exports.create = async user => {
  const { _id } = user;
  const mainGoalId = mongoose.Types.ObjectId();

  await MainGoal.create({
    _id: mainGoalId,
    createdBy: _id,
    users: [_id],
  });

  await User.findByIdAndUpdate(_id, {
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
