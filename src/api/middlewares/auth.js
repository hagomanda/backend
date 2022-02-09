const utils = require("../../utils");

exports.authenticateUser = async (req, res, next) => {
  try {
    const accessToken = req.headers.authorization.split(" ")[1];

    if (!accessToken) {
      return res.json({
        isSuccess: false,
      });
    }

    const decodedEmail = await utils.decodeToken(accessToken);
    const userId = await authService.checkUser(decodedEmail)._id;

    if (decodedEmail.message) {
      return res.json({
        isSuccess: false,
      });
    }

    if (!userId) {
      return res.json({
        result: "error",
        error: {
          message: "Not Found",
          code: 404,
        },
      });
    }

    req.app.locals.userId = userId;
    next();
  } catch (error) {
    next(error);
  }
};
