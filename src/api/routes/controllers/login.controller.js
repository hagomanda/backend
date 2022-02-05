const loginService = require("../../services/login.service");
const utils = require("../../../utils");

exports.login = async (req, res, next) => {
  try {
    const requestEmail = req.body.email;
    const user = await loginService.checkUser(requestEmail);

    if (!user) {
      return res.json({
        isSuccess: false,
      });
    }

    const { email, displayName, profile } = user;
    const { newAccessToken, newRefreshToken } = utils.createToken(email);

    loginService.saveToken(email, newRefreshToken);
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

    const decodedEmail = utils.authenticateToken(refreshToken)?.payload;

    if (!decodedEmail) {
      return res.json({
        isSuccess: false,
      });
    }

    const user = await loginService.checkUser(decodedEmail);

    if (refreshToken !== user.token) {
      return res.json({
        isSuccess: false,
      });
    }

    const { newAccessToken, newRefreshToken } = utils.createToken(decodedEmail);
    loginService.saveToken(decodedEmail, newRefreshToken);
    res.cookie("refreshToken", newRefreshToken, { httpOnly: true });

    return res.json({
      user,
      newAccessToken,
      isSuccess: true,
    });
  } catch (error) {
    next(error);
  }
};
