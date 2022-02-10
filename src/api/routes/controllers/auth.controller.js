const utils = require("../../../utils");
const authService = require("../../services/auth.service");

exports.logout = async (req, res, next) => {
  try {
    await authService.logout(req.app.locals.user);

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
    const user = await authService.checkUser(requestEmail);

    if (!user) {
      return res.json({
        isSuccess: false,
      });
    }

    const { email, displayName, profile } = user;
    const { newAccessToken, newRefreshToken } = utils.createToken(email);

    await authService.saveToken(email, newRefreshToken);
    res.cookie("refreshToken", newRefreshToken, { httpOnly: true });

    res.json({
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
    const user = await authService.checkUser(decodedEmail);

    if (!user) {
      return res.json({
        isSuccess: false,
      });
    }

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

    res.json({
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
