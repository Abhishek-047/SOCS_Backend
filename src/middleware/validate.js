const { StatusCodes } = require('http-status-codes');

module.exports = (schema) => (req, res, next) => {
  const result = schema.safeParse({
    body: req.body,
    query: req.query,
    params: req.params
  });

  if (!result.success) {
    return res.status(StatusCodes.BAD_REQUEST).json({
      success: false,
      message: 'Validation failed',
      errors: result.error.flatten()
    });
  }

  req.validated = result.data;
  return next();
};
