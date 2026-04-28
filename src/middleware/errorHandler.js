const { StatusCodes } = require('http-status-codes');

const logger = require('../utils/logger');

module.exports = (error, req, res, next) => {
  logger.error(error.message, {
    stack: error.stack,
    path: req.originalUrl,
    method: req.method
  });

  const statusCode = error.statusCode || StatusCodes.INTERNAL_SERVER_ERROR;

  res.status(statusCode).json({
    success: false,
    message: error.message || 'Internal server error',
    ...(error.details ? { details: error.details } : {})
  });
};
