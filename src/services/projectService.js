const { StatusCodes } = require('http-status-codes');

const AUDIT_ACTIONS = require('../constants/auditActions');
const projectRepository = require('../repositories/projectRepository');
const auditLogService = require('./auditLogService');
const ApiError = require('../utils/ApiError');
const { buildPagination } = require('../utils/pagination');

const getProjects = async (query) => {
  const { page, limit, skip } = buildPagination(query.page, query.limit);
  const filters = {
    skip,
    limit,
    search: query.search,
    createdById: query.createdById
  };

  const [items, total] = await Promise.all([
    projectRepository.findMany(filters),
    projectRepository.count(filters)
  ]);

  return {
    items,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit) || 1
    }
  };
};

const getProjectById = async (id) => {
  const project = await projectRepository.findById(id);

  if (!project) {
    throw new ApiError(StatusCodes.NOT_FOUND, 'Project not found');
  }

  return project;
};

const createProject = async ({ payload, adminUser, requestMeta }) => {
  const project = await projectRepository.create({
    ...payload,
    githubLink: payload.githubLink || null,
    createdById: adminUser.id
  });

  await auditLogService.log({
    userId: adminUser.id,
    action: AUDIT_ACTIONS.PROJECT_CREATED,
    ...requestMeta
  });

  return project;
};

const updateProject = async ({ projectId, payload, adminUser, requestMeta }) => {
  await getProjectById(projectId);

  const project = await projectRepository.update(projectId, {
    ...payload,
    ...(Object.prototype.hasOwnProperty.call(payload, 'githubLink')
      ? { githubLink: payload.githubLink || null }
      : {})
  });

  await auditLogService.log({
    userId: adminUser.id,
    action: AUDIT_ACTIONS.PROJECT_UPDATED,
    ...requestMeta
  });

  return project;
};

const deleteProject = async ({ projectId, adminUser, requestMeta }) => {
  await getProjectById(projectId);
  const project = await projectRepository.remove(projectId);

  await auditLogService.log({
    userId: adminUser.id,
    action: AUDIT_ACTIONS.PROJECT_DELETED,
    ...requestMeta
  });

  return project;
};

module.exports = {
  getProjects,
  getProjectById,
  createProject,
  updateProject,
  deleteProject
};
