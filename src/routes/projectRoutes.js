const express = require('express');

const projectController = require('../controllers/projectController');
const ROLES = require('../constants/roles');
const authenticate = require('../middleware/authenticate');
const authorize = require('../middleware/authorize');
const validate = require('../middleware/validate');
const asyncHandler = require('../utils/asyncHandler');
const {
  createProjectSchema,
  updateProjectSchema,
  getProjectSchema,
  listProjectsSchema
} = require('../validators/projectValidator');

const router = express.Router();

router.get('/', validate(listProjectsSchema), asyncHandler(projectController.listProjects));
router.get('/:id', validate(getProjectSchema), asyncHandler(projectController.getProject));
router.post(
  '/',
  authenticate,
  authorize(ROLES.ADMIN),
  validate(createProjectSchema),
  asyncHandler(projectController.createProject)
);
router.put(
  '/:id',
  authenticate,
  authorize(ROLES.ADMIN),
  validate(updateProjectSchema),
  asyncHandler(projectController.updateProject)
);
router.delete(
  '/:id',
  authenticate,
  authorize(ROLES.ADMIN),
  validate(getProjectSchema),
  asyncHandler(projectController.deleteProject)
);

module.exports = router;
