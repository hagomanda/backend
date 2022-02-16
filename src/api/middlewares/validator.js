const mongoose = require("mongoose");
const Joi = require("joi");
const jwt = require("jsonwebtoken");

exports.verifyParams = (req, res, next) => {
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
const repetitionSchema = Joi.object()
  .keys({
    isRepeat: Joi.boolean().required(),
    type: Joi.string().default("EVERY_DAY").required(),
    duration: Joi.number().min(1).max(3).required(),
  })
  .required();
const todoMemoSchema = Joi.string().max(200).required();
const emailSchema = Joi.string()
  .email({ minDomainSegments: 2, tlds: { allow: ["com", "net"] } })
  .required();

exports.verifyDateRepetition = async (req, res, next) => {
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

exports.verifyChatToken = (req, res, next) => {
  const token = req.query?.nextPageToken;

  if (!token || !token.length) {
    res.locals.startIndex = undefined;
    return next();
  }

  const decodedToken = jwt.verify(
    token,
    process.env.CHAT_QUERY_SECRET_KEY,
    (error, decode) => {
      if (error) {
        return error;
      }

      return decode.payload;
    },
  );

  if (decodedToken.message) {
    return next(new Error("Invalid Token"));
  }

  res.locals.lastIndex = decodedToken.lastIndex;
  return;
};

exports.verifyMessage = (req, res, next) => {
  const { body } = req;
  const schema = Joi.string().min(1).max(1000).required();

  try {
    schema.validate(body);
    next();
  } catch (error) {
    error.status = 400;
    next(error);
  }
};
