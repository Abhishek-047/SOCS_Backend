const express = require('express');

const authRoutes = require('./authRoutes');
const projectRoutes = require('./projectRoutes');
const eventRoutes = require('./eventRoutes');
const contactRoutes = require('./contactRoutes');
const teamRoutes = require('./teamRoutes');
const resourceRoutes = require('./resourceRoutes');
const visualRoutes = require('./visualRoutes');

const router = express.Router();

router.use('/auth', authRoutes);
router.use('/projects', projectRoutes);
router.use('/events', eventRoutes);
router.use('/contacts', contactRoutes);
router.use('/team', teamRoutes);
router.use('/resources', resourceRoutes);
router.use('/visuals', visualRoutes);

module.exports = router;
