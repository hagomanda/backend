const mongoose = require("mongoose");
const MainGoal = require("../../models/MainGoal");

exports.getChatsFromGoalId = async id => {
  const result = await MainGoal.findById(id, "messages").lean();
  return result.messages;
};
