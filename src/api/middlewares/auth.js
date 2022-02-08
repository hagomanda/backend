const utils = require("../../utils");

exports.authenticateUser = async (req, res, next) => {
  try {
    const accessToken = req.headers.authorization;

    if (!accessToken) {
      return res.json({
        isSuccess: false,
      });
    }

    const authResult = await utils.authenticateToken(accessToken);

    if (authResult.message) {
      return res.json({
        isSuccess: false,
      });
    }

    req.app.locals.authResult = authResult;

    next();
  } catch (error) {
    next(error);
  }
};
