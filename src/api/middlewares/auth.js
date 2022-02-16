const utils = require("../../utils/utils");
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
    const user = await authService.checkUser(decodedEmail);

    if (decodedEmail.message) {
      return res.json({
        isSuccess: false,
      });
    }

    if (!user) {
      res.status(404);
      return res.json({
        result: "error",
        message: "Not Found",
      });
    }

    res.locals.user = user;

    next();
  } catch (error) {
    next(error);
  }
};
