const { prisma } = require('../config/database');

const baseSelect = {
  id: true,
  title: true,
  description: true,
  techStack: true,
  githubLink: true,
  createdAt: true,
  updatedAt: true,
  createdBy: {
    select: {
      id: true,
      name: true,
      email: true,
      role: true
    }
  }
};

const create = (data) =>
  prisma.project.create({
    data,
    select: baseSelect
  });

const update = (id, data) =>
  prisma.project.update({
    where: { id },
    data,
    select: baseSelect
  });

const remove = (id) =>
  prisma.project.delete({
    where: { id },
    select: baseSelect
  });

const findById = (id) =>
  prisma.project.findUnique({
    where: { id },
    select: baseSelect
  });

const findMany = ({ skip, limit, search, createdById }) =>
  prisma.project.findMany({
    where: {
      ...(search
        ? {
            OR: [
              { title: { contains: search } },
              { description: { contains: search } }
            ]
          }
        : {}),
      ...(createdById ? { createdById } : {})
    },
    skip,
    take: limit,
    orderBy: { createdAt: 'desc' },
    select: baseSelect
  });

const count = ({ search, createdById }) =>
  prisma.project.count({
    where: {
      ...(search
        ? {
            OR: [
              { title: { contains: search } },
              { description: { contains: search } }
            ]
          }
        : {}),
      ...(createdById ? { createdById } : {})
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
