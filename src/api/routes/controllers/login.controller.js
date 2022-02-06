const authService = require("../../services/auth.service");
const utils = require("../../../utils");

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

    const authUser = await utils.authenticateToken(refreshToken);

    if (authUser.message) {
      return res.json({
        isSuccess: false,
      });
    }

    if (refreshToken !== authUser.token) {
      return res.json({
        isSuccess: false,
      });
    }

    const { newAccessToken, newRefreshToken } = utils.createToken(
      authUser.email,
    );

    await authService.saveToken(authUser.email, newRefreshToken);
    res.cookie("refreshToken", newRefreshToken, { httpOnly: true });

    return res.json({
      authUser,
      newAccessToken,
      isSuccess: true,
    });
  } catch (error) {
    next(error);
  }
};
