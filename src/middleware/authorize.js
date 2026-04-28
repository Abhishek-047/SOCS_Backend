const { StatusCodes } = require('http-status-codes');

module.exports = (...allowedRoles) => (req, res, next) => {
  if (!req.user || !allowedRoles.includes(req.user.role)) {
    return res.status(StatusCodes.FORBIDDEN).json({
      success: false,
      message: 'You do not have permission to perform this action'
    });
  }

  return next();
};
