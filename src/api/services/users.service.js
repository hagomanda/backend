const User = require("../../models/User");

exports.signup = async userData => {
  const { email, displayName, profile } = userData;

  if (!email || !displayName) {
    return new Error("이메일 또는 별명이 없습니다.");
  }

  try {
    await User.create({
      email,
      displayName,
      profile,
      createdGoals: [],
      createdTodoIds: [],
      token: null,
    });

    return {
      result: "ok",
    };
  } catch (error) {
    return error;
  }
};
