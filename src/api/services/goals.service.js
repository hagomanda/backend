const MainGoal = require("../../models/MainGoal");

exports.getDetail = async id => {
  try {
    const result = await MainGoal.findById(id);
    return result;
  } catch (error) {
    return {
      result: "error",
      error: {
        message: "Internal Error",
        code: 500,
      },
    };
  }
};
