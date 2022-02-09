const mongoose = require("mongoose");

const TodoSchema = new mongoose.Schema({
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

module.exports = mongoose.model("Todo", TodoSchema);
