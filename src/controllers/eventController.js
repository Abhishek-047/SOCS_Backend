const { StatusCodes } = require('http-status-codes');

const eventService = require('../services/eventService');
const pickRequestMeta = require('../utils/pickRequestMeta');

const listEvents = async (req, res) => {
  const result = await eventService.getEvents(req.validated.query);

  res.status(StatusCodes.OK).json({
    success: true,
    data: result
  });
};

const getEvent = async (req, res) => {
  const event = await eventService.getEventById(req.validated.params.id);

  res.status(StatusCodes.OK).json({
    success: true,
    data: event
  });
};

const createEvent = async (req, res) => {
  const event = await eventService.createEvent({
    payload: req.validated.body,
    adminUser: req.user,
    requestMeta: pickRequestMeta(req)
  });

  res.status(StatusCodes.CREATED).json({
    success: true,
    message: 'Event created successfully',
    data: event
  });
};

const updateEvent = async (req, res) => {
  const event = await eventService.updateEvent({
    eventId: req.validated.params.id,
    payload: req.validated.body,
    adminUser: req.user,
    requestMeta: pickRequestMeta(req)
  });

  res.status(StatusCodes.OK).json({
    success: true,
    message: 'Event updated successfully',
    data: event
  });
};

const deleteEvent = async (req, res) => {
  const event = await eventService.deleteEvent({
    eventId: req.validated.params.id,
    adminUser: req.user,
    requestMeta: pickRequestMeta(req)
  });

  res.status(StatusCodes.OK).json({
    success: true,
    message: 'Event deleted successfully',
    data: event
  });
};

module.exports = {
  listEvents,
  getEvent,
  createEvent,
  updateEvent,
  deleteEvent
};
