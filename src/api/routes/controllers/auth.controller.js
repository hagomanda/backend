const utils = require("../../../utils");

exports.authenticateUser = async (req, res, next) => {
  const accessToken = req.headers.authorization;

  if (!accessToken) {
    return res.json({
      isSuccess: false,
    });
  }

  const decode = utils.authenticateToken(accessToken);

  if (!decode) {
    return res.json({
      isSuccess: false,
    });
  }

  res.json({
    isSuccess: true,
  });
};
