const authService = require("../../services/auth.service");
const utils = require("../../../utils");
const User = require("../../../models/User");

exports.logout = async (req, res, next) => {
  try {
    await authService.logout(req.app.locals.userId);

    delete req.headers.authorization;
    res.clearCookie("refreshToken");

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
    const userId = await authService.checkUser(requestEmail)._id;

    if (!userId) {
      return res.json({
        isSuccess: false,
      });
    }

    const { email, displayName, profile } = user;
    const { newAccessToken, newRefreshToken } = utils.createToken(email);

    await authService.saveToken(email, newRefreshToken);
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

    const decodedEmail = await utils.decodeToken(refreshToken);
    const userId = await authService.checkUser(decodedEmail);
    const user = await User.findById(userId);

    if (decodedEmail.message) {
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
