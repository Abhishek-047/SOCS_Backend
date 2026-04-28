const { StatusCodes } = require('http-status-codes');
const AUDIT_ACTIONS = require('../constants/auditActions');
const teamRepository = require('../repositories/teamRepository');
const auditLogService = require('./auditLogService');
const ApiError = require('../utils/ApiError');
const { buildPagination } = require('../utils/pagination');

const getTeamMembers = async (query = {}) => {
  const { page, limit, skip } = buildPagination(query.page, query.limit);
  const filters = { skip, limit, search: query.search };

  const [items, total] = await Promise.all([
    teamRepository.findMany(filters),
    teamRepository.count(filters)
  ]);

  return { items, pagination: { page, limit, total, totalPages: Math.ceil(total / limit) || 1 } };
};

const getTeamMemberById = async (id) => {
  const member = await teamRepository.findById(id);
  if (!member) throw new ApiError(StatusCodes.NOT_FOUND, 'Team member not found');
  return member;
};

const createTeamMember = async ({ payload, adminUser, requestMeta }) => {
  const member = await teamRepository.create(payload);
  await auditLogService.log({
    userId: adminUser.id,
    action: AUDIT_ACTIONS.PROJECT_CREATED || 'TEAM_MEMBER_CREATED',
    ...requestMeta
  });
  return member;
};

const updateTeamMember = async ({ memberId, payload, adminUser, requestMeta }) => {
  await getTeamMemberById(memberId);
  const member = await teamRepository.update(memberId, payload);
  await auditLogService.log({
    userId: adminUser.id,
    action: AUDIT_ACTIONS.PROJECT_UPDATED || 'TEAM_MEMBER_UPDATED',
    ...requestMeta
  });
  return member;
};

const deleteTeamMember = async ({ memberId, adminUser, requestMeta }) => {
  await getTeamMemberById(memberId);
  const member = await teamRepository.remove(memberId);
  await auditLogService.log({
    userId: adminUser.id,
    action: AUDIT_ACTIONS.PROJECT_DELETED || 'TEAM_MEMBER_DELETED',
    ...requestMeta
  });
  return member;
};

module.exports = { getTeamMembers, getTeamMemberById, createTeamMember, updateTeamMember, deleteTeamMember };
