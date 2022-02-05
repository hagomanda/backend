const User = require("../../models/User");

exports.checkUser = async email => {
  try {
    const user = await User.findOne({ email }).lean();
    return user;
  } catch (error) {
    throw Error(error);
  }
};

exports.saveToken = async (email, token) => {
  try {
    await User.findOneAndUpdate({ email }, { token }).exec();
  } catch (error) {
    throw Error(error);
  }
};
