const utils = require("../../utils");
const authService = require("../services/auth.service");

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
      res.status(404);
      return res.json({
        result: "error",
        message: "Not Found",
      });
    }

    req.app.locals.userId = userId;

    next();
  } catch (error) {
    next(error);
  }
};
