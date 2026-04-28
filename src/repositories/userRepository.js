const { prisma } = require('../config/database');

const safeUserSelect = {
  id: true,
  name: true,
  email: true,
  role: true,
  createdAt: true,
  updatedAt: true
};

const create = (data) =>
  prisma.user.create({
    data,
    select: safeUserSelect
  });

const findByEmail = (email) =>
  prisma.user.findUnique({
    where: { email }
  });

const findById = (id) =>
  prisma.user.findUnique({
    where: { id },
    select: safeUserSelect
  });

module.exports = {
  create,
  findByEmail,
  findById,
  safeUserSelect
};
