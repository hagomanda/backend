const User = require("../../models/User");
const MainGoal = require("../../models/MainGoal");

exports.signup = async userData => {
  const { email, displayName, profile } = userData;

  await User.create({
    email,
    displayName,
    profile,
    createdGoals: [],
    createdTodoIds: [],
    token: null,
  });
};

exports.getGoalsFromIds = async ids => {
  try {
    const results = await MainGoal.find(
      {
        _id: {
          $in: ids,
        },
      },
      {
        title: 1,
      },
    ).exec();
    return results;
  } catch (error) {
    return error;
  }
};
