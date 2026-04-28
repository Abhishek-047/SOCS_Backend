const express = require('express');
const visualController = require('../controllers/visualController');
const ROLES = require('../constants/roles');
const authenticate = require('../middleware/authenticate');
const authorize = require('../middleware/authorize');
const validate = require('../middleware/validate');
const asyncHandler = require('../utils/asyncHandler');
const { createVisualSchema, updateVisualSchema, getVisualSchema, listVisualSchema } = require('../validators/visualValidator');

const router = express.Router();

router.get('/', validate(listVisualSchema), asyncHandler(visualController.listVisuals));
router.get('/:id', validate(getVisualSchema), asyncHandler(visualController.getVisual));
router.post('/', authenticate, authorize(ROLES.ADMIN), validate(createVisualSchema), asyncHandler(visualController.createVisual));
router.put('/:id', authenticate, authorize(ROLES.ADMIN), validate(updateVisualSchema), asyncHandler(visualController.updateVisual));
router.delete('/:id', authenticate, authorize(ROLES.ADMIN), validate(getVisualSchema), asyncHandler(visualController.deleteVisual));

module.exports = router;
