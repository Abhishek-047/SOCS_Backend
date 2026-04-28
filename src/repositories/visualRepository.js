const { prisma } = require('../config/database');

const baseSelect = {
  id: true,
  title: true,
  category: true,
  src: true,
  createdAt: true,
  updatedAt: true
};

const create = (data) => prisma.visual.create({ data, select: baseSelect });
const update = (id, data) => prisma.visual.update({ where: { id }, data, select: baseSelect });
const remove = (id) => prisma.visual.delete({ where: { id }, select: baseSelect });
const findById = (id) => prisma.visual.findUnique({ where: { id }, select: baseSelect });

const findMany = ({ skip, limit, search, category }) =>
  prisma.visual.findMany({
    where: {
      ...(search ? { title: { contains: search } } : {}),
      ...(category ? { category } : {})
    },
    skip,
    take: limit,
    orderBy: { createdAt: 'desc' },
    select: baseSelect
  });

const count = ({ search, category }) =>
  prisma.visual.count({
    where: {
      ...(search ? { title: { contains: search } } : {}),
      ...(category ? { category } : {})
    }
  });

module.exports = { create, update, remove, findById, findMany, count };
