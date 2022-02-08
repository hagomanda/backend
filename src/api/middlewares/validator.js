const mongoose = require("mongoose");
const Joi = require("joi");

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

const dateValidation = Joi.date().required();

const repetitoinSchema = Joi.object({
  isRepeat: Joi.boolean().required(),
  type: Joi.string().default("EVERY_DAY").required(),
  week: Joi.number().min(1).max(3).required(),
}).required();

exports.verifyParams = verifyParams;

exports.verifyDateRepetitoin = async (req, res, next) => {
  try {
    const { date, repetition } = req.body;

    await dateValidation.validateAsync(date);
    await repetitoinSchema.validateAsync(repetition);
    next();
  } catch (error) {
    error.status = 400;
    next(error);
  }
};
