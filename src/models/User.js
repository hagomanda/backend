const mongoose = require("mongoose");
const { Schema } = mongoose;
const { isEmail, isURL } = require("validator");

const UserSchema = new Schema({
  email: {
    type: String,
    unique: true,
    required: true,
    validate: {
      validator: isEmail,
      message: "이메일 형식이 틀렸습니다.",
    },
  },
  displayName: String,
  profile: {
    type: String,
    validate: {
      validator: isURL,
      message: "프로필 사진 형식이 틀렸습니다.",
    },
  },
  createdGoals: [
    {
      type: Schema.Types.ObjectId,
      ref: "MainGoal",
    },
  ],
  createdtodoIds: [
    {
      type: Schema.Types.ObjectId,
      ref: "Todo",
    },
  ],
  token: String,
});

module.exports = mongoose.model("User", UserSchema);
