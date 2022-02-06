const usersService = require("../../services/users.service");

exports.create = async (req, res, next) => {
  const result = await usersService.signup(req.body.user);

  if (result.message) {
    return res.json({
      result: "error",
      error: {
        message: "Internal Error",
        code: 500,
      },
    });
  }

  return res.json({
    result: "ok",
  });
};
