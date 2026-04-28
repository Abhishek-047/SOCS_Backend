const express = require('express');
const resourceController = require('../controllers/resourceController');
const ROLES = require('../constants/roles');
const authenticate = require('../middleware/authenticate');
const authorize = require('../middleware/authorize');
const validate = require('../middleware/validate');
const asyncHandler = require('../utils/asyncHandler');
const { createResourceSchema, updateResourceSchema, getResourceSchema, listResourceSchema } = require('../validators/resourceValidator');

const router = express.Router();

router.get('/', validate(listResourceSchema), asyncHandler(resourceController.listResources));
router.get('/:id', validate(getResourceSchema), asyncHandler(resourceController.getResource));
router.post('/', authenticate, authorize(ROLES.ADMIN), validate(createResourceSchema), asyncHandler(resourceController.createResource));
router.put('/:id', authenticate, authorize(ROLES.ADMIN), validate(updateResourceSchema), asyncHandler(resourceController.updateResource));
router.delete('/:id', authenticate, authorize(ROLES.ADMIN), validate(getResourceSchema), asyncHandler(resourceController.deleteResource));

module.exports = router;
