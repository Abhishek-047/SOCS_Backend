const { StatusCodes } = require('http-status-codes');

const authService = require('../services/authService');
const pickRequestMeta = require('../utils/pickRequestMeta');

const register = async (req, res) => {
  const { body } = req.validated;
  const result = await authService.register({
    ...body,
    requestMeta: pickRequestMeta(req)
  });

  res.status(StatusCodes.CREATED).json({
    success: true,
    message: 'User registered successfully',
    data: result
  });
};

const login = async (req, res) => {
  const { body } = req.validated;
  const result = await authService.login({
    ...body,
    requestMeta: pickRequestMeta(req)
  });

  res.status(StatusCodes.OK).json({
    success: true,
    message: 'Login successful',
    data: result
  });
};

const getMe = async (req, res) => {
  res.status(StatusCodes.OK).json({
    success: true,
    data: {
      user: req.user
    }
  });
};

module.exports = {
  register,
  login,
  getMe
};
