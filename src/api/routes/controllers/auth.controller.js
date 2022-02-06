const utils = require("../../../utils");

exports.authenticateUser = async (req, res, next) => {
  try {
    const accessToken = req.headers.authorization;

    if (!accessToken) {
      return res.json({
        isSuccess: false,
      });
    }

    const authResult = utils.authenticateToken(accessToken);

    if (authResult.message) {
      return res.json({
        isSuccess: false,
      });
    }

    res.json({
      isSuccess: true,
    });
  } catch (error) {
    next(error);
  }
};
