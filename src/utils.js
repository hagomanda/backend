const jwt = require("jsonwebtoken");

exports.createToken = payload => {
  const newAccessToken = jwt.sign(
    {
      payload,
    },
    process.env.JWT_SECRET_KEY,
    { expiresIn: "1h" },
  );

  const newRefreshToken = jwt.sign(
    {
      payload,
    },
    process.env.JWT_SECRET_KEY,
    { expiresIn: "24h" },
  );

  return { newAccessToken, newRefreshToken };
};

exports.authenticateToken = token => {
  const decode = jwt.decode(token, process.env.JWT_SECRET_KEY);
  return decode;
};
