const mongoose = require("mongoose");
const StatusCodes = require("http-status-codes").StatusCodes;
const { NotFoundError } = require("../errors");

const checkObjectId = (req, res, next) => {
  const { id: jobId } = req.params;
  if (!mongoose.isValidObjectId(jobId))
    throw new NotFoundError(`No job with id ${jobId}`);
  next();
};

module.exports = checkObjectId;
