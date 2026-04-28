const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { StatusCodes } = require('http-status-codes');

const { env } = require('../config/env');
const AUDIT_ACTIONS = require('../constants/auditActions');
const ROLES = require('../constants/roles');
const userRepository = require('../repositories/userRepository');
const auditLogService = require('./auditLogService');
const ApiError = require('../utils/ApiError');

const buildToken = (user) =>
  jwt.sign({ userId: user.id, role: user.role }, env.JWT_SECRET, {
    expiresIn: env.JWT_EXPIRES_IN
  });

const sanitizeUser = (user) => ({
  id: user.id,
  name: user.name,
  email: user.email,
  role: user.role,
  createdAt: user.createdAt,
  updatedAt: user.updatedAt
});

const register = async ({ name, email, password, requestMeta }) => {
  const existingUser = await userRepository.findByEmail(email);

  if (existingUser) {
    throw new ApiError(StatusCodes.CONFLICT, 'User with this email already exists');
  }

  const hashedPassword = await bcrypt.hash(password, 12);
  const user = await userRepository.create({
    name,
    email,
    password: hashedPassword,
    role: ROLES.USER
  });

  await auditLogService.log({
    userId: user.id,
    action: AUDIT_ACTIONS.REGISTER_SUCCESS,
    ...requestMeta
  });

  return {
    user,
    token: buildToken(user)
  };
};

const login = async ({ email, password, requestMeta }) => {
  const user = await userRepository.findByEmail(email);

  if (!user) {
    await auditLogService.log({
      action: AUDIT_ACTIONS.LOGIN_FAILURE,
      ...requestMeta
    });
    throw new ApiError(StatusCodes.UNAUTHORIZED, 'Invalid email or password');
  }

  const passwordMatches = await bcrypt.compare(password, user.password);

  if (!passwordMatches) {
    await auditLogService.log({
      userId: user.id,
      action: AUDIT_ACTIONS.LOGIN_FAILURE,
      ...requestMeta
    });
    throw new ApiError(StatusCodes.UNAUTHORIZED, 'Invalid email or password');
  }

  await auditLogService.log({
    userId: user.id,
    action: AUDIT_ACTIONS.LOGIN_SUCCESS,
    ...requestMeta
  });

  return {
    user: sanitizeUser(user),
    token: buildToken(user)
  };
};

module.exports = {
  register,
  login,
  sanitizeUser
};
