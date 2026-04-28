const express = require('express');

const contactController = require('../controllers/contactController');
const validate = require('../middleware/validate');
const asyncHandler = require('../utils/asyncHandler');
const { submitContactSchema } = require('../validators/contactValidator');

const router = express.Router();

router.post('/', validate(submitContactSchema), asyncHandler(contactController.submitContact));

module.exports = router;
