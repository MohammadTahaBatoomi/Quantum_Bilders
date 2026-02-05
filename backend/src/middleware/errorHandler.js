"use strict";

const { AppError } = require("../utils/AppError");

const errorHandler = (err, req, res, next) => {
  const error = err instanceof AppError
    ? err
    : new AppError("Unexpected error", 500, "INTERNAL_ERROR");

  res.status(error.statusCode).json({
    success: false,
    error: {
      code: error.code,
      message: error.message,
      details: error.details,
    },
  });
};

module.exports = { errorHandler };
