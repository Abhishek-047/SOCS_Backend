const { StatusCodes } = require('http-status-codes');

const AUDIT_ACTIONS = require('../constants/auditActions');
const eventRepository = require('../repositories/eventRepository');
const auditLogService = require('./auditLogService');
const ApiError = require('../utils/ApiError');
const { buildPagination } = require('../utils/pagination');

const getEvents = async (query) => {
  const { page, limit, skip } = buildPagination(query.page, query.limit);
  const filters = {
    skip,
    limit,
    search: query.search,
    fromDate: query.fromDate,
    toDate: query.toDate
  };

  const [items, total] = await Promise.all([
    eventRepository.findMany(filters),
    eventRepository.count(filters)
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

const getEventById = async (id) => {
  const event = await eventRepository.findById(id);

  if (!event) {
    throw new ApiError(StatusCodes.NOT_FOUND, 'Event not found');
  }

  return event;
};

const createEvent = async ({ payload, adminUser, requestMeta }) => {
  const event = await eventRepository.create({
    ...payload,
    date: new Date(payload.date)
  });

  await auditLogService.log({
    userId: adminUser.id,
    action: AUDIT_ACTIONS.EVENT_CREATED,
    ...requestMeta
  });

  return event;
};

const updateEvent = async ({ eventId, payload, adminUser, requestMeta }) => {
  await getEventById(eventId);
  const event = await eventRepository.update(eventId, {
    ...payload,
    ...(payload.date ? { date: new Date(payload.date) } : {})
  });

  await auditLogService.log({
    userId: adminUser.id,
    action: AUDIT_ACTIONS.EVENT_UPDATED,
    ...requestMeta
  });

  return event;
};

const deleteEvent = async ({ eventId, adminUser, requestMeta }) => {
  await getEventById(eventId);
  const event = await eventRepository.remove(eventId);

  await auditLogService.log({
    userId: adminUser.id,
    action: AUDIT_ACTIONS.EVENT_DELETED,
    ...requestMeta
  });

  return event;
};

module.exports = {
  getEvents,
  getEventById,
  createEvent,
  updateEvent,
  deleteEvent
};
