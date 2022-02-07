const utils = require("../../../utils");
const authService = require("../../services/auth.service");
const router = require("../auth");

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

exports.logout = async (req, res, next) => {
  const result = await authService.logout(req.app.locals.authResult);

  if (result?.error) {
    return next(result.error);
  }

  delete req.headers;

  res.json({
    result: "ok",
  });
};
