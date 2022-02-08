const authService = require("../../services/auth.service");
const utils = require("../../../utils");

exports.logout = async (req, res, next) => {
  try {
    await authService.logout(req.app.locals.authResult);

    delete req.headers;

    res.json({
      result: "ok",
    });
  } catch (error) {
    next(error);
  }
};

exports.login = async (req, res, next) => {
  try {
    const requestEmail = req.body.email;
    const user = await authService.checkUser(requestEmail);

    if (!user) {
      return res.json({
        isSuccess: false,
      });
    }

    const { email, displayName, profile } = user;
    const { newAccessToken, newRefreshToken } = utils.createToken(email);

    authService.saveToken(email, newRefreshToken);
    res.cookie("refreshToken", newRefreshToken, { httpOnly: true });

    return res.json({
      email,
      displayName,
      profile,
      newAccessToken,
      isSuccess: true,
    });
  } catch (error) {
    next(error);
  }
};

exports.refreshLogin = async (req, res, next) => {
  try {
    const refreshToken = req.cookies.refreshToken;

    if (!refreshToken) {
      return res.json({
        isSuccess: false,
      });
    }

    const user = await utils.authenticateToken(refreshToken);

    if (user.message) {
      return res.json({
        isSuccess: false,
      });
    }

    if (refreshToken !== user.token) {
      return res.json({
        isSuccess: false,
      });
    }

    const { newAccessToken, newRefreshToken } = utils.createToken(user.email);

    await authService.saveToken(user.email, newRefreshToken);
    res.cookie("refreshToken", newRefreshToken, { httpOnly: true });

    const { email, displayName, profile } = user;

    return res.json({
      email,
      displayName,
      profile,
      newAccessToken,
      isSuccess: true,
    });
  } catch (error) {
    next(error);
  }
};
