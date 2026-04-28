const jwt = require('jsonwebtoken');
const { StatusCodes } = require('http-status-codes');

const { env } = require('../config/env');
const userRepository = require('../repositories/userRepository');

module.exports = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(StatusCodes.UNAUTHORIZED).json({
        success: false,
        message: 'Authentication token is required'
      });
    }

    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, env.JWT_SECRET);
    const user = await userRepository.findById(decoded.userId);

    if (!user) {
      return res.status(StatusCodes.UNAUTHORIZED).json({
        success: false,
        message: 'Invalid authentication token'
      });
    }

    req.user = user;
    return next();
  } catch (error) {
    return res.status(StatusCodes.UNAUTHORIZED).json({
      success: false,
      message: 'Invalid or expired authentication token'
    });
  }
};
