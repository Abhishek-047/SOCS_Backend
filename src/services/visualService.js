const { StatusCodes } = require('http-status-codes');
const AUDIT_ACTIONS = require('../constants/auditActions');
const visualRepository = require('../repositories/visualRepository');
const auditLogService = require('./auditLogService');
const ApiError = require('../utils/ApiError');
const { buildPagination } = require('../utils/pagination');

const getVisuals = async (query = {}) => {
  const { page, limit, skip } = buildPagination(query.page, query.limit);
  const filters = { skip, limit, search: query.search, category: query.category };

  const [items, total] = await Promise.all([
    visualRepository.findMany(filters),
    visualRepository.count(filters)
  ]);

  return { items, pagination: { page, limit, total, totalPages: Math.ceil(total / limit) || 1 } };
};

const getVisualById = async (id) => {
  const visual = await visualRepository.findById(id);
  if (!visual) throw new ApiError(StatusCodes.NOT_FOUND, 'Visual not found');
  return visual;
};

const createVisual = async ({ payload, adminUser, requestMeta }) => {
  const visual = await visualRepository.create(payload);
  await auditLogService.log({
    userId: adminUser.id,
    action: AUDIT_ACTIONS.PROJECT_CREATED || 'VISUAL_CREATED',
    ...requestMeta
  });
  return visual;
};

const updateVisual = async ({ visualId, payload, adminUser, requestMeta }) => {
  await getVisualById(visualId);
  const visual = await visualRepository.update(visualId, payload);
  await auditLogService.log({
    userId: adminUser.id,
    action: AUDIT_ACTIONS.PROJECT_UPDATED || 'VISUAL_UPDATED',
    ...requestMeta
  });
  return visual;
};

const deleteVisual = async ({ visualId, adminUser, requestMeta }) => {
  await getVisualById(visualId);
  const visual = await visualRepository.remove(visualId);
  await auditLogService.log({
    userId: adminUser.id,
    action: AUDIT_ACTIONS.PROJECT_DELETED || 'VISUAL_DELETED',
    ...requestMeta
  });
  return visual;
};

module.exports = { getVisuals, getVisualById, createVisual, updateVisual, deleteVisual };
