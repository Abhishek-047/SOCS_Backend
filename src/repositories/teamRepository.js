const { prisma } = require('../config/database');

const baseSelect = {
  id: true,
  slug: true,
  name: true,
  role: true,
  skills: true,
  image: true,
  github: true,
  linkedin: true,
  tier: true,
  createdAt: true,
  updatedAt: true
};

const create = (data) =>
  prisma.teamMember.create({
    data,
    select: baseSelect
  });

const update = (id, data) =>
  prisma.teamMember.update({
    where: { id },
    data,
    select: baseSelect
  });

const remove = (id) =>
  prisma.teamMember.delete({
    where: { id },
    select: baseSelect
  });

const findById = (id) =>
  prisma.teamMember.findFirst({
    where: { OR: [{ id }, { slug: id }] },
    select: baseSelect
  });

const findMany = ({ skip, limit, search }) =>
  prisma.teamMember.findMany({
    where: {
      ...(search
        ? {
            OR: [
              { name: { contains: search } },
              { role: { contains: search } }
            ]
          }
        : {})
    },
    skip,
    take: limit,
    orderBy: { createdAt: 'desc' },
    select: baseSelect
  });

const count = ({ search }) =>
  prisma.teamMember.count({
    where: {
      ...(search
        ? {
            OR: [
              { name: { contains: search } },
              { role: { contains: search } }
            ]
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
