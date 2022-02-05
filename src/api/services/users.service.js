const User = require("../../models/User");

exports.signup = async userData => {
  const { email, displayedName, profile } = userData;

  if (!email || !displayedName || !profile) {
    return new Error("이메일 또는 별명, 프로필 사진이 없습니다.");
  }

  try {
    await User.create({
      email,
      nickName: displayedName,
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
