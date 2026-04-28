const express = require('express');
const teamController = require('../controllers/teamController');
const ROLES = require('../constants/roles');
const authenticate = require('../middleware/authenticate');
const authorize = require('../middleware/authorize');
const validate = require('../middleware/validate');
const asyncHandler = require('../utils/asyncHandler');
const { createTeamSchema, updateTeamSchema, getTeamSchema, listTeamSchema } = require('../validators/teamValidator');

const router = express.Router();

router.get('/', validate(listTeamSchema), asyncHandler(teamController.listTeamMembers));
router.get('/:id', validate(getTeamSchema), asyncHandler(teamController.getTeamMember));
router.post('/', authenticate, authorize(ROLES.ADMIN), validate(createTeamSchema), asyncHandler(teamController.createTeamMember));
router.put('/:id', authenticate, authorize(ROLES.ADMIN), validate(updateTeamSchema), asyncHandler(teamController.updateTeamMember));
router.delete('/:id', authenticate, authorize(ROLES.ADMIN), validate(getTeamSchema), asyncHandler(teamController.deleteTeamMember));

module.exports = router;
