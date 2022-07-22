const { CustomAPIError } = require("../errors");
const { StatusCodes } = require("http-status-codes");

const errorHandlerMiddleware = (err, req, res, next) => {
  let customError = {
    statusCode: err.statusCode || StatusCodes.INTERNAL_SERVER_ERROR,
    msg: err.message || "Something went wrong, please try again later",
  };

  if (err instanceof CustomAPIError) {
    return res
      .status(err.statusCode)
      .json({ msg: err.message, errorCode: err.statusCode });
  }
  
  if (err.code && err.code === 11000) {
    customError.msg = `Duplicate value entered for ${Object.keys(
      err.keyValue
    )} field, please choose another value`;
    customError.statusCode = 400;
  }

  if (err.name === "ValidationError") {
    customError.msg = Object.values(err.errors)
      .map((item) => item.message)
      .join(", ");
    customError.statusCode = 400;
  }

  if (err.name === "CastError") {
    customError.msg = `No item found with id : ${err.values}`;
    customError.statusCode = 404;
  }

  if (err.name === "JsonWebTokenError") {
    customError.msg = "Invalid token";
    customError.statusCode = 401;
  }

  if (err.name === "TokenExpiredError") {
    customError.msg = "Token expired";
    customError.statusCode = 401;
  }

  return res
    .status(customError.statusCode)
    .json({ msg: customError.msg, errorCode: customError.statusCode });
};

module.exports = errorHandlerMiddleware;
