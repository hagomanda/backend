const mongoose = require("mongoose");

const verifyParams = (req, res, next) => {
  const { id } = req.params;

  if (!mongoose.isValidObjectId(id)) {
    return res.json({
      code: 400,
      message: "Invalid Id",
    });
  }

  next();
};

exports.verifyParams = verifyParams;
