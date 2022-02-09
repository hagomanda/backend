const User = require("../../models/User");

exports.checkUser = async email => {
  const user = await User.findOne({ email }).lean();
  return user;
};

exports.saveToken = async (email, token) => {
  await User.findOneAndUpdate({ email }, { token }).exec();
};

exports.logout = async userId => {
  await User.findByIdAndUpdate(userId, {
    token: null,
  }).exec();
};
