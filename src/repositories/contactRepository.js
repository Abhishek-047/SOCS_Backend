const { prisma } = require('../config/database');

const create = (data) =>
  prisma.contact.create({
    data,
    select: {
      id: true,
      name: true,
      email: true,
      message: true,
      createdAt: true
    }
  });

module.exports = {
  create
};
