const mongoose = require("mongoose");
const MainGoal = require("../../models/MainGoal");

exports.getChatsFromGoalId = async id => {
  const result = await MainGoal.findById(id, "messages").lean();
  return result.messages;
};

exports.sendMessage = async (
  mainGoalId,
  userId,
  message,
  createdAt,
  profile,
  displayName,
) => {
  return await MainGoal.findByIdAndUpdate(mainGoalId, {
    $push: {
      messages: {
        userId,
        message,
        createdAt,
        profile,
        displayName,
      },
    },
  });
};
