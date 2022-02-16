const mongoose = require("mongoose");
const { Schema } = mongoose;

const SubGoalSchema = new mongoose.Schema({
  title: {
    type: String,
    default: "",
  },
  todos: {
    type: [Schema.Types.ObjectId],
    ref: "Todo",
  },
  level: {
    type: Number,
    default: 0,
  },
});

const MessagesSchema = new mongoose.Schema({
  userId: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  message: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    required: true,
  },
  profile: {
    type: String,
    required: true,
  },
  displayName: {
    type: String,
    required: true,
  },
});

const MainGoalSchema = new mongoose.Schema({
  title: {
    type: String,
    default: "",
  },
  createdBy: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  subGoals: {
    type: [SubGoalSchema],
    default: Array.from(Array(8), () => new Object()),
  },
  users: {
    type: [Schema.Types.ObjectId],
    ref: "User",
    validate: [
      minLength,
      "프로젝트 참여 유저는 작성자를 포함하여 최소 1명 이상이어야 합니다.",
    ],
  },
  messages: [MessagesSchema],
  level: {
    type: Number,
    default: 0,
  },
});

function minLength(value) {
  return value.length >= 1;
}

module.exports = mongoose.model("MainGoal", MainGoalSchema);
