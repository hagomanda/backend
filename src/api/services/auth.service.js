const User = require("../../models/User");

exports.checkUser = async email => {
  const user = await User.findOne({ email }).lean();
  return user;
};

exports.saveToken = async (email, token) => {
  await User.findOneAndUpdate({ email }, { token }).exec();
};

exports.logout = async user => {
  try {
    const { _id } = user;

    await User.findByIdAndUpdate(_id, {
      token: null,
    }).exec();
  } catch (error) {
    return error;
  }
};
