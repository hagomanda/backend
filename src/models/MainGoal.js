const mongoose = require("mongoose");
const { Schema } = mongoose;

const TodosSchema = new mongoose.Schema({
  title: {
    type: String,
    default: "",
  },
  addedInCalender: {
    type: Map,
    of: new mongoose.Schema(
      {
        isComplete: { type: Boolean, default: false },
        memo: { type: String, default: "" },
      },
      {
        _id: false,
      },
    ),
  },
  level: {
    type: Number,
    default: 0,
  },
  experiencePoint: {
    type: Number,
    default: 0,
  },
});

const SubGoalSchema = new mongoose.Schema({
  title: {
    type: String,
    default: "",
  },
  todos: {
    type: [TodosSchema],
    default: Array(8).fill(TodosSchema),
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
    default: Array(8).fill(SubGoalSchema),
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
