const utils = require("../../../utils");

exports.authenticateUser = async (req, res, next) => {
  try {
    const accessToken = req.headers.authorization;

    if (!accessToken) {
      return res.json({
        isSuccess: false,
      });
    }

    const decode = utils.authenticateToken(accessToken);

    if (!decode) {
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
