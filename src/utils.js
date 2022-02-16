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

exports.decodeToken = async token => {
  return jwt.verify(
    token,
    process.env.JWT_SECRET_KEY,
    async (error, decode) => {
      if (error) {
        return error;
      }

      return decode.payload;
    },
  );
};
