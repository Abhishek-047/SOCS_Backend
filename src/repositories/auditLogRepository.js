const { prisma } = require('../config/database');

const create = (data) =>
  prisma.auditLog.create({
    data
  });

module.exports = {
  create
};
