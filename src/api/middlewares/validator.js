const mongoose = require("mongoose");

const verifyParams = (req, res, next) => {
  const { id } = req.params;

  if (!mongoose.isValidObjectId(id)) {
    res.status(400);
    return res.json({
      result: "error",
      message: "Invalid Id",
    });
  }

  next();
};

exports.verifyParams = verifyParams;
