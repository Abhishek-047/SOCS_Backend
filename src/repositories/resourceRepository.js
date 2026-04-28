const { prisma } = require('../config/database');

const baseSelect = {
  id: true,
  title: true,
  description: true,
  url: true,
  category: true,
  tags: true,
  createdAt: true,
  updatedAt: true
};

const create = (data) => prisma.resource.create({ data, select: baseSelect });
const update = (id, data) => prisma.resource.update({ where: { id }, data, select: baseSelect });
const remove = (id) => prisma.resource.delete({ where: { id }, select: baseSelect });
const findById = (id) => prisma.resource.findUnique({ where: { id }, select: baseSelect });

const findMany = ({ skip, limit, search, category }) =>
  prisma.resource.findMany({
    where: {
      ...(search ? { OR: [{ title: { contains: search } }, { description: { contains: search } }] } : {}),
      ...(category ? { category } : {})
    },
    skip,
    take: limit,
    orderBy: { createdAt: 'desc' },
    select: baseSelect
  });

const count = ({ search, category }) =>
  prisma.resource.count({
    where: {
      ...(search ? { OR: [{ title: { contains: search } }, { description: { contains: search } }] } : {}),
      ...(category ? { category } : {})
    }
  });

module.exports = { create, update, remove, findById, findMany, count };
