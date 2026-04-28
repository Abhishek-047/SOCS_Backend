const { StatusCodes } = require('http-status-codes');
const AUDIT_ACTIONS = require('../constants/auditActions');
const resourceRepository = require('../repositories/resourceRepository');
const auditLogService = require('./auditLogService');
const ApiError = require('../utils/ApiError');
const { buildPagination } = require('../utils/pagination');

const getResources = async (query = {}) => {
  const { page, limit, skip } = buildPagination(query.page, query.limit);
  const filters = { skip, limit, search: query.search, category: query.category };

  const [items, total] = await Promise.all([
    resourceRepository.findMany(filters),
    resourceRepository.count(filters)
  ]);

  return { items, pagination: { page, limit, total, totalPages: Math.ceil(total / limit) || 1 } };
};

const getResourceById = async (id) => {
  const resource = await resourceRepository.findById(id);
  if (!resource) throw new ApiError(StatusCodes.NOT_FOUND, 'Resource not found');
  return resource;
};

const createResource = async ({ payload, adminUser, requestMeta }) => {
  const resource = await resourceRepository.create(payload);
  await auditLogService.log({
    userId: adminUser.id,
    action: AUDIT_ACTIONS.PROJECT_CREATED || 'RESOURCE_CREATED',
    ...requestMeta
  });
  return resource;
};

const updateResource = async ({ resourceId, payload, adminUser, requestMeta }) => {
  await getResourceById(resourceId);
  const resource = await resourceRepository.update(resourceId, payload);
  await auditLogService.log({
    userId: adminUser.id,
    action: AUDIT_ACTIONS.PROJECT_UPDATED || 'RESOURCE_UPDATED',
    ...requestMeta
  });
  return resource;
};

const deleteResource = async ({ resourceId, adminUser, requestMeta }) => {
  await getResourceById(resourceId);
  const resource = await resourceRepository.remove(resourceId);
  await auditLogService.log({
    userId: adminUser.id,
    action: AUDIT_ACTIONS.PROJECT_DELETED || 'RESOURCE_DELETED',
    ...requestMeta
  });
  return resource;
};

module.exports = { getResources, getResourceById, createResource, updateResource, deleteResource };
