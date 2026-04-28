const { StatusCodes } = require('http-status-codes');
const visualService = require('../services/visualService');
const pickRequestMeta = require('../utils/pickRequestMeta');

const listVisuals = async (req, res) => {
  const result = await visualService.getVisuals(req.validated.query || {});
  res.status(StatusCodes.OK).json({ success: true, data: result });
};

const getVisual = async (req, res) => {
  const visual = await visualService.getVisualById(req.validated.params.id);
  res.status(StatusCodes.OK).json({ success: true, data: visual });
};

const createVisual = async (req, res) => {
  const visual = await visualService.createVisual({
    payload: req.validated.body,
    adminUser: req.user,
    requestMeta: pickRequestMeta(req)
  });
  res.status(StatusCodes.CREATED).json({ success: true, message: 'Visual created', data: visual });
};

const updateVisual = async (req, res) => {
  const visual = await visualService.updateVisual({
    visualId: req.validated.params.id,
    payload: req.validated.body,
    adminUser: req.user,
    requestMeta: pickRequestMeta(req)
  });
  res.status(StatusCodes.OK).json({ success: true, message: 'Visual updated', data: visual });
};

const deleteVisual = async (req, res) => {
  const visual = await visualService.deleteVisual({
    visualId: req.validated.params.id,
    adminUser: req.user,
    requestMeta: pickRequestMeta(req)
  });
  res.status(StatusCodes.OK).json({ success: true, message: 'Visual deleted', data: visual });
};

module.exports = { listVisuals, getVisual, createVisual, updateVisual, deleteVisual };
