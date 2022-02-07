const mongoose = require("mongoose");
const MainGoal = require("../../models/MainGoal");
const User = require("../../models/User");

exports.getDetail = async id => {
  try {
    const result = await MainGoal.findById(id).lean();
    return result;
  } catch (error) {
    return {
      result: "error",
      error: {
        message: "Internal Error",
        code: 500,
      },
    };
  }
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
