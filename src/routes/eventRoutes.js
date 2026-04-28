const express = require('express');

const eventController = require('../controllers/eventController');
const ROLES = require('../constants/roles');
const authenticate = require('../middleware/authenticate');
const authorize = require('../middleware/authorize');
const validate = require('../middleware/validate');
const asyncHandler = require('../utils/asyncHandler');
const {
  createEventSchema,
  updateEventSchema,
  getEventSchema,
  listEventsSchema
} = require('../validators/eventValidator');

const router = express.Router();

router.get('/', validate(listEventsSchema), asyncHandler(eventController.listEvents));
router.get('/:id', validate(getEventSchema), asyncHandler(eventController.getEvent));
router.post(
  '/',
  authenticate,
  authorize(ROLES.ADMIN),
  validate(createEventSchema),
  asyncHandler(eventController.createEvent)
);
router.put(
  '/:id',
  authenticate,
  authorize(ROLES.ADMIN),
  validate(updateEventSchema),
  asyncHandler(eventController.updateEvent)
);
router.delete(
  '/:id',
  authenticate,
  authorize(ROLES.ADMIN),
  validate(getEventSchema),
  asyncHandler(eventController.deleteEvent)
);

module.exports = router;
