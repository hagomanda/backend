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

exports.verifyParams = verifyParams;

const dateValidation = Joi.date().required();
const repetitionSchema = Joi.object()
  .keys({
    isRepeat: Joi.boolean().required(),
    type: Joi.string().default("EVERY_DAY").required(),
    week: Joi.number().min(1).max(3).required(),
  })
  .required();
const todoMemoSchema = Joi.string().max(200).required();
const emailSchema = Joi.string()
  .email({ minDomainSegments: 2, tlds: { allow: ["com", "net"] } })
  .required();

exports.verifyDaterepetition = async (req, res, next) => {
  try {
    const { date, repetition } = req.body;

    await dateValidation.validateAsync(date);
    await repetitionSchema.validateAsync(repetition);
    next();
  } catch (error) {
    error.status = 400;
    next(error);
  }
};

exports.verifyTodoMemo = async (req, res, next) => {
  try {
    const { memo, date } = req.body;

    await dateValidation.validateAsync(date);
    await todoMemoSchema.validateAsync(memo);
    next();
  } catch (error) {
    error.status = 400;
    next(error);
  }
};

exports.verifyEmail = async (req, res, next) => {
  try {
    const { email } = req.body;

    await emailSchema.validateAsync(email);
    next();
  } catch (error) {
    error.status = 400;
    next(error);
  }
};
