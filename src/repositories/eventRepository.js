const { prisma } = require('../config/database');

const baseSelect = {
  id: true,
  title: true,
  description: true,
  date: true,
  createdAt: true,
  updatedAt: true
};

const create = (data) =>
  prisma.event.create({
    data,
    select: baseSelect
  });

const update = (id, data) =>
  prisma.event.update({
    where: { id },
    data,
    select: baseSelect
  });

const remove = (id) =>
  prisma.event.delete({
    where: { id },
    select: baseSelect
  });

const findById = (id) =>
  prisma.event.findUnique({
    where: { id },
    select: baseSelect
  });

const findMany = ({ skip, limit, search, fromDate, toDate }) =>
  prisma.event.findMany({
    where: {
      ...(search
        ? {
            OR: [
              { title: { contains: search } },
              { description: { contains: search } }
            ]
          }
        : {}),
      ...(fromDate || toDate
        ? {
            date: {
              ...(fromDate ? { gte: new Date(fromDate) } : {}),
              ...(toDate ? { lte: new Date(toDate) } : {})
            }
          }
        : {})
    },
    skip,
    take: limit,
    orderBy: { date: 'asc' },
    select: baseSelect
  });

const count = ({ search, fromDate, toDate }) =>
  prisma.event.count({
    where: {
      ...(search
        ? {
            OR: [
              { title: { contains: search } },
              { description: { contains: search } }
            ]
          }
        : {}),
      ...(fromDate || toDate
        ? {
            date: {
              ...(fromDate ? { gte: new Date(fromDate) } : {}),
              ...(toDate ? { lte: new Date(toDate) } : {})
            }
          }
        : {})
    }
  });

module.exports = {
  create,
  update,
  remove,
  findById,
  findMany,
  count
};
